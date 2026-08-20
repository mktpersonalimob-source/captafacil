// ==========================================================================
// View: Formulário Passo a Passo de Captação (Multi-Step Form)
// ==========================================================================

window.CaptaFacil = window.CaptaFacil || {};
window.CaptaFacil.views = window.CaptaFacil.views || {};

(function(exports) {
    const { authService, captacaoService } = exports;
    const { alert: showAlert } = exports.modal;
    const { show: showGlobalSpinner, hide: hideGlobalSpinner } = exports.loading;

    function renderFormView() {
        return `
            <div class="max-w-4xl mx-auto px-4 sm:px-6 py-6 pb-28">
                <div class="bg-white rounded-2xl shadow-xl border border-orange-100 p-6 sm:p-8">
                    
                    <div class="flex flex-wrap justify-between items-center border-b pb-4 mb-6 gap-3">
                        <div>
                            <h2 id="form-title" class="text-2xl font-black text-gray-800 tracking-tight">Ficha de Captação</h2>
                            <p id="form-subtitle" class="text-xs text-gray-500">Preencha os dados do imóvel e proprietário.</p>
                        </div>
                        <a href="#/home" class="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors">
                            &larr; Voltar ao Painel
                        </a>
                    </div>

                    <div class="mb-8">
                        <div class="flex justify-between items-center relative">
                            <div class="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 z-0"></div>
                            <div id="step-progress-bar" class="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-orange-600 z-0 transition-all duration-300" style="width: 0%;"></div>

                            <div class="step-indicator z-10 flex flex-col items-center cursor-pointer" data-step="1">
                                <span class="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs bg-orange-600 text-white shadow-md">1</span>
                                <span class="text-[11px] font-semibold text-orange-600 mt-1">Proprietário</span>
                            </div>
                            <div class="step-indicator z-10 flex flex-col items-center cursor-pointer" data-step="2">
                                <span class="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs bg-gray-200 text-gray-600">2</span>
                                <span class="text-[11px] font-semibold text-gray-400 mt-1">Imóvel</span>
                            </div>
                            <div class="step-indicator z-10 flex flex-col items-center cursor-pointer" data-step="3">
                                <span class="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs bg-gray-200 text-gray-600">3</span>
                                <span class="text-[11px] font-semibold text-gray-400 mt-1">Detalhes</span>
                            </div>
                            <div class="step-indicator z-10 flex flex-col items-center cursor-pointer" data-step="4">
                                <span class="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs bg-gray-200 text-gray-600">4</span>
                                <span class="text-[11px] font-semibold text-gray-400 mt-1">Valores</span>
                            </div>
                            <div class="step-indicator z-10 flex flex-col items-center cursor-pointer" data-step="5">
                                <span class="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs bg-gray-200 text-gray-600">5</span>
                                <span class="text-[11px] font-semibold text-gray-400 mt-1">Finalizar</span>
                            </div>
                        </div>
                    </div>

                    <form id="captacao-form" class="space-y-6" onsubmit="return false;" novalidate>
                        
                        <!-- ETAPA 1: CONTROLE & PROPRIETÁRIO -->
                        <div id="step-content-1" class="step-content active space-y-4">
                            <h3 class="text-base font-bold text-gray-900 border-b pb-2">Informações Iniciais e Proprietário</h3>
                            
                            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div>
                                    <label class="block text-xs font-bold text-gray-700 mb-1">Corretor Responsável</label>
                                    <input type="text" id="f-corretor-nome" readonly class="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-sm font-semibold text-gray-700">
                                </div>
                                <div>
                                    <label class="block text-xs font-bold text-gray-700 mb-1">Código do Imóvel <span class="text-red-500">*</span></label>
                                    <input type="text" id="f-codigo-imovel" required placeholder="Ex: AP0123" class="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm uppercase focus:ring-2 focus:ring-orange-500 outline-none transition-all">
                                </div>
                                <div class="flex items-center gap-4 pt-6">
                                    <label class="flex items-center gap-1.5 text-xs font-bold text-gray-700 cursor-pointer">
                                        <input type="checkbox" id="f-tem-foto" class="rounded text-orange-600 focus:ring-orange-500 h-4 w-4"> Tem Fotos
                                    </label>
                                    <label class="flex items-center gap-1.5 text-xs font-bold text-gray-700 cursor-pointer">
                                        <input type="checkbox" id="f-tem-placa" class="rounded text-orange-600 focus:ring-orange-500 h-4 w-4"> Tem Placa
                                    </label>
                                </div>
                            </div>

                            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                                <div class="sm:col-span-2">
                                    <label class="block text-xs font-bold text-gray-700 mb-1">Nome Completo / Razão Social <span class="text-red-500">*</span></label>
                                    <input type="text" id="f-prop-nome" required placeholder="Nome do proprietário" class="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 outline-none transition-all">
                                </div>
                                <div>
                                    <label class="block text-xs font-bold text-gray-700 mb-1">CPF / CNPJ</label>
                                    <input type="text" id="f-prop-cpf" placeholder="000.000.000-00" class="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 outline-none transition-all">
                                </div>
                            </div>

                            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div>
                                    <label class="block text-xs font-bold text-gray-700 mb-1">RG / Insc. Estadual</label>
                                    <input type="text" id="f-prop-rg" placeholder="Número do RG" class="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 outline-none transition-all">
                                </div>
                                <div>
                                    <label class="block text-xs font-bold text-gray-700 mb-1">Estado Civil</label>
                                    <select id="f-prop-estado-civil" class="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm bg-white focus:ring-2 focus:ring-orange-500 outline-none transition-all">
                                        <option value="">Selecione...</option>
                                        <option value="Solteiro(a)">Solteiro(a)</option>
                                        <option value="Casado(a)">Casado(a)</option>
                                        <option value="Divorciado(a)">Divorciado(a)</option>
                                        <option value="Viúvo(a)">Viúvo(a)</option>
                                        <option value="União Estável">União Estável</option>
                                    </select>
                                </div>
                                <div>
                                    <label class="block text-xs font-bold text-gray-700 mb-1">Profissão</label>
                                    <input type="text" id="f-prop-profissao" placeholder="Profissão" class="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 outline-none transition-all">
                                </div>
                            </div>

                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-xs font-bold text-gray-700 mb-1">Telefone Principal <span class="text-red-500">*</span></label>
                                    <div class="flex gap-2 items-center">
                                        <input type="tel" id="f-prop-telefone" required placeholder="(00) 00000-0000" class="flex-1 px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 outline-none transition-all">
                                        <label class="flex items-center gap-1.5 text-xs font-bold text-gray-700 cursor-pointer whitespace-nowrap px-3 py-2 bg-green-50 border border-green-200 rounded-xl hover:bg-green-100 transition-colors" title="Marque se este telefone tem WhatsApp">
                                            <input type="checkbox" id="f-prop-whatsapp" class="rounded text-green-600 focus:ring-green-500 h-3.5 w-3.5">
                                            <svg viewBox="0 0 24 24" class="h-4 w-4 fill-green-500 flex-shrink-0"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.553 4.116 1.523 5.849L.057 23.5l5.807-1.524A11.954 11.954 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.8 9.8 0 01-5.002-1.369l-.358-.213-3.724.977.994-3.628-.234-.372A9.817 9.817 0 012.182 12C2.182 6.575 6.575 2.182 12 2.182S21.818 6.575 21.818 12 17.425 21.818 12 21.818z"/></svg>
                                            WhatsApp
                                        </label>
                                    </div>
                                    <p class="text-[10px] text-gray-400 mt-1">Marque a caixinha verde se este número tem WhatsApp</p>
                                </div>
                                <div>
                                    <label class="block text-xs font-bold text-gray-700 mb-1">E-mail do Proprietário</label>
                                    <input type="email" id="f-prop-email" placeholder="proprietario@email.com" class="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 outline-none transition-all">
                                </div>
                            </div>
                        </div>

                        <!-- ETAPA 2: DADOS DO IMÓVEL & LOCALIZAÇÃO -->
                        <div id="step-content-2" class="step-content space-y-4">
                            <h3 class="text-base font-bold text-gray-900 border-b pb-2">Dados do Imóvel e Localização</h3>

                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-xs font-bold text-gray-700 mb-1">Tipo de Negócio <span class="text-red-500">*</span></label>
                                    <select id="f-tipo-captacao" required class="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm bg-white font-bold text-orange-600 focus:ring-2 focus:ring-orange-500 outline-none transition-all">
                                        <option value="Venda">Venda</option>
                                        <option value="Aluguel">Aluguel (Locação)</option>
                                        <option value="Ambos">Venda e Aluguel</option>
                                    </select>
                                </div>
                                <div>
                                    <label class="block text-xs font-bold text-gray-700 mb-1">Finalidade do Imóvel</label>
                                    <select id="f-imovel-finalidade" class="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm bg-white focus:ring-2 focus:ring-orange-500 outline-none transition-all">
                                        <option value="Residencial">Residencial</option>
                                        <option value="Comercial">Comercial</option>
                                        <option value="Residencial e Comercial">Residencial e Comercial</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label class="block text-xs font-bold text-gray-700 mb-1">Tipologia do Imóvel <span class="text-red-500">*</span></label>
                                <div id="f-tipologia-group" class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-semibold text-gray-700 p-3 bg-gray-50 rounded-xl border border-gray-200">
                                    <label class="flex items-center gap-1.5 cursor-pointer"><input type="checkbox" name="tipologia" value="Apartamento" class="rounded text-orange-600"> Apartamento</label>
                                    <label class="flex items-center gap-1.5 cursor-pointer"><input type="checkbox" name="tipologia" value="Casa" class="rounded text-orange-600"> Casa</label>
                                    <label class="flex items-center gap-1.5 cursor-pointer"><input type="checkbox" name="tipologia" value="Terreno" class="rounded text-orange-600"> Terreno</label>
                                    <label class="flex items-center gap-1.5 cursor-pointer"><input type="checkbox" name="tipologia" value="Sala Comercial" class="rounded text-orange-600"> Sala Comercial</label>
                                    <label class="flex items-center gap-1.5 cursor-pointer"><input type="checkbox" name="tipologia" value="Galpão" class="rounded text-orange-600"> Galpão</label>
                                    <label class="flex items-center gap-1.5 cursor-pointer"><input type="checkbox" name="tipologia" value="Sítio/Chácara" class="rounded text-orange-600"> Sítio/Chácara</label>
                                    <label class="flex items-center gap-1.5 cursor-pointer"><input type="checkbox" name="tipologia" value="Prédio" class="rounded text-orange-600"> Prédio</label>
                                    <label class="flex items-center gap-1.5 cursor-pointer"><input type="checkbox" name="tipologia" value="Outro" id="f-tipologia-outro-chk" class="rounded text-orange-600"> Outro</label>
                                </div>
                                <div id="f-tipologia-outro-wrapper" class="hidden mt-2">
                                    <label class="block text-xs font-semibold text-orange-700 mb-1">Especifique o tipo de imóvel <span class="text-red-500">*</span></label>
                                    <input type="text" id="f-tipologia-outro" placeholder="Ex: Cobertura Duplex, Pousada, Studio..." class="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 outline-none transition-all">
                                </div>
                            </div>

                            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                                <div>
                                    <label class="block text-xs font-bold text-gray-700 mb-1">CEP</label>
                                    <div class="flex gap-2">
                                        <input type="text" id="f-imovel-cep" placeholder="00000-000" class="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 outline-none transition-all">
                                        <button type="button" id="btn-busca-cep" class="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl border transition-colors">Buscar</button>
                                    </div>
                                </div>
                                <div class="sm:col-span-2">
                                    <label class="block text-xs font-bold text-gray-700 mb-1">Edifício / Condomínio (Se houver)</label>
                                    <input type="text" id="f-imovel-edificio" placeholder="Nome do condomínio ou edifício" class="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 outline-none transition-all">
                                </div>
                            </div>

                            <div class="grid grid-cols-1 sm:grid-cols-4 gap-4">
                                <div class="sm:col-span-3">
                                    <label class="block text-xs font-bold text-gray-700 mb-1">Endereço (Rua / Avenida) <span class="text-red-500">*</span></label>
                                    <input type="text" id="f-imovel-endereco" required placeholder="Rua / Av" class="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 outline-none transition-all">
                                </div>
                                <div>
                                    <label class="block text-xs font-bold text-gray-700 mb-1">Número <span class="text-red-500">*</span></label>
                                    <input type="text" id="f-imovel-numero" required placeholder="Nº" class="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 outline-none transition-all">
                                </div>
                            </div>

                            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div>
                                    <label class="block text-xs font-bold text-gray-700 mb-1">Complemento / Apto</label>
                                    <input type="text" id="f-imovel-complemento" placeholder="Apto 101" class="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 outline-none transition-all">
                                </div>
                                <div>
                                    <label class="block text-xs font-bold text-gray-700 mb-1">Bairro <span class="text-red-500">*</span></label>
                                    <input type="text" id="f-imovel-bairro" required placeholder="Bairro" class="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 outline-none transition-all">
                                </div>
                                <div>
                                    <label class="block text-xs font-bold text-gray-700 mb-1">Cidade / UF <span class="text-red-500">*</span></label>
                                    <input type="text" id="f-imovel-cidade" required placeholder="Cidade/UF" class="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 outline-none transition-all">
                                </div>
                            </div>

                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-xs font-bold text-gray-700 mb-1">Andar</label>
                                    <input type="text" id="f-imovel-andar" placeholder="Ex: 5º" class="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 outline-none transition-all">
                                </div>
                                <div>
                                    <label class="block text-xs font-bold text-gray-700 mb-1">Local das Chaves</label>
                                    <input type="text" id="f-local-chaves" placeholder="Ex: Imobiliária / Portaria / Proprietário" class="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 outline-none transition-all">
                                </div>
                            </div>
                        </div>

                        <!-- ETAPA 3: CARACTERÍSTICAS & DETALHES -->
                        <div id="step-content-3" class="step-content space-y-4">
                            <h3 class="text-base font-bold text-gray-900 border-b pb-2">Características do Imóvel</h3>

                            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                                <div>
                                    <label class="block text-xs font-bold text-gray-700 mb-1">Área Útil (m²)</label>
                                    <input type="text" id="f-carac-area-util" placeholder="0" class="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 outline-none transition-all">
                                </div>
                                <div>
                                    <label class="block text-xs font-bold text-gray-700 mb-1">Área Total (m²) <span class="text-red-500">*</span></label>
                                    <input type="text" id="f-carac-area-total" required placeholder="0" class="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 outline-none transition-all">
                                </div>
                                <div>
                                    <label class="block text-xs font-bold text-gray-700 mb-1">Quartos</label>
                                    <input type="number" id="f-carac-quartos" min="0" placeholder="0" class="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 outline-none transition-all">
                                </div>
                                <div>
                                    <label class="block text-xs font-bold text-gray-700 mb-1">Suítes</label>
                                    <input type="number" id="f-carac-suites" min="0" placeholder="0" class="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 outline-none transition-all">
                                </div>
                                <div>
                                    <label class="block text-xs font-bold text-gray-700 mb-1">Banheiros</label>
                                    <input type="number" id="f-carac-banheiros" min="0" placeholder="0" class="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 outline-none transition-all">
                                </div>
                                <div>
                                    <label class="block text-xs font-bold text-gray-700 mb-1">Vagas Garagem</label>
                                    <input type="number" id="f-carac-vagas" min="0" placeholder="0" class="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 outline-none transition-all">
                                </div>
                            </div>

                            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div>
                                    <label class="block text-xs font-bold text-gray-700 mb-1">Mobiliado?</label>
                                    <select id="f-carac-mobiliado" class="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm bg-white focus:ring-2 focus:ring-orange-500 outline-none transition-all">
                                        <option value="Não">Não</option>
                                        <option value="Semi-Mobiliado">Semi-Mobiliado</option>
                                        <option value="Totalmente Mobiliado">Totalmente Mobiliado</option>
                                    </select>
                                </div>
                                <div>
                                    <label class="block text-xs font-bold text-gray-700 mb-1">Posição Solar</label>
                                    <select id="f-carac-sol" class="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm bg-white focus:ring-2 focus:ring-orange-500 outline-none transition-all">
                                        <option value="">Não informado</option>
                                        <option value="Sol da Manhã">Sol da Manhã</option>
                                        <option value="Sol da Tarde">Sol da Tarde</option>
                                    </select>
                                </div>
                                <div>
                                    <label class="block text-xs font-bold text-gray-700 mb-1">Tipo de Terreno</label>
                                    <div class="flex gap-3 pt-2 text-xs font-semibold">
                                        <label class="flex items-center gap-1 cursor-pointer"><input type="checkbox" id="f-terreno-aclive" class="rounded text-orange-600"> Aclive</label>
                                        <label class="flex items-center gap-1 cursor-pointer"><input type="checkbox" id="f-terreno-declive" class="rounded text-orange-600"> Declive</label>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label class="block text-xs font-bold text-gray-700 mb-1">Características do Imóvel</label>
                                <div id="f-carac-imovel-group" class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-semibold text-gray-700 p-3 bg-gray-50 rounded-xl border border-gray-200">
                                    <label class="flex items-center gap-1.5 cursor-pointer"><input type="checkbox" name="carac-imovel" value="Piscina" class="rounded text-orange-600"> Piscina</label>
                                    <label class="flex items-center gap-1.5 cursor-pointer"><input type="checkbox" name="carac-imovel" value="Churrasqueira" class="rounded text-orange-600"> Churrasqueira</label>
                                    <label class="flex items-center gap-1.5 cursor-pointer"><input type="checkbox" name="carac-imovel" value="Lareira" class="rounded text-orange-600"> Lareira</label>
                                    <label class="flex items-center gap-1.5 cursor-pointer"><input type="checkbox" name="carac-imovel" value="Espaço Gourmet" class="rounded text-orange-600"> Espaço Gourmet</label>
                                    <label class="flex items-center gap-1.5 cursor-pointer"><input type="checkbox" name="carac-imovel" value="Escritório" class="rounded text-orange-600"> Escritório</label>
                                    <label class="flex items-center gap-1.5 cursor-pointer"><input type="checkbox" name="carac-imovel" value="Lavabo" class="rounded text-orange-600"> Lavabo</label>
                                    <label class="flex items-center gap-1.5 cursor-pointer"><input type="checkbox" name="carac-imovel" value="Ar Condicionado" class="rounded text-orange-600"> Ar Condicionado</label>
                                    <label class="flex items-center gap-1.5 cursor-pointer"><input type="checkbox" name="carac-imovel" value="Varanda" class="rounded text-orange-600"> Varanda</label>
                                    <label class="flex items-center gap-1.5 cursor-pointer"><input type="checkbox" name="carac-imovel" value="Sacada" class="rounded text-orange-600"> Sacada</label>
                                    <label class="flex items-center gap-1.5 cursor-pointer"><input type="checkbox" name="carac-imovel" value="Quintal" class="rounded text-orange-600"> Quintal</label>
                                    <label class="flex items-center gap-1.5 cursor-pointer"><input type="checkbox" name="carac-imovel" value="Área de Serviço" class="rounded text-orange-600"> Área de Serviço</label>
                                    <label class="flex items-center gap-1.5 cursor-pointer"><input type="checkbox" name="carac-imovel" value="Armários Planejados" class="rounded text-orange-600"> Armários Planejados</label>
                                    <label class="flex items-center gap-1.5 cursor-pointer"><input type="checkbox" name="carac-imovel" value="Varanda Gourmet" class="rounded text-orange-600"> Varanda Gourmet</label>
                                    <label class="flex items-center gap-1.5 cursor-pointer"><input type="checkbox" name="carac-imovel" value="Vista Panorâmica" class="rounded text-orange-600"> Vista Panorâmica</label>
                                    <label class="flex items-center gap-1.5 cursor-pointer"><input type="checkbox" name="carac-imovel" value="Aquecimento a Gás" class="rounded text-orange-600"> Aquecimento a Gás</label>
                                    <label class="flex items-center gap-1.5 cursor-pointer"><input type="checkbox" name="carac-imovel" value="Hidromassagem" class="rounded text-orange-600"> Hidromassagem</label>
                                    <label class="flex items-center gap-1.5 cursor-pointer"><input type="checkbox" name="carac-imovel" value="Closet" class="rounded text-orange-600"> Closet</label>
                                    <label class="flex items-center gap-1.5 cursor-pointer"><input type="checkbox" name="carac-imovel" value="Elevador Privativo" class="rounded text-orange-600"> Elevador Privativo</label>
                                </div>
                                <div class="mt-2">
                                    <label class="block text-xs font-medium text-gray-500 mb-1">Outras características do imóvel (separadas por vírgula)</label>
                                    <input type="text" id="f-carac-imovel-custom" placeholder="Ex: Pé direito duplo, Vista para o mar..." class="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 outline-none transition-all">
                                </div>
                            </div>

                            <div>
                                <label class="block text-xs font-bold text-gray-700 mb-1">Características do Condomínio</label>
                                <div id="f-carac-condo-group" class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-semibold text-gray-700 p-3 bg-gray-50 rounded-xl border border-gray-200">
                                    <label class="flex items-center gap-1.5 cursor-pointer"><input type="checkbox" name="carac-condo" value="Piscina" class="rounded text-orange-600"> Piscina</label>
                                    <label class="flex items-center gap-1.5 cursor-pointer"><input type="checkbox" name="carac-condo" value="Churrasqueira" class="rounded text-orange-600"> Churrasqueira</label>
                                    <label class="flex items-center gap-1.5 cursor-pointer"><input type="checkbox" name="carac-condo" value="Salão de Festas" class="rounded text-orange-600"> Salão de Festas</label>
                                    <label class="flex items-center gap-1.5 cursor-pointer"><input type="checkbox" name="carac-condo" value="Academia" class="rounded text-orange-600"> Academia</label>
                                    <label class="flex items-center gap-1.5 cursor-pointer"><input type="checkbox" name="carac-condo" value="Elevador" class="rounded text-orange-600"> Elevador</label>
                                    <label class="flex items-center gap-1.5 cursor-pointer"><input type="checkbox" name="carac-condo" value="Portaria 24h" class="rounded text-orange-600"> Portaria 24h</label>
                                    <label class="flex items-center gap-1.5 cursor-pointer"><input type="checkbox" name="carac-condo" value="Quadra Esportiva" class="rounded text-orange-600"> Quadra Esportiva</label>
                                    <label class="flex items-center gap-1.5 cursor-pointer"><input type="checkbox" name="carac-condo" value="Playground" class="rounded text-orange-600"> Playground</label>
                                    <label class="flex items-center gap-1.5 cursor-pointer"><input type="checkbox" name="carac-condo" value="Sauna" class="rounded text-orange-600"> Sauna</label>
                                    <label class="flex items-center gap-1.5 cursor-pointer"><input type="checkbox" name="carac-condo" value="Espaço Gourmet" class="rounded text-orange-600"> Espaço Gourmet</label>
                                    <label class="flex items-center gap-1.5 cursor-pointer"><input type="checkbox" name="carac-condo" value="Brinquedoteca" class="rounded text-orange-600"> Brinquedoteca</label>
                                    <label class="flex items-center gap-1.5 cursor-pointer"><input type="checkbox" name="carac-condo" value="Salão de Jogos" class="rounded text-orange-600"> Salão de Jogos</label>
                                    <label class="flex items-center gap-1.5 cursor-pointer"><input type="checkbox" name="carac-condo" value="Gerador" class="rounded text-orange-600"> Gerador</label>
                                    <label class="flex items-center gap-1.5 cursor-pointer"><input type="checkbox" name="carac-condo" value="Mercadinho / Conveniência" class="rounded text-orange-600"> Mercadinho</label>
                                    <label class="flex items-center gap-1.5 cursor-pointer"><input type="checkbox" name="carac-condo" value="Acesso PCD" class="rounded text-orange-600"> Acesso PCD</label>
                                    <label class="flex items-center gap-1.5 cursor-pointer"><input type="checkbox" name="carac-condo" value="Garagem Coberta" class="rounded text-orange-600"> Garagem Coberta</label>
                                </div>
                                <div class="mt-2">
                                    <label class="block text-xs font-medium text-gray-500 mb-1">Outras características do condomínio (separadas por vírgula)</label>
                                    <input type="text" id="f-carac-condo-custom" placeholder="Ex: Coworking, Pista de caminhada, Pet place..." class="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 outline-none transition-all">
                                </div>
                            </div>

                            <div>
                                <label class="block text-xs font-bold text-gray-700 mb-1">Descrição / Observações Gerais</label>
                                <textarea id="f-carac-obs" rows="3" placeholder="Informações adicionais relevantes sobre o imóvel..." class="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 outline-none transition-all"></textarea>
                            </div>
                        </div>

                        <!-- ETAPA 4: VALORES & CONDIÇÕES -->
                        <div id="step-content-4" class="step-content space-y-4">
                            <h3 class="text-base font-bold text-gray-900 border-b pb-2">Valores e Condições Comerciais</h3>

                            <!-- Bloco de Venda -->
                            <div id="f-bloco-venda" class="p-4 bg-orange-50/60 rounded-2xl border border-orange-100 space-y-4">
                                <h4 class="text-xs font-black text-orange-900 uppercase tracking-wider flex items-center gap-1.5">
                                    <span class="w-2 h-2 rounded-full bg-orange-600"></span> Valores para Venda
                                </h4>
                                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label class="block text-xs font-bold text-gray-700 mb-1">Valor de Venda (R$) <span id="lbl-venda-required" class="text-red-500">*</span></label>
                                        <input type="text" id="f-valor-venda" placeholder="R$ 0,00" class="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm font-bold text-gray-800 bg-white focus:ring-2 focus:ring-orange-500 outline-none transition-all">
                                    </div>
                                    <div>
                                        <label class="block text-xs font-bold text-gray-700 mb-1">Comissão / Honorários (%)</label>
                                        <input type="text" id="f-valor-comissao" placeholder="Ex: 6" class="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm bg-white focus:ring-2 focus:ring-orange-500 outline-none transition-all">
                                    </div>
                                </div>
                            </div>

                            <!-- Bloco de Locação -->
                            <div id="f-bloco-locacao" class="p-4 bg-blue-50/60 rounded-2xl border border-blue-100 space-y-4">
                                <h4 class="text-xs font-black text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
                                    <span class="w-2 h-2 rounded-full bg-blue-600"></span> Valores para Locação (Aluguel)
                                </h4>
                                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label class="block text-xs font-bold text-gray-700 mb-1">Valor Aluguel Residencial (R$) <span id="lbl-locacao-required" class="text-red-500">*</span></label>
                                        <input type="text" id="f-valor-locacao" placeholder="R$ 0,00" class="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm font-bold text-gray-800 bg-white focus:ring-2 focus:ring-orange-500 outline-none transition-all">
                                    </div>
                                    <div>
                                        <label class="block text-xs font-bold text-gray-700 mb-1">Valor Aluguel Comercial (R$)</label>
                                        <input type="text" id="f-valor-aluguel-comercial" placeholder="R$ 0,00" class="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm font-bold text-gray-800 bg-white focus:ring-2 focus:ring-orange-500 outline-none transition-all">
                                    </div>
                                </div>
                                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                                    <div>
                                        <label class="block text-xs font-bold text-gray-700 mb-1">Taxa Inicial (%)</label>
                                        <input type="text" id="f-taxa-inicial" placeholder="Ex: 50" class="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm bg-white focus:ring-2 focus:ring-orange-500 outline-none transition-all">
                                    </div>
                                    <div>
                                        <label class="block text-xs font-bold text-gray-700 mb-1">Taxa Mensal (%)</label>
                                        <input type="text" id="f-taxa-mensal" placeholder="Ex: 10" class="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm bg-white focus:ring-2 focus:ring-orange-500 outline-none transition-all">
                                    </div>
                                </div>
                            </div>

                            <!-- Bloco de Taxas e Despesas Fixas -->
                            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                                <div>
                                    <label class="block text-xs font-bold text-gray-700 mb-1">Condomínio (R$)</label>
                                    <input type="text" id="f-valor-condominio" placeholder="R$ 0,00" class="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 outline-none transition-all">
                                </div>
                                <div>
                                    <label class="block text-xs font-bold text-gray-700 mb-1">IPTU Anual (R$)</label>
                                    <input type="text" id="f-valor-iptu" placeholder="R$ 0,00" class="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 outline-none transition-all">
                                    <label class="flex items-center gap-1.5 mt-1.5 text-[11px] font-bold text-gray-500 cursor-pointer">
                                        <input type="checkbox" id="f-iptu-isento" class="rounded text-orange-600 focus:ring-orange-500 h-3 w-3">
                                        Isento de IPTU
                                    </label>
                                </div>
                                <div>
                                    <label class="block text-xs font-bold text-gray-700 mb-1">Taxa do Lixo (R$)</label>
                                    <input type="text" id="f-taxa-lixo" placeholder="R$ 0,00" class="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 outline-none transition-all">
                                    <label class="flex items-center gap-1.5 mt-1.5 text-[11px] font-bold text-gray-500 cursor-pointer">
                                        <input type="checkbox" id="f-lixo-isento" class="rounded text-orange-600 focus:ring-orange-500 h-3 w-3">
                                        Isento de Taxa de Lixo
                                    </label>
                                </div>
                            </div>

                            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                                <div>
                                    <label class="block text-xs font-bold text-gray-700 mb-1">Exclusividade Personal?</label>
                                    <select id="f-valor-exclusividade" class="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm bg-white focus:ring-2 focus:ring-orange-500 outline-none transition-all">
                                        <option value="Não">Não</option>
                                        <option value="Sim">Sim</option>
                                    </select>
                                </div>
                                <div>
                                    <label class="block text-xs font-bold text-gray-700 mb-1">Documentação</label>
                                    <select id="f-documentacao" class="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm bg-white focus:ring-2 focus:ring-orange-500 outline-none transition-all">
                                        <option value="Regular">Regular</option>
                                        <option value="Irregular">Irregular</option>
                                    </select>
                                </div>
                                <div>
                                    <label class="block text-xs font-bold text-gray-700 mb-1">Aceita Permuta?</label>
                                    <select id="f-permuta" class="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm bg-white focus:ring-2 focus:ring-orange-500 outline-none transition-all">
                                        <option value="Não">Não</option>
                                        <option value="Sim">Sim</option>
                                    </select>
                                </div>
                            </div>

                            <div id="f-permuta-desc-wrapper" class="hidden">
                                <label class="block text-xs font-bold text-orange-900 mb-1">Detalhes da Permuta <span class="text-red-500">*</span></label>
                                <textarea id="f-permuta-desc" class="w-full px-3 py-2 border border-orange-200 bg-orange-50/50 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 outline-none transition-all" rows="3" placeholder="Descreva o que o proprietário aceita na permuta (ex: aceita carro até R$ 80 mil, apartamento de menor valor em Florianópolis...)"></textarea>
                            </div>
                        </div>

                        <!-- ETAPA 5: REVISÃO & FINALIZAÇÃO -->
                        <div id="step-content-5" class="step-content space-y-4">
                            <h3 class="text-base font-bold text-gray-900 border-b pb-2">Revisão e Finalização da Captação</h3>
                            
                            <div class="p-4 bg-orange-50 rounded-xl border border-orange-200 text-sm text-gray-700 space-y-2">
                                <h4 class="font-bold text-orange-900 text-sm">Resumo da Captação:</h4>
                                <div id="f-review-summary" class="text-xs leading-relaxed text-gray-600 space-y-1">Verifique os dados preenchidos antes de salvar.</div>
                            </div>

                            <div class="pt-4 flex flex-col sm:flex-row gap-3">
                                <button type="button" id="btn-save-capture" class="flex-1 py-3.5 px-4 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow-md text-sm transition-all flex items-center justify-center gap-2">
                                    <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
                                    <span>Salvar Captação</span>
                                </button>
                                <button type="button" id="btn-save-and-sig" class="flex-1 py-3.5 px-4 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-md text-sm transition-all flex items-center justify-center gap-2">
                                    <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L14.732 3.732z" /></svg>
                                    <span>Salvar e Gerar Link de Assinatura</span>
                                </button>
                            </div>
                        </div>

                        <!-- Navegação entre etapas -->
                        <div class="flex justify-between items-center pt-6 border-t border-gray-100">
                            <button type="button" id="btn-prev-step" class="hidden px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-sm transition-colors">
                                &larr; Anterior
                            </button>
                            <button type="button" id="btn-next-step" class="ml-auto px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl text-sm shadow-md transition-all">
                                Próxima Etapa &rarr;
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        `;
    }

    function mountFormView() {
        const user = authService.getCurrentUser();
        const profile = authService.getCurrentProfile();
        let currentStep = 1;
        const totalSteps = 5;

        const corretorInput = document.getElementById("f-corretor-nome");
        if (corretorInput) {
            corretorInput.value = profile?.nome ? `${profile.nome} ${profile.sobrenome || ''}`.trim() : (user?.email || '');
        }

        const hash = window.location.hash || "";
        let editId = null;
        if (hash.includes("edit=")) {
            editId = hash.split("edit=")[1].split("&")[0];
        }

        // Mask helper for Currency (R$ 0,00)
        const maskCurrency = (input) => {
            if (!input) return;
            let value = input.value.replace(/\D/g, '');
            if (value === '') {
                input.value = '';
                return;
            }
            const num = (parseInt(value, 10) / 100).toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });
            input.value = num;
        };

        // Mask helper for Phone
        const maskPhone = (input) => {
            if (!input) return;
            let v = input.value.replace(/\D/g, '');
            if (v.length > 10) {
                input.value = v.replace(/^(\d\d)(\d{5})(\d{4}).*/, '($1) $2-$3');
            } else if (v.length > 5) {
                input.value = v.replace(/^(\d\d)(\d{4})(\d{0,4}).*/, '($1) $2-$3');
            } else if (v.length > 2) {
                input.value = v.replace(/^(\d\d)(\d{0,5})/, '($1) $2');
            } else if (v.length > 0) {
                input.value = v.replace(/^(\d{0,2})/, '($1');
            }
        };

        // Mask helper for CPF/CNPJ
        const maskCpfCnpj = (input) => {
            if (!input) return;
            let v = input.value.replace(/\D/g, '');
            if (v.length <= 11) {
                input.value = v.replace(/(\d{3})(\d)/, '$1.$2')
                               .replace(/(\d{3})(\d)/, '$1.$2')
                               .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
            } else {
                input.value = v.replace(/^(\d{2})(\d)/, '$1.$2')
                               .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
                               .replace(/\.(\d{3})(\d)/, '.$1/$2')
                               .replace(/(\d{4})(\d{1,2})$/, '$1-$2');
            }
        };

        // Mask helper for CEP
        const maskCep = (input) => {
            if (!input) return;
            let v = input.value.replace(/\D/g, '');
            if (v.length > 5) {
                input.value = v.replace(/^(\d{5})(\d{1,3}).*/, '$1-$2');
            } else {
                input.value = v;
            }
        };

        // Attach mask listeners
        const currencyInputIds = [
            'f-valor-venda',
            'f-valor-locacao',
            'f-valor-aluguel-comercial',
            'f-valor-condominio',
            'f-valor-iptu',
            'f-taxa-lixo'
        ];

        currencyInputIds.forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.addEventListener('input', () => maskCurrency(el));
            }
        });

        const phoneInput = document.getElementById('f-prop-telefone');
        if (phoneInput) {
            phoneInput.addEventListener('input', () => maskPhone(phoneInput));
        }

        const cpfInput = document.getElementById('f-prop-cpf');
        if (cpfInput) {
            cpfInput.addEventListener('input', () => maskCpfCnpj(cpfInput));
        }

        const cepInput = document.getElementById('f-imovel-cep');
        if (cepInput) {
            cepInput.addEventListener('input', () => maskCep(cepInput));
        }

        // Toggle visibility of Tipologia "Outro"
        const updateTipologiaVisibility = () => {
            const outroChk = document.getElementById('f-tipologia-outro-chk');
            const outroWrapper = document.getElementById('f-tipologia-outro-wrapper');
            const outroInput = document.getElementById('f-tipologia-outro');
            if (outroChk && outroWrapper) {
                if (outroChk.checked) {
                    outroWrapper.classList.remove('hidden');
                    if (outroInput && !outroInput.value) outroInput.focus();
                } else {
                    outroWrapper.classList.add('hidden');
                    if (outroInput) outroInput.value = '';
                }
            }
        };

        document.querySelectorAll('input[name="tipologia"]').forEach(cb => {
            cb.addEventListener('change', updateTipologiaVisibility);
        });

        // Toggle visibility of Permuta description
        const permutaSelect = document.getElementById('f-permuta');
        const updatePermutaVisibility = () => {
            const permutaDescWrapper = document.getElementById('f-permuta-desc-wrapper');
            const permutaDescInput = document.getElementById('f-permuta-desc');
            if (permutaSelect && permutaDescWrapper) {
                if (permutaSelect.value === 'Sim') {
                    permutaDescWrapper.classList.remove('hidden');
                    if (permutaDescInput && !permutaDescInput.value) permutaDescInput.focus();
                } else {
                    permutaDescWrapper.classList.add('hidden');
                    if (permutaDescInput) permutaDescInput.value = '';
                }
            }
        };

        // Toggle IPTU Isento
        const iptuIsentoChk = document.getElementById('f-iptu-isento');
        const iptuInput = document.getElementById('f-valor-iptu');
        if (iptuIsentoChk && iptuInput) {
            const toggleIptu = () => {
                iptuInput.disabled = iptuIsentoChk.checked;
                iptuInput.classList.toggle('bg-gray-100', iptuIsentoChk.checked);
                if (iptuIsentoChk.checked) iptuInput.value = '';
            };
            iptuIsentoChk.addEventListener('change', toggleIptu);
        }

        // Toggle Lixo Isento
        const lixoIsentoChk = document.getElementById('f-lixo-isento');
        const lixoInput = document.getElementById('f-taxa-lixo');
        if (lixoIsentoChk && lixoInput) {
            const toggleLixo = () => {
                lixoInput.disabled = lixoIsentoChk.checked;
                lixoInput.classList.toggle('bg-gray-100', lixoIsentoChk.checked);
                if (lixoIsentoChk.checked) lixoInput.value = '';
            };
            lixoIsentoChk.addEventListener('change', toggleLixo);
        }

        if (permutaSelect) {
            permutaSelect.addEventListener('change', updatePermutaVisibility);
        }

        // Toggle visibility & requirement of financial blocks based on tipoCaptacao
        const updateFinancialBlocksVisibility = () => {
            const tipo = document.getElementById('f-tipo-captacao')?.value || 'Venda';
            const blocoVenda = document.getElementById('f-bloco-venda');
            const blocoLocacao = document.getElementById('f-bloco-locacao');

            if (tipo === 'Venda') {
                if (blocoVenda) blocoVenda.classList.remove('hidden');
                if (blocoLocacao) blocoLocacao.classList.add('hidden');
            } else if (tipo === 'Aluguel') {
                if (blocoVenda) blocoVenda.classList.add('hidden');
                if (blocoLocacao) blocoLocacao.classList.remove('hidden');
            } else { // Ambos
                if (blocoVenda) blocoVenda.classList.remove('hidden');
                if (blocoLocacao) blocoLocacao.classList.remove('hidden');
            }
        };

        document.getElementById('f-tipo-captacao')?.addEventListener('change', updateFinancialBlocksVisibility);
        updateFinancialBlocksVisibility();

        // Step Navigation Controller
        const setStep = (step) => {
            if (step < 1 || step > totalSteps) return;
            currentStep = step;

            for (let i = 1; i <= totalSteps; i++) {
                const content = document.getElementById(`step-content-${i}`);
                if (content) {
                    if (i === currentStep) content.classList.add("active");
                    else content.classList.remove("active");
                }
            }

            document.querySelectorAll(".step-indicator").forEach(ind => {
                const s = parseInt(ind.dataset.step, 10);
                const circle = ind.querySelector("span:first-child");
                const label = ind.querySelector("span:last-child");

                if (s === currentStep) {
                    circle.className = "w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs bg-orange-600 text-white shadow-md";
                    label.className = "text-[11px] font-bold text-orange-600 mt-1";
                } else if (s < currentStep) {
                    circle.className = "w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs bg-green-500 text-white";
                    label.className = "text-[11px] font-semibold text-green-600 mt-1";
                } else {
                    circle.className = "w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs bg-gray-200 text-gray-600";
                    label.className = "text-[11px] font-semibold text-gray-400 mt-1";
                }
            });

            const progressPercent = ((currentStep - 1) / (totalSteps - 1)) * 100;
            const bar = document.getElementById("step-progress-bar");
            if (bar) bar.style.width = `${progressPercent}%`;

            const prevBtn = document.getElementById("btn-prev-step");
            const nextBtn = document.getElementById("btn-next-step");

            if (currentStep === 1) prevBtn?.classList.add("hidden");
            else prevBtn?.classList.remove("hidden");

            if (currentStep === totalSteps) {
                nextBtn?.classList.add("hidden");
                updateSummary();
            } else {
                nextBtn?.classList.remove("hidden");
            }

            window.scrollTo({ top: 0, behavior: "smooth" });
        };

        // Helper to mark field as invalid
        const markInvalid = (el, message) => {
            if (el) {
                el.classList.add('border-red-500', 'ring-2', 'ring-red-200');
                const clearError = () => {
                    el.classList.remove('border-red-500', 'ring-2', 'ring-red-200');
                    el.removeEventListener('input', clearError);
                    el.removeEventListener('change', clearError);
                };
                el.addEventListener('input', clearError);
                el.addEventListener('change', clearError);
                el.focus();
            }
            if (message) {
                showAlert(message, "Campo Obrigatório");
            }
        };

        // Helper to check if string has digits
        const hasDigits = (str) => !!(str && String(str).replace(/\D/g, '').length > 0);

        // Validation logic per step
        const validateStep = (step) => {
            if (step === 1) {
                const codigo = document.getElementById("f-codigo-imovel");
                if (!codigo?.value.trim()) {
                    markInvalid(codigo, "Por favor, informe o Código do Imóvel.");
                    return false;
                }

                const propNome = document.getElementById("f-prop-nome");
                if (!propNome?.value.trim()) {
                    markInvalid(propNome, "Por favor, informe o Nome Completo / Razão Social do proprietário.");
                    return false;
                }

                const propTelefone = document.getElementById("f-prop-telefone");
                if (!propTelefone?.value.trim()) {
                    markInvalid(propTelefone, "Por favor, informe o Telefone Principal (WhatsApp) do proprietário.");
                    return false;
                }

                const cpf = document.getElementById("f-prop-cpf")?.value.trim();
                if (cpf) {
                    const digits = cpf.replace(/\D/g, '');
                    if (digits.length !== 11 && digits.length !== 14) {
                        markInvalid(document.getElementById("f-prop-cpf"), "O CPF informado deve conter 11 dígitos ou o CNPJ 14 dígitos.");
                        return false;
                    }
                }
            }

            if (step === 2) {
                const tipologias = Array.from(document.querySelectorAll('input[name="tipologia"]:checked')).map(c => c.value);
                if (tipologias.length === 0) {
                    showAlert("Por favor, selecione ao menos uma Tipologia do Imóvel.", "Campo Obrigatório");
                    return false;
                }

                const outroChk = document.getElementById("f-tipologia-outro-chk");
                const outroInput = document.getElementById("f-tipologia-outro");
                if (outroChk?.checked && !outroInput?.value.trim()) {
                    markInvalid(outroInput, "Por favor, especifique o tipo do imóvel na opção 'Outro'.");
                    return false;
                }

                const endereco = document.getElementById("f-imovel-endereco");
                if (!endereco?.value.trim()) {
                    markInvalid(endereco, "Por favor, informe o Endereço (Rua / Avenida) do imóvel.");
                    return false;
                }

                const numero = document.getElementById("f-imovel-numero");
                if (!numero?.value.trim()) {
                    markInvalid(numero, "Por favor, informe o Número do imóvel.");
                    return false;
                }

                const bairro = document.getElementById("f-imovel-bairro");
                if (!bairro?.value.trim()) {
                    markInvalid(bairro, "Por favor, informe o Bairro do imóvel.");
                    return false;
                }

                const cidade = document.getElementById("f-imovel-cidade");
                if (!cidade?.value.trim()) {
                    markInvalid(cidade, "Por favor, informe a Cidade / UF do imóvel.");
                    return false;
                }
            }

            if (step === 3) {
                const areaTotal = document.getElementById("f-carac-area-total");
                if (!areaTotal?.value.trim()) {
                    markInvalid(areaTotal, "A Área Total (m²) é obrigatória. Por favor, preencha este campo.");
                    return false;
                }
            }

            if (step === 4) {
                const tipo = document.getElementById("f-tipo-captacao")?.value || 'Venda';
                const valorVendaInput = document.getElementById("f-valor-venda");
                const valorLocacaoInput = document.getElementById("f-valor-locacao");
                const valorAluguelComInput = document.getElementById("f-valor-aluguel-comercial");

                if (tipo === "Venda") {
                    if (!hasDigits(valorVendaInput?.value)) {
                        markInvalid(valorVendaInput, "Para captações de Venda, o Valor de Venda é obrigatório.");
                        return false;
                    }
                } else if (tipo === "Aluguel") {
                    if (!hasDigits(valorLocacaoInput?.value) && !hasDigits(valorAluguelComInput?.value)) {
                        markInvalid(valorLocacaoInput, "Para captações de Aluguel, informe ao menos um valor de locação (Residencial ou Comercial).");
                        return false;
                    }
                } else if (tipo === "Ambos") {
                    if (!hasDigits(valorVendaInput?.value)) {
                        markInvalid(valorVendaInput, "Para captações de Venda e Aluguel, o Valor de Venda é obrigatório.");
                        return false;
                    }
                    if (!hasDigits(valorLocacaoInput?.value) && !hasDigits(valorAluguelComInput?.value)) {
                        markInvalid(valorLocacaoInput, "Para captações de Venda e Aluguel, informe ao menos um valor de locação (Residencial ou Comercial).");
                        return false;
                    }
                }

                const permuta = document.getElementById("f-permuta")?.value;
                const permutaDesc = document.getElementById("f-permuta-desc");
                if (permuta === "Sim" && !permutaDesc?.value.trim()) {
                    markInvalid(permutaDesc, "Por favor, descreva os detalhes da permuta aceita.");
                    return false;
                }
            }

            return true;
        };

        const updateSummary = () => {
            const codigo = document.getElementById("f-codigo-imovel")?.value.toUpperCase() || "N/A";
            const propNome = document.getElementById("f-prop-nome")?.value || "Não informado";
            const propCpf = document.getElementById("f-prop-cpf")?.value || "Não informado";
            const propTel = document.getElementById("f-prop-telefone")?.value || "Não informado";
            const endereco = document.getElementById("f-imovel-endereco")?.value || "Não informado";
            const num = document.getElementById("f-imovel-numero")?.value || "S/N";
            const bairro = document.getElementById("f-imovel-bairro")?.value || "";
            const cidade = document.getElementById("f-imovel-cidade")?.value || "";
            const tipo = document.getElementById("f-tipo-captacao")?.value || "";
            const areaTotal = document.getElementById("f-carac-area-total")?.value || "-";
            const venda = document.getElementById("f-valor-venda")?.value || "-";
            const locacao = document.getElementById("f-valor-locacao")?.value || "-";
            const permuta = document.getElementById("f-permuta")?.value || "Não";

            const summaryEl = document.getElementById("f-review-summary");
            if (summaryEl) {
                summaryEl.innerHTML = `
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <div><strong>Código do Imóvel:</strong> <span class="font-bold text-orange-600">${codigo}</span></div>
                        <div><strong>Tipo de Negócio:</strong> <span class="font-bold text-gray-800">${tipo}</span></div>
                        <div><strong>Proprietário:</strong> ${propNome} (CPF: ${propCpf})</div>
                        <div><strong>Contato:</strong> ${propTel}</div>
                        <div><strong>Endereço:</strong> ${endereco}, ${num} - ${bairro}, ${cidade}</div>
                        <div><strong>Área Total:</strong> ${areaTotal} m²</div>
                        <div><strong>Valor Venda:</strong> ${venda}</div>
                        <div><strong>Valor Locação:</strong> ${locacao}</div>
                        <div><strong>Aceita Permuta:</strong> ${permuta}</div>
                    </div>
                `;
            }
        };

        // Navigation button events
        document.getElementById("btn-prev-step")?.addEventListener("click", () => setStep(currentStep - 1));
        
        document.getElementById("btn-next-step")?.addEventListener("click", () => {
            if (validateStep(currentStep)) {
                setStep(currentStep + 1);
            }
        });

        // Step indicators click - strict validation of intermediate steps
        document.querySelectorAll(".step-indicator").forEach(ind => {
            ind.addEventListener("click", () => {
                const target = parseInt(ind.dataset.step, 10);
                if (target < currentStep) {
                    setStep(target);
                } else if (target > currentStep) {
                    for (let s = currentStep; s < target; s++) {
                        if (!validateStep(s)) {
                            return;
                        }
                    }
                    setStep(target);
                }
            });
        });

        // CEP auto-complete
        document.getElementById("btn-busca-cep")?.addEventListener("click", async () => {
            const rawCep = document.getElementById("f-imovel-cep")?.value.replace(/\D/g, "");
            if (!rawCep || rawCep.length !== 8) {
                showAlert("Digite um CEP válido com 8 dígitos.", "CEP Inválido");
                return;
            }
            showGlobalSpinner("Buscando CEP...");
            try {
                const res = await fetch(`https://viacep.com.br/ws/${rawCep}/json/`);
                const data = await res.json();
                if (data.erro) {
                    showAlert("CEP não encontrado.", "Aviso");
                } else {
                    document.getElementById("f-imovel-endereco").value = data.logradouro || "";
                    document.getElementById("f-imovel-bairro").value = data.bairro || "";
                    document.getElementById("f-imovel-cidade").value = `${data.localidade || ""}/${data.uf || ""}`;
                    document.getElementById("f-imovel-numero")?.focus();
                }
            } catch (e) {
                showAlert("Falha ao consultar o CEP.", "Erro");
            } finally {
                hideGlobalSpinner();
            }
        });

        const getFormData = () => {
            let tipologias = Array.from(document.querySelectorAll('input[name="tipologia"]:checked')).map(c => c.value);
            const outroChk = document.getElementById('f-tipologia-outro-chk');
            const tipologiaOutro = document.getElementById('f-tipologia-outro')?.value.trim();
            if (outroChk?.checked && tipologiaOutro) {
                tipologias = tipologias.filter(t => t !== 'Outro').concat([tipologiaOutro]);
            }

            const caracImovelChecked = Array.from(document.querySelectorAll('input[name="carac-imovel"]:checked')).map(c => c.value);
            const caracImovelCustom = document.getElementById("f-carac-imovel-custom")?.value.trim() || '';

            const caracCondoChecked = Array.from(document.querySelectorAll('input[name="carac-condo"]:checked')).map(c => c.value);
            const caracCondoCustom = document.getElementById("f-carac-condo-custom")?.value.trim() || '';

            const permutaValue = document.getElementById("f-permuta")?.value || 'Não';
            const permutaDescValue = permutaValue === 'Sim' ? (document.getElementById("f-permuta-desc")?.value.trim() || '') : '';

            return {
                corretorNome: document.getElementById("f-corretor-nome")?.value,
                codigoImovel: document.getElementById("f-codigo-imovel")?.value.trim().toUpperCase(),
                temFoto: document.getElementById("f-tem-foto")?.checked || false,
                temPlaca: document.getElementById("f-tem-placa")?.checked || false,
                propNome: document.getElementById("f-prop-nome")?.value.trim(),
                propCpf: document.getElementById("f-prop-cpf")?.value.trim(),
                propRg: document.getElementById("f-prop-rg")?.value.trim(),
                propEstadoCivil: document.getElementById("f-prop-estado-civil")?.value,
                propProfissao: document.getElementById("f-prop-profissao")?.value.trim(),
                propTelefone: document.getElementById("f-prop-telefone")?.value.trim(),
                propWhatsapp: document.getElementById("f-prop-whatsapp")?.checked || false,
                propEmail: document.getElementById("f-prop-email")?.value.trim(),
                tipoCaptacao: document.getElementById("f-tipo-captacao")?.value,
                imovelFinalidade: document.getElementById("f-imovel-finalidade")?.value,
                imovelTipologia: tipologias,
                imovelCep: document.getElementById("f-imovel-cep")?.value.trim(),
                imovelEdificio: document.getElementById("f-imovel-edificio")?.value.trim(),
                imovelEndereco: document.getElementById("f-imovel-endereco")?.value.trim(),
                imovelNumero: document.getElementById("f-imovel-numero")?.value.trim(),
                imovelComplemento: document.getElementById("f-imovel-complemento")?.value.trim(),
                imovelBairro: document.getElementById("f-imovel-bairro")?.value.trim(),
                imovelCidade: document.getElementById("f-imovel-cidade")?.value.trim(),
                imovelAndar: document.getElementById("f-imovel-andar")?.value.trim(),
                localChaves: document.getElementById("f-local-chaves")?.value.trim(),
                caracAreaUtil: document.getElementById("f-carac-area-util")?.value.trim(),
                caracAreaTotal: document.getElementById("f-carac-area-total")?.value.trim(),
                caracQuartos: document.getElementById("f-carac-quartos")?.value,
                caracSuites: document.getElementById("f-carac-suites")?.value,
                caracBanheiros: document.getElementById("f-carac-banheiros")?.value,
                caracVagas: document.getElementById("f-carac-vagas")?.value,
                caracMobiliado: document.getElementById("f-carac-mobiliado")?.value,
                caracSol: document.getElementById("f-carac-sol")?.value,
                terrenoAclive: document.getElementById("f-terreno-aclive")?.checked || false,
                terrenoDeclive: document.getElementById("f-terreno-declive")?.checked || false,
                caracImovel: caracImovelChecked,
                caracImovelCustom: caracImovelCustom,
                caracCondominio: caracCondoChecked,
                caracCondoCustom: caracCondoCustom,
                caracObs: document.getElementById("f-carac-obs")?.value.trim(),
                valorVenda: document.getElementById("f-valor-venda")?.value.trim(),
                valorLocacao: document.getElementById("f-valor-locacao")?.value.trim(),
                valorAluguelComercial: document.getElementById("f-valor-aluguel-comercial")?.value.trim(),
                valorCondominio: document.getElementById("f-valor-condominio")?.value.trim(),
                valorIptu: document.getElementById("f-iptu-isento")?.checked ? 'Isento' : document.getElementById("f-valor-iptu")?.value.trim(),
                iptuIsento: document.getElementById("f-iptu-isento")?.checked || false,
                taxaLixo: document.getElementById("f-lixo-isento")?.checked ? 'Isento' : document.getElementById("f-taxa-lixo")?.value.trim(),
                lixoIsento: document.getElementById("f-lixo-isento")?.checked || false,
                taxaInicial: document.getElementById("f-taxa-inicial")?.value.trim(),
                taxaMensal: document.getElementById("f-taxa-mensal")?.value.trim(),
                valorComissao: document.getElementById("f-valor-comissao")?.value.trim(),
                valorExclusividade: document.getElementById("f-valor-exclusividade")?.value,
                documentacao: document.getElementById("f-documentacao")?.value,
                permuta: permutaValue,
                permutaDesc: permutaDescValue,
                permutaObs: permutaDescValue
            };
        };

        // Load data for editing
        if (editId) {
            document.getElementById("form-title").innerText = "Editar Captação";
            showGlobalSpinner("Carregando dados da captação...");
            captacaoService.getById(editId).then(data => {
                if (data) {
                    if (data.codigoImovel) document.getElementById("f-codigo-imovel").value = data.codigoImovel;
                    if (data.temFoto) document.getElementById("f-tem-foto").checked = true;
                    if (data.temPlaca) document.getElementById("f-tem-placa").checked = true;
                    if (data.propNome) document.getElementById("f-prop-nome").value = data.propNome;
                    if (data.propCpf) {
                        const cpfEl = document.getElementById("f-prop-cpf");
                        cpfEl.value = data.propCpf;
                        maskCpfCnpj(cpfEl);
                    }
                    if (data.propRg) document.getElementById("f-prop-rg").value = data.propRg;
                    if (data.propEstadoCivil) document.getElementById("f-prop-estado-civil").value = data.propEstadoCivil;
                    if (data.propProfissao) document.getElementById("f-prop-profissao").value = data.propProfissao;
                    if (data.propTelefone) {
                        const telEl = document.getElementById("f-prop-telefone");
                        telEl.value = data.propTelefone;
                        maskPhone(telEl);
                    }
                    if (data.propWhatsapp) {
                        const wa = document.getElementById("f-prop-whatsapp");
                        if (wa) wa.checked = true;
                    }
                    if (data.propEmail) document.getElementById("f-prop-email").value = data.propEmail;
                    if (data.tipoCaptacao) {
                        document.getElementById("f-tipo-captacao").value = data.tipoCaptacao;
                        updateFinancialBlocksVisibility();
                    }
                    if (data.imovelFinalidade) document.getElementById("f-imovel-finalidade").value = data.imovelFinalidade;
                    if (data.imovelCep) {
                        const cepEl = document.getElementById("f-imovel-cep");
                        cepEl.value = data.imovelCep;
                        maskCep(cepEl);
                    }
                    if (data.imovelEdificio) document.getElementById("f-imovel-edificio").value = data.imovelEdificio;
                    if (data.imovelEndereco) document.getElementById("f-imovel-endereco").value = data.imovelEndereco;
                    if (data.imovelNumero) document.getElementById("f-imovel-numero").value = data.imovelNumero;
                    if (data.imovelComplemento) document.getElementById("f-imovel-complemento").value = data.imovelComplemento;
                    if (data.imovelBairro) document.getElementById("f-imovel-bairro").value = data.imovelBairro;
                    if (data.imovelCidade) document.getElementById("f-imovel-cidade").value = data.imovelCidade;
                    if (data.imovelAndar) document.getElementById("f-imovel-andar").value = data.imovelAndar;
                    if (data.localChaves) document.getElementById("f-local-chaves").value = data.localChaves;
                    if (data.caracAreaUtil) document.getElementById("f-carac-area-util").value = data.caracAreaUtil;
                    if (data.caracAreaTotal) document.getElementById("f-carac-area-total").value = data.caracAreaTotal;
                    if (data.caracQuartos !== undefined) document.getElementById("f-carac-quartos").value = data.caracQuartos;
                    if (data.caracSuites !== undefined) document.getElementById("f-carac-suites").value = data.caracSuites;
                    if (data.caracBanheiros !== undefined) document.getElementById("f-carac-banheiros").value = data.caracBanheiros;
                    if (data.caracVagas !== undefined) document.getElementById("f-carac-vagas").value = data.caracVagas;
                    if (data.caracMobiliado) document.getElementById("f-carac-mobiliado").value = data.caracMobiliado;
                    if (data.caracSol) document.getElementById("f-carac-sol").value = data.caracSol;
                    if (data.terrenoAclive) document.getElementById("f-terreno-aclive").checked = true;
                    if (data.terrenoDeclive) document.getElementById("f-terreno-declive").checked = true;
                    
                    if (data.caracImovelCustom) document.getElementById("f-carac-imovel-custom").value = data.caracImovelCustom;
                    if (data.caracCondoCustom) document.getElementById("f-carac-condo-custom").value = data.caracCondoCustom;
                    if (data.caracObs) document.getElementById("f-carac-obs").value = data.caracObs;

                    // Values with currency masks
                    const setCurrencyVal = (id, val) => {
                        const el = document.getElementById(id);
                        if (el && val) {
                            el.value = val;
                            maskCurrency(el);
                        }
                    };

                    setCurrencyVal("f-valor-venda", data.valorVenda);
                    setCurrencyVal("f-valor-locacao", data.valorLocacao);
                    setCurrencyVal("f-valor-aluguel-comercial", data.valorAluguelComercial);
                    setCurrencyVal("f-valor-condominio", data.valorCondominio);
                    // IPTU com isento
                    if (data.iptuIsento) {
                        const chk = document.getElementById('f-iptu-isento');
                        const inp = document.getElementById('f-valor-iptu');
                        if (chk) { chk.checked = true; if (inp) { inp.disabled = true; inp.classList.add('bg-gray-100'); } }
                    } else {
                        setCurrencyVal("f-valor-iptu", data.valorIptu);
                    }
                    // Taxa Lixo com isento
                    if (data.lixoIsento) {
                        const chk = document.getElementById('f-lixo-isento');
                        const inp = document.getElementById('f-taxa-lixo');
                        if (chk) { chk.checked = true; if (inp) { inp.disabled = true; inp.classList.add('bg-gray-100'); } }
                    } else {
                        setCurrencyVal("f-taxa-lixo", data.taxaLixo);
                    }

                    if (data.taxaInicial) document.getElementById("f-taxa-inicial").value = data.taxaInicial;
                    if (data.taxaMensal) document.getElementById("f-taxa-mensal").value = data.taxaMensal;
                    if (data.valorComissao) document.getElementById("f-valor-comissao").value = data.valorComissao;
                    if (data.valorExclusividade) document.getElementById("f-valor-exclusividade").value = data.valorExclusividade;
                    if (data.documentacao) document.getElementById("f-documentacao").value = data.documentacao;
                    
                    // Permuta
                    if (data.permuta) {
                        document.getElementById("f-permuta").value = data.permuta;
                        updatePermutaVisibility();
                    }
                    const permutaTxt = data.permutaDesc || data.permutaObs || '';
                    if (permutaTxt) {
                        const pd = document.getElementById("f-permuta-desc");
                        if (pd) pd.value = permutaTxt;
                    }

                    // Tipologias
                    if (Array.isArray(data.imovelTipologia)) {
                        const standardTypes = ["Apartamento", "Casa", "Terreno", "Sala Comercial", "Galpão", "Sítio/Chácara", "Prédio"];
                        let customTypes = [];

                        data.imovelTipologia.forEach(t => {
                            const cb = document.querySelector(`input[name="tipologia"][value="${t}"]`);
                            if (cb) {
                                cb.checked = true;
                            } else if (t && t !== 'Outro') {
                                customTypes.push(t);
                            }
                        });

                        if (customTypes.length > 0 || data.imovelTipologia.includes('Outro')) {
                            const outroChk = document.getElementById('f-tipologia-outro-chk');
                            if (outroChk) outroChk.checked = true;
                            const outroInput = document.getElementById('f-tipologia-outro');
                            if (outroInput) outroInput.value = customTypes.join(', ');
                            updateTipologiaVisibility();
                        }
                    }

                    // Characteristics
                    if (Array.isArray(data.caracImovel)) {
                        data.caracImovel.forEach(val => {
                            const chk = document.querySelector(`input[name="carac-imovel"][value="${val}"]`);
                            if (chk) chk.checked = true;
                        });
                    }

                    if (Array.isArray(data.caracCondominio)) {
                        data.caracCondominio.forEach(val => {
                            const chk = document.querySelector(`input[name="carac-condo"][value="${val}"]`);
                            if (chk) chk.checked = true;
                        });
                    }
                }
            }).finally(() => hideGlobalSpinner());
        }

        // Save Capture
        document.getElementById("btn-save-capture")?.addEventListener("click", async () => {
            for (let s = 1; s <= 4; s++) {
                if (!validateStep(s)) {
                    setStep(s);
                    return;
                }
            }

            const formData = getFormData();
            showGlobalSpinner("Gravando captação...");
            try {
                await captacaoService.saveCapture(formData, editId);
                showAlert("Captação salva com sucesso!", "Sucesso", () => {
                    window.location.hash = "#/home";
                });
            } catch (err) {
                showAlert("Erro ao salvar: " + err.message, "Erro");
            } finally {
                hideGlobalSpinner();
            }
        });

        // Save and Generate Signature Link
        document.getElementById("btn-save-and-sig")?.addEventListener("click", async () => {
            for (let s = 1; s <= 4; s++) {
                if (!validateStep(s)) {
                    setStep(s);
                    return;
                }
            }

            const formData = getFormData();
            showGlobalSpinner("Salvando e gerando link de assinatura...");
            try {
                const savedId = await captacaoService.saveCapture(formData, editId);
                const { signatureUrl } = await captacaoService.generateSignatureLink(savedId);
                navigator.clipboard.writeText(signatureUrl);
                showAlert(`Captação salva com sucesso!\n\nO link de assinatura foi copiado para a sua área de transferência:\n\n${signatureUrl}`, "Assinatura Pronta", () => {
                    window.location.hash = "#/home";
                });
            } catch (err) {
                showAlert("Erro ao salvar: " + err.message, "Erro");
            } finally {
                hideGlobalSpinner();
            }
        });
    }

    exports.views.form = {
        render: renderFormView,
        mount: mountFormView
    };
})(window.CaptaFacil);
