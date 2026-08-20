// ==========================================================================
// Serviço de Operações de Captação e Firestore
// ==========================================================================

window.CaptaFacil = window.CaptaFacil || {};

(function(exports) {
    const { db, fb, auth, counter } = exports.firebase;

    const captacaoService = {
        async getById(id) {
            if (counter) counter.addReads(1);
            const doc = await db.collection("captacoes").doc(id).get();
            if (!doc.exists) return null;
            return { id: doc.id, ...doc.data() };
        },

        async fetchUserCaptures(uid) {
            const snapshot = await db.collection("captacoes")
                .where("owner_uid", "==", uid)
                .orderBy("createdAt", "desc")
                .get();
            if (counter) counter.addReads(snapshot.size || 1);
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        },

        async fetchUserCapturesPage(uid, { limitCount = 10, startAfterDoc = null } = {}) {
            let queryRef = db.collection("captacoes")
                .where("owner_uid", "==", uid)
                .orderBy("createdAt", "desc")
                .limit(limitCount);

            if (startAfterDoc) {
                queryRef = queryRef.startAfter(startAfterDoc);
            }

            const snapshot = await queryRef.get();
            if (counter) counter.addReads(snapshot.size || 1);

            return {
                items: snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })),
                lastDoc: snapshot.docs[snapshot.docs.length - 1] || null,
                hasMore: snapshot.docs.length === limitCount
            };
        },

        async fetchAllCaptures() {
            const snapshot = await db.collection("captacoes")
                .orderBy("createdAt", "desc")
                .get();
            if (counter) counter.addReads(snapshot.size || 1);
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        },

        async fetchCapturesPage({ limitCount = 10, startAfterDoc = null } = {}) {
            let queryRef = db.collection("captacoes")
                .orderBy("createdAt", "desc")
                .limit(limitCount);

            if (startAfterDoc) {
                queryRef = queryRef.startAfter(startAfterDoc);
            }

            const snapshot = await queryRef.get();
            if (counter) counter.addReads(snapshot.size || 1);

            return {
                items: snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })),
                lastDoc: snapshot.docs[snapshot.docs.length - 1] || null,
                hasMore: snapshot.docs.length === limitCount
            };
        },

        async saveCapture(data, editId = null) {
            const user = auth.currentUser;
            if (!user) throw new Error("Usuário não autenticado");
            // Server-side validation to keep consistency with frontend rules
            const validateCaptureData = (d) => {
                const hasDigits = (s) => { return !!(s && String(s).replace(/\D/g, '').length); };
                if (!d.codigoImovel || String(d.codigoImovel).trim() === '') {
                    throw new Error('Código do Imóvel é obrigatório.');
                }
                if (!d.caracAreaTotal || String(d.caracAreaTotal).trim() === '') {
                    throw new Error('Área Total do imóvel é obrigatória.');
                }
                const tipo = d.tipoCaptacao || '';
                const valorVenda = d.valorVenda || '';
                const valorLocacao = d.valorLocacao || '';
                const valorAluguelComercial = d.valorAluguelComercial || '';
                if (tipo === 'Venda' && !hasDigits(valorVenda)) {
                    throw new Error('Valor de Venda é obrigatório para captações do tipo Venda.');
                }
                if (tipo === 'Aluguel' && !hasDigits(valorLocacao) && !hasDigits(valorAluguelComercial)) {
                    throw new Error('Ao menos um valor de locação (residencial ou comercial) deve ser informado para captações de Aluguel.');
                }
                if (tipo === 'Ambos' && (!hasDigits(valorVenda) || (!hasDigits(valorLocacao) && !hasDigits(valorAluguelComercial)))) {
                    throw new Error('Para captações do tipo Ambos, informe valor de venda e ao menos um valor de locação.');
                }
                if (d.permuta === 'Sim' && (!d.permutaDesc || String(d.permutaDesc).trim() === '') && (!d.permutaObs || String(d.permutaObs).trim() === '')) {
                    throw new Error('Descreva a permuta quando a opção Permuta estiver marcada.');
                }
                if (d.propCpf && String(d.propCpf).trim()) {
                    const digits = String(d.propCpf).replace(/\D/g, '');
                    if (digits.length !== 11 && digits.length !== 14) {
                        throw new Error('CPF/CNPJ informado possui formato inválido.');
                    }
                }
            };

            // perform validation (throws on failure)
            validateCaptureData(data);

            const payload = {
                ...data,
                permutaObs: data.permutaObs || data.permutaDesc || '',
                permutaDesc: data.permutaDesc || data.permutaObs || '',
                owner_uid: user.uid,
                owner_email: user.email,
                updatedAt: fb.firestore.FieldValue.serverTimestamp()
            };

            if (editId) {
                await db.collection("captacoes").doc(editId).set(payload, { merge: true });
                if (counter) counter.addWrites(1);
                return editId;
            } else {
                payload.createdAt = fb.firestore.FieldValue.serverTimestamp();
                payload.status = payload.status || "Pendente";
                const docRef = await db.collection("captacoes").add(payload);
                if (counter) counter.addWrites(1);
                return docRef.id;
            }
        },

        async deleteCapture(id) {
            await db.collection("captacoes").doc(id).delete();
            if (counter) counter.addWrites(1);
        },

        async generateSignatureLink(captureId) {
            if (counter) counter.addReads(1);
            const captureDoc = await db.collection("captacoes").doc(captureId).get();
            if (!captureDoc.exists) throw new Error("Captação não encontrada.");

            const captureData = captureDoc.data();
            const token = [...Array(32)].map(() => Math.random().toString(36)[2]).join('');
            const expires = new Date();
            expires.setDate(expires.getDate() + 2);
            const expiresTimestamp = fb.firestore.Timestamp.fromDate(expires);

            const linkData = {
                captureId: captureId,
                expiresAt: expiresTimestamp,
                propertyAddress: `${captureData.imovelEndereco || ''}, ${captureData.imovelNumero || 'S/N'} - ${captureData.imovelBairro || ''}`,
                ownerName: captureData.propNome || '',
                ownerCpf: captureData.propCpf || null,
                codigoImovel: captureData.codigoImovel || null,
                imovelAndar: captureData.imovelAndar || null,
                imovelComplemento: captureData.imovelComplemento || null,
                valorVenda: captureData.valorVenda || null,
                valorLocacao: captureData.valorLocacao || null,
                valorAluguelComercial: captureData.valorAluguelComercial || null,
                tipoCaptacao: captureData.tipoCaptacao || null
            };

            const batch = db.batch();
            const linkRef = db.collection("signature_links").doc(token);
            batch.set(linkRef, linkData);

            const captureRef = db.collection("captacoes").doc(captureId);
            batch.update(captureRef, {
                signatureToken: token,
                signatureTokenExpires: expiresTimestamp,
                signatureStatus: "pending"
            });

            await batch.commit();
            if (counter) counter.addWrites(2);

            const baseUrl = window.location.href.split("#")[0].split("?")[0];
            const cleanBase = baseUrl.substring(0, baseUrl.lastIndexOf('/') + 1);
            const signatureUrl = `${cleanBase}#/assinatura?token=${token}`;

            return { token, signatureUrl };
        },

        async revokeSignature(captureId) {
            const captureRef = db.collection("captacoes").doc(captureId);
            await captureRef.update({
                signatureId: fb.firestore.FieldValue.delete(),
                signatureStatus: "revoked"
            });
            if (counter) counter.addWrites(1);
        },

        async getSignature(signatureId) {
            if (counter) counter.addReads(1);
            const sigDoc = await db.collection("assinaturas").doc(signatureId).get();
            if (!sigDoc.exists) return null;
            return { id: sigDoc.id, ...sigDoc.data() };
        },

        async linkSignatureToCapture(signatureId, captureId) {
            const batch = db.batch();
            const sigRef = db.collection("assinaturas").doc(signatureId);
            batch.update(sigRef, { captureId: captureId });

            const capRef = db.collection("captacoes").doc(captureId);
            batch.update(capRef, {
                signatureId: signatureId,
                signatureStatus: "signed",
                signatureToken: fb.firestore.FieldValue.delete(),
                signatureTokenExpires: fb.firestore.FieldValue.delete()
            });

            await batch.commit();
            if (counter) counter.addWrites(2);
        },

        async deleteSignature(signatureId) {
            if (counter) counter.addReads(1);
            const sigDoc = await db.collection("assinaturas").doc(signatureId).get();
            const batch = db.batch();

            if (sigDoc.exists) {
                const sigData = sigDoc.data();
                if (sigData.captureId) {
                    const capRef = db.collection("captacoes").doc(sigData.captureId);
                    batch.update(capRef, {
                        signatureId: fb.firestore.FieldValue.delete(),
                        signatureStatus: "revoked"
                    });
                }
            }

            const sigRef = db.collection("assinaturas").doc(signatureId);
            batch.delete(sigRef);

            await batch.commit();
            if (counter) counter.addWrites(2);
        },

        async sendFeedback(userEmail, message) {
            await db.collection("feedback").add({
                userEmail,
                message,
                createdAt: fb.firestore.FieldValue.serverTimestamp()
            });
            if (counter) counter.addWrites(1);
        }
    };

    exports.captacaoService = captacaoService;
})(window.CaptaFacil);
