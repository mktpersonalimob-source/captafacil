// ==========================================================================
// View: Dashboard Principal / Home
// ==========================================================================

window.CaptaFacil = window.CaptaFacil || {};
window.CaptaFacil.views = window.CaptaFacil.views || {};

(function(exports) {
    const { db } = exports.firebase;
    const { authService, captacaoService } = exports;
    const { alert: showAlert } = exports.modal;

    function renderHomeView() {
        return `
            <!-- Conteúdo principal com padding inferior para o rodapé fixo -->
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 pb-24">

                <!-- CARD DE BOAS-VINDAS: Saudação + Relógio + Data -->
                <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div class="flex flex-wrap justify-between items-center gap-4">
                        <!-- Saudação e equipe -->
                        <div id="greeting-message" class="space-y-1">
                            <h2 class="text-2xl font-black text-gray-800 tracking-tight">Carregando...</h2>
                            <p class="text-xs text-gray-500">Equipe: <strong class="text-orange-600" id="greeting-team">—</strong></p>
                        </div>

                        <!-- Relógio e Data -->
                        <div class="text-right">
                            <div id="clock-display" class="text-3xl sm:text-4xl font-black text-gray-900 tracking-tighter leading-none tabular-nums">--:--</div>
                            <div id="date-display" class="text-xs font-semibold text-gray-500 mt-1 capitalize"></div>
                        </div>
                    </div>
                </div>

                <!-- CARDS PRINCIPAIS: Nova Captação + Minhas Captações -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <a href="#/form" class="group block p-6 bg-orange-600 hover:bg-orange-700 text-white rounded-2xl shadow-lg transition-all hover:-translate-y-0.5">
                        <div class="flex items-start gap-4">
                            <div class="p-3 bg-white/15 rounded-xl flex-shrink-0">
                                <svg class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/>
                                </svg>
                            </div>
                            <div>
                                <h2 class="text-xl font-black mb-0.5">Nova Captação</h2>
                                <p class="text-xs text-orange-100">Iniciar preenchimento de nova ficha de imóvel.</p>
                            </div>
                        </div>
                    </a>

                    <a href="#/historico" class="group block p-6 bg-white hover:border-orange-300 border border-gray-200 text-gray-800 rounded-2xl shadow-sm transition-all hover:-translate-y-0.5">
                        <div class="flex items-start gap-4">
                            <div class="p-3 bg-orange-50 rounded-xl flex-shrink-0">
                                <svg class="h-7 w-7 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                                </svg>
                            </div>
                            <div>
                                <h2 class="text-xl font-black text-gray-800 mb-0.5">Minhas Captações</h2>
                                <p class="text-xs text-gray-500">Visualize, edite e gerencie seus imóveis captados.</p>
                            </div>
                        </div>
                    </a>
                </div>

                <!-- SEÇÃO: Captações Recentes + Coluna lateral -->
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-5">

                    <!-- Captações Recentes (2 colunas) -->
                    <div class="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
                        <div class="flex justify-between items-center border-b border-gray-100 pb-3">
                            <h3 class="text-base font-bold text-gray-800 flex items-center gap-2">
                                <svg class="h-4 w-4 text-orange-500" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"/></svg>
                                Captações Recentes
                            </h3>
                            <a href="#/historico" class="text-xs font-bold text-orange-600 hover:text-orange-700">Ver todas &rarr;</a>
                        </div>
                        <div id="recent-captures-display" class="space-y-3">
                            <p class="text-gray-400 text-xs animate-pulse text-center py-6">Buscando captações recentes...</p>
                        </div>
                    </div>

                    <!-- Coluna lateral -->
                    <div class="space-y-4">

                        <!-- Mural de Recados -->
                        <div class="bg-blue-50 border border-blue-200 rounded-2xl p-5 shadow-sm">
                            <h4 class="text-xs font-bold text-blue-900 mb-3 flex items-center gap-1.5">
                                <svg class="h-4 w-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/></svg>
                                Mural de Recados
                            </h4>
                            <div id="admin-notices-display" class="space-y-2.5 text-xs text-blue-800 max-h-52 overflow-y-auto pr-1">
                                <p class="text-blue-400 animate-pulse">Carregando mural...</p>
                            </div>
                        </div>

                        <!-- Guia Rápido -->
                        <div class="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                            <h4 class="text-xs font-bold text-gray-800 mb-1">Precisa de Ajuda?</h4>
                            <p class="text-xs text-gray-500 mb-3">Aprenda a utilizar as principais funções do sistema.</p>
                            <button id="btn-open-help" class="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm">
                                Ver Guia Rápido
                            </button>
                        </div>

                        <!-- Fale Conosco -->
                        <div class="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                            <h4 class="text-xs font-bold text-gray-800 mb-1">Fale Conosco</h4>
                            <p class="text-xs text-gray-500 mb-3">Envie mensagens ou sugestões para a administração.</p>
                            <button id="btn-open-feedback" class="w-full py-2.5 bg-gray-700 hover:bg-gray-900 text-white text-xs font-bold rounded-xl transition-all shadow-sm">
                                Enviar Mensagem
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- ===== RODAPÉ FIXO (Limpo: Conexão/Contador R/W, Sobre e Admin) ===== -->
            <footer class="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur border-t border-gray-200 shadow-sm py-2 px-4">
                <div class="max-w-5xl mx-auto flex flex-wrap justify-between items-center gap-3 text-xs">
                    <!-- Status de Conexão e Contador Firebase -->
                    <div class="flex items-center gap-2">
                        <span class="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                        <span class="font-semibold text-green-600">Conectado</span>
                        <span class="text-gray-300">|</span>
                        <span class="font-mono text-gray-500 text-[11px]" title="Leituras e Escritas no Firebase">R/W: <span id="firebase-counter-display" class="font-bold text-gray-700">0/0</span></span>
                    </div>

                    <!-- Sobre e Botão Painel Admin -->
                    <div class="flex items-center gap-3">
                        <button id="btn-open-about" class="font-semibold text-gray-500 hover:text-orange-600 hover:underline transition-colors">Sobre</button>
                        <a href="#/admin" id="footer-admin-btn" class="hidden px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg shadow-sm transition-all flex items-center gap-1">
                            <span>PAINEL ADMIN</span>
                        </a>
                    </div>
                </div>
            </footer>

            <!-- Modal: Sobre o Sistema -->
            <div id="modal-about" class="hidden fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
                <div class="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden text-center relative">
                    <button id="btn-close-about" class="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-2xl font-bold">&times;</button>
                    <div class="bg-gray-50 p-5 border-b flex justify-center">
                        <svg class="h-8 w-auto" viewBox="0 0 180 40" xmlns="http://www.w3.org/2000/svg">
                            <rect x="1" y="1" width="38" height="38" rx="5" fill="#EA580C"/>
                            <path d="M20 12l8 6v8H12v-8l8-6z" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
                            <text x="48" y="28" font-family="Inter, sans-serif" font-size="21" font-weight="800" fill="#374151" letter-spacing="-0.5px">Capta</text>
                            <text x="106" y="28" font-family="Inter, sans-serif" font-size="21" font-weight="800" fill="#EA580C" letter-spacing="-0.5px">Fácil</text>
                        </svg>
                    </div>
                    <div class="p-5 space-y-2 text-sm text-gray-600">
                        <h3 class="text-base font-bold text-gray-800">CaptaFácil</h3>
                        <p class="text-xs text-gray-500">Gestão e Automação de Captação Imobiliária.</p>
                        <p class="text-xs">Versão <span class="font-mono font-bold bg-gray-100 text-gray-800 px-2 py-0.5 rounded">2.0</span></p>
                        <p class="text-xs text-gray-400 pt-2 border-t">Desenvolvido por <strong class="text-gray-700">Guilherme Montoani</strong> para Personal Consultoria Imobiliária</p>
                    </div>
                </div>
            </div>

            <!-- Modal: Guia Rápido -->
            <div id="modal-help-guide" class="hidden fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
                <div class="bg-gray-50 rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden">
                    <!-- Header -->
                    <div class="p-5 border-b border-gray-200 flex justify-between items-center bg-white">
                        <div class="flex items-center gap-3">
                            <div class="bg-green-100 p-2 rounded-full">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 class="text-lg font-bold text-gray-800">Guia Rápido do CaptaFácil</h3>
                        </div>
                        <button id="btn-close-help-guide" class="text-gray-400 hover:text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-full p-1.5 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>

                    <!-- Conteúdo -->
                    <div class="p-5 space-y-4 max-h-[65vh] overflow-y-auto">
                        <!-- Item 1 -->
                        <div class="flex items-start gap-4">
                            <div class="flex-shrink-0 w-9 h-9 flex items-center justify-center bg-orange-100 text-orange-600 rounded-full">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                            </div>
                            <div>
                                <h4 class="font-bold text-gray-800 text-sm">Nova Captação</h4>
                                <p class="text-xs text-gray-600 mt-0.5">Clique em "Nova Captação" para iniciar o preenchimento de uma ficha de imóvel. O formulário é dividido em 5 etapas para facilitar: Proprietário, Imóvel, Detalhes, Valores e Revisão Final. Você não pode avançar sem preencher os campos obrigatórios.</p>
                            </div>
                        </div>
                        <!-- Item 2 -->
                        <div class="flex items-start gap-4">
                            <div class="flex-shrink-0 w-9 h-9 flex items-center justify-center bg-orange-100 text-orange-600 rounded-full">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                            </div>
                            <div>
                                <h4 class="font-bold text-gray-800 text-sm">Minhas Captações</h4>
                                <p class="text-xs text-gray-600 mt-0.5">Acesse o histórico de todas as suas captações. Você pode buscar por código, endereço, proprietário, CPF ou ID. Também é possível filtrar por status de assinatura e ordenar os resultados. Clique em qualquer captação recente na tela inicial para abrí-la diretamente.</p>
                            </div>
                        </div>
                        <!-- Item 3 -->
                        <div class="flex items-start gap-4">
                            <div class="flex-shrink-0 w-9 h-9 flex items-center justify-center bg-orange-100 text-orange-600 rounded-full">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                            </div>
                            <div>
                                <h4 class="font-bold text-gray-800 text-sm">Gerar PDF Oficial</h4>
                                <p class="text-xs text-gray-600 mt-0.5">Em "Minhas Captações", cada ficha tem um botão "Gerar PDF". Isso cria a ficha oficial com cabeçalho da Personal, formatada em padrão A4, pronta para impressão ou envio ao proprietário.</p>
                            </div>
                        </div>
                        <!-- Item 4 -->
                        <div class="flex items-start gap-4">
                            <div class="flex-shrink-0 w-9 h-9 flex items-center justify-center bg-orange-100 text-orange-600 rounded-full">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                            </div>
                            <div>
                                <h4 class="font-bold text-gray-800 text-sm">Coletar Assinatura Digital</h4>
                                <p class="text-xs text-gray-600 mt-0.5">Use o botão "Coletar Assinatura" em cada captação para gerar um link único e seguro. Envie ao proprietário por WhatsApp ou e-mail. Ele pode assinar digitalmente de qualquer dispositivo (celular, tablet ou computador). O link expira em 48 horas.</p>
                            </div>
                        </div>
                        <!-- Item 5 -->
                        <div class="flex items-start gap-4">
                            <div class="flex-shrink-0 w-9 h-9 flex items-center justify-center bg-orange-100 text-orange-600 rounded-full">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>
                            </div>
                            <div>
                                <h4 class="font-bold text-gray-800 text-sm">Status da Assinatura</h4>
                                <p class="text-xs text-gray-600 mt-0.5">Você pode verificar o status da assinatura clicando no selo colorido de cada captação (✓ Assinado, ⏳ Pendente ou Não Assinado). O modal exibe nome, CPF, data/hora, IP, dispositivo e a imagem da assinatura desenhada pelo proprietário.</p>
                            </div>
                        </div>
                        <!-- Item 6 -->
                        <div class="flex items-start gap-4">
                            <div class="flex-shrink-0 w-9 h-9 flex items-center justify-center bg-orange-100 text-orange-600 rounded-full">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                            </div>
                            <div>
                                <h4 class="font-bold text-gray-800 text-sm">Editar uma Captação</h4>
                                <p class="text-xs text-gray-600 mt-0.5">Em Minhas Captações, clique em "Editar" na ficha desejada para alterar qualquer informação. Após salvar, a ficha é atualizada com a data de modificação e todos os dados são preservados.</p>
                            </div>
                        </div>
                        <!-- Item 7 -->
                        <div class="flex items-start gap-4">
                            <div class="flex-shrink-0 w-9 h-9 flex items-center justify-center bg-orange-100 text-orange-600 rounded-full">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                            </div>
                            <div>
                                <h4 class="font-bold text-gray-800 text-sm">Fale Conosco</h4>
                                <p class="text-xs text-gray-600 mt-0.5">Use o botão "Enviar Mensagem" para enviar sugestões, relatar problemas ou tirar dúvidas diretamente com a administração do sistema. As mensagens são recebidas em tempo real.</p>
                            </div>
                        </div>
                    </div>

                    <!-- Footer do Modal -->
                    <div class="bg-white px-5 py-4 border-t border-gray-200 text-right">
                        <button id="btn-ack-help" class="px-6 py-2.5 bg-orange-600 text-white font-bold rounded-xl shadow-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all text-sm">Entendi!</button>
                    </div>
                </div>
            </div>

            <!-- Modal: Fale Conosco -->
            <div id="modal-feedback-box" class="hidden fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
                <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4">
                    <div class="flex justify-between items-center border-b pb-3">
                        <h3 class="text-base font-bold text-gray-900">Fale Conosco</h3>
                        <button id="btn-close-feedback-box" class="text-gray-400 hover:text-gray-600 text-2xl font-bold">&times;</button>
                    </div>
                    <p class="text-xs text-gray-500">Envie suas sugestões, dúvidas ou relatórios de erro diretamente à administração.</p>
                    <textarea id="feedback-input-text" rows="4" placeholder="Escreva sua mensagem aqui..." class="w-full p-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-orange-500"></textarea>
                    <div class="flex gap-2 justify-end">
                        <button id="btn-cancel-feedback" class="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-semibold">Cancelar</button>
                        <button id="btn-send-feedback" class="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-sm font-bold">Enviar Mensagem</button>
                    </div>
                </div>
            </div>
        `;
    }

    function mountHomeView() {
        const user = authService.getCurrentUser();
        const profile = authService.getCurrentProfile();

        // Atualizar contador do Firebase na interface
        if (exports.firebase.counter) {
            exports.firebase.counter.updateUI();
        }

        // Exibir botão de admin no rodapé se for admin
        if (authService.isAdmin(user, profile)) {
            const adminBtn = document.getElementById("footer-admin-btn");
            if (adminBtn) adminBtn.classList.remove("hidden");
        }

        // Relógio e Data em tempo real
        const updateDateTime = () => {
            const now = new Date();
            const clockEl = document.getElementById("clock-display");
            const dateEl = document.getElementById("date-display");
            if (clockEl) clockEl.innerText = now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
            if (dateEl) dateEl.innerText = now.toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long", year: "numeric" });
        };
        updateDateTime();
        const timerId = setInterval(updateDateTime, 1000);

        // ════════════════════════════════════════════════════════
        // MENSAGENS ESPECIAIS & SAUDAÇÃO INTELIGENTE
        // ════════════════════════════════════════════════════════
        const greetingEl = document.getElementById("greeting-message");
        if (greetingEl) {
            const hoje = new Date();
            const firstName = profile?.nome ? profile.nome.split(' ')[0] : (user?.email?.split('@')[0] || 'Corretor');
            const teamEl = document.getElementById("greeting-team");
            if (teamEl) teamEl.innerText = profile?.equipe || "Geral";

            let handled = false;

            // 1. Aniversário do Usuário
            if (profile && profile.dataNascimento) {
                const aniversario = new Date(profile.dataNascimento + 'T00:00:00');
                if (hoje.getDate() === aniversario.getDate() && hoje.getMonth() === aniversario.getMonth()) {
                    greetingEl.innerHTML = `
                        <div class="flex items-center gap-3">
                            <span class="text-3xl">🎂</span>
                            <div>
                                <h2 class="text-2xl font-black text-gray-800">Feliz Aniversário, ${firstName}!</h2>
                                <p class="text-sm text-orange-600 font-bold">Desejamos a você um dia incrível e muito sucesso! 🎉</p>
                            </div>
                        </div>
                    `;
                    handled = true;
                }
            }

            // 2. Aniversário de Empresa
            if (!handled && profile && profile.dataEntrada) {
                const aniversarioEmpresa = new Date(profile.dataEntrada + 'T00:00:00');
                if (hoje.getDate() === aniversarioEmpresa.getDate() && hoje.getMonth() === aniversarioEmpresa.getMonth()) {
                    const anosDeEmpresa = hoje.getFullYear() - aniversarioEmpresa.getFullYear();
                    if (anosDeEmpresa > 0) {
                        greetingEl.innerHTML = `
                            <div class="flex items-center gap-3">
                                <span class="text-3xl">🎉</span>
                                <div>
                                    <h2 class="text-2xl font-black text-gray-800">Feliz Aniversário de Empresa!</h2>
                                    <p class="text-sm text-blue-600 font-bold">Parabéns, ${firstName}, por seus ${anosDeEmpresa} ${anosDeEmpresa === 1 ? 'ano' : 'anos'} conosco!</p>
                                </div>
                            </div>
                        `;
                        handled = true;
                    }
                }
            }

            // 3. Saudação Diária com Ícone e Aviso de Terça-feira para Locação
            if (!handled) {
                const hour = hoje.getHours();
                const dayOfWeek = hoje.getDay(); // 2 = Terça-feira
                const dayOfMonth = hoje.getDate();

                let greetingText = 'Olá';
                let iconSvg = '';

                if (hour >= 5 && hour < 12) {
                    greetingText = 'Bom dia';
                    iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m0 16v1m9-9h1M3 12H2m15.325-4.775l-.707-.707M6.343 17.657l-.707.707M16.95 18.364l-.707-.707M7.05 6.343l-.707-.707M12 18a6 6 0 100-12 6 6 0 000 12z" /></svg>`;
                } else if (hour >= 12 && hour < 18) {
                    greetingText = 'Boa tarde';
                    iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m0 16v1m9-9h1M3 12H2m15.325-4.775l-.707-.707M6.343 17.657l-.707.707M16.95 18.364l-.707-.707M7.05 6.343l-.707-.707M12 18a6 6 0 100-12 6 6 0 000 12z" /></svg>`;
                } else {
                    greetingText = 'Boa noite';
                    iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>`;
                }

                let specialNotice = '';
                // Aviso de entrega de fichas nas terças-feiras dos primeiros 21 dias do mês para Locação
                if (dayOfWeek === 2 && dayOfMonth <= 21 && profile?.equipe === 'Locação') {
                    specialNotice = '<p class="text-xs text-orange-600 font-bold mt-1 bg-orange-50 px-2.5 py-1 rounded-lg w-fit border border-orange-200">📢 Hoje é dia de entregar as fichas de captação!</p>';
                }

                greetingEl.innerHTML = `
                    <div class="flex items-center gap-2.5">
                        ${iconSvg}
                        <h2 class="text-2xl font-black text-gray-800 tracking-tight">${greetingText}, ${firstName}!</h2>
                    </div>
                    <p class="text-xs text-gray-500 mt-0.5">Equipe: <strong class="text-orange-600">${profile?.equipe || "Geral"}</strong></p>
                    ${specialNotice}
                `;
            }
        }

        // ════════════════════════════════════════════════════════
        // MURAL DE RECADOS + ANIVERSARIANTES DO DIA DA EQUIPE
        // ════════════════════════════════════════════════════════
        const loadNotices = async () => {
            const container = document.getElementById("admin-notices-display");
            if (!container) return;
            try {
                let birthdayHtml = '';
                const hoje = new Date();

                // 1. Checar aniversariantes do dia entre os usuários
                try {
                    const usersSnap = await db.collection("users").get();
                    if (exports.firebase.counter) exports.firebase.counter.addReads(usersSnap.size || 1);
                    usersSnap.forEach(doc => {
                        const u = doc.data();
                        if (u.dataNascimento) {
                            const aniv = new Date(u.dataNascimento + 'T00:00:00');
                            if (hoje.getDate() === aniv.getDate() && hoje.getMonth() === aniv.getMonth()) {
                                const userName = `${u.nome || ''} ${u.sobrenome || ''}`.trim() || u.email;
                                birthdayHtml += `
                                    <div class="border-l-4 border-pink-400 bg-pink-50 p-2.5 rounded-r-xl mb-2">
                                        <p class="text-pink-900 font-bold text-xs">🎂 Feliz Aniversário, ${userName}!</p>
                                        <p class="text-[11px] text-pink-700 mt-0.5">A equipe deseja um dia incrível e cheio de realizações!</p>
                                    </div>
                                `;
                            }
                        }
                    });
                } catch (e) {}

                // 2. Avisos cadastrados pela administração
                const snap = await db.collection("avisos").orderBy("createdAt", "desc").limit(5).get();
                if (exports.firebase.counter) exports.firebase.counter.addReads(snap.size || 1);

                let noticesHtml = "";
                snap.forEach(d => {
                    const data = d.data();
                    const date = data.createdAt ? new Date(data.createdAt.seconds * 1000).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }) : '';
                    noticesHtml += `
                        <div class="border-l-3 border-blue-400 bg-white/70 p-2.5 rounded-r-xl mb-1.5 shadow-2xs">
                            <p class="text-[11px] text-blue-950 leading-snug">${data.text || ''}</p>
                            ${date ? `<span class="text-[9px] text-blue-500 font-semibold mt-1 block">${date}</span>` : ''}
                        </div>
                    `;
                });

                if (!birthdayHtml && snap.empty) {
                    container.innerHTML = '<p class="text-blue-400 text-xs py-2 text-center">Nenhum recado no momento.</p>';
                    return;
                }

                container.innerHTML = birthdayHtml + noticesHtml;
            } catch (e) {
                container.innerHTML = '<p class="text-red-400 text-xs">Falha ao carregar mural.</p>';
            }
        };

        // ════════════════════════════════════════════════════════
        // CAPTAÇÕES RECENTES (4 ITENS, CARDS CLICÁVEIS ESTATUS DE ASSINATURA)
        // ════════════════════════════════════════════════════════
        const loadRecentCaptures = async () => {
            const container = document.getElementById("recent-captures-display");
            if (!container || !user) return;
            try {
                const captures = await captacaoService.fetchUserCaptures(user.uid);
                if (captures.length === 0) {
                    container.innerHTML = `
                        <div class="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                            <p class="text-gray-500 text-xs font-semibold">Nenhuma captação cadastrada ainda.</p>
                            <a href="#/form" class="mt-2 inline-block px-4 py-2 bg-orange-600 text-white font-bold text-xs rounded-xl hover:bg-orange-700 transition-all">Começar Nova Captação</a>
                        </div>
                    `;
                    return;
                }

                let html = "";
                // Exibe as 4 captações mais recentes
                captures.slice(0, 4).forEach(c => {
                    const date = c.createdAt ? new Date(c.createdAt.seconds * 1000).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }) : '-';
                    const tipologia = (c.imovelTipologia && c.imovelTipologia.length > 0) ? c.imovelTipologia.join(' / ') : 'Imóvel';
                    const isSigned = c.signatureId && c.signatureStatus === 'signed';
                    const isPending = c.signatureStatus === 'pending';

                    let badgeHtml = '';
                    if (isSigned) {
                        badgeHtml = `<span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-green-100 text-green-800">✓ Assinado</span>`;
                    } else if (isPending) {
                        badgeHtml = `<span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-yellow-100 text-yellow-800">⏳ Pendente</span>`;
                    } else {
                        badgeHtml = `<span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-gray-100 text-gray-700">Não Assinado</span>`;
                    }

                    const tipoCaptacao = (c.tipoCaptacao === 'Ambos' || c.tipoCaptacao === 'Venda e Aluguel') ? 'Venda e Aluguel' : (c.tipoCaptacao || 'Captação');
                    const searchParam = encodeURIComponent(c.id);

                    html += `
                        <div onclick="window.location.hash='#/historico?search=${searchParam}'" style="cursor: pointer;" class="p-4 bg-white hover:bg-orange-50/40 border border-gray-200 hover:border-orange-300 rounded-2xl shadow-2xs transition-all space-y-2.5 group">
                            <div class="flex justify-between items-start gap-2">
                                <div class="flex items-center gap-2 flex-wrap">
                                    <span class="text-[11px] px-2 py-0.5 bg-orange-100 text-orange-800 font-bold rounded-md">
                                        ${tipoCaptacao}
                                    </span>
                                    ${c.codigoImovel ? `<span class="text-[11px] px-2 py-0.5 bg-blue-100 text-blue-800 font-mono font-bold rounded-md">Cód: ${c.codigoImovel}</span>` : ''}
                                    <span class="text-xs text-gray-400 font-medium">${date}</span>
                                </div>
                                <div class="flex-shrink-0">${badgeHtml}</div>
                            </div>

                            <div class="space-y-0.5">
                                <h4 class="text-sm font-black text-gray-900 group-hover:text-orange-600 transition-colors truncate" title="${tipologia}">
                                    ${tipologia}
                                </h4>
                                <p class="text-xs text-gray-600 truncate" title="${c.imovelEndereco || 'Sem endereço'}, ${c.imovelNumero || 'S/N'} - ${c.imovelBairro || ''}">
                                    ${c.imovelEndereco || 'Endereço não informado'}, ${c.imovelNumero || 'S/N'} ${c.imovelBairro ? `- ${c.imovelBairro}` : ''}
                                </p>
                            </div>

                            <div class="flex justify-between items-center text-xs text-gray-500 pt-2 border-t border-gray-100">
                                <span>Prop.: <strong class="text-gray-800 font-semibold">${c.propNome || 'Não informado'}</strong></span>
                                <span class="text-orange-600 font-bold text-[11px] group-hover:translate-x-0.5 transition-transform">Ver ficha &rarr;</span>
                            </div>
                        </div>
                    `;
                });
                container.innerHTML = html;
            } catch (e) {
                console.error(e);
            }
        };

        // Eventos dos Modais
        document.getElementById("btn-open-about")?.addEventListener("click", () => document.getElementById("modal-about")?.classList.remove("hidden"));
        document.getElementById("btn-close-about")?.addEventListener("click", () => document.getElementById("modal-about")?.classList.add("hidden"));
        document.getElementById("btn-open-help")?.addEventListener("click", () => document.getElementById("modal-help-guide")?.classList.remove("hidden"));
        document.getElementById("btn-close-help-guide")?.addEventListener("click", () => document.getElementById("modal-help-guide")?.classList.add("hidden"));
        document.getElementById("btn-ack-help")?.addEventListener("click", () => document.getElementById("modal-help-guide")?.classList.add("hidden"));
        document.getElementById("btn-open-feedback")?.addEventListener("click", () => document.getElementById("modal-feedback-box")?.classList.remove("hidden"));
        document.getElementById("btn-close-feedback-box")?.addEventListener("click", () => document.getElementById("modal-feedback-box")?.classList.add("hidden"));
        document.getElementById("btn-cancel-feedback")?.addEventListener("click", () => document.getElementById("modal-feedback-box")?.classList.add("hidden"));
        document.getElementById("btn-send-feedback")?.addEventListener("click", async () => {
            const txt = document.getElementById("feedback-input-text")?.value.trim();
            if (!txt) return;
            try {
                await captacaoService.sendFeedback(user.email, txt);
                document.getElementById("modal-feedback-box")?.classList.add("hidden");
                document.getElementById("feedback-input-text").value = "";
                showAlert("Mensagem enviada com sucesso para a administração!", "Obrigado!");
            } catch (e) {
                showAlert("Erro ao enviar mensagem: " + e.message, "Erro");
            }
        });

        loadNotices();
        loadRecentCaptures();
    }

    exports.views.home = {
        render: renderHomeView,
        mount: mountHomeView
    };
})(window.CaptaFacil);
