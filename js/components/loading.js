// ==========================================================================
// Componente: Loading Spinner Global
// ==========================================================================

window.CaptaFacil = window.CaptaFacil || {};

(function(exports) {
    function showGlobalSpinner(message = "Carregando...") {
        let spinner = document.getElementById("global-loading-spinner");
        if (!spinner) {
            spinner = document.createElement("div");
            spinner.id = "global-loading-spinner";
            spinner.className = "fixed inset-0 bg-white bg-opacity-90 z-[9999] flex items-center justify-center flex-col";
            spinner.innerHTML = `
                <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-orange-500 mb-4"></div>
                <p id="global-loading-text" class="text-lg text-gray-700 font-semibold">${message}</p>
            `;
            document.body.appendChild(spinner);
        } else {
            const textEl = document.getElementById("global-loading-text");
            if (textEl) textEl.textContent = message;
            spinner.classList.remove("hidden");
            spinner.classList.add("flex");
        }
    }

    function hideGlobalSpinner() {
        const spinner = document.getElementById("global-loading-spinner");
        if (spinner) {
            spinner.classList.add("hidden");
            spinner.classList.remove("flex");
        }
    }

    exports.loading = {
        show: showGlobalSpinner,
        hide: hideGlobalSpinner
    };
})(window.CaptaFacil);
