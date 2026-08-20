// ==========================================================================
// Ponto de Entrada Principal (Bootstrap da SPA)
// ==========================================================================

window.CaptaFacil = window.CaptaFacil || {};

(function(exports) {
    const { authService, router } = exports;

    // Ouvinte de rota por hash
    window.addEventListener("hashchange", () => {
        router.navigate();
    });

    // Ouvinte de autenticação
    authService.onAuthStateChanged(() => {
        router.navigate();
    });
})(window.CaptaFacil);
