// ==========================================================================
// Configuração Centralizada do Firebase
// ==========================================================================

window.CaptaFacil = window.CaptaFacil || {};

(function(exports) {
    const firebaseConfig = {
        apiKey: "AIzaSyAvqL_ESrGNMsMxlKt4Iwen_fBRZ4e_y58",
        authDomain: "captafacil-6cf54.firebaseapp.com",
        projectId: "captafacil-6cf54",
        storageBucket: "captafacil-6cf54.firebasestorage.app",
        messagingSenderId: "398747051095",
        appId: "1:398747051095:web:68e8bf8c01988c045eef12"
    };

    // Apenas o usuário gui.mont0ani@gmail.com é administrador
    const ADMIN_EMAILS = [
        "gui.mont0ani@gmail.com"
    ];

    if (!window.firebase.apps || window.firebase.apps.length === 0) {
        window.firebase.initializeApp(firebaseConfig);
    }

    const auth = window.firebase.auth();
    const db = window.firebase.firestore();
    const fb = window.firebase;

    let reads = parseInt(sessionStorage.getItem('firebaseReads') || '0', 10);
    let writes = parseInt(sessionStorage.getItem('firebaseWrites') || '0', 10);

    const counter = {
        addReads(n = 1) {
            reads += n;
            sessionStorage.setItem('firebaseReads', reads);
            this.updateUI();
        },
        addWrites(n = 1) {
            writes += n;
            sessionStorage.setItem('firebaseWrites', writes);
            this.updateUI();
        },
        get() {
            return { reads, writes };
        },
        updateUI() {
            const el = document.getElementById('firebase-counter-display');
            if (el) el.innerText = `${reads}/${writes}`;
        }
    };

    // Auto-update counter on DOM ready / intervals
    document.addEventListener("DOMContentLoaded", () => counter.updateUI());

    exports.firebase = {
        config: firebaseConfig,
        ADMIN_EMAILS: ADMIN_EMAILS,
        auth: auth,
        db: db,
        fb: fb,
        counter: counter
    };
})(window.CaptaFacil);
