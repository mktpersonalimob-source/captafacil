// ==========================================================================
// View: Assinatura Eletrônica de Documento
// ==========================================================================

window.CaptaFacil = window.CaptaFacil || {};
window.CaptaFacil.views = window.CaptaFacil.views || {};

(function(exports) {
    const { db, fb } = exports.firebase;
    const { alert: showAlert } = exports.modal;

    function renderAssinaturaView() {
        return `
            <div class="flex items-center justify-center min-h-screen p-4">
                <div id="loading-view" class="text-center">
                    <div class="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-orange-500 mx-auto mb-4"></div>
                    <p class="text-lg text-gray-700 font-semibold">Verificando link de assinatura...</p>
                </div>

                <div id="error-view" class="hidden text-center max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-red-100">
                    <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                        <svg class="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h2 class="text-xl font-bold text-gray-800">Link Inválido ou Expirado</h2>
                    <p id="error-message" class="text-gray-600 mt-2 text-sm">Este link de assinatura não é válido ou já foi utilizado. Por favor, solicite um novo link ao seu corretor.</p>
                </div>

                <div id="success-view" class="hidden text-center max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-green-100">
                    <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                        <svg class="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 class="text-xl font-bold text-gray-800">Assinatura Registrada!</h2>
                    <p class="text-gray-600 mt-2 text-sm">Obrigado! Sua assinatura foi gravada com sucesso. Você já pode fechar esta janela com segurança.</p>
                </div>

                <div id="signature-view" class="hidden max-w-3xl w-full bg-white p-5 sm:p-8 rounded-3xl shadow-2xl border border-orange-100">
                    <header class="text-center mb-6">
                        <svg class="w-40 mx-auto mb-3" viewBox="0 0 215 40" xmlns="http://www.w3.org/2000/svg">
                            <rect x="1" y="1" width="38" height="38" rx="5" fill="#EA580C" />
                            <path d="M20 12l8 6v8H12v-8l8-6z" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
                            <text x="50" y="29" font-family="Inter, sans-serif" font-size="22" font-weight="800" fill="#374151" letter-spacing="-0.5px">Capta</text>
                            <text x="125" y="29" font-family="Inter, sans-serif" font-size="22" font-weight="800" fill="#EA580C" letter-spacing="-0.5px">Fácil</text>
                        </svg>
                        <h1 class="text-2xl font-black text-gray-800">Autorização de Captação</h1>
                        <p class="text-sm text-gray-600 mt-1">Por favor, confirme os dados do imóvel e assine abaixo.</p>
                    </header>

                    <div class="bg-gradient-to-r from-orange-50 via-white to-amber-50 p-4 rounded-2xl border border-orange-200 mb-5 shadow-sm">
                        <h3 class="font-bold text-gray-800 text-sm mb-3 flex items-center gap-2">
                            <span class="inline-flex h-6 w-6 items-center justify-center rounded-full bg-orange-100 text-orange-700">🏠</span>
                            Dados do Imóvel
                        </h3>
                        <div id="sig-property-details" class="grid gap-2 sm:grid-cols-2 text-xs text-gray-700 leading-relaxed">Carregando dados...</div>
                    </div>

                    <!-- Termo de Autorização -->
                    <div class="mb-5 flex justify-end">
                        <button id="btn-ver-termo" type="button" class="group inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-orange-200 bg-gradient-to-r from-orange-50 to-amber-50 text-orange-700 text-xs font-bold shadow-sm hover:shadow-md hover:border-orange-300 hover:from-orange-100 hover:to-amber-100 transition-all duration-200">
                            <span class="flex items-center justify-center w-7 h-7 rounded-lg bg-white text-orange-600 shadow-sm group-hover:scale-105 transition-transform">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.747 0-3.332.477-4.5 1.253z" />
                                </svg>
                            </span>
                            Ver termo
                        </button>
                    </div>

                    <div id="modal-termo" class="hidden fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
                        <div class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-orange-100">
                            <div class="flex justify-between items-center p-4 border-b border-gray-200 bg-gradient-to-r from-orange-50 via-amber-50 to-white">
                                <div class="flex items-center gap-3">
                                    <div class="flex items-center justify-center w-9 h-9 rounded-full bg-orange-100 text-orange-700">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.747 0-3.332.477-4.5 1.253z" />
                                        </svg>
                                    </div>
                                    <h3 class="text-base font-bold text-orange-900">Termo de Autorização</h3>
                                </div>
                                <button id="btn-fechar-termo" type="button" class="text-gray-400 hover:text-gray-600 text-2xl font-bold leading-none w-8 h-8 rounded-full hover:bg-white transition-colors">&times;</button>
                            </div>
                            <div class="p-5 max-h-[70vh] overflow-y-auto bg-gray-50/60">
                                <div id="sig-termo-text" class="text-xs text-gray-700 leading-relaxed whitespace-pre-wrap bg-white p-4 rounded-xl border border-orange-100 shadow-sm">
                                    Carregando termo...
                                </div>
                            </div>
                            <div class="border-t border-gray-200 px-5 py-4 flex justify-end bg-white">
                                <button id="btn-fechar-termo-acao" type="button" class="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl shadow-sm transition-colors">Fechar</button>
                            </div>
                        </div>
                    </div>

                    <div class="space-y-4">
                        <div>
                            <label for="sig-owner-name" class="block text-xs font-bold text-gray-700 uppercase mb-1">Nome Completo do Proprietário (Conforme Documento) *</label>
                            <input type="text" id="sig-owner-name" required class="block w-full rounded-xl border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 text-sm py-2.5 px-3" placeholder="Ex: João da Silva">
                        </div>
                        <div>
                            <label for="sig-owner-cpf" class="block text-xs font-bold text-gray-700 uppercase mb-1">CPF / CNPJ (Opcional)</label>
                            <input type="text" id="sig-owner-cpf" class="block w-full rounded-xl border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 text-sm py-2.5 px-3" placeholder="000.000.000-00">
                        </div>
                        <div>
                            <label class="block text-sm font-semibold text-gray-700">Assinatura Manual *</label>
                            <div class="relative mt-1">
                                <canvas id="signature-pad" class="w-full h-48 bg-white rounded-xl"></canvas>
                                <button id="btn-clear-signature" class="absolute top-2 right-2 text-xs bg-gray-100 hover:bg-red-50 text-gray-600 hover:text-red-600 font-semibold px-2 py-1 rounded border">Limpar</button>
                            </div>
                            <p class="text-xs text-gray-500 mt-1">Desenhe sua assinatura no quadro acima usando o mouse ou o dedo.</p>
                        </div>
                    </div>

                    <div class="mt-6">
                        <button id="btn-submit-sig" class="w-full flex justify-center items-center px-6 py-3.5 rounded-xl shadow-md text-base font-bold text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all">
                            Confirmar e Enviar Assinatura
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    function mountAssinaturaView() {
        let captureId = null;
        let isDrawing = false;
        let signaturePad = null;
        let ctx = null;

        const hash = window.location.hash || "";
        let token = null;
        if (hash.includes("token=")) {
            token = hash.split("token=")[1].split("&")[0];
        } else {
            token = new URLSearchParams(window.location.search).get("token");
        }

        const showView = (id) => {
            ["loading-view", "error-view", "success-view", "signature-view"].forEach(v => {
                const el = document.getElementById(v);
                if (el) el.classList.add("hidden");
            });
            const target = document.getElementById(id);
            if (target) target.classList.remove("hidden");
        };

        const showError = (msg) => {
            const errEl = document.getElementById("error-message");
            if (errEl) errEl.innerText = msg;
            showView("error-view");
        };

        const initializeCanvas = () => {
            signaturePad = document.getElementById('signature-pad');
            if (!signaturePad) return;
            ctx = signaturePad.getContext('2d');

            const ratio = Math.max(window.devicePixelRatio || 1, 1);
            signaturePad.width = signaturePad.offsetWidth * ratio;
            signaturePad.height = signaturePad.offsetHeight * ratio;
            ctx.scale(ratio, ratio);
            ctx.strokeStyle = '#1F2937';
            ctx.lineWidth = 2.5;

            function getEventPosition(event) {
                const rect = signaturePad.getBoundingClientRect();
                if (event.touches && event.touches.length > 0) {
                    return {
                        x: event.touches[0].clientX - rect.left,
                        y: event.touches[0].clientY - rect.top
                    };
                }
                return {
                    x: event.clientX - rect.left,
                    y: event.clientY - rect.top
                };
            }

            function startDrawing(e) {
                e.preventDefault();
                isDrawing = true;
                const { x, y } = getEventPosition(e);
                ctx.beginPath();
                ctx.moveTo(x, y);
            }

            function draw(e) {
                if (!isDrawing) return;
                e.preventDefault();
                const { x, y } = getEventPosition(e);
                ctx.lineTo(x, y);
                ctx.stroke();
            }

            function stopDrawing() {
                isDrawing = false;
                ctx.closePath();
            }

            signaturePad.addEventListener('mousedown', startDrawing);
            signaturePad.addEventListener('mousemove', draw);
            signaturePad.addEventListener('mouseup', stopDrawing);
            signaturePad.addEventListener('mouseleave', stopDrawing);

            signaturePad.addEventListener('touchstart', startDrawing, { passive: false });
            signaturePad.addEventListener('touchmove', draw, { passive: false });
            signaturePad.addEventListener('touchend', stopDrawing);

            document.getElementById('btn-clear-signature')?.addEventListener('click', () => {
                ctx.clearRect(0, 0, signaturePad.width, signaturePad.height);
            });

            const openTermModal = async () => {
                const modal = document.getElementById('modal-termo');
                const termoEl = document.getElementById('sig-termo-text');
                if (!modal) return;

                if (termoEl && !termoEl.dataset.loaded) {
                    try {
                        const termoText = window.CaptaFacil.pdfService && window.CaptaFacil.pdfService.fetchGlobalTermo
                            ? await window.CaptaFacil.pdfService.fetchGlobalTermo()
                            : `AUTORIZAÇÃO DE CAPTAÇÃO DE IMÓVEL\n\nPelo presente instrumento, o PROPRIETÁRIO autoriza a PERSONAL CONSULTORIA IMOBILIÁRIA a realizar a intermediação e divulgação para venda e/ou locação do imóvel descrito, concordando com as condições acordadas.`;
                        if (termoEl) {
                            termoEl.innerText = termoText;
                            termoEl.dataset.loaded = 'true';
                        }
                    } catch (error) {
                        console.warn('Erro ao carregar termo de autorização no clique:', error);
                        if (termoEl) {
                            termoEl.innerText = `AUTORIZAÇÃO DE CAPTAÇÃO DE IMÓVEL\n\nPelo presente instrumento, o PROPRIETÁRIO autoriza a PERSONAL CONSULTORIA IMOBILIÁRIA a realizar a intermediação e divulgação para venda e/ou locação do imóvel descrito, concordando com as condições acordadas.`;
                            termoEl.dataset.loaded = 'true';
                        }
                    }
                }

                modal.classList.remove('hidden');
            };

            const closeTermModal = () => {
                const modal = document.getElementById('modal-termo');
                if (modal) modal.classList.add('hidden');
            };

            document.getElementById('btn-ver-termo')?.addEventListener('click', openTermModal);
            document.getElementById('btn-fechar-termo')?.addEventListener('click', closeTermModal);
            document.getElementById('btn-fechar-termo-acao')?.addEventListener('click', closeTermModal);
            document.getElementById('modal-termo')?.addEventListener('click', (event) => {
                if (event.target && event.target.id === 'modal-termo') {
                    closeTermModal();
                }
            });
        };

        const isCanvasBlank = () => {
            if (!signaturePad || !ctx) return true;
            const pixelBuffer = new Uint32Array(ctx.getImageData(0, 0, signaturePad.width, signaturePad.height).data.buffer);
            return !pixelBuffer.some(color => color !== 0);
        };

        const getPublicIp = async () => {
            try {
                const res = await fetch('https://www.cloudflare.com/cdn-cgi/trace');
                const txt = await res.text();
                const line = txt.split('\n').find(l => l.startsWith('ip='));
                if (line) return line.substring(3);
            } catch (e) {}
            try {
                const res = await fetch('https://ipinfo.io/ip');
                if (res.ok) return await res.text();
            } catch (e) {}
            return 'N/A';
        };

        const submitSignature = async () => {
            const ownerName = document.getElementById('sig-owner-name')?.value.trim();
            const ownerCpf = document.getElementById('sig-owner-cpf')?.value.trim();

            if (!ownerName) {
                showAlert('Por favor, informe seu nome completo.', 'Atenção');
                return;
            }

            if (isCanvasBlank()) {
                showAlert('Por favor, desenhe sua assinatura no quadro.', 'Atenção');
                return;
            }

            const btn = document.getElementById('btn-submit-sig');
            btn.disabled = true;
            btn.innerText = 'Gravando assinatura...';

            try {
                const clientIp = await getPublicIp();
                const deviceInfo = { userAgent: navigator.userAgent };
                const signatureImage = signaturePad.toDataURL('image/png');

                const batch = db.batch();
                const signatureRef = db.collection('assinaturas').doc();

                batch.set(signatureRef, {
                    captureId: captureId,
                    ownerName: ownerName,
                    ownerCpf: ownerCpf,
                    signatureImage: signatureImage,
                    signedAt: fb.firestore.FieldValue.serverTimestamp(),
                    clientIp: clientIp,
                    deviceInfo: deviceInfo,
                    _token: token
                });

                const captureRef = db.collection('captacoes').doc(captureId);
                batch.update(captureRef, {
                    signatureId: signatureRef.id,
                    signatureStatus: 'signed',
                    signatureToken: fb.firestore.FieldValue.delete(),
                    signatureTokenExpires: fb.firestore.FieldValue.delete()
                });

                const linkRef = db.collection('signature_links').doc(token);
                batch.update(linkRef, { usedAt: fb.firestore.FieldValue.serverTimestamp() });

                await batch.commit();
                showView('success-view');

            } catch (error) {
                console.error("Erro ao enviar assinatura:", error);
                showError(`Ocorreu um erro ao enviar sua assinatura: ${error.message}. Tente novamente.`);
                btn.disabled = false;
                btn.innerText = 'Confirmar e Enviar Assinatura';
            }
        };

        const validateToken = async () => {
            if (!token) {
                showError('Token de assinatura não encontrado ou inválido.');
                return;
            }

            try {
                const linkRef = db.collection('signature_links').doc(token);
                const linkDoc = await linkRef.get();

                if (!linkDoc.exists) {
                    showError('Este link de assinatura é inválido ou não existe mais.');
                    return;
                }

                const data = linkDoc.data();
                captureId = data.captureId;

                if (data.usedAt) {
                    showError('Este link já foi utilizado para uma assinatura registrada.');
                    return;
                }

                if (data.expiresAt) {
                    const expires = data.expiresAt.toDate();
                    if (new Date() > expires) {
                        showError('Este link de assinatura expirou (validade de 48 horas excedida).');
                        return;
                    }
                }

                const detailsEl = document.getElementById('sig-property-details');
                let detailsHtml = `<p><span class="font-bold text-gray-800">Endereço:</span> ${data.propertyAddress}</p>`;
                if (data.imovelComplemento) detailsHtml += `<p><span class="font-bold text-gray-800">Complemento:</span> ${data.imovelComplemento}</p>`;
                if (data.imovelAndar) detailsHtml += `<p><span class="font-bold text-gray-800">Andar:</span> ${data.imovelAndar}</p>`;
                if (data.codigoImovel) detailsHtml += `<p><span class="font-bold text-blue-700 font-mono">Código do Imóvel:</span> <span class="font-bold font-mono">${data.codigoImovel}</span></p>`;
                if (data.tipoCaptacao) detailsHtml += `<p><span class="font-bold text-gray-800">Modalidade:</span> ${data.tipoCaptacao}</p>`;

                if (data.valorVenda && data.valorVenda !== 'R$ 0,00') {
                    detailsHtml += `<p><span class="font-bold text-orange-700">Valor de Venda:</span> <span class="font-bold">${data.valorVenda}</span></p>`;
                }
                if (data.valorLocacao && data.valorLocacao !== 'R$ 0,00') {
                    detailsHtml += `<p><span class="font-bold text-blue-700">Valor Aluguel Residencial:</span> <span class="font-bold">${data.valorLocacao}</span></p>`;
                }
                if (data.valorAluguelComercial && data.valorAluguelComercial !== 'R$ 0,00') {
                    detailsHtml += `<p><span class="font-bold text-indigo-700">Valor Aluguel Comercial:</span> <span class="font-bold">${data.valorAluguelComercial}</span></p>`;
                }

                if (detailsEl) detailsEl.innerHTML = detailsHtml;

                const nameInput = document.getElementById('sig-owner-name');
                const cpfInput = document.getElementById('sig-owner-cpf');
                if (nameInput) nameInput.value = data.ownerName || '';
                if (cpfInput) {
                    cpfInput.value = data.ownerCpf || '';
                    cpfInput.addEventListener('input', (e) => {
                        let v = e.target.value.replace(/\D/g, '');
                        if (v.length <= 11) {
                            v = v.replace(/(\d{3})(\d)/, '$1.$2');
                            v = v.replace(/(\d{3})(\d)/, '$1.$2');
                            v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
                        } else {
                            v = v.substring(0, 14);
                            v = v.replace(/^(\d{2})(\d)/, '$1.$2');
                            v = v.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
                            v = v.replace(/\.(\d{3})(\d)/, '.$1/$2');
                            v = v.replace(/(\d{4})(\d)/, '$1-$2');
                        }
                        e.target.value = v;
                    });
                }

                showView('signature-view');
                initializeCanvas();
                document.getElementById('btn-submit-sig')?.addEventListener('click', submitSignature);

            } catch (error) {
                console.error("Erro ao validar token:", error);
                showError(`Falha ao verificar link: ${error.message}`);
            }
        };

        validateToken();
    }

    exports.views.assinatura = {
        render: renderAssinaturaView,
        mount: mountAssinaturaView
    };
})(window.CaptaFacil);
