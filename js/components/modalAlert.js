// ==========================================================================
// Componente: Modal Customizado de Alerta e Confirmação
// ==========================================================================

window.CaptaFacil = window.CaptaFacil || {};

(function(exports) {
    function showAlert(message, title = "Aviso", callback = null) {
        let alertEl = document.getElementById("custom-alert-container");
        if (!alertEl) {
            alertEl = document.createElement("div");
            alertEl.id = "custom-alert-container";
            document.body.appendChild(alertEl);
        }

        alertEl.innerHTML = `
            <div class="fixed inset-0 bg-black bg-opacity-50 z-[9990] flex items-center justify-center p-4">
                <div class="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6 text-center transform transition-all">
                    <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-orange-100 mb-4">
                        <svg class="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 class="text-lg font-bold text-gray-900 mb-2">${title}</h3>
                    <p class="text-sm text-gray-600 mb-6">${message}</p>
                    <button id="custom-alert-btn" class="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2.5 bg-orange-600 text-base font-semibold text-white hover:bg-orange-700 focus:outline-none">
                        Entendido
                    </button>
                </div>
            </div>
        `;

        document.getElementById("custom-alert-btn").addEventListener("click", () => {
            alertEl.innerHTML = "";
            if (typeof callback === "function") callback();
        });
    }

    function showConfirm(message, title = "Confirmação") {
        return new Promise((resolve) => {
            let confirmEl = document.getElementById("custom-confirm-container");
            if (!confirmEl) {
                confirmEl = document.createElement("div");
                confirmEl.id = "custom-confirm-container";
                document.body.appendChild(confirmEl);
            }

            confirmEl.innerHTML = `
                <div class="fixed inset-0 bg-black bg-opacity-50 z-[9990] flex items-center justify-center p-4">
                    <div class="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6 text-center transform transition-all">
                        <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-orange-100 mb-4">
                            <svg class="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 class="text-lg font-bold text-gray-900 mb-2">${title}</h3>
                        <p class="text-sm text-gray-600 mb-6">${message}</p>
                        <div class="flex gap-3 justify-center">
                            <button id="custom-confirm-cancel" class="w-full inline-flex justify-center rounded-lg border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none">
                                Cancelar
                            </button>
                            <button id="custom-confirm-ok" class="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-orange-600 text-base font-semibold text-white hover:bg-orange-700 focus:outline-none">
                                Confirmar
                            </button>
                        </div>
                    </div>
                </div>
            `;

            document.getElementById("custom-confirm-cancel").addEventListener("click", () => {
                confirmEl.innerHTML = "";
                resolve(false);
            });

            document.getElementById("custom-confirm-ok").addEventListener("click", () => {
                confirmEl.innerHTML = "";
                resolve(true);
            });
        });
    }

    exports.modal = {
        alert: showAlert,
        confirm: showConfirm
    };
})(window.CaptaFacil);
