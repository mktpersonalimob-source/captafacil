// ==========================================================================
// Serviço Centralizado de Geração de PDF (Ficha de Captação A4)
// ==========================================================================

window.CaptaFacil = window.CaptaFacil || {};

(function(exports) {
    const { db } = exports.firebase;
    const { show: showGlobalSpinner, hide: hideGlobalSpinner } = exports.loading;
    const { alert: showAlert } = exports.modal;

    let termoAutorizacaoGlobal = 'Todos os dados pessoais serão tratados pela Personal Consultoria Imobiliária de acordo com a Lei Geral de Proteção de Dados Pessoais (Lei n.º 13.709, de 14 de agosto de 2018). Os dados constantes neste cadastro são necessários e utilizados somente para o fim de comercialização/locação do imóvel acima descrito, incluindo sua divulgação em portais imobiliários, sites e demais meios de publicidade.\n\nEstou ciente que sou responsável pelas informações, valores e disponibilidade do imóvel conforme informado nesta ficha, e quaisquer alterações, principalmente após iniciada a negociação com possíveis locatários ou compradores, pode gerar obrigação de cumprir a oferta e até gerar dano moral ao consumidor.';

    async function fetchGlobalTermo() {
        try {
            const docRef = db.collection('configuracoes').doc('textos');
            const doc = await docRef.get();
            if (doc.exists && doc.data().termoAutorizacao) {
                termoAutorizacaoGlobal = doc.data().termoAutorizacao;
            }
        } catch (error) {
            console.warn("Erro ao buscar termo de autorização, usando padrão.", error);
        }
        return termoAutorizacaoGlobal;
    }

    function parseUserAgent(ua) {
        if (!ua) return 'Não registrado';
        let browser = 'Navegador desconhecido';
        let os = 'SO desconhecido';

        if (/firefox/i.test(ua)) browser = `Firefox ${ua.match(/Firefox\/([0-9.]+)/)?.[1] || ''}`;
        else if (/edg/i.test(ua)) browser = `Edge ${ua.match(/Edg\/([0-9.]+)/)?.[1] || ''}`;
        else if (/chrome/i.test(ua) && !/chromium/i.test(ua)) browser = `Chrome ${ua.match(/Chrome\/([0-9.]+)/)?.[1] || ''}`;
        else if (/safari/i.test(ua) && !/chrome/i.test(ua)) browser = `Safari ${ua.match(/Version\/([0-9.]+)/)?.[1] || ''}`;

        if (/windows/i.test(ua)) os = 'Windows';
        else if (/macintosh/i.test(ua)) os = 'macOS';
        else if (/android/i.test(ua)) os = 'Android';
        else if (/iphone|ipad|ipod/i.test(ua)) os = 'iOS';
        else if (/linux/i.test(ua)) os = 'Linux';

        return `${browser} em ${os}`.trim();
    }

    function ensurePrintContainer() {
        let container = document.getElementById('print-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'print-container';
            container.innerHTML = `
                <div class="pdf-header" style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #000; padding-bottom: 5px; margin-bottom: 10px;">
                    <!-- Logotipo Oficial da Personal Consultoria Imobiliária com Cores Vivas -->
                    <svg style="height: 30px; width: auto;" viewBox="0 0 611.13 115.33" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <style>
                              .cls-1-personal-about { fill: #062e47; }
                              .cls-2-personal-about { fill: #eb942e; }
                              .cls-3-personal-about { fill: #062e46; }
                              .cls-4-personal-about { fill: #a93a39; }
                              .cls-5-personal-about { fill: #fff7c7; }
                              .cls-6-personal-about { fill: #082d46; }
                            </style>
                        </defs>
                        <g>
                            <g>
                                <g>
                                    <polygon class="cls-4-personal-about" points="54.82 0 92.71 23.25 92.71 83.19 54.82 83.19 54.82 0"/>
                                    <polygon class="cls-5-personal-about" points="54.82 0 16.94 23.25 16.94 83.19 54.82 83.19 54.82 0"/>
                                    <path class="cls-4-personal-about" d="m48.44,15.64c-.52-.78-1.65-2.48-3.69-3.13-1.53-.49-3-.2-4,0-2.1.43-3.56,1.32-4,1.59-2.72,1.66-9.56,5.53-18.65,10.74-.08,19.4.08,38.94,0,58.35,3.3.05,6.61,0,9.91.05.05-8.22-.02-16.53.03-24.75,2.31-.06,7.56-.52,12.64-4.1,4.67-3.3,6.66-7.47,8.13-10.66,5.83-12.67,1.97-24.58-.36-28.09Zm-15.15,28.41c-.79.48-2.44,1.3-4.88,1.35.01-4.73.03-9.46.04-14.19.82-.66,2.41-1.73,4.58-1.88.89-.07,2.17-.16,3.25.62,1.24.9,1.49,2.43,1.64,3.41.49,3.26-.56,8.25-4.61,10.69Z"/>
                                    <g>
                                        <polygon class="cls-2-personal-about" points="16.92 23.25 16.92 83.19 18.69 83.19 18.69 22.17 16.92 23.25"/>
                                        <polygon class="cls-2-personal-about" points="20.9 20.81 20.9 83.19 22.68 83.19 22.68 19.72 20.9 20.81"/>
                                        <polygon class="cls-2-personal-about" points="24.95 18.33 24.95 83.19 26.72 83.19 26.72 17.24 24.95 18.33"/>
                                        <polygon class="cls-2-personal-about" points="28.94 15.88 28.94 83.19 30.71 83.19 30.71 14.79 28.94 15.88"/>
                                        <polygon class="cls-2-personal-about" points="33.08 13.34 33.08 83.19 34.86 83.19 34.86 12.25 33.08 13.34"/>
                                        <polygon class="cls-2-personal-about" points="37.07 10.89 37.07 83.19 38.84 83.19 38.84 9.8 37.07 10.89"/>
                                        <polygon class="cls-2-personal-about" points="41.12 8.4 41.12 83.19 42.89 83.19 42.89 7.31 41.12 8.4"/>
                                        <polygon class="cls-2-personal-about" points="45.11 5.95 45.11 83.19 46.88 83.19 46.88 4.86 45.11 5.95"/>
                                        <polygon class="cls-2-personal-about" points="49.04 3.54 49.04 83.19 50.82 83.19 50.82 2.45 49.04 3.54"/>
                                        <polygon class="cls-2-personal-about" points="53.03 83.19 54.81 83.19 54.81 0 53.03 1.09 53.03 83.19"/>
                                    </g>
                                </g>
                                <g>
                                    <g>
                                        <path class="cls-1-personal-about" d="m227.71,82.17h16.6c2.07-6.14,4.13-12.27,6.2-18.41.39-1.21,1.95-5.58,6.2-7.82,1.02-.54,3.15-1.66,5.87-1.24,1.29.2,2.28.68,2.91,1.05,2.89-3.28,5.77-6.56,8.66-9.85-1.07-.58-2.83-1.36-5.13-1.65-3.4-.42-5.99.51-7.06.91-4.78,1.77-7.35,5.39-8.25,6.82.83-2.29,1.65-4.58,2.48-6.87h-15.16c-4.43,12.35-8.87,24.7-13.3,37.05Z"/>
                                        <path class="cls-1-personal-about" d="m266.72,72.01c5.44-.24,10.87-.48,16.31-.72.13.68.45,1.76,1.29,2.77,1.08,1.29,2.41,1.73,3.18,1.99,1.23.41,2.22.42,3.04.43,1.97.02,3.4-.44,3.76-.55.65-.22,1.56-.53,2.54-1.27.68-.51,1.59-1.2,1.93-2.41.09-.33.3-1.04,0-1.76-.32-.77-1.03-1.18-1.96-1.57-2.46-1.04-4.39-1.19-4.39-1.19s-3.39-.26-7.92-1.19c-5.22-1.07-6.94-2.55-7.39-2.96-.68-.61-1.61-1.45-2.15-2.86-1.38-3.59,1.15-7.3,1.76-8.2,1.33-1.96,2.86-2.96,4.43-4.01,4.64-3.06,9.32-3.63,11.4-3.86.9-.1,1.75-.13,3.43-.19,4.59-.17,7.88.07,8.87.14,3.96.31,5.97.48,7.82,1.43.88.45,2.65,1.39,4.01,3.43,1.05,1.57,1.39,3.1,1.53,4.01-5.21.3-10.43.6-15.64.91-.09-.48-.35-1.46-1.17-2.24-.32-.3-.72-.58-1.43-.86-2.46-.97-4.89-.55-5.9-.36-.96.18-1.75.33-2.68.86-.74.42-1.89,1.06-2.36,2.41-.08.22-.69,1.96.38,3.15.69.76,1.68.85,1.96.86,2.58.1,5.15.19,7.73.29,3.77.09,6.66.83,8.53,1.46,2.33.78,3.37,1.49,4.15,2.27.37.36,1.7,1.77,2.2,3.9.98,4.19-2.05,7.88-3.05,9.11-1.95,2.38-4.1,3.48-6.34,4.63-4.05,2.07-7.61,2.63-9.49,2.91-2.03.3-4.16.3-8.44.29-4.61,0-6.8-.27-8.2-.48-2.63-.39-3.95-.59-5.48-1.34-1.02-.49-4.17-2.02-5.58-5.53-.59-1.47-.68-2.81-.67-3.67Z"/>
                                        <path class="cls-1-personal-about" d="m390.61,45.02c4.91-.02,9.82-.05,14.74-.07-.43,2.07-.86,4.15-1.29,6.22,1.98-1.85,4.53-3.71,8.58-5.2,3.14-1.16,5.5-1.62,6.15-1.67,2.31-.18,7.29-.43,11.02,2,.98.64,2.45,2.03,3.34,4.05,1,2.26,.43,4.72,.1,6.13-1.09,4.58-4.28,14.2-9.16,26.73-5.72.02-11.42-.02-17.14,0,1.98-4.76,3.82-9.48,5.7-14.64.98-2.68,1.91-5.33,2.79-7.94.07-.29.66-3.01-1-4.58-.74-.7-1.61-.87-2.36-1-2.64-.48-4.86.68-5.72,1.14-2.56,1.38-3.88,3.48-4.43,4.51-.9,2.18-1.78,4.42-2.65,6.72-2.04,5.42-4.05,10.73-5.56,15.78-5.56.02-10.85,0-16.4.02,4.43-12.49,8.87-25.73,13.3-38.22Z"/>
                                        <path class="cls-1-personal-about" d="m488.98,83.22c6.04-17.2,12.46-35.07,18.5-52.26,5.66-.06,11.2.06,16.86,0-5.94,17.24-12.1,35.02-18.05,52.26-5.75.02-11.56-.02-17.31,0Z"/>
                                        <path class="cls-1-personal-about" d="m175.07,35.43c-1.52-2.38-4.86-4.58-12.01-4.2h-33.19l-18.47,51.98h19.09l6.15-19.36c40.63,4.6,42.54-21.17,38.43-28.42Zm-19.07,16.48c-2.52,2.1-5.57,1.93-6.37,1.86-3-.02-6.01-.05-9.01-.07,1.45-4.22,2.91-8.44,4.36-12.66,2.72.02,5.44.05,8.15.07.24,0,4.02.06,5.51,2.72,1.58,2.82-.63,6.4-2.65,8.08Z"/>
                                        <path class="cls-1-personal-about" d="m225.52,65.71c.76-1.74,1.83-4.82,1.72-8.73-.07-2.34-.19-6.28-2.86-9.44-3.36-3.97-8.83-4.41-10.87-4.58,0,0-1.83-.02-5.47-.07-3.02-.04-4.56-.06-5.83.07-2.51.25-4.34.83-5.44,1.14-3.45.99-12.25,3.53-17.88,11.59-.96,1.37-2.71,3.93-3.58,7.73-.46,2-1.98,8.64,1.86,13.59,3.03,3.91,7.5,5.27,9.59,5.65,1.41.26,3.49.5,6.94.55,3.25.04,5.39.07,7.9-.21,1.81-.2,5.59-1.38,9.62-3.12,5.04-2.18,8.53-5.51,10.73-8.15-5.48-.38-10.97-.76-16.45-1.14-.57.87-2.29,3.26-5.44,4.15-3.09.87-7.18.19-8.87-2.29-.43-.63-.62-1.27-.72-1.57-.72-2.43.21-4.57.57-5.29,11.49.05,22.99.1,34.48.14Zm-28.96-11.5c3.94-3.68,10.59-4.27,13.32-1.76.58.53.96,1.19,1.05,1.34,1.3,2.26.76,4.71.52,5.58-6.01.02-12.02.03-18.03.05.85-2.83,2.33-4.45,3.14-5.21Z"/>
                                        <path class="cls-1-personal-about" d="m374.44,51.07c-2.45-4.64-8.11-7.14-11.84-7.86-1.88-.36-4.02-.41-5.63-.44-3.58-.08-6.6.21-8.16.44-13.09,1.94-20.72,11.56-20.72,11.56-1.71,2.16-4.08,5.23-4.91,9.93-.3,1.73-1.4,7.98,2.38,12.75,2.69,3.4,6.55,4.4,9.02,5.04,2.46.64,4.42.65,7.44.67.69,0,5.1.02,8.81-.67,2.43-.45,11.72-2.16,18.19-10.08.72-.88,10.04-12.59,5.41-21.35Zm-18.73,16.98c-3.43,4.21-10.31,7.23-14.02,4.48-3.78-2.8-3-10.66.67-15.21,3.75-4.65,11.43-7,14.94-3.83,3.39,3.06,1.83,10.36-1.58,14.56Z"/>
                                        <path class="cls-1-personal-about" d="m486.25,48.46c-1.91-2.59-5.2-3.28-8.3-3.93-1.81-.38-4.14-.38-8.73-.36-4.18.02-6.27.03-9.01.36-1.94.23-4.91.59-7.58,1.5-2.26.77-7.23,2.92-11.8,9.44,5.03.38,10.06.76,15.09,1.14.58-.94,2.14-3.17,5.08-4.36,0,0,4.04-1.63,9.01.57.48.21,1.11.54,1.5,1.22.62,1.06,.39,2.51-.29,3.5-.47.69-1.08,1.05-1.43,1.22-2.17.29-19.45,2.65-26.75,5.08-.69.23-2.14.74-3.79,1.79-1.63,1.03-4.86,3.07-6.01,6.93-.29.96-1.31,4.93.93,7.58.83.98,1.76,1.38,3.08,1.93,2.91,1.21,5.42,1.2,9.01,1.14,2.31-.04,4.74-.09,7.88-.88.66-.17,2.63-.68,5.07-1.77,2.57-1.15,4.58-2.45,6.01-3.5-.33,1.74-.67,3.48-1,5.22,5.34-.02,10.68-.05,16.02-.07-.28-.74-.62-1.88-.72-3.29-.16-2.24.37-3.99.79-5.22,1.83-5.43,5.28-12.54,5.72-13.44.21-.43,3.54-7.29.21-11.79Zm-20.42,22.37c-4.22,5.58-13.66,6.55-15.81,3.68-.71-.95-.54-2.21-.5-2.47.39-2.8,3.92-4.31,5.22-4.86,2.07-.89,3.25-.82,6.94-1.43,2.82-.46,5.06-.98,6.44-1.32-.12,1.6-.56,4.12-2.29,6.4Z"/>
                                    </g>
                                    <g>
                                        <path class="cls-3-personal-about" d="m125.18,110.16c-.86,2.87-2.6,5.17-6.57,5.17-4.66,0-7.27-3.84-7.27-8.74s2.91-8.82,7.35-8.82c4.06,0,5.94,2.55,6.54,5.3h-1.67c-.71-1.99-1.97-3.64-4.89-3.64-3.46,0-5.62,2.99-5.62,7.1s2.17,7.15,5.64,7.15c2.88,0,4.01-1.48,4.85-3.52h1.63Z"/>
                                        <path class="cls-3-personal-about" d="m142.1,109.02c0,3.2-1.72,6.28-5.32,6.28-3.32,0-5.23-2.98-5.23-6.26,0-3.45,2.03-6.3,5.32-6.3s5.23,3.08,5.23,6.28Zm-8.98.02c0,2.38,1.33,4.72,3.72,4.72s3.69-2.17,3.69-4.71-1.36-4.77-3.75-4.77-3.66,2.21-3.66,4.76Z"/>
                                        <path class="cls-3-personal-about" d="m148.94,106.08c0-1,0-2.1-.02-3h1.47c.04.43.06,1.49.07,2.4.43-1.24,1.53-2.73,3.75-2.73,2.34,0,3.9,1.69,3.9,5.01v7.21h-1.53v-6.87c0-2.13-.69-3.79-2.7-3.79-2.29,0-3.42,2.08-3.42,5.02v5.64h-1.52v-8.9Z"/>
                                        <path class="cls-3-personal-about" d="m166.18,111.39c.39,1.57,1.52,2.47,3.49,2.47,2.11,0,2.89-.89,2.89-2.09,0-1.09-.53-1.87-3.26-2.24-3.47-.49-4.18-1.88-4.18-3.37s1.01-3.4,4.16-3.4c3.48,0,4.39,2.17,4.48,3.51h-1.54c-.16-.76-.59-2.08-3.04-2.08-2.07,0-2.52,1.07-2.52,1.82,0,1,.52,1.6,2.96,1.97,3.71.56,4.47,1.87,4.47,3.67,0,2.13-1.38,3.66-4.52,3.66s-4.59-1.49-4.95-3.92h1.55Z"/>
                                        <path class="cls-3-personal-about" d="m189.57,111.5c0,1.16,0,2.31.02,3.47h-1.46c-.04-.33-.07-1.26-.08-2.19-.51,1.47-1.46,2.53-3.7,2.53s-3.81-1.35-3.81-4.81v-7.41h1.52v7.07c0,1.86.63,3.57,2.59,3.57,2.36,0,3.39-1.61,3.39-5.29v-5.34h1.52v8.43Z"/>
                                        <path class="cls-3-personal-about" d="m197.21,114.98v-17.83h1.52v17.83h-1.52Z"/>
                                        <path class="cls-3-personal-about" d="m205.23,103.08h2.07v-3.92h1.52v3.92h2.72v1.48h-2.72v6.95c0,1.47.33,2.11,1.47,2.11.3,0,.74-.02,1.03-.11v1.37c-.43.19-.9.2-1.43.2-1.98,0-2.59-1.05-2.59-3.4v-7.13h-2.07v-1.48Z"/>
                                        <path class="cls-3-personal-about" d="m227.56,109.02c0,3.2-1.72,6.28-5.32,6.28-3.32,0-5.23-2.98-5.23-6.26,0-3.45,2.03-6.3,5.32-6.3s5.23,3.08,5.23,6.28Zm-8.98.02c0,2.38,1.33,4.72,3.72,4.72s3.69-2.17,3.69-4.71-1.36-4.77-3.75-4.77-3.66,2.21-3.66,4.76Z"/>
                                        <path class="cls-3-personal-about" d="m234.41,106.31c0-1.07,0-2.16-.02-3.24h1.47c.03.33.07,1.56.07,2.77.68-1.9,2.21-3.1,4.15-3.09v1.76c-2.34-.03-4.15,1.78-4.15,5.32v5.15h-1.52v-8.66Z"/>
                                        <path class="cls-3-personal-about" d="m246.37,97.14h1.52v2.59h-1.52v-2.59Zm0,5.93h1.52v11.9h-1.52v-11.9Z"/>
                                        <path class="cls-3-personal-about" d="m264.08,112.15c0,1.04.06,2.55.1,2.83h-1.45c-.08-.48-.12-1.45-.12-1.86-.53,1.29-1.67,2.19-3.88,2.19-2.89,0-3.92-2.05-3.92-3.8,0-3.02,2.36-3.86,5.22-3.86h2.57v-.71c0-1.4-.51-2.74-2.86-2.74-2.1,0-2.6,1.12-2.82,2.33h-1.52c.13-1.61,1.04-3.77,4.35-3.77s4.34,2.02,4.34,3.98v5.42Zm-1.49-3.15c-.34,0-1.01,0-2.52,0-2.52,0-3.75.64-3.75,2.42,0,1.31.81,2.41,2.64,2.41,2.96,0,3.64-2.11,3.64-4.21v-.61Z"/>
                                        <path class="cls-3-personal-about" d="m284.01,98.13v16.85h-1.61v-16.85h1.61Z"/>
                                        <path class="cls-3-personal-about" d="m291.79,106.15c0-1.02,0-2.04-.02-3.07h1.48c.04.49.06,1.21.05,1.89.51-1.07,1.49-2.22,3.32-2.22,1.63,0,2.67.95,3.12,2.38.54-1.07,1.49-2.38,3.5-2.38s3.57,1.32,3.57,4.83v7.4h-1.51v-7.32c0-1.49-.4-3.35-2.35-3.35-1.74,0-2.89,1.42-2.89,4.16v6.51h-1.51v-7.44c0-1.5-.43-3.23-2.36-3.23-2.08,0-2.88,1.95-2.88,4.38v6.3h-1.51v-8.83Z"/>
                                        <path class="cls-3-personal-about" d="m324.19,109.02c0,3.2-1.72,6.28-5.32,6.28-3.32,0-5.23-2.98-5.23-6.26,0-3.45,2.03-6.3,5.32-6.3s5.23,3.08,5.23,6.28Zm-8.98.02c0,2.38,1.33,4.72,3.72,4.72s3.69-2.17,3.69-4.71-1.36-4.77-3.75-4.77-3.66,2.21-3.66,4.76Z"/>
                                        <path class="cls-3-personal-about" d="m331.09,97.14h1.52v7.93c.51-.98,1.63-2.33,3.87-2.33,2.85,0,4.85,2.63,4.85,6.08,0,3.96-2.06,6.48-4.94,6.48-2.24,0-3.27-1.18-3.8-2.32-.02.66-.02,1.53-.06,1.99h-1.46c.02-1.44.02-2.76.02-4.13v-13.7Zm8.67,11.73c0-2.13-1.04-4.56-3.56-4.56s-3.67,2.07-3.67,4.69c0,2.95,1.46,4.72,3.68,4.72,2.56,0,3.55-2.37,3.55-4.85Z"/>
                                        <path class="cls-3-personal-about" d="m348.16,97.14h1.52v2.59h-1.52v-2.59Zm0,5.93h1.52v11.9h-1.52v-11.9Z"/>
                                        <path class="cls-3-personal-about" d="m357.43,114.98v-17.83h1.52v17.83h-1.52Z"/>
                                        <path class="cls-3-personal-about" d="m366.68,97.14h1.52v2.59h-1.52v-2.59Zm0,5.93h1.52v11.9h-1.52v-11.9Z"/>
                                        <path class="cls-3-personal-about" d="m384.38,112.15c0,1.04.06,2.55.1,2.83h-1.45c-.08-.48-.12-1.45-.12-1.86-.53,1.29-1.67,2.19-3.88,2.19-2.89,0-3.92-2.05-3.92-3.8,0-3.02,2.36-3.86,5.22-3.86h2.57v-.71c0-1.4-.51-2.74-2.86-2.74-2.1,0-2.6,1.12-2.82,2.33h-1.52c.13-1.61,1.04-3.77,4.35-3.77s4.34,2.02,4.34,3.98v5.42Zm-1.49-3.15c-.34,0-1.01,0-2.52,0-2.52,0-3.75.64-3.75,2.42,0,1.31.81,2.41,2.64,2.41,2.96,0,3.64-2.11,3.64-4.21v-.61Zm.67-12.1l-3.18,3.82h-1.5l2.79-3.82h1.88Z"/>
                                        <path class="cls-3-personal-about" d="m392.15,106.31c0-1.07,0-2.16-.02-3.24h1.47c.03.33.07,1.56.07,2.77.68-1.9,2.21-3.1,4.15-3.09v1.76c-2.34-.03-4.15,1.78-4.15,5.32v5.15h-1.52v-8.66Z"/>
                                        <path class="cls-3-personal-about" d="m404.11,97.14h1.52v2.59h-1.52v-2.59Zm0,5.93h1.52v11.9h-1.52v-11.9Z"/>
                                        <path class="cls-3-personal-about" d="m421.82,112.15c0,1.04.06,2.55.1,2.83h-1.45c-.08-.48-.12-1.45-.12-1.86-.53,1.29-1.67,2.19-3.88,2.19-2.89,0-3.92-2.05-3.92-3.8,0-3.02,2.36-3.86,5.22-3.86h2.57v-.71c0-1.4-.51-2.74-2.86-2.74-2.1,0-2.6,1.12-2.82,2.33h-1.52c.13-1.61,1.04-3.77,4.35-3.77s4.34,2.02,4.34,3.98v5.42Zm-1.49-3.15c-.34,0-1.01,0-2.52,0-2.52,0-3.75.64-3.75,2.42,0,1.31.81,2.41,2.64,2.41,2.96,0,3.64-2.11,3.64-4.21v-.61Z"/>
                                    </g>
                                </g>
                                <g>
                                    <path class="cls-1-personal-about" d="m531.47,98.6h13.46c10.41-24.45,20.82-48.9,31.22-73.35h-11.23c-8.02,4.17-16.04,8.34-24.06,12.51,1.48,3.04,2.96,6.08,4.44,9.12,3.52-1.92,7.04-3.84,10.57-5.76-8.14,19.16-16.27,38.32-24.41,57.49Z"/>
                                    <g>
                                        <path class="cls-1-personal-about" d="m555.12,96.34l-1.05,2.24h-3.12l5.55-10.78h3.92l1.12,10.78h-3.01l-.19-2.24h-3.22Zm3.19-2.23c-.14-1.64-.24-3.18-.27-4.18h-.04c-.48,1.18-1.16,2.62-1.91,4.18h2.22Z"/>
                                        <path class="cls-1-personal-about" d="m562.17,98.58l2.28-10.78h3.68c.54,2.66,1.3,5.87,1.46,7.34h.05c.16-1.22.55-3.23.92-4.95l.5-2.38h2.78l-2.28,10.78h-3.5c-.46-2.19-1.38-6.32-1.52-7.71h-.04c-.18,1.32-.6,3.3-1,5.2l-.53,2.51h-2.79Z"/>
                                        <path class="cls-1-personal-about" d="m584.51,92.16c0,3.23-1.77,6.61-6.18,6.61-3.15,0-4.5-2.01-4.5-4.41,0-3.24,1.98-6.77,6.09-6.77,3.18,0,4.6,2.06,4.6,4.56Zm-7.58,2.26c0,1.29.52,2.17,1.73,2.17,2.07,0,2.81-2.85,2.81-4.62,0-1.2-.41-2.19-1.7-2.19-1.94,0-2.84,2.79-2.84,4.64Z"/>
                                        <path class="cls-1-personal-about" d="m587.57,95.21c.07.87.62,1.47,1.74,1.47.89,0,1.43-.31,1.43-1.09,0-.69-.49-1.04-1.77-1.46-2.3-.75-3.22-1.64-3.22-3.08,0-1.96,1.44-3.46,4.34-3.46,2.63,0,4.26,1.22,4.29,3.31h-2.94c-.02-.49-.23-1.2-1.41-1.2-.71,0-1.23.3-1.23.96,0,.51.39.83,1.66,1.24,2.41.78,3.41,1.74,3.41,3.32,0,2.05-1.5,3.55-4.75,3.55-2.97,0-4.44-1.39-4.5-3.57h2.94Z"/>
                                    </g>
                                    <path class="cls-1-personal-about" d="m588.13,25.4h17.51l5.49-10.03h-29.57s-13,31.32-13,31.32c2.78-2.48,6.44-4,10.46-4,8.67,0,15.7,7.03,15.7,15.7s-7.03,15.7-15.7,15.7-18.24-8.81-18.24-8.81l-4.54,10.57s7.2,10.59,22.69,10.59,28.05-12.56,28.05-28.05c0-12.8-8.57-23.59-20.29-26.96-.01,0-.53.91-1.12,1.97-.8,1.43-1.73,3.11-1.73,3.11l4.29-11.12Z"/>
                                    <g>
                                        <path class="cls-2-personal-about" d="m589.74,34l-.61,1.4c12.7,5.57,18.56,20.6,13,33.29-5.57,12.7-20.6,18.56-33.29,13l-.61,1.4c13.46,5.9,29.4-.32,35.3-13.78,5.9-13.46-.32-29.4-13.78-35.3Z"/>
                                        <path class="cls-2-personal-about" d="m588.6,36.6l-.56,1.27c11.34,4.97,16.58,18.4,11.61,29.74-4.97,11.34-18.4,16.58-29.74,11.61l-.56,1.27c12.03,5.28,26.28-.28,31.56-12.32,5.28-12.04-.28-26.28-12.32-31.56Z"/>
                                        <path class="cls-2-personal-about" d="m587.5,39.11l-.56,1.29c9.95,4.36,14.55,16.14,10.19,26.09-4.36,9.95-16.14,14.55-26.09,10.19l-.56,1.29c10.66,4.67,23.27-.25,27.94-10.91,4.67-10.66-.25-23.27-10.91-27.94Z"/>
                                        <path class="cls-2-personal-about" d="m586.41,41.61l-.56,1.29c8.58,3.76,12.55,13.92,8.79,22.51s-13.92,12.55-22.51,8.79l-.56,1.29c9.29,4.07,20.29-.22,24.36-9.51,4.07-9.29-.22-20.29-9.51-24.36Z"/>
                                    </g>
                                </g>
                            </g>
                        </g>
                    </svg>
                    <div style="font-size: 16px; font-weight: bold; text-transform: uppercase; text-align: right;">Ficha de Captação</div>
                </div>

                <div class="pdf-section-title">INFORMAÇÕES DE CONTROLE</div>
                <div class="pdf-row top-border">
                    <div class="pdf-cell" style="flex: 2;"><span class="pdf-label">CORRETOR RESPONSÁVEL</span><span class="pdf-value out-corretor-nome"></span></div>
                    <div class="pdf-cell"><span class="pdf-label">CÓDIGO DO IMÓVEL</span><span class="pdf-value out-codigo-imovel"></span></div>
                    <div class="pdf-cell" style="flex: 0.5; flex-direction: row; align-items: center; gap: 4px; justify-content: center; padding-top: 3px; padding-bottom: 3px;">
                        <span class="pdf-label" style="margin-bottom: 0;">FOTO</span>
                        <div class="out-tem-foto" style="width: 12px; height: 12px; border: 1px solid #000; text-align: center; line-height: 12px; font-size: 10px;"></div>
                    </div>
                    <div class="pdf-cell" style="flex: 0.5; flex-direction: row; align-items: center; gap: 4px; justify-content: center; padding-top: 3px; padding-bottom: 3px;">
                        <span class="pdf-label" style="margin-bottom: 0;">PLACA</span>
                        <div class="out-tem-placa" style="width: 12px; height: 12px; border: 1px solid #000; text-align: center; line-height: 12px; font-size: 10px;"></div>
                    </div>
                </div>

                <div class="pdf-section-title">1. DADOS DO PROPRIETÁRIO</div>
                <div class="pdf-row top-border">
                    <div class="pdf-cell" style="flex: 3;"><span class="pdf-label">NOME COMPLETO / RAZÃO SOCIAL</span><span class="pdf-value out-prop-nome"></span></div>
                    <div class="pdf-cell" style="flex: 1.5;"><span class="pdf-label">CPF / CNPJ</span><span class="pdf-value out-prop-cpf"></span></div>
                    <div class="pdf-cell" style="flex: 1.5;"><span class="pdf-label">RG / INSC. EST.</span><span class="pdf-value out-prop-rg"></span></div>
                </div>
                <div class="pdf-row">
                    <div class="pdf-cell"><span class="pdf-label">ESTADO CIVIL</span><span class="pdf-value out-prop-estado-civil"></span></div>
                    <div class="pdf-cell"><span class="pdf-label">PROFISSÃO</span><span class="pdf-value out-prop-profissao"></span></div>
                    <div class="pdf-cell"><span class="pdf-label">TELEFONE / WHATSAPP</span><span class="pdf-value out-prop-telefone"></span></div>
                    <div class="pdf-cell" style="flex: 1.5;"><span class="pdf-label">E-MAIL</span><span class="pdf-value out-prop-email"></span></div>
                </div>

                <div class="pdf-section-title">2. DADOS DO IMÓVEL</div>
                <div class="pdf-row top-border">
                    <div class="pdf-cell" style="flex: 1.5;"><span class="pdf-label">TIPOLOGIA DO IMÓVEL</span><span class="pdf-value out-imovel-tipologia"></span></div>
                    <div class="pdf-cell" style="flex: 2.5;"><span class="pdf-label">EDIFÍCIO / CONDOMÍNIO</span><span class="pdf-value out-imovel-edificio"></span></div>
                </div>
                <div class="pdf-row">
                    <div class="pdf-cell" style="flex: 2;"><span class="pdf-label">ENDEREÇO DO IMÓVEL</span><span class="pdf-value out-imovel-endereco"></span></div>
                    <div class="pdf-cell"><span class="pdf-label">NÚMERO</span><span class="pdf-value out-imovel-numero"></span></div>
                    <div class="pdf-cell"><span class="pdf-label">COMPLEMENTO</span><span class="pdf-value out-imovel-complemento"></span></div>
                </div>
                <div class="pdf-row">
                    <div class="pdf-cell" style="flex: 1.5;"><span class="pdf-label">BAIRRO</span><span class="pdf-value out-imovel-bairro"></span></div>
                    <div class="pdf-cell" style="flex: 1.5;"><span class="pdf-label">CIDADE/UF</span><span class="pdf-value out-imovel-cidade"></span></div>
                    <div class="pdf-cell"><span class="pdf-label">CEP</span><span class="pdf-value out-imovel-cep"></span></div>
                    <div class="pdf-cell"><span class="pdf-label">ANDAR</span><span class="pdf-value out-imovel-andar"></span></div>
                    <div class="pdf-cell" style="flex: 2;"><span class="pdf-label">LOCAL DAS CHAVES</span><span class="pdf-value out-local-chaves"></span></div>
                </div>

                <div class="pdf-section-title">3. CARACTERÍSTICAS E DESCRIÇÃO</div>
                <div class="pdf-row top-border">
                    <div class="pdf-cell"><span class="pdf-label">ÁREA CONSTRUÍDA (m²)</span><span class="pdf-value out-carac-area-util"></span></div>
                    <div class="pdf-cell"><span class="pdf-label">ÁREA TOTAL (m²)</span><span class="pdf-value out-carac-area-total"></span></div>
                    <div class="pdf-cell"><span class="pdf-label">DORMITÓRIOS</span><span class="pdf-value out-carac-quartos"></span></div>
                    <div class="pdf-cell"><span class="pdf-label">SUÍTES</span><span class="pdf-value out-carac-suites"></span></div>
                    <div class="pdf-cell"><span class="pdf-label">BANHEIROS</span><span class="pdf-value out-carac-banheiros"></span></div>
                    <div class="pdf-cell"><span class="pdf-label">VAGAS GAR.</span><span class="pdf-value out-carac-vagas"></span></div>
                </div>
                <div class="pdf-row">
                    <div class="pdf-cell"><span class="pdf-label">MOBILIADO?</span><span class="pdf-value out-carac-mobiliado"></span></div>
                    <div class="pdf-cell"><span class="pdf-label">POSIÇÃO SOLAR</span><span class="pdf-value out-carac-sol"></span></div>
                    <div class="pdf-cell" style="flex: 2;"><span class="pdf-label">TERRENO</span><span class="pdf-value out-terreno-tipo"></span></div>
                </div>
                <div class="pdf-row">
                    <div class="pdf-cell"><span class="pdf-label">CARACTERÍSTICAS DO IMÓVEL</span><span class="pdf-value out-carac-imovel"></span></div>
                </div>
                <div class="pdf-row">
                    <div class="pdf-cell"><span class="pdf-label">CARACTERÍSTICAS DO CONDOMÍNIO</span><span class="pdf-value out-carac-condominio"></span></div>
                </div>
                <div class="pdf-row" style="min-height: 40px;">
                    <div class="pdf-cell"><span class="pdf-label">DESCRIÇÃO / OBSERVAÇÕES</span><span class="pdf-value out-carac-obs"></span></div>
                </div>

                <div class="pdf-section-title">4. VALORES E CONDIÇÕES</div>
                <div class="pdf-row top-border">
                    <div class="pdf-cell"><span class="pdf-label">VALOR DE VENDA</span><span class="pdf-value font-bold out-valor-venda"></span></div>
                    <div class="pdf-cell"><span class="pdf-label">VALOR ALUGUEL RESID.</span><span class="pdf-value font-bold out-valor-locacao"></span></div>
                    <div class="pdf-cell"><span class="pdf-label">VALOR ALUGUEL COM.</span><span class="pdf-value font-bold out-valor-aluguel-comercial"></span></div>
                </div>
                <div class="pdf-row">
                    <div class="pdf-cell"><span class="pdf-label">VALOR DO CONDOMÍNIO</span><span class="pdf-value out-valor-condominio"></span></div>
                    <div class="pdf-cell"><span class="pdf-label">VALOR DO IPTU (Anual)</span><span class="pdf-value out-valor-iptu"></span></div>
                    <div class="pdf-cell"><span class="pdf-label">TAXA DO LIXO</span><span class="pdf-value out-taxa-lixo"></span></div>
                </div>
                <div class="pdf-row">
                    <div class="pdf-cell"><span class="pdf-label">TAXA INICIAL</span><span class="pdf-value out-taxa-inicial"></span></div>
                    <div class="pdf-cell"><span class="pdf-label">TAXA MENSAL</span><span class="pdf-value out-taxa-mensal"></span></div>
                    <div class="pdf-cell"><span class="pdf-label">DOCUMENTAÇÃO</span><span class="pdf-value out-documentacao"></span></div>
                    <div class="pdf-cell"><span class="pdf-label">ACEITA PERMUTA?</span><span class="pdf-value out-permuta"></span></div>
                </div>
                <div class="pdf-row out-permuta-obs-row" style="display: none;">
                    <div class="pdf-cell">
                        <span class="pdf-label">DETALHES DA PERMUTA</span>
                        <span class="pdf-value out-permuta-obs"></span>
                    </div>
                </div>
                <div class="pdf-row">
                    <div class="pdf-cell"><span class="pdf-label">HONORÁRIOS (COMISSÃO)</span><span class="pdf-value font-bold out-valor-comissao"></span></div>
                    <div class="pdf-cell" style="flex: 2;"><span class="pdf-label">EXCLUSIVIDADE PERSONAL?</span><span class="pdf-value out-valor-exclusividade"></span></div>
                </div>

                <div class="pdf-section-title" style="margin-top: 20px;">5. TERMO DE AUTORIZAÇÃO E CONCORDÂNCIA</div>
                <div id="out-termo-pdf" class="pdf-value" style="border: 1px solid #000; padding: 8px; font-size: 9px; text-align: justify; line-height: 1.2;"></div>

                <div class="signature-box" style="justify-content: center; margin-top: 50px;">
                    <div style="width: 70%; text-align: center;">
                        <div style="min-height: 65px; display: flex; align-items: flex-end; justify-content: center;">
                            <img id="pdf-signature-image" src="" style="max-height: 60px; max-width: 90%; object-fit: contain;">
                        </div>
                        <div style="border-top: 1px solid #000; padding-top: 2px; font-size: 9px; font-weight: bold;">
                            Assinatura do Proprietário
                        </div>
                    </div>
                </div>
                
                <div class="pdf-footer" style="position: absolute; bottom: 7mm; left: 7mm; right: 7mm; font-size: 7px; color: #555; text-align: center; border-top: 1px solid #ccc; padding-top: 4px; line-height: 1.3; font-weight: normal;">
                    <div id="pdf-footer-details"></div>
                </div>
            `;
            document.body.appendChild(container);
        }
        return container;
    }

    function populatePrintContainer(data, signatureData = null) {
        ensurePrintContainer();

        const normalizeExportText = (value, fallback = '-') => {
            if (value === null || value === undefined || value === '') return fallback;
            if (typeof value !== 'string') return String(value);
            const normalized = value
                .replace(/\r\n/g, '\n')
                .replace(/\n+/g, ' ')
                .replace(/\s{2,}/g, ' ')
                .trim();
            return normalized || fallback;
        };

        const setText = (selector, value, upper = false) => {
            document.querySelectorAll(selector).forEach(el => {
                let finalValue = normalizeExportText(value, '-');
                if (upper && typeof finalValue === 'string') finalValue = finalValue.toUpperCase();
                el.innerText = finalValue;
            });
        };

        const isZeroOrEmpty = (val) => !val || val === 'R$ 0,00' || val === '0';

        const formatDate = (dateString) => {
            if (!dateString) return new Date().toLocaleDateString('pt-BR');
            if (dateString.seconds) return new Date(dateString.seconds * 1000).toLocaleDateString('pt-BR');
            if (typeof dateString === 'string' && dateString.includes('-')) {
                const [year, month, day] = dateString.split('-');
                return `${day}/${month}/${year}`;
            }
            return dateString;
        };

        const sigImg = document.getElementById('pdf-signature-image');
        if (sigImg) sigImg.src = '';

        const footerDetails = document.getElementById('pdf-footer-details');
        if (footerDetails) {
            let footerParts = [];
            if (signatureData && signatureData.signatureImage) {
                if (sigImg) sigImg.src = signatureData.signatureImage;
                const signedDate = signatureData.signedAt ? new Date(signatureData.signedAt.seconds * 1000).toLocaleString('pt-BR') : 'Data não registrada';
                footerParts.push(`Assinado por: ${signatureData.ownerName}`);
                if (signatureData.ownerCpf) footerParts.push(`CPF: ${signatureData.ownerCpf}`);
                footerParts.push(`Data: ${signedDate}`);
                footerParts.push(`IP: ${signatureData.clientIp || 'Não registrado'}`);
                if (signatureData.deviceInfo && signatureData.deviceInfo.userAgent) {
                    footerParts.push(`Dispositivo: ${parseUserAgent(signatureData.deviceInfo.userAgent)}`);
                }
            }

            footerParts.push(`Data de Cadastro: ${formatDate(data.createdAt || data.dataCadastro)}`);
            footerParts.push(`ID da Captação: ${data.id ? data.id.substring(0, 6).toUpperCase() : 'N/A'}`);

            footerDetails.innerHTML = footerParts.join(' &nbsp;|&nbsp; ');
        }

        setText('.out-corretor-nome', data.corretorNome || data.owner_email, true);
        setText('.out-codigo-imovel', data.codigoImovel, true);

        const fotoBox = document.querySelector('#print-container .out-tem-foto');
        if (fotoBox) fotoBox.innerHTML = data.temFoto ? '✓' : '&nbsp;';
        
        const placaBox = document.querySelector('#print-container .out-tem-placa');
        if (placaBox) placaBox.innerHTML = data.temPlaca ? '✓' : '&nbsp;';

        setText('.out-prop-nome', data.propNome, true);
        setText('.out-prop-cpf', data.propCpf);
        setText('.out-prop-rg', data.propRg);
        setText('.out-prop-estado-civil', data.propEstadoCivil);
        setText('.out-prop-profissao', data.propProfissao, true);
        setText('.out-imovel-tipologia', data.imovelTipologia?.join(' / '), true);
        setText('.out-imovel-edificio', data.imovelEdificio, true);

        const telefones = [data.propTelefone1, data.propTelefone2, data.propTelefone3]
            .map((tel, i) => tel ? `${tel}${data[`propTelefone${i+1}Whatsapp`] ? ' (W)' : ''}` : null)
            .filter(Boolean)
            .join(' / ');
        setText('.out-prop-telefone', telefones || data.propTelefone);
        setText('.out-prop-email', data.propEmail?.toLowerCase());
        setText('.out-imovel-finalidade', data.imovelFinalidade, true);
        setText('.out-imovel-endereco', data.imovelEndereco, true);
        setText('.out-imovel-numero', data.imovelNumero);
        setText('.out-imovel-complemento', data.imovelComplemento, true);
        setText('.out-imovel-bairro', data.imovelBairro, true);
        setText('.out-imovel-cidade', data.imovelCidade, true);
        setText('.out-imovel-cep', data.imovelCep);
        setText('.out-imovel-andar', data.imovelAndar);

        let chaves = data.localChaves === 'Outro' ? data.localChavesOutro : data.localChaves;
        setText('.out-local-chaves', chaves, true);
        setText('.out-carac-area-util', data.caracAreaUtil);
        setText('.out-carac-area-total', data.caracAreaTotal);
        setText('.out-carac-quartos', data.caracQuartos);
        setText('.out-carac-suites', data.caracSuites);
        setText('.out-carac-banheiros', data.caracBanheiros);
        setText('.out-carac-vagas', data.caracVagas);
        setText('.out-carac-mobiliado', data.caracMobiliado, true);
        setText('.out-carac-sol', data.caracSol, true);

        let terreno = [];
        if (data.terrenoAclive) terreno.push('Aclive');
        if (data.terrenoDeclive) terreno.push('Declive');
        setText('.out-terreno-tipo', terreno.join(' / ') || (data.terrenoAclive !== undefined || data.terrenoDeclive !== undefined ? 'Plano' : ''), true);
        
        const caracImovel = [...(data.caracImovel || []), ...(data.caracImovelCustom ? data.caracImovelCustom.split(',').map(s => s.trim()) : [])].filter(Boolean);
        setText('.out-carac-imovel', caracImovel.join(' • '), true);
        
        const caracCondo = [...(data.caracCondominio || []), ...(data.caracCondoCustom ? data.caracCondoCustom.split(',').map(s => s.trim()) : [])].filter(Boolean);
        setText('.out-carac-condominio', caracCondo.join(' • '), true);

        setText('.out-carac-obs', data.caracObs, true);
        setText('.out-valor-venda', isZeroOrEmpty(data.valorVenda) ? '-' : data.valorVenda);
        setText('.out-valor-locacao', isZeroOrEmpty(data.valorLocacao) ? '-' : data.valorLocacao);
        setText('.out-valor-aluguel-comercial', isZeroOrEmpty(data.valorAluguelComercial) ? '-' : data.valorAluguelComercial);
        setText('.out-valor-condominio', isZeroOrEmpty(data.valorCondominio) ? '-' : data.valorCondominio);
        setText('.out-valor-iptu', isZeroOrEmpty(data.valorIptu) ? '-' : data.valorIptu);
        setText('.out-taxa-lixo', isZeroOrEmpty(data.taxaLixo) ? '-' : data.taxaLixo);
        setText('.out-taxa-inicial', data.taxaInicial ? `${data.taxaInicial}%` : '');
        setText('.out-taxa-mensal', data.taxaMensal ? `${data.taxaMensal}%` : '');
        setText('.out-documentacao', data.documentacao, true);
        setText('.out-permuta', data.permuta, true);

        const permutaObsRow = document.querySelector('#print-container .out-permuta-obs-row');
        const permutaTexto = data.permutaObs || data.permutaDesc || '';
        if (data.permuta === 'Sim' && permutaTexto) {
            setText('.out-permuta-obs', permutaTexto, true);
            if (permutaObsRow) permutaObsRow.style.display = 'flex';
        } else {
            setText('.out-permuta-obs', '');
            if (permutaObsRow) permutaObsRow.style.display = 'none';
        }

        setText('.out-valor-comissao', data.valorComissao ? `${data.valorComissao}%` : '');
        setText('.out-valor-exclusividade', data.valorExclusividade, true);
        
        const termoEl = document.getElementById('out-termo-pdf');
        if (termoEl) termoEl.innerText = normalizeExportText(termoAutorizacaoGlobal, '');
    }

    async function generatePDF(data, triggerButton = null) {
        let signatureData = null;
        showGlobalSpinner("Gerando documento PDF...");

        try {
            if (data.signatureId && data.signatureStatus === 'signed') {
                const sigDoc = await db.collection('assinaturas').doc(data.signatureId).get();
                if (sigDoc.exists) {
                    signatureData = sigDoc.data();
                }
            }

            populatePrintContainer(data, signatureData);
            const element = document.getElementById('print-container');
            
            const canvas = await window.html2canvas(element, { scale: 2, useCORS: true, logging: false });
            const imgData = canvas.toDataURL('image/jpeg', 1.0);
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);

            const nomeProprietario = data.propNome?.split(' ')[0] || 'Ficha';
            const captureShortId = data.id ? data.id.substring(0, 4) : 'TEMP';
            const fileName = `Ficha_Captacao_${nomeProprietario}_${captureShortId}.pdf`;
            pdf.save(fileName);

        } catch (error) {
            console.error("Erro ao gerar PDF:", error);
            showAlert('Ocorreu um erro ao gerar o documento PDF: ' + error.message, 'Erro no PDF');
        } finally {
            hideGlobalSpinner();
        }
    }

    exports.pdfService = {
        fetchGlobalTermo,
        parseUserAgent,
        generatePDF
    };
})(window.CaptaFacil);
