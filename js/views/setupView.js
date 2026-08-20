// ==========================================================================
// View: Setup / Onboarding Inicial do Usuário
// ==========================================================================

window.CaptaFacil = window.CaptaFacil || {};
window.CaptaFacil.views = window.CaptaFacil.views || {};

(function(exports) {
    const { authService } = exports;

    function renderSetupView() {
        return `
            <div class="flex min-h-screen items-center justify-center p-4">
                <div class="w-full max-w-lg p-6 sm:p-8 space-y-6 bg-white rounded-2xl shadow-xl border border-orange-100">
                    <div class="text-center space-y-2">
                        <h1 class="text-2xl font-bold text-gray-800">Bem-vindo(a) ao CaptaFácil!</h1>
                        <p class="text-sm text-gray-600">Para começar, complete seus dados cadastrais.</p>
                    </div>
                    <form id="setup-form" class="space-y-4" onsubmit="return false;">
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label for="setup-nome" class="text-sm font-semibold text-gray-700">Nome *</label>
                                <input id="setup-nome" type="text" required class="w-full px-4 py-2.5 mt-1 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm">
                            </div>
                            <div>
                                <label for="setup-sobrenome" class="text-sm font-semibold text-gray-700">Sobrenome *</label>
                                <input id="setup-sobrenome" type="text" required class="w-full px-4 py-2.5 mt-1 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm">
                            </div>
                        </div>
                        <div>
                            <label for="setup-data-nascimento" class="text-sm font-semibold text-gray-700">Data de Nascimento *</label>
                            <input id="setup-data-nascimento" type="date" required class="w-full px-4 py-2.5 mt-1 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm">
                        </div>
                        <div>
                            <label for="setup-equipe" class="text-sm font-semibold text-gray-700">Sua Equipe *</label>
                            <select id="setup-equipe" required class="w-full px-4 py-2.5 mt-1 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-sm">
                                <option value="">Selecione uma equipe...</option>
                                <option value="Locação">Locação</option>
                                <option value="Terceiro">Terceiro</option>
                                <option value="Lançamento">Lançamento</option>
                                <option value="Administrativo">Administrativo</option>
                            </select>
                        </div>
                        <div>
                            <button type="submit" id="btn-save-setup" class="w-full px-4 py-3 mt-2 font-bold text-white bg-orange-600 rounded-xl hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 shadow-md transition-all text-sm">
                                Salvar e Acessar o Sistema
                            </button>
                        </div>
                        <p id="setup-error-msg" class="text-sm text-center text-red-600 font-medium"></p>
                    </form>
                </div>
            </div>
        `;
    }

    function mountSetupView() {
        const form = document.getElementById("setup-form");
        const saveBtn = document.getElementById("btn-save-setup");
        const errorMsg = document.getElementById("setup-error-msg");

        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            const user = authService.getCurrentUser();
            if (!user) {
                window.location.hash = "#/login";
                return;
            }

            saveBtn.disabled = true;
            saveBtn.textContent = "Salvando perfil...";
            errorMsg.textContent = "";

            const payload = {
                nome: document.getElementById("setup-nome").value.trim(),
                sobrenome: document.getElementById("setup-sobrenome").value.trim(),
                dataNascimento: document.getElementById("setup-data-nascimento").value,
                equipe: document.getElementById("setup-equipe").value
            };

            try {
                await authService.saveSetup(user.uid, payload);
                window.location.hash = "#/home";
            } catch (error) {
                console.error("Erro ao salvar setup:", error);
                errorMsg.textContent = "Ocorreu um erro ao salvar seus dados. Tente novamente.";
                saveBtn.disabled = false;
                saveBtn.textContent = "Salvar e Acessar o Sistema";
            }
        });
    }

    exports.views.setup = {
        render: renderSetupView,
        mount: mountSetupView
    };
})(window.CaptaFacil);
