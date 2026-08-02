export class SistemaConfiguracoes {
    constructor() {
        this.configAberta = false;
        this.seletorAberto = false;
        this.corPrimaria = localStorage.getItem('corPrimaria') || '#00C3FF';
        this.corSelecionadaNome = localStorage.getItem('corPrimariaNome') || 'Azul Royal';
        this.observers = [];
        this._observer = null;
        
        this.inicializarInterface();
        this.configurarEventos();
        this.aplicarCorPrimaria();
        this.aplicarCorTextoBotao();
        this.configurarObservers();
        this.configurarObserverDinamico();
    }

    inicializarInterface() {
        const botaoConfig = document.createElement('div');
        botaoConfig.id = 'config-botao';
        botaoConfig.innerHTML = '⚙';
        botaoConfig.title = 'Configurações';
        
        const painelConfig = document.createElement('div');
        painelConfig.id = 'config-painel';
        
        painelConfig.innerHTML = `
            <div class="config-cabecalho">
                <h2>Configurações</h2>
                <button id="fechar-config">×</button>
            </div>
            <div class="config-conteudo">
                <div class="config-secao">
                    <h3 class="config-titulo">Cor Dominante</h3>
                    <p class="config-descricao">Selecione uma cor para personalizar o tema da ficha.</p>
                    
                    <div class="seletor-cor-custom">
                        <div class="seletor-cor-trigger" id="seletor-cor-trigger">
                            <div class="seletor-cor-visual">
                                <div class="seletor-cor-amostra" id="seletor-cor-amostra"></div>
                                <div class="seletor-cor-info">
                                    <span class="seletor-cor-nome" id="seletor-cor-nome">${this.corSelecionadaNome}</span>
                                    <span class="seletor-cor-seta">▼</span>
                                </div>
                            </div>
                            <div class="seletor-cor-codigo" id="seletor-cor-codigo">${this.corPrimaria.toUpperCase()}</div>
                        </div>
                        
                        <div class="seletor-cor-opcoes" id="seletor-cor-opcoes">
                            <div class="cor-opcao" data-cor="#FF0015" data-nome="Vermelho Escarlate">
                                <div class="cor-opcao-visual" style="background: #FF0015;"></div>
                                <div class="cor-opcao-info">
                                    <span class="cor-opcao-nome">Vermelho Escarlate</span>
                                    <span class="cor-opcao-hex">#FF0015</span>
                                </div>
                            </div>
                            
                            <div class="cor-opcao" data-cor="#FF8C00" data-nome="Laranja Tangerina">
                                <div class="cor-opcao-visual" style="background: #FF8C00;"></div>
                                <div class="cor-opcao-info">
                                    <span class="cor-opcao-nome">Laranja Tangerina</span>
                                    <span class="cor-opcao-hex">#FF8C00</span>
                                </div>
                            </div>
                            
                            <div class="cor-opcao" data-cor="#FFEE00" data-nome="Amarelo Ouro">
                                <div class="cor-opcao-visual" style="background: #FFEE00;"></div>
                                <div class="cor-opcao-info">
                                    <span class="cor-opcao-nome">Amarelo Ouro</span>
                                    <span class="cor-opcao-hex">#FFEE00</span>
                                </div>
                            </div>
                            
                            <div class="cor-opcao" data-cor="#48FF00" data-nome="Verde Lima">
                                <div class="cor-opcao-visual" style="background: #48FF00;"></div>
                                <div class="cor-opcao-info">
                                    <span class="cor-opcao-nome">Verde Lima</span>
                                    <span class="cor-opcao-hex">#48FF00</span>
                                </div>
                            </div>
        
                            <div class="cor-opcao" data-cor="#00FF7B" data-nome="Verde Aqua">
                                <div class="cor-opcao-visual" style="background: #00FF7B;"></div>
                                <div class="cor-opcao-info">
                                    <span class="cor-opcao-nome">Verde Aqua</span>
                                    <span class="cor-opcao-hex">#00FF7B</span>
                                </div>
                            </div>
                            
                            <div class="cor-opcao" data-cor="#00FFC7" data-nome="Ciano Puro">
                                <div class="cor-opcao-visual" style="background: #00FFC7;"></div>
                                <div class="cor-opcao-info">
                                    <span class="cor-opcao-nome">Ciano Puro</span>
                                    <span class="cor-opcao-hex">#00FFC7</span>
                                </div>
                            </div>
        
                            <div class="cor-opcao" data-cor="#1ABC9C" data-nome="Turquesa">
                                <div class="cor-opcao-visual" style="background: #1ABC9C;"></div>
                                <div class="cor-opcao-info">
                                    <span class="cor-opcao-nome">Turquesa</span>
                                    <span class="cor-opcao-hex">#1ABC9C</span>
                                </div>
                            </div>
                            
                            <div class="cor-opcao" data-cor="#00C3FF" data-nome="Azul Royal">
                                <div class="cor-opcao-visual" style="background: #00C3FF;"></div>
                                <div class="cor-opcao-info">
                                    <span class="cor-opcao-nome">Azul Royal</span>
                                    <span class="cor-opcao-hex">#00C3FF</span>
                                </div>
                            </div>
                            
                            <div class="cor-opcao" data-cor="#002AFF" data-nome="Índigo">
                                <div class="cor-opcao-visual" style="background: #002AFF;"></div>
                                <div class="cor-opcao-info">
                                    <span class="cor-opcao-nome">Índigo</span>
                                    <span class="cor-opcao-hex">#002AFF</span>
                                </div>
                            </div>
                            
                            <div class="cor-opcao" data-cor="#6600FF" data-nome="Violeta">
                                <div class="cor-opcao-visual" style="background: #6600FF;"></div>
                                <div class="cor-opcao-info">
                                    <span class="cor-opcao-nome">Violeta</span>
                                    <span class="cor-opcao-hex">#6600FF</span>
                                </div>
                            </div>
                            
                            <div class="cor-opcao" data-cor="#9400FF" data-nome="Magenta">
                                <div class="cor-opcao-visual" style="background: #9400FF;"></div>
                                <div class="cor-opcao-info">
                                    <span class="cor-opcao-nome">Magenta</span>
                                    <span class="cor-opcao-hex">#9400FF</span>
                                </div>
                            </div>
                            
                            <div class="cor-opcao" data-cor="#FF00F6" data-nome="Rosa Coral">
                                <div class="cor-opcao-visual" style="background: #FF00F6;"></div>
                                <div class="cor-opcao-info">
                                    <span class="cor-opcao-nome">Rosa Coral</span>
                                    <span class="cor-opcao-hex">#FF00F6</span>
                                </div>
                            </div>
                            
                            <div class="cor-opcao" data-cor="#FF007B" data-nome="Rosa Choque">
                                <div class="cor-opcao-visual" style="background: #FF007B;"></div>
                                <div class="cor-opcao-info">
                                    <span class="cor-opcao-nome">Rosa Choque</span>
                                    <span class="cor-opcao-hex">#FF007B</span>
                                </div>
                            </div>
                            
                            <div class="cor-opcao" data-cor="#B0B0B0" data-nome="Cinza">
                                <div class="cor-opcao-visual" style="background: #B0B0B0;"></div>
                                <div class="cor-opcao-info">
                                    <span class="cor-opcao-nome">Cinza</span>
                                    <span class="cor-opcao-hex">#B0B0B0</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="cor-exemplos">
                        <div class="cor-exemplo-label">Pré-visualização:</div>
                        <div class="cor-exemplo-itens">
                            <div class="cor-exemplo-item" id="cor-exemplo-texto">Texto</div>
                            <div class="cor-exemplo-item" id="cor-exemplo-fundo">Fundo</div>
                            <div class="cor-exemplo-item" id="cor-exemplo-borda">Borda</div>
                            <div class="cor-exemplo-item" id="cor-exemplo-botao">Botão</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        const overlay = document.createElement('div');
        overlay.id = 'config-overlay';
        
        document.body.appendChild(botaoConfig);
        document.body.appendChild(overlay);
        document.body.appendChild(painelConfig);
        
        this.adicionarEstilos();
    }

    adicionarEstilos() {
        const estilos = `
            #config-botao {
                position: fixed;
                top: 20px;
                right: 20px;
                width: 50px;
                height: 50px;
                background: var(--bg-card);
                border: 2px solid var(--primary);
                border-radius: 10px;
                color: var(--primary);
                font-size: 28px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                z-index: 1000;
                transition: all 0.3s ease;
                }
            
            #config-botao:hover {
                background: var(--primary);
                transform: scale(1.05) rotate(30deg);
                color: white;
                }
            
            #config-painel {
                position: fixed;
                top: 0;
                right: 0;
                width: 420px;
                height: 100vh;
                background: linear-gradient(145deg, #1a1a22, #14141a);
                border-left: 2px solid var(--border);
                z-index: 2000;
                transform: translateX(100%);
                transition: transform 0.3s ease-out;
                display: flex;
                flex-direction: column;
                overflow: hidden;
            }
            
            #config-painel.aberto {
                transform: translateX(0);
            }
            
            .config-cabecalho {
                padding: 25px 20px;
                border-bottom: 1px solid var(--border);
                display: flex;
                justify-content: space-between;
                align-items: center;
                background: rgba(15, 15, 19, 0.9);
            }
            
            .config-cabecalho h2 {
                margin: 0;
                color: var(--primary);
                font-size: 22px;
                letter-spacing: 1px;
                text-shadow: 0 0 10px var(--primary);
            }
            
            #fechar-config {
                background: transparent;
                border: 2px solid var(--primary);
                color: var(--primary);
                width: 36px;
                height: 36px;
                border-radius: 8px;
                font-size: 24px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s ease;
            }
            
            #fechar-config:hover {
                background: var(--primary);
                transform: rotate(90deg);
                color: white;
            }
            
            .config-conteudo {
                padding: 30px 25px;
                flex-grow: 1;
                display: flex;
                flex-direction: column;
                gap: 30px;
                overflow-y: auto;
            }
            
            .config-secao {
                background: rgba(30, 30, 38, 0.7);
                border-radius: 15px;
                padding: 25px;
                border: 2px solid var(--border);
            }
            
            .config-titulo {
                margin: 0 0 15px 0;
                color: var(--primary);
                font-size: 20px;
                font-weight: bold;
                text-transform: uppercase;
                letter-spacing: 1px;
            }
            
            .config-descricao {
                color: #aaa;
                font-size: 14px;
                line-height: 1.5;
                margin-bottom: 25px;
            }
            
            .seletor-cor-custom {
                width: 100%;
                position: relative;
                margin-bottom: 25px;
            }
            
            .seletor-cor-trigger {
                background: rgba(20, 20, 26, 0.8);
                border: 2px solid var(--border);
                border-radius: 12px;
                padding: 15px;
                cursor: pointer;
                transition: all 0.3s ease;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .seletor-cor-trigger:hover {
                border-color: var(--primary);
                background: rgba(20, 20, 26, 0.9);
                box-shadow: 0 0 15px rgba(58, 134, 255, 0.3);
            }
            
            .seletor-cor-visual {
                display: flex;
                align-items: center;
                gap: 15px;
            }
            
            .seletor-cor-amostra {
                width: 40px;
                height: 40px;
                border-radius: 8px;
                border: 2px solid white;
                box-shadow: 0 0 15px currentColor, inset 0 0 5px rgba(255, 255, 255, 0.2);
                transition: all 0.3s ease;
            }
            
            .seletor-cor-info {
                display: flex;
                flex-direction: column;
                gap: 5px;
            }
            
            .seletor-cor-nome {
                color: #eaeaea;
                font-size: 16px;
                font-weight: bold;
                letter-spacing: 0.5px;
            }
            
            .seletor-cor-seta {
                color: var(--primary);
                font-size: 12px;
                transition: transform 0.3s ease;
                opacity: 0.8;
            }
            
            .seletor-cor-trigger.ativo .seletor-cor-seta {
                transform: rotate(180deg);
                opacity: 1;
            }
            
            .seletor-cor-codigo {
                background: rgba(0, 0, 0, 0.4);
                border: 1px solid var(--border);
                border-radius: 6px;
                padding: 6px 12px;
                color: #eaeaea;
                font-family: 'Share Tech Mono', monospace;
                font-size: 14px;
                font-weight: bold;
                letter-spacing: 1px;
                text-shadow: 0 0 5px currentColor;
            }
            
            .seletor-cor-opcoes {
                position: absolute;
                top: calc(100% + 10px);
                left: 0;
                right: 0;
                background: rgba(20, 20, 26, 0.98);
                border: 2px solid var(--border);
                border-radius: 12px;
                max-height: 200px;
                overflow-y: auto;
                z-index: 10;
                display: none;
                box-shadow: 0 15px 40px rgba(0, 0, 0, 0.7);
                backdrop-filter: blur(10px);
            }
            
            .seletor-cor-opcoes.aberto {
                display: block;
                animation: slideDown 0.3s ease;
            }
            
            @keyframes slideDown {
                from {
                    opacity: 0;
                    transform: translateY(-15px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            .cor-opcao {
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 8px 12px;
                cursor: pointer;
                transition: all 0.2s ease;
                border-bottom: 1px solid rgba(255, 255, 255, 0.08);
            }
            
            .cor-opcao:last-child {
                border-bottom: none;
            }
            
            .cor-opcao:hover {
                background: rgba(58, 134, 255, 0.15);
                transform: translateX(5px);
            }
            
            .cor-opcao.selecionada {
                background: linear-gradient(90deg, rgba(58, 134, 255, 0.2), rgba(58, 134, 255, 0.1));
                position: relative;
                border-left: 3px solid var(--primary);
            }
            
            .cor-opcao.selecionada::after {
                content: '✓';
                position: absolute;
                right: 15px;
                color: var(--primary);
                font-weight: bold;
                font-size: 16px;
                text-shadow: 0 0 5px currentColor;
            }
            
            .cor-opcao-visual {
                width: 24px;
                height: 24px;
                border-radius: 6px;
                border: 2px solid rgba(255, 255, 255, 0.8);
                flex-shrink: 0;
                box-shadow: 0 0 8px rgba(0, 0, 0, 0.3);
            }
            
            .cor-opcao-info {
                display: flex;
                flex-direction: column;
                gap: 2px;
                flex-grow: 1;
            }
            
            .cor-opcao-nome {
                color: #eaeaea;
                font-size: 13px;
                font-weight: 500;
                letter-spacing: 0.3px;
            }
            
            .cor-opcao-hex {
                color: #888;
                font-size: 11px;
                font-family: 'Share Tech Mono', monospace;
                letter-spacing: 0.5px;
            }
            
            .cor-exemplos {
                margin-top: 25px;
                padding-top: 20px;
                border-top: 1px solid rgba(255, 255, 255, 0.1);
            }
            
            .cor-exemplo-label {
                color: #aaa;
                font-size: 13px;
                margin-bottom: 12px;
                font-weight: bold;
                text-transform: uppercase;
                letter-spacing: 1px;
            }
            
            .cor-exemplo-itens {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 12px;
            }
            
            .cor-exemplo-item {
                padding: 12px 8px;
                border-radius: 8px;
                text-align: center;
                font-size: 13px;
                font-weight: bold;
                transition: all 0.3s ease;
                letter-spacing: 0.5px;
            }
            
            #cor-exemplo-texto {
                color: var(--primary);
                background: rgba(58, 134, 255, 0.1);
                border: 1px solid rgba(58, 134, 255, 0.3);
            }
            
            #cor-exemplo-fundo {
                background: var(--primary);
                color: var(--button-text-color, #000);
                font-weight: 800;
                box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.2);
            }
            
            #cor-exemplo-borda {
                border: 3px solid var(--primary);
                color: var(--primary);
                background: rgba(0, 0, 0, 0.3);
            }
            
            #cor-exemplo-botao {
                background: linear-gradient(145deg, var(--primary), rgba(58, 134, 255, 0.7));
                color: var(--button-text-color, #000);
                border: none;
                cursor: default;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
            }
            
            #config-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(15, 15, 19, 0.8);
                backdrop-filter: blur(5px);
                z-index: 1999;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
            }
            
            #config-overlay.ativo {
                opacity: 1;
                visibility: visible;
            }
            
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            
            .config-secao {
                animation: fadeIn 0.4s ease both;
            }
            
            .seletor-cor-opcoes::-webkit-scrollbar {
                width: 6px;
            }
            
            .seletor-cor-opcoes::-webkit-scrollbar-track {
                background: rgba(0, 0, 0, 0.2);
                border-radius: 4px;
            }
            
            .seletor-cor-opcoes::-webkit-scrollbar-thumb {
                background: var(--primary);
                border-radius: 4px;
            }
            
            .seletor-cor-opcoes::-webkit-scrollbar-thumb:hover {
                background: rgba(58, 134, 255, 0.8);
            }
            
            /* CORES SEMPRE BRANCAS - EXCEÇÕES */
            #limpar-historico,
            .tipo-dado-btn:not(.selecionado),
            .filtro-tipo:not(.ativo),
            #btn-carregar-ficha,
            .botao-aba,
            .rolagem-tipo span,
            .barra-botoes-esquerda button,
            .barra-botoes-direita button,
            #fechar-modal,
            .btn-quantidade,        
            #cancelar-item,         
            .botao-cancelar,
            .botao-fechar-modal {
                color: #FFFFFF !important;
            }
            
            /* Atributos clicados ou hover - cores originais */
            .atributo-sigla.texto-clicavel {
                color: var(--primary) !important;
            }
            
            .atributo-sigla.texto-clicavel:hover {
                color: var(--primary) !important;
                text-shadow: 0 0 15px var(--primary) !important;
            }
            
            @media (max-width: 768px) {
                #config-painel {
                    width: 350px;
                }
                
                #config-botao {
                    top: 20px;
                    right: 15px;
                    width: 45px;
                    height: 45px;
                    font-size: 24px;
                }
                
                .config-cabecalho h2 {
                    font-size: 20px;
                }
                
                .config-secao {
                    padding: 20px;
                }
                
                .cor-exemplo-itens {
                    grid-template-columns: repeat(2, 1fr);
                }
                
                .seletor-cor-opcoes {
                    max-height: 150px;
                }
                
                .seletor-cor-trigger {
                    flex-direction: column;
                    gap: 10px;
                    align-items: flex-start;
                }
                
                .seletor-cor-codigo {
                    align-self: flex-end;
                }
                
                .cor-opcao {
                    padding: 6px 10px;
                    gap: 10px;
                }
                
                .cor-opcao-visual {
                    width: 20px;
                    height: 20px;
                }
                
                .cor-opcao-nome {
                    font-size: 12px;
                }
                
                .cor-opcao-hex {
                    font-size: 10px;
                }
            }
            
            @media (max-width: 480px) {
                #config-painel {
                    width: 100%;
                }
                
                .config-conteudo {
                    padding: 20px 15px;
                }
                
                #config-botao {
                    top: 15px;
                    right: 15px;
                    width: 40px;
                    height: 40px;
                    font-size: 20px;
                }
                
                .seletor-cor-trigger {
                    padding: 12px;
                }
                
                .seletor-cor-amostra {
                    width: 35px;
                    height: 35px;
                }
                
                .seletor-cor-nome {
                    font-size: 15px;
                }
                
                .seletor-cor-codigo {
                    font-size: 13px;
                    padding: 5px 10px;
                }
                
                .cor-exemplo-itens {
                    grid-template-columns: repeat(2, 1fr);
                    gap: 10px;
                }
                
                .cor-exemplo-item {
                    padding: 10px;
                    font-size: 12px;
                }
            }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.textContent = estilos;
        document.head.appendChild(styleSheet);
    }

    configurarEventos() {
        const botaoConfig = document.getElementById('config-botao');
        const fecharConfig = document.getElementById('fechar-config');
        const overlay = document.getElementById('config-overlay');
        const trigger = document.getElementById('seletor-cor-trigger');
        const opcoes = document.getElementById('seletor-cor-opcoes');
        const opcoesCores = document.querySelectorAll('.cor-opcao');
        
        botaoConfig.addEventListener('click', () => this.abrirConfiguracoes());
        fecharConfig.addEventListener('click', () => this.fecharConfiguracoes());
        overlay.addEventListener('click', () => this.fecharConfiguracoes());
        
        trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleSeletorCores();
        });
        
        opcoesCores.forEach(opcao => {
            opcao.addEventListener('click', (e) => {
                e.stopPropagation();
                const novaCor = opcao.getAttribute('data-cor');
                const nomeCor = opcao.getAttribute('data-nome');
                this.mudarCorPrimaria(novaCor, nomeCor);
                this.fecharSeletorCores();
            });
        });
        
        document.addEventListener('click', (e) => {
            if (this.seletorAberto && 
                !trigger.contains(e.target) && 
                !opcoes.contains(e.target)) {
                this.fecharSeletorCores();
            }
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (this.seletorAberto) {
                    this.fecharSeletorCores();
                } else {
                    this.fecharConfiguracoes();
                }
            }
        });
        
        document.addEventListener('click', (e) => {
            const menuHamburguer = document.getElementById('menu-hamburguer');
            const configBotao = document.getElementById('config-botao');
            
            if (e.target !== menuHamburguer && e.target !== configBotao) {
                if (this.configAberta) {
                    const painelConfig = document.getElementById('config-painel');
                    if (!painelConfig.contains(e.target)) {
                        this.fecharConfiguracoes();
                    }
                }
            }
        });
    }

    configurarObservers() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    setTimeout(() => {
                        this.aplicarCorTextoBotao();
                    }, 100);
                }
            });
        });

        const fichaContainer = document.querySelector('.ficha-container');
        if (fichaContainer) {
            observer.observe(fichaContainer, {
                childList: true,
                subtree: true
            });
        }

        document.addEventListener('abaMudou', () => {
            setTimeout(() => {
                this.aplicarCorTextoBotao();
            }, 50);
        });
    }

    configurarObserverDinamico() {
        if (this._observer) {
            this._observer.disconnect();
        }
        
        this._observer = new MutationObserver((mutations) => {
            let precisaAtualizar = false;
            
            mutations.forEach(mutation => {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === 1) {
                            if (node.matches && this.isBotao(node)) {
                                precisaAtualizar = true;
                            }
                            if (node.querySelectorAll) {
                                const botoes = node.querySelectorAll('button, .botao-aba, .botao-rolar, .botao-inventario, .botao-adicionar-perk, .filtro-tipo, .tipo-dado-btn, .vd-btn, .botao-acao-minimal, .botao-seguir-trilha, .botao-adicionar-perk-modal, #salvar-item, #cancelar-item');
                                if (botoes.length > 0) {
                                    precisaAtualizar = true;
                                }
                            }
                        }
                    });
                }
            });
            
            if (precisaAtualizar) {
                setTimeout(() => {
                    this.aplicarCorTextoBotao();
                }, 50);
            }
        });
        
        this._observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    isBotao(elemento) {
        return elemento.tagName === 'BUTTON' ||
               elemento.matches('.botao-aba, .botao-rolar, .botao-inventario, .botao-adicionar-perk, .filtro-tipo, .tipo-dado-btn, .vd-btn, .botao-acao-minimal, .botao-seguir-trilha, .botao-adicionar-perk-modal');
    }

    abrirConfiguracoes() {
        const painel = document.getElementById('config-painel');
        const overlay = document.getElementById('config-overlay');
        
        this.fecharMenuHamburguer();
        
        painel.classList.add('aberto');
        overlay.classList.add('ativo');
        this.configAberta = true;
        
        this.atualizarDisplayCor();
        this.marcarCorAtual();
    }

    fecharConfiguracoes() {
        const painel = document.getElementById('config-painel');
        const overlay = document.getElementById('config-overlay');
        
        painel.classList.remove('aberto');
        overlay.classList.remove('ativo');
        this.configAberta = false;
        this.fecharSeletorCores();
    }

    toggleSeletorCores() {
        const trigger = document.getElementById('seletor-cor-trigger');
        const opcoes = document.getElementById('seletor-cor-opcoes');
        
        if (this.seletorAberto) {
            this.fecharSeletorCores();
        } else {
            this.abrirSeletorCores();
        }
    }

    abrirSeletorCores() {
        const trigger = document.getElementById('seletor-cor-trigger');
        const opcoes = document.getElementById('seletor-cor-opcoes');
        
        trigger.classList.add('ativo');
        opcoes.classList.add('aberto');
        this.seletorAberto = true;
    }

    fecharSeletorCores() {
        const trigger = document.getElementById('seletor-cor-trigger');
        const opcoes = document.getElementById('seletor-cor-opcoes');
        
        trigger.classList.remove('ativo');
        opcoes.classList.remove('aberto');
        this.seletorAberto = false;
    }

    fecharMenuHamburguer() {
        const painelLateral = document.getElementById('painel-lateral');
        const menuOverlay = document.getElementById('menu-overlay');
        
        if (painelLateral && menuOverlay) {
            painelLateral.classList.remove('aberto');
            menuOverlay.classList.remove('ativo');
        }
    }

    atualizarDisplayCor() {
        const amostra = document.getElementById('seletor-cor-amostra');
        const nome = document.getElementById('seletor-cor-nome');
        const codigo = document.getElementById('seletor-cor-codigo');
        
        if (amostra && nome && codigo) {
            amostra.style.backgroundColor = this.corPrimaria;
            amostra.style.boxShadow = `0 0 15px ${this.corPrimaria}, inset 0 0 5px rgba(255, 255, 255, 0.2)`;
            nome.textContent = this.corSelecionadaNome;
            codigo.textContent = this.corPrimaria.toUpperCase();
            codigo.style.textShadow = `0 0 5px ${this.corPrimaria}`;
            
            this.atualizarExemplosCor();
        }
    }

    marcarCorAtual() {
        const opcoesCores = document.querySelectorAll('.cor-opcao');
        opcoesCores.forEach(opcao => {
            if (opcao.getAttribute('data-cor') === this.corPrimaria) {
                opcao.classList.add('selecionada');
            } else {
                opcao.classList.remove('selecionada');
            }
        });
    }

    atualizarExemplosCor() {
        const textoExemplo = document.getElementById('cor-exemplo-texto');
        const fundoExemplo = document.getElementById('cor-exemplo-fundo');
        const bordaExemplo = document.getElementById('cor-exemplo-borda');
        const botaoExemplo = document.getElementById('cor-exemplo-botao');
        const corTexto = this.getContrastColor(this.corPrimaria);
        
        if (textoExemplo) {
            textoExemplo.style.color = this.corPrimaria;
            textoExemplo.style.borderColor = this.corPrimaria + '4D';
            textoExemplo.style.background = this.corPrimaria + '1A';
        }
        
        if (fundoExemplo) {
            fundoExemplo.style.background = this.corPrimaria;
            fundoExemplo.style.color = corTexto;
        }
        
        if (bordaExemplo) {
            bordaExemplo.style.borderColor = this.corPrimaria;
            bordaExemplo.style.color = this.corPrimaria;
        }
        
        if (botaoExemplo) {
            const corClara = this.lightenColor(this.corPrimaria, 20);
            botaoExemplo.style.background = `linear-gradient(145deg, ${this.corPrimaria}, ${corClara})`;
            botaoExemplo.style.color = corTexto;
        }
    }

    aplicarCorPrimaria() {
        const cor = this.corPrimaria;
        const glowColor = this.corPrimaria + '80';
        
        document.documentElement.style.setProperty('--primary', cor);
        document.documentElement.style.setProperty('--primary-glow', glowColor);
        
        localStorage.setItem('corPrimaria', cor);
        localStorage.setItem('corPrimariaNome', this.corSelecionadaNome);
        
        this.atualizarDisplayCor();
        this.notificarObservers();
        
        this.aplicarCorTextoBotao();
    }

    aplicarCorTextoBotao() {
        const corTexto = this.getContrastColor(this.corPrimaria);
        
        document.documentElement.style.setProperty('--button-text-color', corTexto);
        
        const seletoresComContraste = [
            '.botao-rolar',
            '.botao-inventario',
            '.botao-adicionar-perk',
            '.botao-salvar-item',
            '.botao-limpar',
            '.botao-salvar',
            '.botao-acao-minimal',
            '.botao-seguir-trilha',
            '.botao-adicionar-perk-modal',
            '.tipo-dado-btn.selecionado',
            '.filtro-tipo.ativo',
            '.vd-btn',
            '.botao-acao',
            '.botao-editar',
            '.botao-remover',
            '#salvar-item',
            '.perk-remover',
            '[role="button"]'
        ];

        seletoresComContraste.forEach(seletor => {
            const elementos = document.querySelectorAll(seletor);
            elementos.forEach(elemento => {
                if (!this.isExcecao(elemento)) {
                    elemento.style.color = corTexto;
                }
            });
        });

        this.aplicarExcecoesBrancas();
    }

isExcecao(elemento) {
    const excecoes = [
        '#limpar-historico',
        '.tipo-dado-btn:not(.selecionado)',
        '.filtro-tipo:not(.ativo)',
        '#btn-carregar-ficha',
        '#btn-limpar-dados',
        '.botao-aba',
        '.rolagem-tipo span',
        '.rolagem-tipo input:checked + span',
        '.barra-botoes-esquerda button',
        '.barra-botoes-direita button',
        '#fechar-modal',
        '.botao-fechar-modal',
        '.atributo-sigla.texto-clicavel',
        '.atributo-sigla.texto-clicavel:hover',
        '.btn-quantidade',
        '#cancelar-item',
        '.botao-cancelar'
    ];

        let alvo = elemento;
        while (alvo) {
            for (const seletor of excecoes) {
                if (alvo.matches && alvo.matches(seletor)) {
                    return true;
                }
            }
            alvo = alvo.parentElement;
        }

        return false;
    }

    aplicarExcecoesBrancas() {
        const excecoes = [
            '#limpar-historico',
            '.tipo-dado-btn:not(.selecionado)',
            '.filtro-tipo:not(.ativo)',
            '#btn-carregar-ficha',
            '#btn-limpar-dados',
            '.botao-aba',
            '.rolagem-tipo span',
            '.barra-botoes-esquerda button',
            '.barra-botoes-direita button',
            '#fechar-modal',
            '.botao-fechar-modal',
            '.btn-quantidade',    
            '#cancelar-item',         
            '.botao-cancelar'        
         ];

        excecoes.forEach(seletor => {
            const elementos = document.querySelectorAll(seletor);
            elementos.forEach(elemento => {
                elemento.style.color = '#FFFFFF !important';
                elemento.style.setProperty('color', '#FFFFFF', 'important');
            });
        });

        document.querySelectorAll('.atributo-sigla.texto-clicavel').forEach(el => {
            el.style.setProperty('color', 'var(--primary)', 'important');
        });
    }

    getContrastColor(hexColor) {
        hexColor = hexColor.replace('#', '');
        
        let r, g, b;
        if (hexColor.length === 3) {
            r = parseInt(hexColor[0] + hexColor[0], 16);
            g = parseInt(hexColor[1] + hexColor[1], 16);
            b = parseInt(hexColor[2] + hexColor[2], 16);
        } else if (hexColor.length === 6) {
            r = parseInt(hexColor.slice(0, 2), 16);
            g = parseInt(hexColor.slice(2, 4), 16);
            b = parseInt(hexColor.slice(4, 6), 16);
        } else {
            return '#FFFFFF';
        }
        
        const luminancia = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        return luminancia > 0.5 ? '#000000' : '#FFFFFF';
    }

    lightenColor(hex, percent) {
        hex = hex.replace('#', '');
        
        let r, g, b;
        if (hex.length === 3) {
            r = parseInt(hex[0] + hex[0], 16);
            g = parseInt(hex[1] + hex[1], 16);
            b = parseInt(hex[2] + hex[2], 16);
        } else if (hex.length === 6) {
            r = parseInt(hex.slice(0, 2), 16);
            g = parseInt(hex.slice(2, 4), 16);
            b = parseInt(hex.slice(4, 6), 16);
        } else {
            return hex;
        }
        
        const newR = Math.min(255, Math.floor(r + (255 - r) * (percent / 100)));
        const newG = Math.min(255, Math.floor(g + (255 - g) * (percent / 100)));
        const newB = Math.min(255, Math.floor(b + (255 - b) * (percent / 100)));
        
        const toHex = (n) => {
            const hex = n.toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        };
        
        return `#${toHex(newR)}${toHex(newG)}${toHex(newB)}`;
    }

    mudarCorPrimaria(novaCor, nomeCor) {
        this.corPrimaria = novaCor;
        this.corSelecionadaNome = nomeCor;
        this.aplicarCorPrimaria();
        this.aplicarCorTextoBotao();
        
        const botaoConfig = document.getElementById('config-botao');
        botaoConfig.style.animation = 'none';
        setTimeout(() => {
            botaoConfig.style.animation = 'pulse 0.5s';
        }, 10);
        
        this.marcarCorAtual();
    }

    addObserver(observer) {
        this.observers.push(observer);
    }

    removeObserver(observer) {
        this.observers = this.observers.filter(obs => obs !== observer);
    }

    notificarObservers() {
        this.observers.forEach(observer => {
            if (observer && typeof observer.update === 'function') {
                observer.update(this.corPrimaria);
            }
        });
    }

    getCorPrimaria() {
        return this.corPrimaria;
    }

    getCorTexto() {
        return this.getContrastColor(this.corPrimaria);
    }
}