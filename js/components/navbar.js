// ==========================================================================
// Componente: Barra de Navegação Superior (Header Simplificado)
// ==========================================================================

window.CaptaFacil = window.CaptaFacil || {};

(function(exports) {
    const { authService } = exports;
    const { confirm: showConfirm } = exports.modal;

    function renderNavbar(activeRoute = "home") {
        const user = authService.getCurrentUser();
        if (!user) return "";

        return `
            <nav class="bg-white border-b border-orange-100 shadow-sm sticky top-0 z-40">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div class="flex justify-between h-14 items-center">
                        <!-- Logo -->
                        <a href="#/home" class="flex items-center gap-2 flex-shrink-0">
                            <svg class="h-8 w-auto" viewBox="0 0 180 40" xmlns="http://www.w3.org/2000/svg">
                                <rect x="1" y="1" width="38" height="38" rx="5" fill="#EA580C" />
                                <path d="M20 12l8 6v8H12v-8l8-6z" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
                                <text x="48" y="28" font-family="Inter, sans-serif" font-size="21" font-weight="800" fill="#374151" letter-spacing="-0.5px">Capta</text>
                                <text x="106" y="28" font-family="Inter, sans-serif" font-size="21" font-weight="800" fill="#EA580C" letter-spacing="-0.5px">Fácil</text>
                            </svg>
                        </a>

                        <!-- Logout apenas no header -->
                        <button id="nav-btn-logout" class="flex items-center gap-1.5 px-3 py-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg text-sm font-semibold transition-colors" title="Sair do sistema">
                            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            <span class="hidden sm:inline">Sair</span>
                        </button>
                    </div>
                </div>
            </nav>
        `;
    }

    function mountNavbarEvents() {
        const logoutBtn = document.getElementById("nav-btn-logout");
        if (logoutBtn) {
            logoutBtn.addEventListener("click", async () => {
                const confirmed = await showConfirm("Deseja realmente sair do sistema?", "Confirmar Saída");
                if (confirmed) {
                    await authService.logout();
                    window.location.hash = "#/login";
                }
            });
        }
    }

    exports.navbar = {
        render: renderNavbar,
        mount: mountNavbarEvents
    };
})(window.CaptaFacil);
