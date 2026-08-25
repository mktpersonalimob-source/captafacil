// ==========================================================================
// Serviço de Autenticação e Usuários
// ==========================================================================

window.CaptaFacil = window.CaptaFacil || {};

(function(exports) {
    const { auth, db, fb, ADMIN_EMAILS } = exports.firebase;
    let currentUserProfile = null;

    const authService = {
        getCurrentUser() {
            return auth.currentUser;
        },

        getCurrentProfile() {
            return currentUserProfile;
        },

        isAdmin(user = null, profile = null) {
            const u = user || auth.currentUser;
            if (!u || !u.email) return false;
            return ADMIN_EMAILS.includes(u.email.toLowerCase().trim());
        },

        async login(email, password) {
            const cred = await auth.signInWithEmailAndPassword(email, password);
            const user = cred.user;
            const userRef = db.collection("users").doc(user.uid);

            await userRef.set({
                email: user.email,
                last_seen: fb.firestore.FieldValue.serverTimestamp()
            }, { merge: true });

            try {
                await db.collection("audit_logs").add({
                    action: "LOGIN",
                    userEmail: user.email,
                    timestamp: fb.firestore.FieldValue.serverTimestamp()
                });
            } catch (e) {}

            const profileDoc = await userRef.get();
            if (profileDoc.exists) {
                currentUserProfile = { id: profileDoc.id, ...profileDoc.data() };
            }
            return { user, profile: currentUserProfile };
        },

        async fetchProfile(user) {
            if (!user) {
                currentUserProfile = null;
                return null;
            }
            const doc = await db.collection("users").doc(user.uid).get();
            if (doc.exists) {
                currentUserProfile = { id: doc.id, ...doc.data() };
            } else {
                currentUserProfile = null;
            }
            return currentUserProfile;
        },

        async saveSetup(uid, data) {
            const userRef = db.collection("users").doc(uid);
            const profileData = {
                nome: data.nome,
                sobrenome: data.sobrenome,
                dataNascimento: data.dataNascimento,
                equipe: data.equipe,
                setup_completed: true,
                isActive: true,
                createdAt: fb.firestore.FieldValue.serverTimestamp(),
                updatedAt: fb.firestore.FieldValue.serverTimestamp()
            };
            await userRef.set(profileData, { merge: true });
            currentUserProfile = { id: uid, ...profileData };
            return currentUserProfile;
        },

        async logout() {
            const email = auth.currentUser && auth.currentUser.email ? auth.currentUser.email : null;
            currentUserProfile = null;
            try {
                await db.collection("audit_logs").add({
                    action: "LOGOUT",
                    label: "Logout de usuário",
                    userEmail: email,
                    timestamp: fb.firestore.FieldValue.serverTimestamp()
                });
            } catch (e) {}
            await auth.signOut();
        },

        onAuthStateChanged(callback) {
            return auth.onAuthStateChanged(async (user) => {
                if (user) {
                    await this.fetchProfile(user);
                } else {
                    currentUserProfile = null;
                }
                callback(user, currentUserProfile);
            });
        }
    };

    exports.authService = authService;
})(window.CaptaFacil);
