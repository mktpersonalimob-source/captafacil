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
    authService.onAuthStateChanged((user) => {
        router.navigate();
        if (user) {
            try { localStorage.setItem('capta_last_activity', Date.now().toString()); } catch (e) {}
        }
    });

    // Gerenciamento de sessão: logout após 10 minutos de inatividade ou quando outra aba sinalizar fechamento.
    (function sessionManager() {
        const INACTIVITY_TIMEOUT_MS = 10 * 60 * 1000; // 10 minutos
        const CHECK_INTERVAL_MS = 60 * 1000; // checar a cada minuto

        // Atualiza último tempo de atividade no localStorage
        const touch = () => {
            try { localStorage.setItem('capta_last_activity', Date.now().toString()); } catch (e) {}
        };

        ['mousemove', 'keydown', 'click', 'touchstart'].forEach(evt => window.addEventListener(evt, touch, { passive: true }));

        // Quando a aba for descarregada, sinaliza para as outras abas
        window.addEventListener('beforeunload', () => {
            try { localStorage.setItem('capta_tab_closed', Date.now().toString()); } catch (e) {}
        });

        // Se outra aba sinalizar fechamento, efetua logout nesta aba também (para evitar sessão inconsistente)
        window.addEventListener('storage', (e) => {
            if (e.key === 'capta_tab_closed') {
                try { authService.logout().catch(() => {}); } catch (e) {}
            }
        });

        // Checagem periódica de inatividade
        setInterval(() => {
            try {
                const user = authService.getCurrentUser();
                if (!user) return;
                const last = parseInt(localStorage.getItem('capta_last_activity') || '0', 10);
                if (Date.now() - last > INACTIVITY_TIMEOUT_MS) {
                    try { authService.logout().catch(() => {}); } catch (e) {}
                    // força navegação para rota pública
                    window.location.hash = '#/login';
                }
            } catch (e) {}
        }, CHECK_INTERVAL_MS);

    })();

})(window.CaptaFacil);
