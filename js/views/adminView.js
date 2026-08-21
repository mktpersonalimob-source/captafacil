// ==========================================================================
// View: Painel Administrativo
// ==========================================================================

window.CaptaFacil = window.CaptaFacil || {};
window.CaptaFacil.views = window.CaptaFacil.views || {};

(function(exports) {
    const { db, fb } = exports.firebase;
    const { authService, captacaoService } = exports;
    const { generatePDF, parseUserAgent } = exports.pdfService;
    const { alert: showAlert, confirm: showConfirm } = exports.modal;
    const { show: showGlobalSpinner, hide: hideGlobalSpinner } = exports.loading;

    const fetchGlobalTermo = async () => {
        try {
            const snap = await db.collection("configuracoes").doc("textos").get();
            if (snap.exists && snap.data().termoAutorizacao) {
                return snap.data().termoAutorizacao;
            }
        } catch (e) {}
        return `AUTORIZAÇÃO DE CAPTAÇÃO DE IMÓVEL\n\nPelo presente instrumento particular, o PROPRIETÁRIO autoriza a PERSONAL CONSULTORIA IMOBILIÁRIA a intermediar, com exclusividade ou não, a venda e/ou locação do imóvel descrito neste documento, sob as condições comerciais estipuladas.`;
    };

    function renderAdminView() {
        return `
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 pb-28">

                <!-- CABEÇALHO DO PAINEL ADMIN -->
                <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-wrap justify-between items-center gap-4">
                    <div class="space-y-1">
                        <div class="flex items-center gap-3">
                            <span class="p-2 bg-blue-50 text-blue-600 rounded-xl font-bold text-lg">🛡️</span>
                            <div>
                                <h1 class="text-2xl font-black text-gray-800 tracking-tight">Painel Administrativo</h1>
                                <p class="text-xs text-gray-500">Gestão global de captações, corretores, equipes, assinaturas e auditoria.</p>
                            </div>
                        </div>
                    </div>
                    <a href="#/home" class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition-colors">
                        &larr; Voltar ao Início
                    </a>
                </div>

                <!-- CONTAINER PRINCIPAL DO CONTEÚDO ADMIN (Card Branco para Melhor Leitura) -->
                <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 space-y-6">

                    <!-- ================================================ -->
                    <!-- SUB-TELA: HUB PRINCIPAL                          -->
                    <!-- ================================================ -->
                    <div id="adm-subview-hub" class="adm-subview space-y-6">
                        <div>
                            <h2 class="text-base font-bold text-gray-800">Selecione uma área de gerenciamento:</h2>
                            <p class="text-xs text-gray-500">Acesse as ferramentas administrativas do sistema CaptaFácil.</p>
                        </div>

                        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            
                            <!-- 1. Captações -->
                            <div data-adm-nav="captures" class="p-5 bg-white rounded-2xl border border-gray-200 hover:border-orange-500 hover:shadow-md transition-all cursor-pointer group">
                                <div class="p-2.5 bg-orange-50 rounded-xl w-fit mb-3">
                                    <svg class="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>
                                </div>
                                <h3 class="font-bold text-gray-800 mb-1 group-hover:text-orange-600 transition-colors">Todas as Captações</h3>
                                <p class="text-xs text-gray-500">Visualizar, editar, gerar PDF ou excluir fichas de qualquer corretor.</p>
                            </div>

                            <!-- 2. Usuários -->
                            <div data-adm-nav="users" class="p-5 bg-white rounded-2xl border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all cursor-pointer group">
                                <div class="p-2.5 bg-blue-50 rounded-xl w-fit mb-3">
                                    <svg class="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
                                </div>
                                <h3 class="font-bold text-gray-800 mb-1 group-hover:text-blue-600 transition-colors">Usuários e Equipes</h3>
                                <p class="text-xs text-gray-500">Gerenciar corretores, editar equipes, aniversários e status de acesso.</p>
                            </div>

                            <!-- 3. Assinaturas -->
                            <div data-adm-nav="signatures" class="p-5 bg-white rounded-2xl border border-gray-200 hover:border-purple-500 hover:shadow-md transition-all cursor-pointer group">
                                <div class="p-2.5 bg-purple-50 rounded-xl w-fit mb-3">
                                    <svg class="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L14.732 3.732z"/></svg>
                                </div>
                                <h3 class="font-bold text-gray-800 mb-1 group-hover:text-purple-600 transition-colors">Assinaturas Eletrônicas</h3>
                                <p class="text-xs text-gray-500">Visualizar assinaturas, vincular a captações ou excluir registros.</p>
                            </div>

                            <!-- 4. Mural de Recados -->
                            <div data-adm-nav="notices" class="p-5 bg-white rounded-2xl border border-gray-200 hover:border-amber-500 hover:shadow-md transition-all cursor-pointer group">
                                <div class="p-2.5 bg-amber-50 rounded-xl w-fit mb-3">
                                    <svg class="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"/></svg>
                                </div>
                                <h3 class="font-bold text-gray-800 mb-1 group-hover:text-amber-600 transition-colors">Mural de Recados</h3>
                                <p class="text-xs text-gray-500">Publicar comunicados visíveis para todos os corretores na Home.</p>
                            </div>

                            <!-- 5. Fale Conosco -->
                            <div data-adm-nav="feedback" class="p-5 bg-white rounded-2xl border border-gray-200 hover:border-gray-500 hover:shadow-md transition-all cursor-pointer group">
                                <div class="p-2.5 bg-gray-100 rounded-xl w-fit mb-3">
                                    <svg class="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg>
                                </div>
                                <h3 class="font-bold text-gray-800 mb-1 group-hover:text-gray-900 transition-colors">Fale Conosco</h3>
                                <p class="text-xs text-gray-500">Mensagens, sugestões e feedbacks enviados pelos corretores.</p>
                            </div>

                            <!-- 6. Termo do PDF -->
                            <div data-adm-nav="termo" class="p-5 bg-white rounded-2xl border border-gray-200 hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer group">
                                <div class="p-2.5 bg-emerald-50 rounded-xl w-fit mb-3">
                                    <svg class="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                                </div>
                                <h3 class="font-bold text-gray-800 mb-1 group-hover:text-emerald-600 transition-colors">Texto do Termo (PDF)</h3>
                                <p class="text-xs text-gray-500">Personalizar o texto de autorização de captação gerado no PDF.</p>
                            </div>

                            <!-- 7. Monitor de Acesso -->
                            <div data-adm-nav="access" class="p-5 bg-white rounded-2xl border border-gray-200 hover:border-indigo-500 hover:shadow-md transition-all cursor-pointer group">
                                <div class="p-2.5 bg-indigo-50 rounded-xl w-fit mb-3">
                                    <svg class="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                                </div>
                                <h3 class="font-bold text-gray-800 mb-1 group-hover:text-indigo-600 transition-colors">Monitor de Acessos</h3>
                                <p class="text-xs text-gray-500">Registro de último login e presença dos corretores.</p>
                            </div>

                            <!-- 8. Auditoria -->
                            <div data-adm-nav="audit" class="p-5 bg-white rounded-2xl border border-gray-200 hover:border-blue-600 hover:shadow-md transition-all cursor-pointer group">
                                <div class="p-2.5 bg-blue-50 rounded-xl w-fit mb-3">
                                    <svg class="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/></svg>
                                </div>
                                <h3 class="font-bold text-gray-800 mb-1 group-hover:text-blue-600 transition-colors">Log de Auditoria</h3>
                                <p class="text-xs text-gray-500">Histórico de ações executadas no sistema (10 em 10).</p>
                            </div>
                        </div>
                    </div>

                    <!-- ================================================ -->
                    <!-- SUB-TELA: GERENCIAR CAPTAÇÕES                    -->
                    <!-- ================================================ -->
                    <div id="adm-subview-captures" class="adm-subview hidden space-y-4">
                        <div class="flex flex-wrap justify-between items-center gap-3 pb-3 border-b border-gray-100">
                            <div>
                                <h2 class="text-lg font-bold text-gray-800">Todas as Captações</h2>
                                <p class="text-xs text-gray-500">Visualização de todos os corretores • Paginação de 10 em 10</p>
                            </div>
                            <button data-adm-back class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition-colors">&larr; Voltar ao Menu Admin</button>
                        </div>

                        <div class="flex flex-col sm:flex-row gap-3 items-center justify-between">
                            <div class="relative flex-1 w-full">
                                <input type="text" id="adm-captures-search" placeholder="Buscar por código, endereço, proprietário, corretor ou ID..." class="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500">
                            </div>
                            <button id="btn-adm-refresh-captures" class="px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl shadow-sm transition-colors">Atualizar Lista</button>
                        </div>

                        <div id="adm-captures-list-container" class="space-y-3 min-h-[200px]">
                            <p class="text-center text-gray-400 py-10 text-sm animate-pulse">Carregando captações...</p>
                        </div>

                        <!-- Paginação -->
                        <div class="p-3 bg-gray-50 rounded-xl border border-gray-200 flex justify-between items-center text-xs font-bold text-gray-600">
                            <button id="btn-adm-cap-prev" class="px-4 py-2 bg-white hover:bg-gray-100 border rounded-xl disabled:opacity-40">&larr; Anterior</button>
                            <span id="adm-cap-page-indicator">Página 1</span>
                            <button id="btn-adm-cap-next" class="px-4 py-2 bg-white hover:bg-gray-100 border rounded-xl disabled:opacity-40">Próxima &rarr;</button>
                        </div>
                    </div>

                    <div id="modal-capture-status" class="hidden fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
                        <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full p-5 space-y-4">
                            <div class="flex justify-between items-center border-b pb-3">
                                <h3 class="text-base font-bold text-gray-900">Status da Captação</h3>
                                <button id="btn-close-capture-status-modal" class="text-gray-400 hover:text-gray-600 text-2xl font-bold leading-none">&times;</button>
                            </div>
                            <div id="capture-status-content" class="space-y-3 text-sm text-gray-700"></div>
                        </div>
                    </div>

                    <!-- ================================================ -->
                    <!-- SUB-TELA: USUÁRIOS E EQUIPES COM BUSCA           -->
                    <!-- ================================================ -->
                    <div id="adm-subview-users" class="adm-subview hidden space-y-4">
                        <div class="flex flex-wrap justify-between items-center gap-3 pb-3 border-b border-gray-100">
                            <div>
                                <h2 class="text-lg font-bold text-gray-800">Usuários e Equipes</h2>
                                <p class="text-xs text-gray-500">Busca em tempo real e edição de perfil de cada corretor.</p>
                            </div>
                            <button data-adm-back class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition-colors">&larr; Voltar ao Menu Admin</button>
                        </div>

                        <!-- Campo de Busca por Usuário -->
                        <div class="relative">
                            <input type="text" id="adm-users-search" placeholder="Buscar corretor por nome, e-mail ou equipe..." class="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500">
                        </div>

                        <div id="adm-users-list-container" class="space-y-3 min-h-[200px]">
                            <p class="text-center text-gray-400 py-10 text-sm animate-pulse">Carregando usuários...</p>
                        </div>
                    </div>

                    <!-- Modal de Edição de Usuário -->
                    <div id="modal-edit-user" class="hidden fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
                        <div class="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
                            <div class="flex justify-between items-center border-b pb-3">
                                <h3 class="text-base font-bold text-gray-900">Editar Perfil do Corretor</h3>
                                <button id="btn-close-user-modal" class="text-gray-400 hover:text-gray-600 text-2xl font-bold">&times;</button>
                            </div>
                            <input type="hidden" id="edit-user-id">
                            <div class="grid grid-cols-2 gap-3">
                                <div>
                                    <label class="text-xs font-bold text-gray-600 block mb-1">Nome</label>
                                    <input id="edit-user-nome" type="text" class="w-full px-3 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500">
                                </div>
                                <div>
                                    <label class="text-xs font-bold text-gray-600 block mb-1">Sobrenome</label>
                                    <input id="edit-user-sobrenome" type="text" class="w-full px-3 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500">
                                </div>
                                <div>
                                    <label class="text-xs font-bold text-gray-600 block mb-1">Data de Nascimento</label>
                                    <input id="edit-user-nasc" type="date" class="w-full px-3 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500">
                                </div>
                                <div>
                                    <label class="text-xs font-bold text-gray-600 block mb-1">Data de Entrada</label>
                                    <input id="edit-user-entrada" type="date" class="w-full px-3 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500">
                                </div>
                                <div>
                                    <label class="text-xs font-bold text-gray-600 block mb-1">Equipe</label>
                                    <select id="edit-user-equipe" class="w-full px-3 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500 bg-white">
                                        <option value="Vendas">Vendas</option>
                                        <option value="Locação">Locação</option>
                                        <option value="Administrativo">Administrativo</option>
                                    </select>
                                </div>
                                <div>
                                    <label class="text-xs font-bold text-gray-600 block mb-1">Status da Conta</label>
                                    <select id="edit-user-status" class="w-full px-3 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500 bg-white">
                                        <option value="true">Ativo</option>
                                        <option value="false">Desativado</option>
                                    </select>
                                </div>
                            </div>
                            <div class="flex justify-end gap-2 pt-3 border-t">
                                <button id="btn-cancel-user-edit" class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-semibold">Cancelar</button>
                                <button id="btn-save-user-edit" class="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow-sm">Salvar Alterações</button>
                            </div>
                        </div>
                    </div>

                    <!-- ================================================ -->
                    <!-- SUB-TELA: ASSINATURAS ELETRÔNICAS                -->
                    <!-- ================================================ -->
                    <div id="adm-subview-signatures" class="adm-subview hidden space-y-4">
                        <div class="flex flex-wrap justify-between items-center gap-3 pb-3 border-b border-gray-100">
                            <div>
                                <h2 class="text-lg font-bold text-gray-800">Assinaturas Eletrônicas</h2>
                                <p class="text-xs text-gray-500">Exibição completa de dispositivo, código da captação e opções de vincular ou excluir.</p>
                            </div>
                            <button data-adm-back class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition-colors">&larr; Voltar ao Menu Admin</button>
                        </div>
                        <div id="adm-signatures-container" class="space-y-4 min-h-[200px]">
                            <p class="text-center text-gray-400 py-10 text-sm animate-pulse">Carregando assinaturas...</p>
                        </div>
                    </div>

                    <!-- Modal: Vincular Assinatura a uma Captação -->
                    <div id="modal-link-signature" class="hidden fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
                        <div class="bg-white rounded-2xl shadow-2xl max-w-xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
                            <div class="flex justify-between items-center border-b pb-3">
                                <div>
                                    <h3 class="text-base font-bold text-gray-900">Vincular Assinatura a uma Captação</h3>
                                    <p class="text-xs text-gray-500" id="link-sig-owner-info">Assinatura selecionada</p>
                                </div>
                                <button id="btn-close-link-sig-modal" class="text-gray-400 hover:text-gray-600 text-2xl font-bold">&times;</button>
                            </div>
                            
                            <div>
                                <label class="text-xs font-bold text-gray-700 block mb-1">Buscar Captação de Destino:</label>
                                <input type="text" id="link-sig-search-input" placeholder="Digite código, endereço ou proprietário..." class="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-purple-500">
                            </div>

                            <div id="link-sig-captures-list" class="space-y-2 max-h-60 overflow-y-auto p-1 border rounded-xl bg-gray-50 min-h-[120px]">
                                <p class="text-center text-gray-400 py-6 text-xs">Carregando captações para seleção...</p>
                            </div>

                            <div class="flex justify-end gap-2 pt-3 border-t">
                                <button id="btn-cancel-link-sig" class="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-xs font-bold">Cancelar</button>
                            </div>
                        </div>
                    </div>

                    <!-- Modal: Visualizar Assinatura Ampliada -->
                    <div id="modal-view-signature" class="hidden fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
                        <div class="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden">
                            <div class="flex justify-between items-center p-5 border-b">
                                <div>
                                    <h3 class="font-bold text-gray-900" id="sig-modal-owner-name">Assinatura</h3>
                                    <p class="text-xs text-gray-500" id="sig-modal-details"></p>
                                </div>
                                <button id="btn-close-sig-modal" class="text-gray-400 hover:text-gray-600 text-2xl font-bold">&times;</button>
                            </div>
                            <div class="p-5 bg-gray-50 flex justify-center items-center min-h-[200px]">
                                <img id="sig-modal-image" src="" alt="Assinatura" class="max-w-full max-h-[300px] border border-gray-200 rounded-xl bg-white p-3 shadow-inner object-contain">
                            </div>
                            <div class="p-4 flex flex-wrap gap-2 justify-between border-t bg-gray-50">
                                <div class="text-xs text-gray-600 self-center" id="sig-modal-capture-info">Captação vinculada: —</div>
                                <button id="btn-close-sig-modal-2" class="px-5 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs font-bold rounded-xl">Fechar</button>
                            </div>
                        </div>
                    </div>

                    <!-- ================================================ -->
                    <!-- SUB-TELA: MURAL DE RECADOS                       -->
                    <!-- ================================================ -->
                    <div id="adm-subview-notices" class="adm-subview hidden space-y-4">
                        <div class="flex flex-wrap justify-between items-center gap-3 pb-3 border-b border-gray-100">
                            <div>
                                <h2 class="text-lg font-bold text-gray-800">Mural de Recados</h2>
                                <p class="text-xs text-gray-500">Publicações aparecem na tela principal de todos os corretores.</p>
                            </div>
                            <button data-adm-back class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition-colors">&larr; Voltar ao Menu Admin</button>
                        </div>
                        <div class="bg-gray-50 p-4 rounded-2xl border border-gray-200 space-y-3">
                            <h4 class="text-xs font-bold text-gray-800 uppercase">Publicar novo recado:</h4>
                            <textarea id="adm-new-notice-text" rows="3" placeholder="Escreva a mensagem para os corretores..." class="w-full p-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500"></textarea>
                            <div class="text-right">
                                <button id="btn-adm-publish-notice" class="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm">Publicar Recado</button>
                            </div>
                        </div>
                        <div class="space-y-3">
                            <h4 class="text-xs font-bold text-gray-700 uppercase">Recados Publicados Ativos:</h4>
                            <div id="adm-notices-container" class="space-y-2">Carregando...</div>
                        </div>
                    </div>

                    <!-- ================================================ -->
                    <!-- SUB-TELA: FALE CONOSCO                           -->
                    <!-- ================================================ -->
                    <div id="adm-subview-feedback" class="adm-subview hidden space-y-4">
                        <div class="flex flex-wrap justify-between items-center gap-3 pb-3 border-b border-gray-100">
                            <div>
                                <h2 class="text-lg font-bold text-gray-800">Mensagens Recebidas</h2>
                                <p class="text-xs text-gray-500">Feedbacks, sugestões e chamados enviados pelos corretores.</p>
                            </div>
                            <button data-adm-back class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition-colors">&larr; Voltar ao Menu Admin</button>
                        </div>
                        <div id="adm-feedback-container" class="space-y-3">Carregando...</div>
                    </div>

                    <!-- ================================================ -->
                    <!-- SUB-TELA: TERMO DO PDF                           -->
                    <!-- ================================================ -->
                    <div id="adm-subview-termo" class="adm-subview hidden space-y-4">
                        <div class="flex flex-wrap justify-between items-center gap-3 pb-3 border-b border-gray-100">
                            <div>
                                <h2 class="text-lg font-bold text-gray-800">Texto do Termo de Autorização</h2>
                                <p class="text-xs text-gray-500">Este texto é impresso no documento oficial PDF e apresentado no link de assinatura.</p>
                            </div>
                            <button data-adm-back class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition-colors">&larr; Voltar ao Menu Admin</button>
                        </div>
                        <div class="space-y-3">
                            <textarea id="adm-termo-textarea" rows="10" class="w-full p-4 border border-gray-300 rounded-2xl text-sm font-mono focus:ring-2 focus:ring-blue-500"></textarea>
                            <button id="btn-adm-save-termo-text" class="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm">Salvar Alterações no Termo</button>
                        </div>
                    </div>

                    <!-- ================================================ -->
                    <!-- SUB-TELA: MONITOR DE ACESSO                      -->
                    <!-- ================================================ -->
                    <div id="adm-subview-access" class="adm-subview hidden space-y-4">
                        <div class="flex flex-wrap justify-between items-center gap-3 pb-3 border-b border-gray-100">
                            <div>
                                <h2 class="text-lg font-bold text-gray-800">Monitor de Acesso e Presença</h2>
                                <p class="text-xs text-gray-500">Visualização de data e hora do último acesso de cada corretor.</p>
                            </div>
                            <button data-adm-back class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition-colors">&larr; Voltar ao Menu Admin</button>
                        </div>
                        <div id="adm-access-container" class="space-y-2">Carregando...</div>
                    </div>

                    <!-- ================================================ -->
                    <!-- SUB-TELA: AUDITORIA (10 em 10 + Carregar Mais)   -->
                    <!-- ================================================ -->
                    <div id="adm-subview-audit" class="adm-subview hidden space-y-4">
                        <div class="flex flex-wrap justify-between items-center gap-3 pb-3 border-b border-gray-100">
                            <div>
                                <h2 class="text-lg font-bold text-gray-800">Registro de Auditoria</h2>
                                <p class="text-xs text-gray-500">Histórico de ações detalhadas com identificação clara de usuário e data/hora.</p>
                            </div>
                            <button data-adm-back class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition-colors">&larr; Voltar ao Menu Admin</button>
                        </div>

                        <div id="adm-audit-container" class="space-y-3 min-h-[200px]">
                            <p class="text-center text-gray-400 py-10 text-sm animate-pulse">Carregando registros de auditoria...</p>
                        </div>

                        <!-- Botão Carregar Mais -->
                        <div class="text-center pt-2" id="adm-audit-load-more-wrapper">
                            <button id="btn-adm-audit-load-more" class="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl transition-all">
                                Carregar Mais Registros (10)
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        `;
    }

    function mountAdminView() {
        const user = authService.getCurrentUser();
        const profile = authService.getCurrentProfile();

        if (!authService.isAdmin(user, profile)) {
            showAlert("Acesso restrito a administradores do sistema.", "Acesso Negado");
            window.location.hash = "#/home";
            return;
        }

        // Navegação de Subtelas
        const showSubView = (subId) => {
            document.querySelectorAll(".adm-subview").forEach(el => el.classList.add("hidden"));
            const target = document.getElementById(`adm-subview-${subId}`);
            if (target) target.classList.remove("hidden");
            window.scrollTo({ top: 0, behavior: "smooth" });
        };

        document.querySelectorAll("[data-adm-nav]").forEach(btn => {
            btn.addEventListener("click", () => {
                const target = btn.getAttribute("data-adm-nav");
                showSubView(target);
                if (target === "captures") loadCapturesPaged();
                if (target === "users") loadUsers();
                if (target === "notices") loadNotices();
                if (target === "feedback") loadFeedbacks();
                if (target === "termo") loadTermo();
                if (target === "signatures") loadSignatures();
                if (target === "access") loadAccessMonitor();
                if (target === "audit") { auditCurrentLimit = 10; loadAuditLogs(); }
            });
        });

        document.querySelectorAll("[data-adm-back]").forEach(btn => btn.addEventListener("click", () => showSubView("hub")));

        // ════════════════════════════════════════════════════════
        // 1. CAPTAÇÕES (PAGINADAS 10 EM 10)
        // ════════════════════════════════════════════════════════
        let allCapturesCache = [];
        let capturesPageCache = [];
        let capturesPageCursors = [];
        let currentPage = 1;
        let capturesHasMore = true;
        const pageSize = 10;

        const fetchNextCapturePage = async () => {
            const startAfterDoc = capturesPageCursors[capturesPageCursors.length - 1] || null;
            const response = await captacaoService.fetchCapturesPage({
                limitCount: pageSize,
                startAfterDoc
            });

            if (!response.items.length) {
                capturesHasMore = false;
                return [];
            }

            capturesPageCache.push(response.items);
            capturesPageCursors.push(response.lastDoc);
            capturesHasMore = response.hasMore;
            return response.items;
        };

        const refreshCapturesList = async () => {
            capturesPageCache = [];
            capturesPageCursors = [];
            capturesHasMore = true;
            currentPage = 1;
            allCapturesCache = [];

            const container = document.getElementById("adm-captures-list-container");
            if (container) {
                container.innerHTML = '<p class="text-center text-gray-400 py-10 animate-pulse text-sm">Atualizando captações...</p>';
            }

            try {
                await fetchNextCapturePage();
                allCapturesCache = await captacaoService.fetchAllCaptures();
                renderCapturesCards();
            } catch (error) {
                console.error('Erro ao atualizar captações:', error);
                if (container) {
                    container.innerHTML = '<p class="text-center text-red-500 py-10 text-sm">Erro ao atualizar a lista de captações.</p>';
                }
            }
        };

        const loadCapturesPaged = async (page = 1) => {
            currentPage = page;
            const container = document.getElementById("adm-captures-list-container");
            if (!container) return;

            if (!capturesPageCache.length) {
                container.innerHTML = '<p class="text-center text-gray-400 py-10 animate-pulse text-sm">Buscando captações...</p>';
                await fetchNextCapturePage();
                allCapturesCache = await captacaoService.fetchAllCaptures();
            }

            renderCapturesCards();
        };

        const openCaptureStatusModal = async (captureId) => {
            const modal = document.getElementById("modal-capture-status");
            const content = document.getElementById("capture-status-content");
            if (!modal || !content) return;

            modal.classList.remove("hidden");
            content.innerHTML = '<p class="text-center text-gray-400 py-6 text-sm animate-pulse">Carregando status...</p>';

            try {
                const capture = allCapturesCache.find(c => c.id === captureId) || await captacaoService.getById(captureId);
                if (!capture) {
                    content.innerHTML = '<p class="text-center text-red-500 py-4 text-sm">Captação não encontrada.</p>';
                    return;
                }

                const status = capture.signatureStatus || 'not_signed';
                const signedAt = capture.signatureSignedAt || (capture.signatureData && capture.signatureData.signedAt) || null;
                const signedDate = signedAt && signedAt.seconds ? new Date(signedAt.seconds * 1000).toLocaleString('pt-BR') : 'Não registrado';
                let badgeClass = 'bg-gray-100 text-gray-700';
                let statusText = 'Não assinado';
                let infoHtml = '<p class="text-xs text-gray-500">Ainda não há assinatura eletrônica registrada para esta captação.</p>';

                if (status === 'signed') {
                    badgeClass = 'bg-green-100 text-green-800';
                    statusText = 'Assinado';
                    infoHtml = `
                        <div class="space-y-2">
                            <div class="flex items-center gap-2">
                                <span class="px-2 py-1 rounded-full text-[10px] font-bold ${badgeClass}">${statusText}</span>
                                <span class="text-xs text-gray-500">Captação vinculada a assinatura</span>
                            </div>
                            <p class="text-xs text-gray-600"><strong>Assinado por:</strong> ${capture.propNome || 'Não informado'}</p>
                            <p class="text-xs text-gray-600"><strong>Data:</strong> ${signedDate}</p>
                            <p class="text-xs text-gray-600"><strong>ID da assinatura:</strong> ${capture.signatureId || 'N/A'}</p>
                        </div>
                    `;
                } else if (status === 'pending') {
                    badgeClass = 'bg-yellow-100 text-yellow-800';
                    statusText = 'Pendente';
                    const expiry = capture.signatureTokenExpires && capture.signatureTokenExpires.seconds ? new Date(capture.signatureTokenExpires.seconds * 1000).toLocaleString('pt-BR') : 'Não informado';
                    infoHtml = `
                        <div class="space-y-2">
                            <div class="flex items-center gap-2">
                                <span class="px-2 py-1 rounded-full text-[10px] font-bold ${badgeClass}">${statusText}</span>
                                <span class="text-xs text-gray-500">Link de assinatura ativo</span>
                            </div>
                            <p class="text-xs text-gray-600"><strong>Validade do link:</strong> ${expiry}</p>
                            <p class="text-xs text-gray-600"><strong>Token:</strong> ${capture.signatureToken || 'N/A'}</p>
                        </div>
                    `;
                }

                content.innerHTML = `
                    <div class="space-y-3">
                        <div class="p-3 rounded-xl bg-gray-50 border border-gray-200">
                            <div class="flex items-center justify-between gap-2">
                                <span class="text-xs font-bold text-gray-500 uppercase">Status</span>
                                <span class="px-2.5 py-1 rounded-full text-[10px] font-bold ${badgeClass}">${statusText}</span>
                            </div>
                            <p class="mt-2 text-sm font-bold text-gray-900">${capture.imovelEndereco || 'Imóvel sem endereço'}, ${capture.imovelNumero || 'S/N'}</p>
                        </div>
                        ${infoHtml}
                        <div class="border-t border-gray-200 pt-3 text-[11px] text-gray-500 space-y-1">
                            <p><strong>Corretor:</strong> ${capture.corretorNome || capture.owner_email || 'Não informado'}</p>
                            <p><strong>Proprietário:</strong> ${capture.propNome || 'Não informado'}</p>
                            <p><strong>Código:</strong> ${capture.codigoImovel || 'N/A'}</p>
                        </div>
                    </div>
                `;
            } catch (error) {
                console.error('Erro ao carregar status da captação:', error);
                content.innerHTML = '<p class="text-center text-red-500 py-4 text-sm">Erro ao carregar o status desta captação.</p>';
            }
        };

        const renderCapturesCards = () => {
            const container = document.getElementById("adm-captures-list-container");
            if (!container) return;

            const pageItems = capturesPageCache[currentPage - 1] || [];
            const term = document.getElementById("adm-captures-search")?.value.toLowerCase().trim() || "";
            const filtered = pageItems.filter(c => {
                if (!term) return true;
                return (c.imovelEndereco || "").toLowerCase().includes(term)
                    || (c.propNome || "").toLowerCase().includes(term)
                    || (c.codigoImovel || "").toLowerCase().includes(term)
                    || (c.corretorNome || "").toLowerCase().includes(term)
                    || (c.owner_email || "").toLowerCase().includes(term)
                    || (c.id || "").toLowerCase().includes(term);
            });

            if (currentPage < 1) currentPage = 1;

            const indEl = document.getElementById("adm-cap-page-indicator");
            if (indEl) {
                const totalLoaded = capturesPageCache.reduce((acc, page) => acc + page.length, 0);
                indEl.innerText = `Página ${currentPage} • ${totalLoaded} captações carregadas ${capturesHasMore ? '• próximos lotes de 10' : '• última página'}`;
            }
            const prevEl = document.getElementById("btn-adm-cap-prev");
            const nextEl = document.getElementById("btn-adm-cap-next");
            if (prevEl) prevEl.disabled = currentPage === 1;
            if (nextEl) nextEl.disabled = !capturesHasMore && currentPage >= capturesPageCache.length;

            if (filtered.length === 0) {
                container.innerHTML = '<p class="text-center text-gray-500 py-10 text-sm">Nenhuma captação encontrada nesta página.</p>';
                return;
            }

            let html = '<div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">';
            filtered.forEach(c => {
                const date = c.createdAt ? new Date(c.createdAt.seconds * 1000).toLocaleDateString('pt-BR') : '-';
                const isSigned = c.signatureId && c.signatureStatus === 'signed';
                const isPending = c.signatureStatus === 'pending';
                const badge = isSigned
                    ? '<span class="text-[10px] font-bold text-green-700 bg-green-100 px-2.5 py-0.5 rounded-full">✓ Assinado</span>'
                    : isPending
                        ? '<span class="text-[10px] font-bold text-yellow-700 bg-yellow-100 px-2.5 py-0.5 rounded-full">⏳ Pendente</span>'
                        : '<span class="text-[10px] font-bold text-gray-500 bg-gray-100 px-2.5 py-0.5 rounded-full">Não Assinado</span>';
                const tipologia = (c.imovelTipologia && c.imovelTipologia.length > 0) ? c.imovelTipologia.join(' / ') : 'Imóvel';

                html += `
                    <div class="bg-white border border-gray-200 rounded-2xl p-4 space-y-3 hover:border-orange-300 transition-all shadow-2xs">
                        <div class="flex justify-between items-start gap-2">
                            <div>
                                <div class="flex items-center gap-1.5 mb-1 flex-wrap">
                                    <span class="text-[10px] px-2 py-0.5 bg-orange-100 text-orange-800 font-bold rounded">${c.tipoCaptacao || 'Captação'}</span>
                                    ${c.codigoImovel ? `<span class="text-[10px] px-2 py-0.5 bg-blue-100 text-blue-800 font-mono font-bold rounded">Cód: ${c.codigoImovel}</span>` : ''}
                                    <span class="text-[10px] text-gray-400">${date}</span>
                                </div>
                                <h4 class="text-sm font-bold text-gray-900 leading-tight">${tipologia}</h4>
                                <p class="text-xs text-gray-500 mt-0.5 line-clamp-1">${c.imovelEndereco || 'Sem endereço'}, ${c.imovelNumero || 'S/N'} - ${c.imovelBairro || ''}</p>
                            </div>
                            <button type="button" data-adm-status="${c.id}" class="flex-shrink-0 cursor-pointer hover:opacity-90">${badge}</button>
                        </div>
                        <div class="text-xs text-gray-600 grid grid-cols-2 gap-1 pt-2 border-t border-gray-100">
                            <span class="truncate">Corretor: <strong class="text-gray-800">${c.corretorNome || c.owner_email || '-'}</strong></span>
                            <span class="truncate">Prop: <strong class="text-gray-800">${c.propNome || '-'}</strong></span>
                        </div>
                        <div class="flex gap-1.5 pt-1">
                            <button data-adm-edit="${c.id}" class="flex-1 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-xl transition-colors">Editar</button>
                            <button data-adm-pdf="${c.id}" class="flex-1 py-1.5 bg-orange-50 hover:bg-orange-100 text-orange-700 text-xs font-bold rounded-xl transition-colors">PDF</button>
                            <button data-adm-del="${c.id}" class="flex-1 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold rounded-xl transition-colors">Excluir</button>
                        </div>
                    </div>
                `;
            });
            html += '</div>';
            container.innerHTML = html;
        };

        document.getElementById("btn-adm-cap-prev")?.addEventListener("click", () => { if (currentPage > 1) { currentPage--; renderCapturesCards(); } });
        document.getElementById("btn-adm-cap-next")?.addEventListener("click", async () => {
            if (currentPage < capturesPageCache.length) {
                currentPage++;
                renderCapturesCards();
                return;
            }

            if (!capturesHasMore) return;
            await fetchNextCapturePage();
            if (capturesPageCache.length > 0) {
                currentPage = capturesPageCache.length;
                renderCapturesCards();
            }
        });
        document.getElementById("btn-adm-refresh-captures")?.addEventListener("click", refreshCapturesList);
        document.getElementById("adm-captures-search")?.addEventListener("input", () => { currentPage = 1; renderCapturesCards(); });
        document.getElementById("btn-close-capture-status-modal")?.addEventListener("click", () => document.getElementById("modal-capture-status")?.classList.add("hidden"));

        // ════════════════════════════════════════════════════════
        // 2. USUÁRIOS E EQUIPES (COM BUSCA EM TEMPO REAL)
        // ════════════════════════════════════════════════════════
        let usersListCache = [];

        const loadUsers = async () => {
            const container = document.getElementById("adm-users-list-container");
            if (!container) return;
            container.innerHTML = '<p class="text-center text-gray-400 py-10 animate-pulse text-sm">Carregando corretores...</p>';
            try {
                const snap = await db.collection("users").get();
                if (exports.firebase.counter) exports.firebase.counter.addReads(snap.size || 1);
                usersListCache = snap.docs.map(d => ({ id: d.id, ...d.data() }));
                renderUsersList();
            } catch (e) {
                container.innerHTML = `<p class="text-red-500 text-center py-6 text-sm">Erro ao carregar: ${e.message}</p>`;
            }
        };

        const renderUsersList = () => {
            const container = document.getElementById("adm-users-list-container");
            if (!container) return;

            const term = document.getElementById("adm-users-search")?.value.toLowerCase().trim() || "";
            const filtered = usersListCache.filter(u => {
                if (!term) return true;
                const name = `${u.nome || ''} ${u.sobrenome || ''}`.toLowerCase();
                const email = (u.email || '').toLowerCase();
                const equipe = (u.equipe || '').toLowerCase();
                return name.includes(term) || email.includes(term) || equipe.includes(term);
            });

            if (filtered.length === 0) {
                container.innerHTML = '<p class="text-gray-400 text-xs py-8 text-center">Nenhum corretor encontrado para esta busca.</p>';
                return;
            }

            let html = "";
            filtered.forEach(u => {
                const name = `${u.nome || ''} ${u.sobrenome || ''}`.trim() || u.email;
                const isActive = u.isActive !== false;
                const dateNasc = u.dataNascimento ? new Date(u.dataNascimento + 'T00:00:00').toLocaleDateString('pt-BR') : 'Não inf.';
                const dateEntrada = u.dataEntrada ? new Date(u.dataEntrada + 'T00:00:00').toLocaleDateString('pt-BR') : 'Não inf.';

                html += `
                    <div class="bg-white border border-gray-200 rounded-2xl p-4 flex flex-wrap justify-between items-center gap-3 hover:border-blue-200 transition-all">
                        <div>
                            <div class="flex items-center gap-2 mb-1 flex-wrap">
                                <h4 class="font-bold text-gray-900 text-sm">${name}</h4>
                                <span class="text-[10px] font-bold px-2 py-0.5 rounded-full ${isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
                                    ${isActive ? 'Ativo' : 'Desativado'}
                                </span>
                                <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
                                    Equipe: ${u.equipe || 'Geral'}
                                </span>
                            </div>
                            <p class="text-xs text-gray-500 font-mono">${u.email}</p>
                            <p class="text-[11px] text-gray-400 mt-1">Nascimento: <strong class="text-gray-600">${dateNasc}</strong> • Entrada: <strong class="text-gray-600">${dateEntrada}</strong></p>
                        </div>
                        <button data-edit-user-btn="${u.id}" class="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-xl transition-colors">
                            Editar Perfil
                        </button>
                    </div>
                `;
            });
            container.innerHTML = html;
        };

        document.getElementById("adm-users-search")?.addEventListener("input", renderUsersList);

        // Edição de Usuário
        document.addEventListener("click", (e) => {
            const userId = e.target.getAttribute("data-edit-user-btn");
            if (userId) {
                const u = usersListCache.find(user => user.id === userId);
                if (!u) return;
                document.getElementById("edit-user-id").value = u.id;
                document.getElementById("edit-user-nome").value = u.nome || "";
                document.getElementById("edit-user-sobrenome").value = u.sobrenome || "";
                document.getElementById("edit-user-nasc").value = u.dataNascimento || "";
                document.getElementById("edit-user-entrada").value = u.dataEntrada || "";
                document.getElementById("edit-user-equipe").value = u.equipe || "Vendas";
                document.getElementById("edit-user-status").value = String(u.isActive !== false);
                document.getElementById("modal-edit-user")?.classList.remove("hidden");
            }
        });

        document.getElementById("btn-close-user-modal")?.addEventListener("click", () => document.getElementById("modal-edit-user")?.classList.add("hidden"));
        document.getElementById("btn-cancel-user-edit")?.addEventListener("click", () => document.getElementById("modal-edit-user")?.classList.add("hidden"));
        document.getElementById("btn-save-user-edit")?.addEventListener("click", async () => {
            const uid = document.getElementById("edit-user-id").value;
            if (!uid) return;
            const nome = document.getElementById("edit-user-nome").value.trim();
            const sobrenome = document.getElementById("edit-user-sobrenome").value.trim();
            const dataNascimento = document.getElementById("edit-user-nasc").value;
            const dataEntrada = document.getElementById("edit-user-entrada").value;
            const equipe = document.getElementById("edit-user-equipe").value;
            const isActive = document.getElementById("edit-user-status").value === "true";

            showGlobalSpinner("Salvando perfil...");
            try {
                await db.collection("users").doc(uid).set({
                    nome, sobrenome, dataNascimento, dataEntrada, equipe, isActive,
                    updatedAt: fb.firestore.FieldValue.serverTimestamp()
                }, { merge: true });
                if (exports.firebase.counter) exports.firebase.counter.addWrites(1);
                hideGlobalSpinner();
                document.getElementById("modal-edit-user")?.classList.add("hidden");
                showAlert("Perfil do corretor atualizado com sucesso!", "Sucesso");
                loadUsers();
            } catch (err) {
                hideGlobalSpinner();
                showAlert("Erro ao salvar perfil: " + err.message, "Erro");
            }
        });

        // ════════════════════════════════════════════════════════
        // 3. MURAL DE RECADOS
        // ════════════════════════════════════════════════════════
        const loadNotices = async () => {
            const container = document.getElementById("adm-notices-container");
            if (!container) return;
            try {
                const snap = await db.collection("avisos").orderBy("createdAt", "desc").get();
                if (exports.firebase.counter) exports.firebase.counter.addReads(snap.size || 1);
                if (snap.empty) { container.innerHTML = '<p class="text-gray-400 text-xs">Nenhum recado publicado.</p>'; return; }
                let html = "";
                snap.forEach(d => {
                    const data = d.data();
                    html += `
                        <div class="p-3 bg-white border border-gray-200 rounded-xl flex justify-between items-center gap-3">
                            <p class="text-xs text-gray-800">${data.text || ''}</p>
                            <button data-del-notice="${d.id}" class="text-red-600 hover:text-red-800 text-xs font-bold flex-shrink-0">Excluir</button>
                        </div>
                    `;
                });
                container.innerHTML = html;
            } catch (e) {}
        };

        document.getElementById("btn-adm-publish-notice")?.addEventListener("click", async () => {
            const txt = document.getElementById("adm-new-notice-text")?.value.trim();
            if (!txt) return;
            showGlobalSpinner("Publicando...");
            try {
                await db.collection("avisos").add({ text: txt, authorEmail: user.email, createdAt: fb.firestore.FieldValue.serverTimestamp() });
                if (exports.firebase.counter) exports.firebase.counter.addWrites(1);
                document.getElementById("adm-new-notice-text").value = "";
                loadNotices();
                showAlert("Recado publicado no mural com sucesso!", "Sucesso");
            } catch (e) { showAlert("Erro: " + e.message, "Erro"); } finally { hideGlobalSpinner(); }
        });

        // ════════════════════════════════════════════════════════
        // 4. MENSAGENS FALE CONOSCO
        // ════════════════════════════════════════════════════════
        const loadFeedbacks = async () => {
            const container = document.getElementById("adm-feedback-container");
            if (!container) return;
            try {
                const snap = await db.collection("feedback").orderBy("createdAt", "desc").get();
                if (exports.firebase.counter) exports.firebase.counter.addReads(snap.size || 1);
                if (snap.empty) { container.innerHTML = '<p class="text-gray-400 text-xs py-6 text-center">Nenhuma mensagem recebida.</p>'; return; }
                let html = "";
                snap.forEach(d => {
                    const data = d.data();
                    const date = data.createdAt ? new Date(data.createdAt.seconds * 1000).toLocaleString('pt-BR') : '-';
                    html += `
                        <div class="p-4 bg-white border border-gray-200 rounded-xl space-y-2">
                            <div class="flex justify-between text-xs text-gray-500">
                                <span>De: <strong class="text-gray-800">${data.userEmail || 'Anônimo'}</strong></span>
                                <span>${date}</span>
                            </div>
                            <p class="text-sm text-gray-800 bg-gray-50 p-3 rounded-lg border">${data.message || ''}</p>
                            <div class="text-right"><button data-del-feedback="${d.id}" class="text-xs text-red-600 font-bold">Excluir</button></div>
                        </div>
                    `;
                });
                container.innerHTML = html;
            } catch (e) {}
        };

        // ════════════════════════════════════════════════════════
        // 5. TERMO DO PDF
        // ════════════════════════════════════════════════════════
        const loadTermo = async () => {
            const termo = await fetchGlobalTermo();
            const textarea = document.getElementById("adm-termo-textarea");
            if (textarea) textarea.value = termo;
        };

        document.getElementById("btn-adm-save-termo-text")?.addEventListener("click", async () => {
            const newText = document.getElementById("adm-termo-textarea")?.value.trim();
            if (!newText) return;
            showGlobalSpinner("Salvando termo...");
            try {
                await db.collection("configuracoes").doc("textos").set({ termoAutorizacao: newText }, { merge: true });
                if (exports.firebase.counter) exports.firebase.counter.addWrites(1);
                showAlert("Termo atualizado com sucesso!", "Sucesso");
            } catch (e) { showAlert("Erro: " + e.message, "Erro"); } finally { hideGlobalSpinner(); }
        });

        // ════════════════════════════════════════════════════════
        // 6. ASSINATURAS (DISPOSITIVO, CÓDIGO COMPLETO, VINCULAR, EXCLUIR)
        // ════════════════════════════════════════════════════════
        let signaturesCache = [];
        let selectedSigForLink = null;

        const loadSignatures = async () => {
            const container = document.getElementById("adm-signatures-container");
            if (!container) return;
            container.innerHTML = '<p class="text-center text-gray-400 py-10 animate-pulse text-sm">Carregando assinaturas...</p>';
            try {
                const snap = await db.collection("assinaturas").orderBy("signedAt", "desc").limit(50).get();
                if (exports.firebase.counter) exports.firebase.counter.addReads(snap.size || 1);
                if (snap.empty) { container.innerHTML = '<p class="text-gray-400 text-xs py-6 text-center">Nenhuma assinatura registrada.</p>'; return; }
                signaturesCache = snap.docs.map(d => ({ id: d.id, ...d.data() }));

                // Buscar captações vinculadas para exibir código completo e endereço
                if (allCapturesCache.length === 0) {
                    allCapturesCache = await captacaoService.fetchAllCaptures();
                }

                let html = "";
                signaturesCache.forEach(sig => {
                    const date = sig.signedAt ? new Date(sig.signedAt.seconds * 1000).toLocaleString('pt-BR') : '-';
                    const userAgentFormatted = sig.deviceInfo?.userAgent ? parseUserAgent(sig.deviceInfo.userAgent) : 'Não informado';
                    
                    // Achar captação correspondente
                    const linkedCapture = allCapturesCache.find(c => c.id === sig.captureId);
                    const codigoCompleto = linkedCapture?.codigoImovel ? `Cód: ${linkedCapture.codigoImovel}` : (sig.captureId ? `ID: ${sig.captureId}` : 'Não vinculada');
                    const enderecoCompleto = linkedCapture ? `${linkedCapture.imovelEndereco || ''}, ${linkedCapture.imovelNumero || 'S/N'} - ${linkedCapture.imovelBairro || ''}` : '';

                    html += `
                        <div class="bg-white border border-gray-200 rounded-2xl p-5 flex flex-wrap gap-4 items-center justify-between shadow-2xs hover:border-purple-200 transition-all">
                            <div class="flex gap-4 items-center flex-wrap flex-1 min-w-0">
                                <!-- Prévia da assinatura -->
                                <div class="bg-gray-50 border-2 border-gray-200 rounded-xl p-2 flex-shrink-0 cursor-pointer hover:border-purple-300" data-sig-view="${sig.id}" title="Clique para ampliar">
                                    ${sig.signatureImage
                                        ? `<img src="${sig.signatureImage}" class="h-20 w-36 object-contain" data-sig-view="${sig.id}">`
                                        : `<div class="h-20 w-36 flex items-center justify-center text-xs text-gray-400" data-sig-view="${sig.id}">Sem imagem</div>`
                                    }
                                </div>
                                <div class="space-y-1 min-w-0">
                                    <h4 class="font-bold text-gray-900 text-sm truncate">${sig.ownerName || 'Proprietário'}</h4>
                                    <p class="text-xs text-gray-500">CPF: <strong>${sig.ownerCpf || 'N/A'}</strong> • Data: <strong>${date}</strong></p>
                                    <p class="text-xs text-gray-500">IP: <span class="font-mono text-gray-700">${sig.clientIp || 'N/A'}</span></p>
                                    <p class="text-xs text-gray-600">📱 <strong>Dispositivo:</strong> ${userAgentFormatted}</p>
                                    <div class="pt-1">
                                        <span class="text-xs px-2 py-0.5 bg-purple-50 text-purple-800 font-bold rounded-md border border-purple-200">
                                            Captação: ${codigoCompleto}
                                        </span>
                                        ${enderecoCompleto ? `<p class="text-[11px] text-gray-500 truncate mt-0.5">${enderecoCompleto}</p>` : ''}
                                    </div>
                                </div>
                            </div>
                            <div class="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                                <button data-sig-view="${sig.id}" class="px-3.5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl transition-colors">🔍 Ampliar</button>
                                <button data-sig-link-to-cap="${sig.id}" class="px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl transition-colors shadow-sm">Vincular a uma Captação</button>
                                <button data-sig-delete="${sig.id}" class="px-3.5 py-2 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold rounded-xl transition-colors">Excluir</button>
                            </div>
                        </div>
                    `;
                });
                container.innerHTML = html;
            } catch (e) { console.error(e); }
        };

        // Modal Vincular Assinatura
        const openLinkModal = (sigId) => {
            const sig = signaturesCache.find(s => s.id === sigId);
            if (!sig) return;
            selectedSigForLink = sig;
            document.getElementById("link-sig-owner-info").innerText = `Proprietário: ${sig.ownerName || 'Assinatura'} (ID: ${sig.id})`;
            document.getElementById("modal-link-signature")?.classList.remove("hidden");
            renderCapturesForLink();
        };

        const renderCapturesForLink = () => {
            const listEl = document.getElementById("link-sig-captures-list");
            if (!listEl) return;
            const term = document.getElementById("link-sig-search-input")?.value.toLowerCase().trim() || "";

            const filtered = allCapturesCache.filter(c => {
                if (!term) return true;
                return (c.codigoImovel || "").toLowerCase().includes(term)
                    || (c.imovelEndereco || "").toLowerCase().includes(term)
                    || (c.propNome || "").toLowerCase().includes(term)
                    || (c.id || "").toLowerCase().includes(term);
            });

            if (filtered.length === 0) {
                listEl.innerHTML = '<p class="text-center text-gray-400 py-6 text-xs">Nenhuma captação encontrada.</p>';
                return;
            }

            let html = "";
            filtered.forEach(c => {
                const isCurrentLinked = selectedSigForLink && selectedSigForLink.captureId === c.id;
                html += `
                    <div class="p-3 bg-white border border-gray-200 rounded-xl flex justify-between items-center gap-2 hover:border-purple-300">
                        <div class="truncate">
                            <div class="flex items-center gap-1.5">
                                ${c.codigoImovel ? `<span class="text-[10px] px-1.5 py-0.5 bg-blue-100 text-blue-800 font-bold rounded">Cód: ${c.codigoImovel}</span>` : ''}
                                <span class="text-xs font-bold text-gray-900 truncate">${c.propNome || 'Proprietário'}</span>
                            </div>
                            <p class="text-[11px] text-gray-500 truncate">${c.imovelEndereco || 'Sem endereço'}, ${c.imovelNumero || 'S/N'}</p>
                        </div>
                        <button onclick="CaptaFacil.views.admin.confirmLink('${c.id}')" class="px-3 py-1.5 ${isCurrentLinked ? 'bg-green-600 text-white' : 'bg-purple-600 hover:bg-purple-700 text-white'} text-xs font-bold rounded-lg flex-shrink-0">
                            ${isCurrentLinked ? '✓ Vinculada' : 'Selecionar'}
                        </button>
                    </div>
                `;
            });
            listEl.innerHTML = html;
        };

        exports.views.admin.confirmLink = async (captureId) => {
            if (!selectedSigForLink) return;
            const confirmed = await showConfirm("Deseja vincular esta assinatura a esta captação? A captação será marcada como Assinada.", "Confirmar Vínculo");
            if (!confirmed) return;

            showGlobalSpinner("Vinculando assinatura...");
            try {
                await captacaoService.linkSignatureToCapture(selectedSigForLink.id, captureId);
                hideGlobalSpinner();
                document.getElementById("modal-link-signature")?.classList.add("hidden");
                showAlert("Assinatura vinculada com sucesso à captação!", "Sucesso");
                allCapturesCache = [];
                loadSignatures();
            } catch (err) {
                hideGlobalSpinner();
                showAlert("Erro ao vincular: " + err.message, "Erro");
            }
        };

        document.getElementById("link-sig-search-input")?.addEventListener("input", renderCapturesForLink);
        document.getElementById("btn-close-link-sig-modal")?.addEventListener("click", () => document.getElementById("modal-link-signature")?.classList.add("hidden"));
        document.getElementById("btn-cancel-link-sig")?.addEventListener("click", () => document.getElementById("modal-link-signature")?.classList.add("hidden"));

        // Eventos de Assinatura
        document.addEventListener("click", async (e) => {
            // Visualizar ampliada
            const sigViewId = e.target.getAttribute("data-sig-view");
            if (sigViewId) {
                const sig = signaturesCache.find(s => s.id === sigViewId);
                if (!sig) return;
                const userAgentFormatted = sig.deviceInfo?.userAgent ? parseUserAgent(sig.deviceInfo.userAgent) : 'Não informado';
                document.getElementById("sig-modal-owner-name").innerText = sig.ownerName || 'Assinatura';
                document.getElementById("sig-modal-details").innerText = `CPF: ${sig.ownerCpf || 'N/A'} • IP: ${sig.clientIp || 'N/A'} • Disp: ${userAgentFormatted}`;
                document.getElementById("sig-modal-image").src = sig.signatureImage || '';
                document.getElementById("sig-modal-capture-info").innerText = `Captação vinculada: ${sig.captureId ? sig.captureId : 'Não identificada'}`;
                document.getElementById("modal-view-signature")?.classList.remove("hidden");
                return;
            }

            // Vincular
            const linkSigId = e.target.getAttribute("data-sig-link-to-cap");
            if (linkSigId) {
                openLinkModal(linkSigId);
                return;
            }

            // Excluir
            const delSigId = e.target.getAttribute("data-sig-delete");
            if (delSigId) {
                const confirmed = await showConfirm("Deseja realmente excluir permanentemente este registro de assinatura?", "Excluir Assinatura");
                if (!confirmed) return;
                showGlobalSpinner("Excluindo assinatura...");
                try {
                    await captacaoService.deleteSignature(delSigId);
                    hideGlobalSpinner();
                    showAlert("Assinatura excluída com sucesso.", "Sucesso");
                    loadSignatures();
                } catch (err) {
                    hideGlobalSpinner();
                    showAlert("Erro ao excluir: " + err.message, "Erro");
                }
                return;
            }
        });

        document.getElementById("btn-close-sig-modal")?.addEventListener("click", () => document.getElementById("modal-view-signature")?.classList.add("hidden"));
        document.getElementById("btn-close-sig-modal-2")?.addEventListener("click", () => document.getElementById("modal-view-signature")?.classList.add("hidden"));

        // ════════════════════════════════════════════════════════
        // 7. MONITOR DE ACESSO
        // ════════════════════════════════════════════════════════
        const loadAccessMonitor = async () => {
            const container = document.getElementById("adm-access-container");
            if (!container) return;
            try {
                const snap = await db.collection("users").get();
                if (exports.firebase.counter) exports.firebase.counter.addReads(snap.size || 1);
                let html = "";
                snap.forEach(d => {
                    const u = d.data();
                    const name = `${u.nome || ''} ${u.sobrenome || ''}`.trim() || u.email;
                    const lastSeen = u.last_seen ? new Date(u.last_seen.seconds * 1000).toLocaleString('pt-BR') : 'Nunca acessou';
                    html += `
                        <div class="p-3 bg-white border border-gray-200 rounded-xl flex justify-between items-center text-xs">
                            <span class="font-bold text-gray-800">${name} (${u.email})</span>
                            <span class="text-gray-500">Último acesso: <strong class="text-blue-600">${lastSeen}</strong></span>
                        </div>
                    `;
                });
                container.innerHTML = html || '<p class="text-gray-400 text-xs text-center py-6">Nenhum dado disponível.</p>';
            } catch (e) {}
        };

        // ════════════════════════════════════════════════════════
        // 8. AUDITORIA (10 EM 10 ITENS + BOTÃO CARREGAR MAIS)
        // ════════════════════════════════════════════════════════
        let auditCurrentLimit = 10;

        const loadAuditLogs = async () => {
            const container = document.getElementById("adm-audit-container");
            const btnMore = document.getElementById("btn-adm-audit-load-more");
            if (!container) return;
            try {
                const snap = await db.collection("audit_logs").orderBy("timestamp", "desc").limit(auditCurrentLimit).get();
                if (exports.firebase.counter) exports.firebase.counter.addReads(snap.size || 1);

                if (snap.empty) {
                    container.innerHTML = '<p class="text-gray-400 text-xs text-center py-6">Nenhum log gravado no momento.</p>';
                    if (btnMore) btnMore.classList.add("hidden");
                    return;
                }

                let html = "";
                snap.forEach(d => {
                    const log = d.data();
                    const time = log.timestamp ? new Date(log.timestamp.seconds * 1000).toLocaleString('pt-BR') : '-';
                    const action = log.action || 'ATIVIDADE';
                    
                    let actionBadgeColor = 'bg-gray-100 text-gray-800 border-gray-300';
                    if (action.includes('LOGIN')) actionBadgeColor = 'bg-green-100 text-green-800 border-green-200';
                    else if (action.includes('LOGOUT')) actionBadgeColor = 'bg-yellow-100 text-yellow-800 border-yellow-200';
                    else if (action.includes('CREATE') || action.includes('SAVE')) actionBadgeColor = 'bg-blue-100 text-blue-800 border-blue-200';
                    else if (action.includes('DELETE') || action.includes('REVOKE')) actionBadgeColor = 'bg-red-100 text-red-800 border-red-200';
                    else if (action.includes('SIGN')) actionBadgeColor = 'bg-purple-100 text-purple-800 border-purple-200';

                    let detailsStr = '';
                    if (log.details && typeof log.details === 'object') {
                        detailsStr = Object.entries(log.details).map(([k, v]) => `${k}: ${v}`).join(' | ');
                    }

                    html += `
                        <div class="p-3.5 bg-white border border-gray-200 rounded-2xl flex flex-wrap justify-between items-center gap-3 text-xs hover:border-blue-200 transition-all">
                            <div class="space-y-1">
                                <div class="flex items-center gap-2 flex-wrap">
                                    <span class="px-2 py-0.5 text-[10px] font-mono font-bold rounded border ${actionBadgeColor}">
                                        ${action}
                                    </span>
                                    <span class="font-bold text-gray-900">${log.userEmail || 'Sistema'}</span>
                                </div>
                                ${detailsStr ? `<p class="text-[11px] text-gray-500">${detailsStr}</p>` : ''}
                            </div>
                            <span class="text-gray-400 font-mono text-[11px]">${time}</span>
                        </div>
                    `;
                });
                container.innerHTML = html;

                if (btnMore) {
                    if (snap.size < auditCurrentLimit) {
                        btnMore.classList.add("hidden");
                    } else {
                        btnMore.classList.remove("hidden");
                    }
                }
            } catch (e) {
                container.innerHTML = `<p class="text-red-500 text-xs text-center py-6">Erro ao carregar auditoria: ${e.message}</p>`;
            }
        };

        document.getElementById("btn-adm-audit-load-more")?.addEventListener("click", () => {
            auditCurrentLimit += 10;
            loadAuditLogs();
        });

        // ════════════════════════════════════════════════════════
        // EVENTOS GLOBAIS DE DELEGAÇÃO DO ADMIN
        // ════════════════════════════════════════════════════════
        document.addEventListener("click", async (e) => {
            const statusButton = e.target.closest("[data-adm-status]");
            const statusId = statusButton?.getAttribute("data-adm-status");
            if (statusId) {
                await openCaptureStatusModal(statusId);
                return;
            }

            const editButton = e.target.closest("[data-adm-edit]");
            const editId = editButton?.getAttribute("data-adm-edit");
            if (editId) {
                window.location.hash = `#/form?edit=${editId}`;
                return;
            }

            const pdfButton = e.target.closest("[data-adm-pdf]");
            const pdfId = pdfButton?.getAttribute("data-adm-pdf");
            if (pdfId) {
                let capture = (capturesPageCache || []).flat().find(c => c.id === pdfId)
                    || allCapturesCache.find(c => c.id === pdfId);

                if (!capture) {
                    capture = await captacaoService.getById(pdfId).catch(() => null);
                    if (capture) allCapturesCache.push(capture);
                }

                if (capture) {
                    const openPdf = () => generatePDF(capture, pdfButton);
                    openPdf();
                }
                return;
            }

            const delButton = e.target.closest("[data-adm-del]");
            const delId = delButton?.getAttribute("data-adm-del");
            if (delId) {
                const confirmed = await showConfirm("Deseja excluir permanentemente esta captação?", "Excluir Captação");
                if (confirmed) {
                    showGlobalSpinner("Excluindo...");
                    await captacaoService.deleteCapture(delId);
                    allCapturesCache = allCapturesCache.filter(c => c.id !== delId);
                    hideGlobalSpinner();
                    renderCapturesCards();
                }
                return;
            }

            const delNoticeId = e.target.getAttribute("data-del-notice");
            if (delNoticeId) { await db.collection("avisos").doc(delNoticeId).delete(); loadNotices(); return; }

            const delFeedbackId = e.target.getAttribute("data-del-feedback");
            if (delFeedbackId) { await db.collection("feedback").doc(delFeedbackId).delete(); loadFeedbacks(); return; }
        });
    }

    exports.views.admin = {
        render: renderAdminView,
        mount: mountAdminView
    };
})(window.CaptaFacil);
