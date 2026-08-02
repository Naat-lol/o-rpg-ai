export class GerenciadorCondicoes {
    constructor() {
        this.condicoes = {
            'lesao-grave': document.querySelector('input[type="checkbox"]:nth-of-type(1)'),
            'em-choque': document.querySelector('input[type="checkbox"]:nth-of-type(2)'),
            'inconsciente': document.querySelector('input[type="checkbox"]:nth-of-type(3)'),
            'insanidade': document.querySelector('input[type="checkbox"]:nth-of-type(4)')
        };

        this.body = document.body;
        this.fichaContainer = document.querySelector('.ficha-container');
        this.barraVida = document.querySelector('.barra-container.vida .barra');
        this.tituloVida = document.querySelector('.barra-container.vida .barra-titulo');
        this.barraPreenchimentoVida = document.querySelector('.barra-container.vida .barra-preenchimento');
        this.atributosContainers = document.querySelectorAll('.atributo-item');
        this.textos = this.selecionarTextosParaInsanidade();

        this.inicializarEventos();
        this.injetarEstilosCSS();
    }

    selecionarTextosParaInsanidade() {
        return document.querySelectorAll(`
            .atributo-sigla, .atributo-nome, .barra-titulo,
            .dados-basicos input::placeholder, .status label
        `);
    }

    inicializarEventos() {
        Object.entries(this.condicoes).forEach(([nome, checkbox]) => {
            checkbox.addEventListener('change', () => {
                this.aplicarEfeitos(nome, checkbox.checked);
                this.verificarCombinacoes();
            });
        });
    }

    aplicarEfeitos(condicao, ativado) {
        if (ativado) {
            this.body.classList.add(`condicao-${condicao}`);
            this.aplicarEfeitosEspecificos(condicao, true);
        } else {
            this.body.classList.remove(`condicao-${condicao}`);
            this.aplicarEfeitosEspecificos(condicao, false);
        }
    }

    aplicarEfeitosEspecificos(condicao, ativado) {
        switch (condicao) {
            case 'lesao-grave':
                if (ativado) {
                    this.fichaContainer.classList.add('fundo-avermelhado-piscando');
                    this.tituloVida.classList.add('piscando-vermelho', 'tremor-leve');
                    this.barraPreenchimentoVida.classList.add('piscando-vermelho', 'tremor-leve');
                } else {
                    this.fichaContainer.classList.remove('fundo-avermelhado-piscando');
                    this.tituloVida.classList.remove('piscando-vermelho', 'tremor-leve');
                    this.barraPreenchimentoVida.classList.remove('piscando-vermelho', 'tremor-leve');
                }
                break;

            case 'em-choque':
                if (ativado) {
                    this.fichaContainer.classList.add('fundo-azulado-piscando');
                    this.atributosContainers.forEach(container => {
                        container.classList.add('tremor-sincronizado');
                    });
                } else {
                    this.fichaContainer.classList.remove('fundo-azulado-piscando');
                    this.atributosContainers.forEach(container => {
                        container.classList.remove('tremor-sincronizado');
                    });
                }
                break;

            case 'inconsciente':
                if (ativado) {
                    this.fichaContainer.classList.add('tela-escura');
                } else {
                    this.fichaContainer.classList.remove('tela-escura');
                }
                break;

            case 'insanidade':
                this.textos.forEach(texto => {
                    if (ativado) {
                        texto.classList.add('insanidade-texto');
                    } else {
                        texto.classList.remove('insanidade-texto');
                    }
                });
                break;
        }
    }

    verificarCombinacoes() {
        const ativadas = Object.entries(this.condicoes)
            .filter(([, checkbox]) => checkbox.checked)
            .map(([nome]) => nome);

        if (ativadas.includes('lesao-grave') && ativadas.includes('em-choque')) {
            this.barraVida.classList.add('tremor-intenso');
            this.atributosContainers.forEach(container => {
                container.classList.add('tremor-intenso');
            });
        } else {
            this.barraVida.classList.remove('tremor-intenso');
            this.atributosContainers.forEach(container => {
                container.classList.remove('tremor-intenso');
            });
        }

        if (ativadas.includes('inconsciente') && ativadas.includes('insanidade')) {
            this.fichaContainer.classList.add('tela-muito-escura');
            this.textos.forEach(texto => {
                texto.classList.add('insanidade-lenta');
            });
        } else {
            this.fichaContainer.classList.remove('tela-muito-escura');
            this.textos.forEach(texto => {
                texto.classList.remove('insanidade-lenta');
            });
        }

        if (ativadas.includes('lesao-grave') && ativadas.includes('insanidade')) {
            this.textos.forEach(texto => {
                texto.classList.add('piscando-vermelho');
            });
        } else {
            this.textos.forEach(texto => {
                texto.classList.remove('piscando-vermelho');
            });
        }

        if (ativadas.includes('em-choque') && ativadas.includes('inconsciente')) {
            this.fichaContainer.classList.add('fundo-azulado-escuro');
            this.atributosContainers.forEach(container => {
                container.classList.add('tremor-lento');
            });
        } else {
            this.fichaContainer.classList.remove('fundo-azulado-escuro');
            this.atributosContainers.forEach(container => {
                container.classList.remove('tremor-lento');
            });
        }
    }

    injetarEstilosCSS() {
        const style = document.createElement('style');
        style.textContent = `
            /* Efeitos para Lesão Grave */
            .fundo-avermelhado-piscando {
                animation: piscar-avermelhado 2s infinite ease-in-out;
            }
            @keyframes piscar-avermelhado {
                0%, 100% { background-color: rgba(255, 59, 59, 0.1); }
                50% { background-color: rgba(255, 59, 59, 0.3); }
            }
            .piscando-vermelho {
                animation: piscar-vermelho 1.5s infinite ease-in-out;
            }
            @keyframes piscar-vermelho {
                0%, 100% { color: #ff3b3b; text-shadow: 0 0 8px rgba(255,59,59,0.7); }
                50% { color: #ff5555; text-shadow: 0 0 12px rgba(255,59,59,0.9); }
            }
            .tremor-leve {
                animation: tremor 0.1s infinite alternate;
            }
            @keyframes tremor {
                0% { transform: translateX(0); }
                100% { transform: translateX(1px); }
            }

            /* Efeitos para Em Choque */
            .fundo-azulado-piscando {
                animation: piscar-azulado 3s infinite ease-in-out;
            }
            @keyframes piscar-azulado {
                0%, 100% { background-color: rgba(68, 170, 255, 0.1); }
                50% { background-color: rgba(68, 170, 255, 0.2); }
            }
            .tremor-sincronizado {
                animation: tremor-sinc 0.2s infinite alternate;
            }
            @keyframes tremor-sinc {
                0% { transform: translateX(-1px); }
                100% { transform: translateX(1px); }
            }

            /* Efeitos para Inconsciente */
            .tela-escura {
                filter: brightness(0.7);
                transition: filter 0.5s ease;
            }

            /* Efeitos para Insanidade */
            .insanidade-texto {
                animation: arco-iris 5s infinite linear;
            }
            @keyframes arco-iris {
                0% { color: #ff0000; }
                14% { color: #ff7f00; }
                28% { color: #ffff00; }
                42% { color: #00ff00; }
                57% { color: #0000ff; }
                71% { color: #4b0082; }
                85% { color: #9400d3; }
                100% { color: #ff0000; }
            }

            /* Combinações */
            .tremor-intenso {
                animation: tremor-intenso 0.05s infinite alternate !important;
            }
            @keyframes tremor-intenso {
                0% { transform: translateX(-2px); }
                100% { transform: translateX(2px); }
            }
            .tela-muito-escura {
                filter: brightness(0.5) !important;
            }
            .insanidade-lenta {
                animation-duration: 10s !important;
            }
            .fundo-azulado-escuro {
                animation: piscar-azulado-escuro 3s infinite ease-in-out;
            }
            @keyframes piscar-azulado-escuro {
                0%, 100% { background-color: rgba(0, 0, 139, 0.2); }
                50% { background-color: rgba(0, 0, 139, 0.4); }
            }
            .tremor-lento {
                animation-duration: 0.4s !important;
            }
        `;
        document.head.appendChild(style);
    }
}