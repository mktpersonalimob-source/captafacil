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

                    <div class="rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-5 text-left shadow-sm">
                        <div class="flex items-center gap-2 mb-3">
                            <span class="inline-flex h-8 w-8 items-center justify-center rounded-full bg-amber-500 text-white text-sm font-bold">!</span>
                            <p class="text-base font-bold text-amber-900">Sistema migrado</p>
                        </div>
                        <p class="text-sm leading-6 text-amber-900/90">
                            Este sistema e endereço foram descontinuados. A nova versão do CaptaFácil já está em funcionamento no novo endereço.
                        </p>
                        <a href="https://captafacil.imobiliariapersonal.com.br" target="_blank" rel="noopener noreferrer"
                           class="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-orange-600 px-4 py-3 text-sm font-bold text-white shadow-md transition hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2">
                            Acessar Novo CaptaFácil
                        </a>
                    </div>

                    <button type="button" id="btn-toggle-login"
                            class="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 shadow-sm transition hover:border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                            aria-expanded="false">
                        Quero fazer login neste link assim mesmo
                    </button>

                    <div id="login-form-wrapper" class="login-form-wrapper" aria-hidden="true">
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
            </div>
        `;
    }

    function mountLoginView() {
        const formWrapper = document.getElementById("login-form-wrapper");
        const toggleBtn = document.getElementById("btn-toggle-login");
        const form = document.getElementById("login-form");
        const emailInput = document.getElementById("login-email");
        const passwordInput = document.getElementById("login-password");
        const errorMsg = document.getElementById("login-error-msg");
        const submitBtn = document.getElementById("btn-login-submit");

        const setLoginFormVisible = (visible) => {
            formWrapper.classList.toggle("is-visible", visible);
            formWrapper.setAttribute("aria-hidden", String(!visible));
            toggleBtn.setAttribute("aria-expanded", String(visible));
            toggleBtn.textContent = visible ? "Ocultar formulário de login" : "Quero fazer login neste link assim mesmo";
        };

        toggleBtn.addEventListener("click", () => {
            const isVisible = formWrapper.classList.contains("is-visible");
            setLoginFormVisible(!isVisible);
        });

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
