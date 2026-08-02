export class SistemaAbas {
    constructor() {
        this.abaAtual = 'informacoes';
        this.inicializarMenu();
        this.configurarEventos();
        this.atualizarConteudo();
    }

    inicializarMenu() {
        const botaoMenu = document.createElement('div');
        botaoMenu.id = 'menu-hamburguer';
        botaoMenu.innerHTML = '☰';
        botaoMenu.title = 'Menu';
        
        const painelLateral = document.createElement('div');
        painelLateral.id = 'painel-lateral';
        
        painelLateral.innerHTML = `
            <div class="painel-cabecalho">
                <h2>Menu</h2>
                <button id="fechar-painel">×</button>
            </div>
            <div class="painel-conteudo">
                <button class="botao-aba" data-aba="informacoes">
                    <span>Informações Gerais</span>
                </button>
                <button class="botao-aba" data-aba="pericias">
                    <span>Perícias</span>
                </button>
                <button class="botao-aba" data-aba="dados">
                    <span>Dados</span>
                </button>
                <button class="botao-aba" data-aba="inventario">
                    <span>Inventário</span>
                </button>
                <button class="botao-aba" data-aba="trilhas-perks">
                    <span>Trilhas e Perks</span>
                </button>
            </div>
        `;
        
        const overlay = document.createElement('div');
        overlay.id = 'menu-overlay';
        
        document.body.appendChild(botaoMenu);
        document.body.appendChild(overlay);
        document.body.appendChild(painelLateral);
        
        this.adicionarEstilos();
    }

    adicionarEstilos() {
        const estilos = `
            /* BOTÃO HAMBURGUER */
            #menu-hamburguer {
                position: fixed;
                top: 20px;
                left: 20px;
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
            
            #menu-hamburguer:hover {
                background: var(--primary);
                color: white;
                transform: scale(1.05);
                }
            
            /* PAINEL LATERAL */
            #painel-lateral {
                position: fixed;
                top: 0;
                left: 0;
                width: 300px;
                height: 100vh;
                background: linear-gradient(145deg, #1a1a22, #14141a);
                border-right: 2px solid var(--border);
                z-index: 2000;
                transform: translateX(-100%);
                transition: transform 0.3s ease-out;
                box-shadow: 10px 0 40px rgba(0, 0, 0, 0.6);
                display: flex;
                flex-direction: column;
                overflow: hidden;
            }
            
            #painel-lateral.aberto {
                transform: translateX(0);
            }
            
            /* CABEÇALHO DO PAINEL */
            .painel-cabecalho {
                padding: 25px 20px;
                border-bottom: 1px solid var(--border);
                display: flex;
                justify-content: space-between;
                align-items: center;
                background: rgba(15, 15, 19, 0.9);
            }
            
            .painel-cabecalho h2 {
                margin: 0;
                color: var(--primary);
                font-size: 22px;
                letter-spacing: 1px;
                text-shadow: 0 0 10px var(--primary);
            }
            
            #fechar-painel {
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
            
            #fechar-painel:hover {
                background: var(--primary);
                color: white;
                transform: rotate(90deg);
            }
            
            /* CONTEÚDO DO PAINEL */
            .painel-conteudo {
                padding: 25px 20px;
                flex-grow: 1;
                display: flex;
                flex-direction: column;
                gap: 15px;
            }
            
            /* BOTÕES DAS ABAS */
            .botao-aba {
                background: var(--bg-card);
                border: 2px solid var(--border);
                border-radius: 12px;
                padding: 18px 20px;
                color: #eaeaea;
                font-size: 16px;
                font-family: 'Share Tech Mono', monospace;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 15px;
                transition: all 0.3s ease;
                text-align: left;
                position: relative;
                overflow: hidden;
            }
            
            .botao-aba:hover {
                border-color: var(--primary);
                transform: translateX(5px);
                }
            
            .botao-aba.ativa {
                border-color: var(--primary);
                }
            
            .botao-aba.ativa .icone-aba {
                text-shadow: 0 0 15px rgba(68, 170, 255, 0.8);
            }
            
            /* OVERLAY */
            #menu-overlay {
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
            
            #menu-overlay.ativo {
                opacity: 1;
                visibility: visible;
            }
            
            /* CONTEÚDO DAS ABAS */
            .conteudo-aba {
                display: none;
                animation: fadeIn 0.4s ease;
            }
            
            .conteudo-aba.ativa {
                display: block;
            }
            
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            
            /* TÍTULO DA ABA PERÍCIAS */
            .titulo-pericias {
                text-align: center;
                color: var(--primary);
                font-size: 32px;
                margin: 40px 0;
                text-shadow: 0 0 15px var(--primary);
                letter-spacing: 2px;
                position: relative;
                padding-bottom: 15px;
            }
            
            /* ESTILOS RESPONSIVOS */
            @media (max-width: 768px) {
                #painel-lateral {
                    width: 280px;
                }
                
                #menu-hamburguer {
                    top: 15px;
                    left: 15px;
                    width: 45px;
                    height: 45px;
                    font-size: 24px;
                }
                
                .botao-aba {
                    padding: 15px;
                    font-size: 15px;
                }
                
                .painel-cabecalho h2 {
                    font-size: 20px;
                }
            }
            
            @media (max-width: 480px) {
                #painel-lateral {
                    width: 100%;
                }
                
                .painel-conteudo {
                    padding: 20px 15px;
                }
            }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.textContent = estilos;
        document.head.appendChild(styleSheet);
    }

    configurarEventos() {
        const botaoHamburguer = document.getElementById('menu-hamburguer');
        const fecharPainel = document.getElementById('fechar-painel');
        const overlay = document.getElementById('menu-overlay');
        const botoesAbas = document.querySelectorAll('.botao-aba');
        
        botaoHamburguer.addEventListener('click', () => this.abrirMenu());
        
        fecharPainel.addEventListener('click', () => this.fecharMenu());
        overlay.addEventListener('click', () => this.fecharMenu());
        
        botoesAbas.forEach(botao => {
            botao.addEventListener('click', () => {
                const aba = botao.getAttribute('data-aba');
                this.mudarAba(aba);
                this.fecharMenu();
            });
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.fecharMenu();
            }
        });
    }

    abrirMenu() {
        const painel = document.getElementById('painel-lateral');
        const overlay = document.getElementById('menu-overlay');
        
        painel.classList.add('aberto');
        overlay.classList.add('ativo');
        
        document.querySelectorAll('.botao-aba').forEach(botao => {
            if (botao.getAttribute('data-aba') === this.abaAtual) {
                botao.classList.add('ativa');
            } else {
                botao.classList.remove('ativa');
            }
        });
    }

    fecharMenu() {
        const painel = document.getElementById('painel-lateral');
        const overlay = document.getElementById('menu-overlay');
        
        painel.classList.remove('aberto');
        overlay.classList.remove('ativo');
    }

    mudarAba(aba) {
        this.abaAtual = aba;
        this.atualizarConteudo();
        
        document.dispatchEvent(new CustomEvent('abaMudou', {
            detail: { aba: this.abaAtual }
        }));
    }

    atualizarConteudo() {
        document.querySelectorAll('.conteudo-aba').forEach(aba => {
            aba.classList.remove('ativa');
        });
        
        const abaAtualElement = document.getElementById(`aba-${this.abaAtual}`);
        if (abaAtualElement) {
            abaAtualElement.classList.add('ativa');
        }
        
        document.querySelectorAll('.botao-aba').forEach(botao => {
            if (botao.getAttribute('data-aba') === this.abaAtual) {
                botao.classList.add('ativa');
            } else {
                botao.classList.remove('ativa');
            }
        });
        
        this.atualizarTitulo();
    }

    atualizarTitulo() {
        const titulos = {
            'informacoes': 'Informações',
            'pericias': 'Perícias',
            'dados': 'Dados',
            'inventario': 'Inventário',
            'trilhas-perks': 'Trilhas e Perks'
        };
        
        if (titulos[this.abaAtual]) {
            document.title = titulos[this.abaAtual];
        }
    }
}