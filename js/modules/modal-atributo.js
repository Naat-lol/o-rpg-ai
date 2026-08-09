export class ModalAtributo {
    constructor(sistemaDados, sistemaPericias) {
        this.sistemaDados = sistemaDados;
        this.sistemaPericias = sistemaPericias;
        this.atributoSelecionado = null;
        this.modal = null;
        this.vantagemNivel = 1;
        this.tipoRolagem = 'normal';
        
        this.criarModal();
        this.configurarEventos();
    }

    criarModal() {
        if (document.getElementById('modal-atributo-overlay')) {
            this.modal = document.getElementById('modal-atributo-overlay');
            return;
        }

        const overlay = document.createElement('div');
        overlay.className = 'modal-atributo-overlay';
        overlay.id = 'modal-atributo-overlay';
        overlay.style.display = 'none';

        overlay.innerHTML = `
            <div class="modal-atributo">
                <div class="modal-atributo-cabecalho">
                    <h2 id="modal-atributo-titulo">Teste de Atributo</h2>
                    <button class="modal-atributo-fechar" id="fechar-modal-atributo">×</button>
                </div>
                <div class="modal-atributo-conteudo">
                    <div class="modal-atributo-info">
                        <span class="modal-atributo-nome" id="modal-atributo-nome">FOR</span>
                        <span class="modal-atributo-valor" id="modal-atributo-valor">Valor: 0</span>
                    </div>
                    
                    <div class="modal-atributo-rolagem-tipo">
                        <label class="rolagem-tipo-label">Tipo de Rolagem:</label>
                        <div class="modal-rolagem-opcoes">
                            <button class="modal-rolagem-btn active" data-tipo="normal">
                                <span class="rolagem-text">Normal</span>
                            </button>
                            <button class="modal-rolagem-btn" data-tipo="vantagem">
                                <span class="rolagem-text">Vantagem</span>
                            </button>
                            <button class="modal-rolagem-btn" data-tipo="desvantagem">
                                <span class="rolagem-text">Desvantagem</span>
                            </button>
                        </div>
                    </div>

                    <div class="modal-atributo-vantagem-nivel" id="modal-vantagem-nivel-container" style="display: none;">
                        <label class="vantagem-nivel-label">Nível de <span id="vantagem-tipo-texto">Vantagem</span>:</label>
                        <div class="vantagem-nivel-controle">
                            <button class="vantagem-nivel-btn" id="vantagem-diminuir">−</button>
                            <span class="vantagem-nivel-valor" id="vantagem-nivel-display">1</span>
                            <button class="vantagem-nivel-btn" id="vantagem-aumentar">+</button>
                            <span class="vantagem-nivel-desc" id="vantagem-nivel-desc">dado(s) extra(s)</span>
                        </div>
                        <div class="vantagem-nivel-info" id="vantagem-nivel-info">
                          + Rola <span id="vantagem-dados-extra">1</span> dado(s) extra(s)
                        </div>
                    </div>
                    
                    <div class="modal-atributo-opcoes">
                        <button class="modal-atributo-btn" id="btn-atributo-puro">
                            <span class="btn-text">Teste Puro</span>
                            <span class="btn-desc" id="btn-puro-desc">Rola Xd20</span>
                        </button>
                        
                        <div class="modal-atributo-divisor">
                            <span>OU</span>
                        </div>
                        
                        <div class="modal-atributo-pericia">
                            <label for="pericia-select">Com uma Perícia:</label>
                            <select id="pericia-select" class="modal-atributo-select">
                                <option value="">Selecione uma perícia...</option>
                            </select>
                            <button class="modal-atributo-btn" id="btn-atributo-pericia" disabled>
                                <span class="btn-text">Rolar com Perícia</span>
                                <span class="btn-desc" id="btn-pericia-desc">Selecione uma perícia</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);
        this.modal = overlay;

        this.adicionarEstilos();
    }

    adicionarEstilos() {
        if (document.getElementById('style-modal-atributo')) return;

        const style = document.createElement('style');
        style.id = 'style-modal-atributo';
        style.textContent = `
            .modal-atributo-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.85);
                backdrop-filter: blur(8px);
                z-index: 10000;
                display: none;
                align-items: center;
                justify-content: center;
            }

            .modal-atributo-overlay.ativo {
                display: flex;
                animation: fadeInModal 0.3s ease;
            }

            @keyframes fadeInModal {
                from {
                    opacity: 0;
                    transform: scale(0.95);
                }
                to {
                    opacity: 1;
                    transform: scale(1);
                }
            }

            .modal-atributo {
                background: linear-gradient(145deg, #1a1a22, #14141a);
                border: 2px solid var(--primary, #3A86FF);
                border-radius: 20px;
                padding: 35px;
                max-width: 550px;
                width: 90%;
                max-height: 85vh;
                overflow-y: auto;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8);
            }

            .modal-atributo-cabecalho {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 25px;
                padding-bottom: 15px;
                border-bottom: 2px solid var(--border, #333);
            }

            .modal-atributo-cabecalho h2 {
                color: var(--primary, #3A86FF);
                margin: 0;
                font-size: 24px;
                letter-spacing: 1px;
                text-transform: uppercase;
            }

            .modal-atributo-fechar {
                background: transparent;
                border: none;
                color: #888;
                font-size: 32px;
                cursor: pointer;
                transition: all 0.3s ease;
                padding: 0 10px;
                line-height: 1;
            }

            .modal-atributo-fechar:hover {
                color: #fff;
                transform: rotate(90deg);
            }

            .modal-atributo-conteudo {
                display: flex;
                flex-direction: column;
                gap: 20px;
            }

            .modal-atributo-info {
                display: flex;
                justify-content: space-between;
                align-items: center;
                background: rgba(0, 0, 0, 0.3);
                padding: 15px 20px;
                border-radius: 12px;
                border: 1px solid var(--border, #333);
            }

            .modal-atributo-nome {
                font-size: 32px;
                font-weight: bold;
                color: var(--primary, #3A86FF);
            }

            .modal-atributo-valor {
                font-size: 18px;
                color: #aaa;
            }

            .modal-atributo-rolagem-tipo {
                background: rgba(0, 0, 0, 0.2);
                padding: 15px;
                border-radius: 12px;
                border: 1px solid var(--border, #333);
            }

            .rolagem-tipo-label {
                display: block;
                color: #aaa;
                font-size: 13px;
                text-transform: uppercase;
                letter-spacing: 1px;
                margin-bottom: 10px;
            }

            .modal-rolagem-opcoes {
                display: flex;
                gap: 10px;
            }

            .modal-rolagem-btn {
                flex: 1;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
                padding: 10px 15px;
                background: rgba(20, 20, 26, 0.6);
                border: 2px solid var(--border, #333);
                border-radius: 8px;
                color: #aaa;
                cursor: pointer;
                transition: all 0.3s ease;
                font-family: inherit;
                font-size: 14px;
            }

            .modal-rolagem-btn:hover {
                border-color: var(--primary, #3A86FF);
                color: #fff;
                transform: translateY(-2px);
            }

            .modal-rolagem-btn.active {
                border-color: var(--primary, #3A86FF);
                background: rgba(58, 134, 255, 0.15);
                color: var(--primary, #3A86FF);
                box-shadow: 0 0 20px rgba(58, 134, 255, 0.1);
            }

            .modal-rolagem-btn .rolagem-icon {
                font-size: 18px;
            }

            .modal-rolagem-btn .rolagem-text {
                font-weight: bold;
                font-size: 13px;
            }

            .modal-atributo-vantagem-nivel {
                background: rgba(0, 0, 0, 0.2);
                padding: 15px;
                border-radius: 12px;
                border: 1px solid var(--border, #333);
                animation: slideDownVantagem 0.3s ease;
            }

            @keyframes slideDownVantagem {
                from {
                    opacity: 0;
                    transform: translateY(-10px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            .vantagem-nivel-label {
                display: block;
                color: #aaa;
                font-size: 13px;
                text-transform: uppercase;
                letter-spacing: 1px;
                margin-bottom: 10px;
            }

            .vantagem-nivel-label span {
                color: var(--primary, #3A86FF);
                font-weight: bold;
            }

            .vantagem-nivel-controle {
                display: flex;
                align-items: center;
                gap: 15px;
            }

            .vantagem-nivel-btn {
                width: 36px;
                height: 36px;
                background: rgba(20, 20, 26, 0.6);
                border: 2px solid var(--border, #333);
                border-radius: 8px;
                color: #fff;
                font-size: 20px;
                cursor: pointer;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .vantagem-nivel-btn:hover {
                border-color: var(--primary, #3A86FF);
                background: rgba(58, 134, 255, 0.1);
            }

            .vantagem-nivel-btn:active {
                transform: scale(0.95);
            }

            .vantagem-nivel-valor {
                font-size: 24px;
                font-weight: bold;
                color: var(--primary, #3A86FF);
                min-width: 30px;
                text-align: center;
            }

            .vantagem-nivel-desc {
                color: #888;
                font-size: 14px;
                margin-left: 5px;
            }

            .vantagem-nivel-info {
                margin-top: 10px;
                color: #666;
                font-size: 13px;
                padding: 8px 12px;
                background: rgba(0, 0, 0, 0.2);
                border-radius: 6px;
                border-left: 3px solid var(--primary, #3A86FF);
            }

            .vantagem-nivel-info span {
                color: var(--primary, #3A86FF);
                font-weight: bold;
            }

            .modal-atributo-opcoes {
                display: flex;
                flex-direction: column;
                gap: 15px;
            }

            .modal-atributo-btn {
                display: flex;
                align-items: center;
                gap: 15px;
                padding: 15px 20px;
                background: rgba(20, 20, 26, 0.6);
                border: 2px solid var(--border, #333);
                border-radius: 12px;
                cursor: pointer;
                transition: all 0.3s ease;
                color: #fff;
                font-family: inherit;
                width: 100%;
                text-align: left;
            }

            .modal-atributo-btn:hover:not(:disabled) {
                border-color: var(--primary, #3A86FF);
                background: rgba(58, 134, 255, 0.1);
                transform: translateX(5px);
            }

            .modal-atributo-btn:disabled {
                opacity: 0.4;
                cursor: not-allowed;
            }

            .modal-atributo-btn .btn-icon {
                font-size: 24px;
                min-width: 40px;
            }

            .modal-atributo-btn .btn-text {
                font-size: 16px;
                font-weight: bold;
                color: #eaeaea;
            }

            .modal-atributo-btn .btn-desc {
                font-size: 12px;
                color: #888;
                margin-left: auto;
                text-align: right;
                max-width: 200px;
            }

            .modal-atributo-divisor {
                display: flex;
                align-items: center;
                gap: 15px;
                color: #666;
                font-size: 12px;
                text-transform: uppercase;
                letter-spacing: 2px;
                padding: 5px 0;
            }

            .modal-atributo-divisor::before,
            .modal-atributo-divisor::after {
                content: '';
                flex: 1;
                height: 1px;
                background: var(--border, #333);
            }

            .modal-atributo-pericia {
                display: flex;
                flex-direction: column;
                gap: 10px;
            }

            .modal-atributo-pericia label {
                color: #aaa;
                font-size: 14px;
                letter-spacing: 0.5px;
            }

            .modal-atributo-select {
                background: rgba(0, 0, 0, 0.4);
                border: 2px solid var(--border, #333);
                border-radius: 10px;
                padding: 12px 15px;
                color: #fff;
                font-size: 15px;
                font-family: inherit;
                transition: all 0.3s ease;
                cursor: pointer;
                width: 100%;
            }

            .modal-atributo-select:focus {
                outline: none;
                border-color: var(--primary, #3A86FF);
            }

            .modal-atributo-select option {
                background: #1a1a22;
                color: #fff;
                padding: 10px;
            }

            @media (max-width: 480px) {
                .modal-atributo {
                    padding: 20px;
                }

                .modal-atributo-cabecalho h2 {
                    font-size: 20px;
                }

                .modal-atributo-nome {
                    font-size: 28px;
                }

                .modal-atributo-btn {
                    padding: 12px 15px;
                    flex-wrap: wrap;
                }

                .modal-atributo-btn .btn-desc {
                    margin-left: 0;
                    width: 100%;
                    padding-left: 55px;
                    text-align: left;
                }

                .modal-rolagem-opcoes {
                    flex-direction: column;
                }

                .modal-rolagem-btn {
                    justify-content: center;
                }

                .vantagem-nivel-controle {
                    justify-content: center;
                }
            }
        `;

        document.head.appendChild(style);
    }

    configurarEventos() {
        const fecharBtn = document.getElementById('fechar-modal-atributo');
        if (fecharBtn) {
            fecharBtn.addEventListener('click', () => this.fechar());
        }

        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.fechar();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('ativo')) {
                this.fechar();
            }
        });

        const botoesRolagem = document.querySelectorAll('.modal-rolagem-btn');
        botoesRolagem.forEach(btn => {
            btn.addEventListener('click', () => {
                botoesRolagem.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                this.tipoRolagem = btn.dataset.tipo;
                this.atualizarUI();
            });
        });

        const btnDiminuir = document.getElementById('vantagem-diminuir');
        const btnAumentar = document.getElementById('vantagem-aumentar');
        
        if (btnDiminuir) {
            btnDiminuir.addEventListener('click', () => {
                if (this.vantagemNivel > 1) {
                    this.vantagemNivel--;
                    this.atualizarVantagemUI();
                }
            });
        }
        
        if (btnAumentar) {
            btnAumentar.addEventListener('click', () => {
                if (this.vantagemNivel < 5) {
                    this.vantagemNivel++;
                    this.atualizarVantagemUI();
                }
            });
        }

        const btnPuro = document.getElementById('btn-atributo-puro');
        if (btnPuro) {
            btnPuro.addEventListener('click', () => {
                if (this.atributoSelecionado) {
                    this.rolarAtributoPuro();
                    this.fechar();
                }
            });
        }

        const selectPericia = document.getElementById('pericia-select');
        if (selectPericia) {
            selectPericia.addEventListener('change', (e) => {
                const btnPericia = document.getElementById('btn-atributo-pericia');
                if (btnPericia) {
                    btnPericia.disabled = !e.target.value;
                    const desc = btnPericia.querySelector('.btn-desc');
                    if (desc) {
                        if (e.target.value) {
                            const pericia = this.sistemaPericias?.pericias?.find(p => p.nome === e.target.value);
                            if (pericia) {
                                desc.textContent = `Atributo ${this.atributoSelecionado?.valor || 0}d20 | Cap: ${pericia.capacidade}`;
                            }
                        } else {
                            desc.textContent = 'Selecione uma perícia';
                        }
                    }
                }
                this.atualizarUI();
            });
        }

        const btnPericia = document.getElementById('btn-atributo-pericia');
        if (btnPericia) {
            btnPericia.addEventListener('click', () => {
                const select = document.getElementById('pericia-select');
                if (select && select.value && this.atributoSelecionado) {
                    this.rolarComPericia(select.value);
                    this.fechar();
                }
            });
        }
    }

    atualizarUI() {
        const container = document.getElementById('modal-vantagem-nivel-container');
        const tipoTexto = document.getElementById('vantagem-tipo-texto');
        const info = document.getElementById('vantagem-nivel-info');
        const dadosExtra = document.getElementById('vantagem-dados-extra');
        const descNivel = document.getElementById('vantagem-nivel-desc');
        const btnPuroDesc = document.getElementById('btn-puro-desc');
        const btnPericiaDesc = document.getElementById('btn-pericia-desc');
        const selectPericia = document.getElementById('pericia-select');

        if (this.tipoRolagem !== 'normal') {
            container.style.display = 'block';
            
            const texto = this.tipoRolagem === 'vantagem' ? 'Vantagem' : 'Desvantagem';
            if (tipoTexto) tipoTexto.textContent = texto;
            
            if (descNivel) {
                descNivel.textContent = this.tipoRolagem === 'vantagem' ? 'dado(s) extra(s)' : 'dado(s) a menos';
            }
            
            if (info) {
                const icone = this.tipoRolagem === 'vantagem' ? '➕' : '➖';
                const acao = this.tipoRolagem === 'vantagem' ? 'extra(s)' : 'a menos';
                info.innerHTML = `${icone} ${this.tipoRolagem === 'vantagem' ? 'Adiciona' : 'Remove'} <span>${this.vantagemNivel}</span> dado(s) ${acao}`;
            }
            
            if (dadosExtra) dadosExtra.textContent = this.vantagemNivel;
        } else {
            container.style.display = 'none';
        }

        if (btnPuroDesc && this.atributoSelecionado) {
            let qtd = this.atributoSelecionado.valor;
            let texto = '';
            
            if (this.tipoRolagem === 'vantagem') {
                const total = qtd + this.vantagemNivel;
                texto = `${total}d20 (${qtd} + ${this.vantagemNivel} de vantagem)`;
            } else if (this.tipoRolagem === 'desvantagem') {
                let novaQtd = Math.max(0, qtd - this.vantagemNivel);
                if (novaQtd === 0) {
                    texto = `1d10 (Desvantagem extrema)`;
                } else {
                    texto = `${novaQtd}d20 (Desvantagem ${this.vantagemNivel}x)`;
                }
            } else {
                if (qtd === 0) {
                    texto = `1d10 (Atributo 0)`;
                } else {
                    texto = `${qtd}d20`;
                }
            }
            btnPuroDesc.textContent = texto;
        }

        if (btnPericiaDesc && selectPericia && selectPericia.value && this.atributoSelecionado) {
            const pericia = this.sistemaPericias?.pericias?.find(p => p.nome === selectPericia.value);
            if (pericia) {
                let qtd = this.atributoSelecionado.valor;
                let texto = '';
                
                if (this.tipoRolagem === 'vantagem') {
                    const total = qtd + this.vantagemNivel;
                    texto = `${total}d20 (${qtd} + ${this.vantagemNivel} de vantagem) | Cap: ${pericia.capacidade}`;
                } else if (this.tipoRolagem === 'desvantagem') {
                    let novaQtd = Math.max(0, qtd - this.vantagemNivel);
                    if (novaQtd === 0) {
                        texto = `1d10 (Desvantagem extrema) | Cap: ${pericia.capacidade}`;
                    } else {
                        texto = `${novaQtd}d20 (Desvantagem ${this.vantagemNivel}x) | Cap: ${pericia.capacidade}`;
                    }
                } else {
                    if (qtd === 0) {
                        texto = `1d10 (Atributo 0) | Cap: ${pericia.capacidade}`;
                    } else {
                        texto = `${qtd}d20 | Cap: ${pericia.capacidade}`;
                    }
                }
                btnPericiaDesc.textContent = texto;
            }
        } else if (btnPericiaDesc) {
            btnPericiaDesc.textContent = 'Selecione uma perícia';
        }

        this.atualizarVantagemUI();
    }

    atualizarVantagemUI() {
        const display = document.getElementById('vantagem-nivel-display');
        const dadosExtra = document.getElementById('vantagem-dados-extra');
        const info = document.getElementById('vantagem-nivel-info');
        const btnPuroDesc = document.getElementById('btn-puro-desc');
        const btnPericiaDesc = document.getElementById('btn-pericia-desc');
        const selectPericia = document.getElementById('pericia-select');

        if (display) display.textContent = this.vantagemNivel;
        if (dadosExtra) dadosExtra.textContent = this.vantagemNivel;

        if (info && this.tipoRolagem !== 'normal') {
            const icone = this.tipoRolagem === 'vantagem' ? '➕' : '➖';
            const acao = this.tipoRolagem === 'vantagem' ? 'extra(s)' : 'a menos';
            info.innerHTML = `${icone} ${this.tipoRolagem === 'vantagem' ? 'Adiciona' : 'Remove'} <span>${this.vantagemNivel}</span> dado(s) ${acao}`;
        }

        if (btnPuroDesc && this.atributoSelecionado) {
            let qtd = this.atributoSelecionado.valor;
            let texto = '';
            
            if (this.tipoRolagem === 'vantagem') {
                const total = qtd + this.vantagemNivel;
                texto = `${total}d20 (${qtd} + ${this.vantagemNivel} de vantagem)`;
            } else if (this.tipoRolagem === 'desvantagem') {
                let novaQtd = Math.max(0, qtd - this.vantagemNivel);
                if (novaQtd === 0) {
                    texto = `1d10 (Desvantagem extrema)`;
                } else {
                    texto = `${novaQtd}d20 (Desvantagem ${this.vantagemNivel}x)`;
                }
            } else {
                if (qtd === 0) {
                    texto = `1d10 (Atributo 0)`;
                } else {
                    texto = `${qtd}d20`;
                }
            }
            btnPuroDesc.textContent = texto;
        }

        if (btnPericiaDesc && selectPericia && selectPericia.value && this.atributoSelecionado) {
            const pericia = this.sistemaPericias?.pericias?.find(p => p.nome === selectPericia.value);
            if (pericia) {
                let qtd = this.atributoSelecionado.valor;
                let texto = '';
                
                if (this.tipoRolagem === 'vantagem') {
                    const total = qtd + this.vantagemNivel;
                    texto = `${total}d20 (${qtd} + ${this.vantagemNivel} de vantagem) | Cap: ${pericia.capacidade}`;
                } else if (this.tipoRolagem === 'desvantagem') {
                    let novaQtd = Math.max(0, qtd - this.vantagemNivel);
                    if (novaQtd === 0) {
                        texto = `1d10 (Desvantagem extrema) | Cap: ${pericia.capacidade}`;
                    } else {
                        texto = `${novaQtd}d20 (Desvantagem ${this.vantagemNivel}x) | Cap: ${pericia.capacidade}`;
                    }
                } else {
                    if (qtd === 0) {
                        texto = `1d10 (Atributo 0) | Cap: ${pericia.capacidade}`;
                    } else {
                        texto = `${qtd}d20 | Cap: ${pericia.capacidade}`;
                    }
                }
                btnPericiaDesc.textContent = texto;
            }
        }
    }

    abrir(atributo) {
        if (!atributo) return;

        this.atributoSelecionado = atributo;
        this.vantagemNivel = 1;
        this.tipoRolagem = 'normal';
        
        const titulo = document.getElementById('modal-atributo-titulo');
        if (titulo) {
            titulo.textContent = `Teste de ${atributo.sigla}`;
        }

        const nome = document.getElementById('modal-atributo-nome');
        if (nome) {
            nome.textContent = atributo.sigla;
        }

        const valor = document.getElementById('modal-atributo-valor');
        if (valor) {
            const qtd = atributo.valor;
            const texto = qtd === 0 ? `Valor: 0 (rola 1d10)` : `Valor: ${qtd}`;
            valor.textContent = texto;
        }

        const botoesRolagem = document.querySelectorAll('.modal-rolagem-btn');
        botoesRolagem.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tipo === 'normal');
        });

        const container = document.getElementById('modal-vantagem-nivel-container');
        if (container) container.style.display = 'none';

        const display = document.getElementById('vantagem-nivel-display');
        if (display) display.textContent = '1';

        this.carregarPericias(atributo.sigla);

        const select = document.getElementById('pericia-select');
        if (select) {
            select.value = '';
        }
        const btnPericia = document.getElementById('btn-atributo-pericia');
        if (btnPericia) {
            btnPericia.disabled = true;
            const desc = btnPericia.querySelector('.btn-desc');
            if (desc) {
                desc.textContent = 'Selecione uma perícia';
            }
        }

        this.atualizarUI();

        this.modal.classList.add('ativo');
        this.modal.style.display = 'flex';
    }

    fechar() {
        this.modal.classList.remove('ativo');
        this.modal.style.display = 'none';
        this.atributoSelecionado = null;
    }

    carregarPericias(siglaAtributo) {
        const select = document.getElementById('pericia-select');
        if (!select) return;

        select.innerHTML = '<option value="">Selecione uma perícia...</option>';

        if (!this.sistemaPericias) return;

        const periciasDoAtributo = this.sistemaPericias.pericias
            .filter(p => p.atributo === siglaAtributo)
            .sort((a, b) => a.nome.localeCompare(b.nome));

        if (periciasDoAtributo.length === 0) {
            const option = document.createElement('option');
            option.value = '';
            option.textContent = 'Nenhuma perícia para este atributo';
            option.disabled = true;
            select.appendChild(option);
            return;
        }

        periciasDoAtributo.forEach(pericia => {
            const option = document.createElement('option');
            option.value = pericia.nome;
            const cap = pericia.capacidade;
            const textoCap = cap === 0 ? 'Cap: 0' : `Cap: ${cap}`;
            option.textContent = `${pericia.nome} (${textoCap})`;
            select.appendChild(option);
        });
    }

    rolarAtributoPuro() {
        if (!this.atributoSelecionado || !this.sistemaDados) return;

        const { sigla, valor } = this.atributoSelecionado;
        let quantidade = valor;
        
        if (this.tipoRolagem === 'desvantagem') {
            quantidade = Math.max(0, quantidade - this.vantagemNivel);
        }
        
        if (quantidade === 0) {
            this.rolarD10(sigla, 'Atributo');
            return;
        }

        if (this.tipoRolagem === 'vantagem') {
            if (this.sistemaDados.rolarDadosPersonalizados) {
                this.sistemaDados.rolarDadosPersonalizados({
                    tipoDados: 'd20',
                    quantidade: quantidade,
                    modificador: 0,
                    tipoRolagem: 'vantagem',
                    vantagensDesvantagens: this.vantagemNivel,
                    mostrarResultados: 'separado-e-somado'
                });
            }
            return;
        }

        if (this.sistemaDados.rolarTesteAtributo) {
            let nome = sigla;
            if (this.tipoRolagem === 'desvantagem' && this.vantagemNivel > 0) {
                nome = `${sigla} (Desvantagem ${this.vantagemNivel}x)`;
            }
            this.sistemaDados.rolarTesteAtributo(nome, quantidade);
        }
    }

    rolarComPericia(nomePericia) {
        if (!this.atributoSelecionado || !this.sistemaDados || !this.sistemaPericias) return;

        const pericia = this.sistemaPericias.pericias.find(p => p.nome === nomePericia);
        if (!pericia) return;

        let quantidade = this.atributoSelecionado.valor;
        const { sigla } = this.atributoSelecionado;
        
        if (this.tipoRolagem === 'desvantagem') {
            quantidade = Math.max(0, quantidade - this.vantagemNivel);
        }
        
        if (quantidade === 0) {
            this.rolarD10(`${sigla} + ${pericia.nome}`, 'Perícia');
            return;
        }

        if (this.tipoRolagem === 'vantagem') {
            if (this.sistemaDados.rolarDadosPersonalizados) {
                this.sistemaDados.rolarDadosPersonalizados({
                    tipoDados: 'd20',
                    quantidade: quantidade,
                    modificador: 0,
                    tipoRolagem: 'vantagem',
                    vantagensDesvantagens: this.vantagemNivel,
                    mostrarResultados: 'separado-e-somado'
                });
            }
            return;
        }

        if (this.sistemaDados.rolarTesteAtributo) {
            let nome = `${sigla} + ${pericia.nome}`;
            if (this.tipoRolagem === 'desvantagem' && this.vantagemNivel > 0) {
                nome = `${sigla} + ${pericia.nome} (Desvantagem ${this.vantagemNivel}x)`;
            }
            this.sistemaDados.rolarTesteAtributo(nome, quantidade);
        }
    }
    
    rolarD10(nome, tipo) {
        if (!this.sistemaDados) return;

        const resultado = this.sistemaDados.rolarDado(10);
        
        let sucessos = 0;
        if (resultado === 1) {
            sucessos = -1;
        } else if (resultado >= 5 && resultado <= 9) {
            sucessos = 1;
        } else if (resultado === 10) {
            sucessos = 2;
        }

        this.sistemaDados.adicionarAoHistorico({
            tipo: 'D10',
            nome: `${nome} (1d10)`,
            resultado: resultado,
            sucessos: sucessos,
            timestamp: new Date().toISOString()
        });

        const cor = sucessos <= 0 ? '#D90012' : 
                   sucessos === 1 ? '#00E10F' : '#A23B72';
        
        if (this.sistemaDados.mostrarNotificacao) {
            this.sistemaDados.mostrarNotificacao({
                titulo: `${nome} (1d10)`,
                tipo: 'desvantagem',
                dadosInfo: '1d10',
                resultados: [resultado],
                valorFinal: sucessos,
                cor: cor,
                extraInfo: this.tipoRolagem === 'desvantagem' ? `Desvantagem ${this.vantagemNivel}x - 1d10` : 'Atributo/Perícia 0 - 1d10',
                isD20: false,
                modificador: 0
            });
        }

        return {
            resultado: resultado,
            sucessos: sucessos
        };
    }
}