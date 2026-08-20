// ==========================================================================
// View: Histórico Completo de Captações (Minhas Captações)
// ==========================================================================

window.CaptaFacil = window.CaptaFacil || {};
window.CaptaFacil.views = window.CaptaFacil.views || {};

(function(exports) {
    const { db } = exports.firebase;
    const { authService, captacaoService } = exports;
    const { generatePDF, parseUserAgent } = exports.pdfService;
    const { alert: showAlert, confirm: showConfirm } = exports.modal;
    const { show: showGlobalSpinner, hide: hideGlobalSpinner } = exports.loading;

    function renderHistoryView() {
        return `
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 pb-28">
                
                <!-- Cabeçalho da Página com Botão Voltar ao Início -->
                <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-wrap justify-between items-center gap-4">
                    <div class="space-y-1">
                        <div class="flex items-center gap-3">
                            <a href="#/home" class="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition-colors">
                                &larr; Voltar ao Painel
                            </a>
                            <h1 class="text-2xl font-black text-gray-800 tracking-tight">Minhas Captações</h1>
                        </div>
                        <p class="text-xs text-gray-500">Visualize, edite, gere documentos PDF e gerencie as assinaturas dos seus imóveis.</p>
                    </div>
                    <div class="flex items-center gap-3">
                        <button id="btn-refresh-history" class="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors">
                            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                            <span>Atualizar</span>
                        </button>
                        <a href="#/form" class="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold shadow-md transition-all">
                            + Nova Captação
                        </a>
                    </div>
                </div>

                <!-- Barra de Filtros e Busca -->
                <div class="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                    <div class="grid grid-cols-1 md:grid-cols-4 gap-3 text-sm">
                        <div class="md:col-span-2">
                            <label class="block text-xs font-bold text-gray-600 mb-1">Buscar por Código, Endereço, Proprietário, CPF ou ID:</label>
                            <div class="relative">
                                <input type="text" id="hist-search-input" placeholder="Ex: AP0123, Rua das Flores, João..." class="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-orange-500">
                                <svg class="h-4 w-4 text-gray-400 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                            </div>
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-gray-600 mb-1">Status da Assinatura:</label>
                            <select id="hist-filter-signature" class="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm bg-white focus:ring-2 focus:ring-orange-500">
                                <option value="all">Todas as captações</option>
                                <option value="signed">Apenas Assinadas</option>
                                <option value="pending">Apenas Pendentes</option>
                                <option value="not_signed">Não Assinadas</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-gray-600 mb-1">Ordenar por:</label>
                            <select id="hist-sort-by" class="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm bg-white focus:ring-2 focus:ring-orange-500">
                                <option value="createdAt_desc">Mais Recentes</option>
                                <option value="createdAt_asc">Mais Antigas</option>
                                <option value="propNome_asc">Proprietário (A-Z)</option>
                                <option value="imovelEndereco_asc">Endereço (A-Z)</option>
                            </select>
                        </div>
                    </div>
                </div>

                <!-- Container dos Cards do Histórico -->
                <div id="history-items-container" class="space-y-4 min-h-[300px]">
                    <p class="text-center text-gray-400 py-12 text-sm animate-pulse">Carregando lista de captações...</p>
                </div>

                <div id="history-pagination" class="flex items-center justify-between gap-3 pt-2">
                    <button id="btn-history-prev" type="button" class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl disabled:opacity-40 disabled:cursor-not-allowed">← Anterior</button>
                    <span id="history-page-indicator" class="text-xs font-bold text-gray-500">Página 1</span>
                    <button id="btn-history-next" type="button" class="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl disabled:opacity-40 disabled:cursor-not-allowed">Próxima →</button>
                </div>
            </div>

            <!-- Modal: Detalhes do Status da Assinatura -->
            <div id="modal-signature-status" class="hidden fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
                <div class="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden">
                    <div class="flex justify-between items-center p-5 border-b border-gray-100 bg-gray-50">
                        <div class="flex items-center gap-2">
                            <span class="text-xl">✍️</span>
                            <div>
                                <h3 class="font-bold text-gray-900 text-base">Status da Assinatura Eletrônica</h3>
                                <p class="text-xs text-gray-500" id="sig-status-subhead">Detalhes da assinatura e validade jurídica</p>
                            </div>
                        </div>
                        <button id="btn-close-sig-status-modal" class="text-gray-400 hover:text-gray-600 text-2xl font-bold">&times;</button>
                    </div>
                    <div id="sig-status-content" class="p-6 space-y-4 text-sm text-gray-700 min-h-[160px]">
                        <p class="text-center text-gray-400 py-6">Carregando dados da assinatura...</p>
                    </div>
                    <div class="p-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-2" id="sig-status-footer">
                        <button id="btn-close-sig-status-modal-2" class="px-5 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs font-bold rounded-xl transition-colors">
                            Fechar
                        </button>
                    </div>
                </div>
            </div>

            <!-- Modal de Link de Assinatura -->
            <div id="modal-signature-link" class="hidden fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
                <div class="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 text-center space-y-4">
                    <div class="mx-auto flex items-center justify-center h-14 w-14 rounded-full bg-purple-100 mb-2">
                        <svg class="h-7 w-7 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                    </div>
                    <div>
                        <h3 class="text-lg font-black text-gray-900">Link de Assinatura Gerado!</h3>
                        <p class="text-xs text-gray-500 mt-1">Envie o link abaixo para o proprietário assinar pelo celular ou computador. Validade de 48 horas.</p>
                    </div>
                    <div id="modal-signature-url" class="p-3 bg-gray-100 rounded-xl text-xs font-mono break-all text-gray-800 select-all border border-gray-200 text-left"></div>
                    <div class="flex gap-3 pt-2">
                        <button id="btn-modal-copy-link" class="flex-1 py-3 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-md transition-all">
                            Copiar Link
                        </button>
                        <button id="btn-modal-close-link" class="px-5 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl transition-all">
                            Fechar
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    function mountHistoryView() {
        const user = authService.getCurrentUser();
        let allCaptures = [];
        let userCapturePageCache = [];
        let userCapturePageCursors = [];
        let userCaptureCurrentPage = 1;
        let userCapturesHasMore = true;
        let generatedSigUrl = "";

        // Verificar parâmetro de busca na URL
        const hash = window.location.hash || "";
        let initialSearch = "";
        if (hash.includes("search=")) {
            try {
                initialSearch = decodeURIComponent(hash.split("search=")[1].split("&")[0]);
            } catch (e) {}
        }
        if (initialSearch) {
            const searchInput = document.getElementById("hist-search-input");
            if (searchInput) searchInput.value = initialSearch;
        }

        const getLoadedCaptures = () => userCapturePageCache.flat();

        const loadNextUserCapturePage = async () => {
            if (!user) return [];
            const startAfterDoc = userCapturePageCursors[userCapturePageCursors.length - 1] || null;
            const result = await captacaoService.fetchUserCapturesPage(user.uid, {
                limitCount: 10,
                startAfterDoc
            });

            if (!result.items.length) {
                userCapturesHasMore = false;
                return [];
            }

            userCapturePageCache.push(result.items);
            userCapturePageCursors.push(result.lastDoc);
            userCapturesHasMore = result.hasMore;
            return result.items;
        };

        const loadCaptures = async () => {
            const container = document.getElementById("history-items-container");
            if (!container) return;
            if (!user) return;

            if (!userCapturePageCache.length) {
                container.innerHTML = '<p class="text-center text-gray-400 py-12 text-sm animate-pulse">Carregando lista de captações...</p>';
                await loadNextUserCapturePage();
            }

            allCaptures = getLoadedCaptures();
            renderHistoryList();
        };

        const createCaptureCardHtml = (data) => {
            const date = data.createdAt ? new Date(data.createdAt.seconds * 1000).toLocaleDateString('pt-BR') : '-';
            const tipologia = (data.imovelTipologia && data.imovelTipologia.length > 0) ? data.imovelTipologia.join(' / ') : 'Imóvel';
            const isSigned = data.signatureId && data.signatureStatus === 'signed';
            const isPending = data.signatureStatus === 'pending';
            const hasVenda = !!(data.valorVenda && data.valorVenda !== 'R$ 0,00');
            const hasLocacaoResidencial = !!(data.valorLocacao && data.valorLocacao !== 'R$ 0,00');
            const hasLocacaoComercial = !!(data.valorAluguelComercial && data.valorAluguelComercial !== 'R$ 0,00');

            let badgeHtml = '';
            if (isSigned) {
                badgeHtml = `
                    <button data-action="status-sig" data-id="${data.id}" class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-100 hover:bg-green-200 text-green-800 transition-colors shadow-2xs cursor-pointer" title="Clique para ver a assinatura">
                        <svg class="h-3.5 w-3.5 text-green-700" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
                        <span>Assinado</span>
                    </button>
                `;
            } else if (isPending) {
                badgeHtml = `
                    <button data-action="status-sig" data-id="${data.id}" class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-yellow-100 hover:bg-yellow-200 text-yellow-800 transition-colors shadow-2xs cursor-pointer" title="Clique para ver o status do link">
                        <svg class="h-3.5 w-3.5 text-yellow-700" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.415L11 9.586V6z" clip-rule="evenodd"/></svg>
                        <span>Pendente</span>
                    </button>
                `;
            } else {
                badgeHtml = `
                    <button data-action="status-sig" data-id="${data.id}" class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors shadow-2xs cursor-pointer" title="Clique para gerar assinatura">
                        <span>Não Assinado</span>
                    </button>
                `;
            }

            const tipoCaptacao = (data.tipoCaptacao === 'Ambos' || data.tipoCaptacao === 'Venda e Aluguel') ? 'Venda e Aluguel' : (data.tipoCaptacao || 'Captação');

            return `
                <div class="bg-white p-6 rounded-2xl border border-gray-200 hover:border-orange-300 shadow-sm transition-all space-y-4">
                    
                    <!-- Linha Superior: Tipo de Captação, Data e Badge de Assinatura -->
                    <div class="flex flex-wrap justify-between items-center gap-3">
                        <div class="flex items-center gap-2 flex-wrap">
                            <span class="inline-block px-3 py-1 bg-orange-100 text-orange-800 text-xs font-bold rounded-lg">
                                ${tipoCaptacao}
                            </span>
                            ${data.codigoImovel ? `<span class="inline-block px-2.5 py-1 bg-blue-50 text-blue-800 font-mono font-bold text-xs rounded-lg border border-blue-200">Cód: ${data.codigoImovel}</span>` : ''}
                            <span class="text-xs text-gray-400 font-medium">Cadastrado em: ${date}</span>
                        </div>
                        <div>${badgeHtml}</div>
                    </div>

                    <!-- Título do Imóvel e Endereço -->
                    <div class="space-y-1">
                        <h3 class="text-lg font-black text-gray-900 leading-tight">
                            ${tipologia}
                        </h3>
                        <p class="text-xs text-gray-600 leading-relaxed">
                            <strong class="text-gray-800">${data.imovelEndereco || 'Endereço não informado'}</strong>, ${data.imovelNumero || 'S/N'}
                            ${data.imovelComplemento ? ` (${data.imovelComplemento})` : ''}
                            ${data.imovelBairro ? ` - ${data.imovelBairro}` : ''}
                            ${data.imovelCidade ? ` • ${data.imovelCidade}/${data.imovelEstado || 'SC'}` : ''}
                        </p>
                    </div>

                    <!-- Grid de Informações Detalhadas -->
                    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 bg-gray-50 rounded-xl border border-gray-100 text-xs text-gray-600">
                        <div>
                            <span class="text-gray-400 block text-[10px] uppercase font-bold">Proprietário</span>
                            <span class="font-bold text-gray-800 block truncate">${data.propNome || 'Não informado'}</span>
                            <span class="text-gray-500">${data.propTelefone || ''}</span>
                        </div>
                        <div>
                            <span class="text-gray-400 block text-[10px] uppercase font-bold">Valores</span>
                            ${hasVenda ? `<span class="font-bold text-orange-700 block">Venda: ${data.valorVenda}</span>` : ''}
                            ${hasLocacaoResidencial ? `<span class="font-bold text-blue-700 block">Aluguel Residencial: ${data.valorLocacao}</span>` : ''}
                            ${hasLocacaoComercial ? `<span class="font-bold text-indigo-700 block">Aluguel Comercial: ${data.valorAluguelComercial}</span>` : ''}
                            ${!hasVenda && !hasLocacaoResidencial && !hasLocacaoComercial ? '<span class="text-gray-400">Não informado</span>' : ''}
                        </div>
                        <div>
                            <span class="text-gray-400 block text-[10px] uppercase font-bold">Identificação</span>
                            <span class="font-mono text-gray-700 block cursor-pointer hover:underline" title="Clique para copiar ID" onclick="navigator.clipboard.writeText('${data.id}');">ID: ${data.id.substring(0, 8).toUpperCase()}</span>
                            <span class="text-gray-400 text-[10px]">${data.imovelFinalidade || 'Residencial'}</span>
                        </div>
                    </div>

                    <!-- Barra de Ações com Botões Grandes -->
                    <div class="flex flex-wrap sm:flex-nowrap gap-2 pt-2 border-t border-gray-100">
                        <button data-action="edit" data-id="${data.id}" data-signed="${isSigned}" class="flex-1 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors">
                            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                            <span>Editar</span>
                        </button>
                        <button data-action="pdf" data-id="${data.id}" class="flex-1 py-2.5 bg-orange-50 hover:bg-orange-100 text-orange-700 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors">
                            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
                            <span>Gerar PDF</span>
                        </button>
                        <button data-action="signature" data-id="${data.id}" data-signed="${isSigned}" class="flex-1 py-2.5 bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors">
                            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L14.732 3.732z"/></svg>
                            <span>${isSigned ? 'Reassinar' : 'Coletar Assinatura'}</span>
                        </button>
                    </div>
                </div>
            `;
        };

        const renderHistoryList = () => {
            const container = document.getElementById("history-items-container");
            const pageIndicator = document.getElementById("history-page-indicator");
            const prevBtn = document.getElementById("btn-history-prev");
            const nextBtn = document.getElementById("btn-history-next");
            if (!container) return;

            const loadedCaptures = getLoadedCaptures();
            const term = document.getElementById("hist-search-input")?.value.toLowerCase().trim() || "";
            const sigFilter = document.getElementById("hist-filter-signature")?.value || "all";
            const sortBy = document.getElementById("hist-sort-by")?.value || "createdAt_desc";

            const pageItems = userCapturePageCache[userCaptureCurrentPage - 1] || [];
            let filtered = pageItems.filter(c => {
                if (term) {
                    const matchEnd = (c.imovelEndereco || "").toLowerCase().includes(term);
                    const matchBairro = (c.imovelBairro || "").toLowerCase().includes(term);
                    const matchNome = (c.propNome || "").toLowerCase().includes(term);
                    const matchCpf = (c.propCpf || "").replace(/\D/g, '').includes(term.replace(/\D/g, ''));
                    const matchCodigo = (c.codigoImovel || "").toLowerCase().includes(term);
                    const matchId = (c.id || "").toLowerCase().includes(term);
                    if (!matchEnd && !matchBairro && !matchNome && !matchCpf && !matchCodigo && !matchId) return false;
                }
                if (sigFilter === "signed" && (!c.signatureId || c.signatureStatus !== "signed")) return false;
                if (sigFilter === "pending" && c.signatureStatus !== "pending") return false;
                if (sigFilter === "not_signed" && (c.signatureStatus === "signed" || c.signatureStatus === "pending")) return false;
                return true;
            });

            filtered.sort((a, b) => {
                if (sortBy === "createdAt_desc") return (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0);
                if (sortBy === "createdAt_asc") return (a.createdAt?.seconds || 0) - (b.createdAt?.seconds || 0);
                if (sortBy === "propNome_asc") return (a.propNome || "").localeCompare(b.propNome || "");
                if (sortBy === "imovelEndereco_asc") return (a.imovelEndereco || "").localeCompare(b.imovelEndereco || "");
                return 0;
            });

            if (pageIndicator) pageIndicator.innerText = `Página ${userCaptureCurrentPage} • ${loadedCaptures.length} carregadas`;
            if (prevBtn) prevBtn.disabled = userCaptureCurrentPage === 1;
            if (nextBtn) nextBtn.disabled = !userCapturesHasMore && userCaptureCurrentPage >= userCapturePageCache.length;

            if (filtered.length === 0) {
                container.innerHTML = `
                    <div class="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-300">
                        <p class="text-gray-500 font-bold">Nenhuma captação encontrada com os filtros selecionados.</p>
                        <p class="text-xs text-gray-400 mt-1">Tente ajustar a busca ou limpe os filtros.</p>
                    </div>
                `;
                return;
            }

            container.innerHTML = filtered.map(c => createCaptureCardHtml(c)).join("");
        };

        // Modal de Status da Assinatura
        const showSignatureDetailsModal = async (captureId) => {
            const modal = document.getElementById("modal-signature-status");
            const content = document.getElementById("sig-status-content");
            if (!modal || !content) return;

            modal.classList.remove("hidden");
            content.innerHTML = '<p class="text-center text-gray-400 py-10 animate-pulse text-sm">Carregando dados da assinatura...</p>';

            try {
                const capture = allCaptures.find(c => c.id === captureId) || await captacaoService.getById(captureId);
                if (!capture) {
                    content.innerHTML = '<p class="text-red-500 text-center py-4">Captação não encontrada.</p>';
                    return;
                }

                if (capture.signatureStatus === 'signed' && capture.signatureId) {
                    const sig = await captacaoService.getSignature(capture.signatureId);
                    if (!sig) {
                        content.innerHTML = `<p class="text-red-500 text-center py-4">Assinatura vinculada (ID: ${capture.signatureId}) não encontrada no registro.</p>`;
                        return;
                    }

                    const signedDate = sig.signedAt ? new Date(sig.signedAt.seconds * 1000).toLocaleString('pt-BR') : 'Data não registrada';
                    const userAgentFormatted = sig.deviceInfo?.userAgent ? parseUserAgent(sig.deviceInfo.userAgent) : 'Não informado';

                    content.innerHTML = `
                        <div class="space-y-3">
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs bg-gray-50 p-3.5 rounded-xl border border-gray-200">
                                <div><strong class="text-gray-700">Assinado por:</strong> <span class="text-gray-900 font-bold block">${sig.ownerName || capture.propNome || '-'}</span></div>
                                <div><strong class="text-gray-700">CPF:</strong> <span class="text-gray-900 block">${sig.ownerCpf || capture.propCpf || 'N/A'}</span></div>
                                <div><strong class="text-gray-700">Data e Hora:</strong> <span class="text-gray-900 block">${signedDate}</span></div>
                                <div><strong class="text-gray-700">Endereço IP:</strong> <span class="text-gray-900 font-mono block">${sig.clientIp || 'Não registrado'}</span></div>
                                <div class="sm:col-span-2 pt-1 border-t border-gray-200"><strong class="text-gray-700">Dispositivo:</strong> <span class="text-gray-800">${userAgentFormatted}</span></div>
                            </div>

                            <div class="pt-2">
                                <label class="text-xs font-bold text-gray-700 block mb-1">Traçado da Assinatura:</label>
                                <div class="bg-gray-100 border border-gray-200 rounded-xl p-3 flex justify-center items-center min-h-[100px]">
                                    ${sig.signatureImage 
                                        ? `<img src="${sig.signatureImage}" alt="Assinatura" class="max-h-28 object-contain">`
                                        : `<span class="text-xs text-gray-400">Imagem da assinatura não disponível.</span>`
                                    }
                                </div>
                            </div>
                        </div>
                    `;
                } else if (capture.signatureStatus === 'pending') {
                    const expiryDate = capture.signatureTokenExpires ? new Date(capture.signatureTokenExpires.seconds * 1000).toLocaleString('pt-BR') : '48 horas';
                    content.innerHTML = `
                        <div class="text-center py-4 space-y-3">
                            <div class="h-12 w-12 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center mx-auto text-xl">⏳</div>
                            <h4 class="font-bold text-gray-800">Aguardando Assinatura do Proprietário</h4>
                            <p class="text-xs text-gray-500">Um link foi gerado e está ativo para preenchimento.</p>
                            <p class="text-xs text-gray-500 bg-yellow-50 p-2.5 rounded-xl border border-yellow-200"><strong>Validade:</strong> ${expiryDate}</p>
                            <button onclick="CaptaFacil.views.history.generateLink('${capture.id}')" class="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl transition-all shadow-sm">
                                Ver / Copiar Link Novamente
                            </button>
                        </div>
                    `;
                } else {
                    content.innerHTML = `
                        <div class="text-center py-6 space-y-3">
                            <div class="h-12 w-12 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center mx-auto text-xl">📝</div>
                            <h4 class="font-bold text-gray-800">Captação Sem Assinatura Registrada</h4>
                            <p class="text-xs text-gray-500">Você pode gerar um link para o proprietário assinar online agora mesmo.</p>
                            <button onclick="CaptaFacil.views.history.generateLink('${capture.id}')" class="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl transition-all shadow-sm">
                                Gerar Link de Assinatura
                            </button>
                        </div>
                    `;
                }
            } catch (err) {
                content.innerHTML = `<p class="text-red-500 text-center py-4">Erro ao buscar dados: ${err.message}</p>`;
            }
        };

        const handleSignatureAction = async (captureId, isSigned) => {
            if (isSigned) {
                const confirmed = await showConfirm(
                    "Esta captação já possui uma assinatura válida registrada. Gerar um novo link irá invalidar a assinatura atual. Deseja continuar?",
                    "Reassinar Captação"
                );
                if (!confirmed) return;
                showGlobalSpinner("Revogando e gerando novo link...");
                try {
                    await captacaoService.revokeSignature(captureId);
                    const { signatureUrl } = await captacaoService.generateSignatureLink(captureId);
                    hideGlobalSpinner();
                    generatedSigUrl = signatureUrl;
                    document.getElementById("modal-signature-url").innerText = signatureUrl;
                    document.getElementById("modal-signature-link")?.classList.remove("hidden");
                    loadCaptures();
                } catch (e) {
                    hideGlobalSpinner();
                    showAlert("Erro ao gerar link: " + e.message, "Erro");
                }
            } else {
                showGlobalSpinner("Gerando link de assinatura...");
                try {
                    const { signatureUrl } = await captacaoService.generateSignatureLink(captureId);
                    hideGlobalSpinner();
                    generatedSigUrl = signatureUrl;
                    document.getElementById("modal-signature-url").innerText = signatureUrl;
                    document.getElementById("modal-signature-link")?.classList.remove("hidden");
                    loadCaptures();
                } catch (e) {
                    hideGlobalSpinner();
                    showAlert("Erro ao gerar link: " + e.message, "Erro");
                }
            }
        };

        // Expor helper para cliques nos modais
        exports.views.history.generateLink = (id) => {
            document.getElementById("modal-signature-status")?.classList.add("hidden");
            handleSignatureAction(id, false);
        };

        // Eventos de Delegação
        document.addEventListener("click", async (e) => {
            const btn = e.target.closest("[data-action]");
            if (!btn) return;
            const action = btn.getAttribute("data-action");
            const id = btn.getAttribute("data-id");
            const isSigned = btn.getAttribute("data-signed") === "true";

            if (action === "status-sig") {
                showSignatureDetailsModal(id);
                return;
            }

            if (action === "edit") {
                if (isSigned) {
                    const confirmed = await showConfirm(
                        "Esta captação já foi assinada. Se você editá-la e salvar, a assinatura atual precisará ser refeita. Deseja continuar?",
                        "Editar Captação Assinada"
                    );
                    if (!confirmed) return;
                }
                window.location.hash = `#/form?edit=${id}`;
                return;
            }

            if (action === "pdf") {
                const capture = allCaptures.find(c => c.id === id);
                if (capture) {
                    await generatePDF(capture, btn);
                }
                return;
            }

            if (action === "signature") {
                handleSignatureAction(id, isSigned);
                return;
            }
        });

        // Eventos de Filtro e Busca
        document.getElementById("hist-search-input")?.addEventListener("input", renderHistoryList);
        document.getElementById("hist-filter-signature")?.addEventListener("change", renderHistoryList);
        document.getElementById("hist-sort-by")?.addEventListener("change", renderHistoryList);
        document.getElementById("btn-history-prev")?.addEventListener("click", () => {
            if (userCaptureCurrentPage > 1) {
                userCaptureCurrentPage -= 1;
                renderHistoryList();
            }
        });
        document.getElementById("btn-history-next")?.addEventListener("click", async () => {
            if (userCaptureCurrentPage < userCapturePageCache.length) {
                userCaptureCurrentPage += 1;
                renderHistoryList();
                return;
            }
            if (!userCapturesHasMore || !user) return;
            await loadNextUserCapturePage();
            if (userCapturePageCache.length > 0) {
                userCaptureCurrentPage = userCapturePageCache.length;
                renderHistoryList();
            }
        });
        document.getElementById("btn-refresh-history")?.addEventListener("click", async () => {
            userCapturePageCache = [];
            userCapturePageCursors = [];
            userCaptureCurrentPage = 1;
            userCapturesHasMore = true;
            allCaptures = [];
            await loadCaptures();
        });

        // Eventos de Modais
        document.getElementById("btn-close-sig-status-modal")?.addEventListener("click", () => document.getElementById("modal-signature-status")?.classList.add("hidden"));
        document.getElementById("btn-close-sig-status-modal-2")?.addEventListener("click", () => document.getElementById("modal-signature-status")?.classList.add("hidden"));

        document.getElementById("btn-modal-close-link")?.addEventListener("click", () => document.getElementById("modal-signature-link")?.classList.add("hidden"));
        document.getElementById("btn-modal-copy-link")?.addEventListener("click", async () => {
            if (generatedSigUrl) {
                await navigator.clipboard.writeText(generatedSigUrl).catch(() => {});
                showAlert("Link copiado com sucesso para a área de transferência!", "Copiado");
            }
        });

        loadCaptures();
    }

    exports.views.history = {
        render: renderHistoryView,
        mount: mountHistoryView
    };
})(window.CaptaFacil);
