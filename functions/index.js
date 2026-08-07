const functions = require("firebase-functions");
const admin = require("firebase-admin");
const crypto = require("crypto");

admin.initializeApp();
const db = admin.firestore();
const storage = admin.storage();

/**
 * Gera um link de assinatura seguro para uma captação.
 */
exports.generateSignatureLink = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError("unauthenticated", "Você precisa estar logado para realizar esta ação.");
    }

    const captureId = data.captureId;
    if (!captureId) {
        throw new functions.https.HttpsError("invalid-argument", "O ID da captação é obrigatório.");
    }

    const token = crypto.randomBytes(20).toString("hex");
    const expiration = new Date();
    expiration.setDate(expiration.getDate() + 7); // Link válido por 7 dias

    await db.collection("captacoes").doc(captureId).update({
        signatureToken: token,
        signatureTokenExpires: admin.firestore.Timestamp.fromDate(expiration),
    });

    // Substitua 'seu-dominio.com' pelo domínio real onde o CaptaFácil está hospedado
    const link = `https://captafacil-6cf54.web.app/assinar.html?id=${captureId}&token=${token}`;

    return { link: link };
});

/**
 * Verifica a validade de um token de assinatura.
 */
exports.verifySignatureToken = functions.https.onCall(async (data, context) => {
    const { id, token } = data;

    if (!id || !token) {
        throw new functions.https.HttpsError("invalid-argument", "ID da captação e token são obrigatórios.");
    }

    const docRef = db.collection("captacoes").doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
        return { valid: false, message: "Captação não encontrada." };
    }

    const docData = doc.data();

    if (docData.signatureImageUrl) {
        return { valid: false, message: "Este documento já foi assinado." };
    }

    if (docData.signatureToken !== token) {
        return { valid: false, message: "Token de assinatura inválido." };
    }

    if (docData.signatureTokenExpires.toDate() < new Date()) {
        return { valid: false, message: "Este link de assinatura expirou." };
    }

    return {
        valid: true,
        propertyData: {
            propNome: docData.propNome,
            imovelTipologia: docData.imovelTipologia,
            tipoCaptacao: docData.tipoCaptacao,
            imovelEndereco: docData.imovelEndereco,
            imovelNumero: docData.imovelNumero,
            imovelBairro: docData.imovelBairro,
        },
    };
});

/**
 * Salva a imagem da assinatura no Storage e atualiza o Firestore.
 */
exports.saveSignature = functions.https.onCall(async (data, context) => {
    const { captureId, token, signatureImage } = data;

    // 1. Re-validar o token
    const verification = await exports.verifySignatureToken({ id: captureId, token: token }, context);
    if (!verification.valid) {
        throw new functions.https.HttpsError("permission-denied", verification.message);
    }

    // 2. Fazer upload da imagem para o Firebase Storage
    const base64EncodedImageString = signatureImage.replace(/^data:image\/\w+;base64,/, "");
    const imageBuffer = Buffer.from(base64EncodedImageString, "base64");

    const bucket = storage.bucket();
    const filePath = `signatures/${captureId}/signature.png`;
    const file = bucket.file(filePath);

    await file.save(imageBuffer, {
        metadata: { contentType: "image/png" },
    });

    // 3. Obter a URL pública e atualizar o Firestore
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${filePath}`;

    await db.collection("captacoes").doc(captureId).update({
        signatureImageUrl: publicUrl,
        signatureToken: admin.firestore.FieldValue.delete(), // Remove o token para invalidá-lo
        signatureTokenExpires: admin.firestore.FieldValue.delete(),
    });

    return { success: true, url: publicUrl };
});