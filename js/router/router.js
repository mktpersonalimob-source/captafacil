// ==========================================================================
// Roteador Central da SPA com Guards de Autenticação e Permissão
// ==========================================================================

window.CaptaFacil = window.CaptaFacil || {};

(function(exports) {
    const { authService } = exports;
    const { render: renderNavbar, mount: mountNavbarEvents } = exports.navbar;
    const { show: showGlobalSpinner, hide: hideGlobalSpinner } = exports.loading;
    const views = exports.views;

    const routes = {
        login: { render: () => views.login.render(), mount: () => views.login.mount(), requiresAuth: false },
        setup: { render: () => views.setup.render(), mount: () => views.setup.mount(), requiresAuth: true },
        home: { render: () => views.home.render(), mount: () => views.home.mount(), requiresAuth: true },
        historico: { render: () => views.history.render(), mount: () => views.history.mount(), requiresAuth: true },
        form: { render: () => views.form.render(), mount: () => views.form.mount(), requiresAuth: true },
        admin: { render: () => views.admin.render(), mount: () => views.admin.mount(), requiresAuth: true, adminOnly: true },
        assinatura: { render: () => views.assinatura.render(), mount: () => views.assinatura.mount(), requiresAuth: false }
    };

    async function navigate() {
        const rawHash = window.location.hash || "#/home";
        const pathPart = rawHash.replace("#/", "").split("?")[0] || "home";
        const routeKey = pathPart.toLowerCase();

        const appContainer = document.getElementById("app");
        if (!appContainer) return;

        // Rota pública de assinatura: não requer login
        if (routeKey === "assinatura" || window.location.search.includes("token=")) {
            appContainer.innerHTML = views.assinatura.render();
            views.assinatura.mount();
            return;
        }

        showGlobalSpinner("Carregando...");

        const user = authService.getCurrentUser();
        let profile = authService.getCurrentProfile();

        if (user && !profile) {
            profile = await authService.fetchProfile(user);
        }

        hideGlobalSpinner();

        // 1. Não autenticado
        if (!user) {
            if (routeKey !== "login") {
                window.location.hash = "#/login";
                return;
            }
            appContainer.innerHTML = views.login.render();
            views.login.mount();
            return;
        }

        // 2. Autenticado, mas setup incompleto
        if (!profile || !profile.setup_completed) {
            if (routeKey !== "setup") {
                window.location.hash = "#/setup";
                return;
            }
            appContainer.innerHTML = views.setup.render();
            views.setup.mount();
            return;
        }

        // 3. Autenticado e tentando ir para login ou setup
        if (routeKey === "login" || routeKey === "setup") {
            window.location.hash = "#/home";
            return;
        }

        // 4. Rota exclusiva de Admin
        if (routeKey === "admin" && !authService.isAdmin(user, profile)) {
            window.location.hash = "#/home";
            return;
        }

        // 5. Renderizar view com Navbar
        const route = routes[routeKey] || routes.home;
        const navHtml = renderNavbar(routeKey);
        const viewHtml = route.render();

        appContainer.innerHTML = `
            ${navHtml}
            <main class="min-h-[calc(100vh-64px)]">
                ${viewHtml}
            </main>
        `;

        mountNavbarEvents();
        if (typeof route.mount === "function") {
            route.mount();
        }
    }

    exports.router = {
        navigate: navigate
    };
})(window.CaptaFacil);
