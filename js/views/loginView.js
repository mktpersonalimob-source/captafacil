// ==========================================================================
// View: Login / Autenticação
// ==========================================================================

window.CaptaFacil = window.CaptaFacil || {};
window.CaptaFacil.views = window.CaptaFacil.views || {};

(function(exports) {
    const { authService } = exports;

    function renderLoginView() {
        return `
            <div class="flex min-h-screen items-center justify-center p-4">
                <div class="w-full max-w-md p-6 sm:p-8 space-y-6 bg-white rounded-2xl shadow-xl text-center border border-orange-100">
                    <div class="text-center space-y-5">
                        <div class="flex items-center justify-center space-x-4 mb-4">
                            <svg class="w-36" viewBox="0 0 215 40" xmlns="http://www.w3.org/2000/svg">
                                <rect x="1" y="1" width="38" height="38" rx="5" fill="#EA580C" />
                                <path d="M20 12l8 6v8H12v-8l8-6z" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
                                <text x="50" y="29" font-family="Inter, sans-serif" font-size="22" font-weight="800" fill="#374151" letter-spacing="-0.5px">Capta</text>
                                <text x="125" y="29" font-family="Inter, sans-serif" font-size="22" font-weight="800" fill="#EA580C" letter-spacing="-0.5px">Fácil</text>
                            </svg>
                        </div>
                        <p class="text-sm text-gray-500 font-medium">Acesse sua conta para continuar</p>
                    </div>

                    <form id="login-form" class="space-y-4 text-left" onsubmit="return false;">
                        <div>
                            <label for="login-email" class="text-sm font-semibold text-gray-700">E-mail</label>
                            <input id="login-email" name="email" type="email" required placeholder="seu.email@personal.com.br"
                                   class="w-full px-4 py-2.5 mt-1 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm">
                        </div>
                        <div>
                            <label for="login-password" class="text-sm font-semibold text-gray-700">Senha</label>
                            <input id="login-password" name="password" type="password" required placeholder="••••••••"
                                   class="w-full px-4 py-2.5 mt-1 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm">
                        </div>
                        
                        <button type="submit" id="btn-login-submit"
                                class="w-full px-4 py-3 font-bold text-white bg-orange-600 rounded-xl hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 shadow-md transition-all text-sm mt-2">
                            Entrar no Sistema
                        </button>

                        <p id="login-error-msg" class="text-sm text-center text-red-600 font-medium min-h-[20px]"></p>
                    </form>
                </div>
            </div>
        `;
    }

    function mountLoginView() {
        const form = document.getElementById("login-form");
        const emailInput = document.getElementById("login-email");
        const passwordInput = document.getElementById("login-password");
        const errorMsg = document.getElementById("login-error-msg");
        const submitBtn = document.getElementById("btn-login-submit");

        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            errorMsg.textContent = "";
            submitBtn.disabled = true;
            submitBtn.textContent = "Verificando credenciais...";

            try {
                const { profile } = await authService.login(emailInput.value.trim(), passwordInput.value);
                if (profile && profile.setup_completed) {
                    window.location.hash = "#/home";
                } else {
                    window.location.hash = "#/setup";
                }
            } catch (error) {
                console.error("Login failed:", error);
                errorMsg.textContent = "Email ou senha inválidos. Tente novamente.";
                submitBtn.disabled = false;
                submitBtn.textContent = "Entrar no Sistema";
            }
        });
    }

    exports.views.login = {
        render: renderLoginView,
        mount: mountLoginView
    };
})(window.CaptaFacil);
