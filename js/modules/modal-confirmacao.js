export class ModalConfirmacao {
    constructor() {
        this.modal = null;
        this.overlay = null;
        this.resolve = null;
        this.criarModal();
    }

    criarModal() {
        this.overlay = document.createElement('div');
        this.overlay.className = 'modal-confirmacao-overlay';
        this.overlay.id = 'modal-confirmacao-overlay';
        this.overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(15, 15, 19, 0.95);
            display: none;
            justify-content: center;
            align-items: center;
            z-index: 5000;
            backdrop-filter: blur(8px);
        `;

        this.modal = document.createElement('div');
        this.modal.className = 'modal-confirmacao';
        this.modal.id = 'modal-confirmacao';
        this.modal.style.cssText = `
            background: linear-gradient(145deg, #1c1c22, #16161c);
            border-radius: 16px;
            width: 100%;
            max-width: 420px;
            border: 2px solid var(--border);
            overflow: hidden;
            animation: slideInModal 0.3s ease-out;
            max-height: 80vh;
            display: flex;
            flex-direction: column;
        `;

        this.modal.innerHTML = `
            <div class="modal-confirmacao-cabecalho" style="
                padding: 20px 24px;
                border-bottom: 1px solid var(--border);
                background: rgba(15, 15, 19, 0.9);
                flex-shrink: 0;
            ">
                <h2 id="modal-confirmacao-titulo" style="
                    margin: 0;
                    color: var(--primary);
                    font-size: 18px;
                    font-weight: bold;
                    letter-spacing: 0.5px;
                ">Confirmar Ação</h2>
            </div>
            <div class="modal-confirmacao-conteudo" style="
                padding: 24px;
                flex-grow: 1;
                overflow-y: auto;
            ">
                <p id="modal-confirmacao-mensagem" style="
                    color: #ddd;
                    font-size: 15px;
                    line-height: 1.6;
                    margin: 0;
                ">Tem certeza que deseja realizar esta ação?</p>
            </div>
            <div class="modal-confirmacao-rodape" style="
                padding: 16px 24px;
                border-top: 1px solid var(--border);
                background: rgba(15, 15, 19, 0.9);
                display: flex;
                justify-content: flex-end;
                gap: 12px;
                flex-shrink: 0;
            ">
                <button id="modal-confirmacao-cancelar" class="botao-confirmacao-cancelar" style="
                    background: transparent;
                    border: 2px solid var(--border);
                    color: #aaa;
                    padding: 10px 24px;
                    border-radius: 8px;
                    font-size: 14px;
                    font-weight: bold;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    font-family: 'Share Tech Mono', monospace;
                    min-width: 100px;
                    display: none;
                ">Cancelar</button>
                <button id="modal-confirmacao-confirmar" class="botao-confirmacao-confirmar" style="
                    background: var(--primary);
                    border: none;
                    color: var(--button-text-color);
                    padding: 10px 24px;
                    border-radius: 8px;
                    font-size: 14px;
                    font-weight: bold;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    font-family: 'Share Tech Mono', monospace;
                    min-width: 120px;
                ">Confirmar</button>
            </div>
        `;

        this.overlay.appendChild(this.modal);
        document.body.appendChild(this.overlay);

        this.adicionarEstilos();

        const btnCancelar = this.modal.querySelector('#modal-confirmacao-cancelar');
        const btnConfirmar = this.modal.querySelector('#modal-confirmacao-confirmar');

        btnCancelar.addEventListener('click', () => {
            this.fechar(false);
        });

        btnConfirmar.addEventListener('click', () => {
            this.fechar(true);
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.overlay.style.display === 'flex') {
                if (btnCancelar.style.display === 'none') {
                    this.fechar(true);
                } else {
                    this.fechar(false);
                }
            }
        });

        this.overlay.addEventListener('click', (e) => {
            if (e.target === this.overlay) {
                if (btnCancelar.style.display === 'none') {
                    this.fechar(true);
                } else {
                    this.fechar(false);
                }
            }
        });

        btnCancelar.addEventListener('mouseenter', () => {
            btnCancelar.style.borderColor = '#fff';
            btnCancelar.style.color = '#fff';
            btnCancelar.style.background = 'rgba(255, 255, 255, 0.05)';
        });
        btnCancelar.addEventListener('mouseleave', () => {
            btnCancelar.style.borderColor = 'var(--border)';
            btnCancelar.style.color = '#aaa';
            btnCancelar.style.background = 'transparent';
        });

        btnConfirmar.addEventListener('mouseenter', () => {
            btnConfirmar.style.transform = 'translateY(-2px)';
        });
        btnConfirmar.addEventListener('mouseleave', () => {
            btnConfirmar.style.transform = 'translateY(0)';
        });
    }

    adicionarEstilos() {
        const style = document.createElement('style');
        style.textContent = `
            .modal-confirmacao-overlay {
                animation: fadeInOverlay 0.3s ease;
            }

            @keyframes fadeInOverlay {
                from { opacity: 0; }
                to { opacity: 1; }
            }

            @keyframes slideInModal {
                from {
                    opacity: 0;
                    transform: translateY(-20px) scale(0.95);
                }
                to {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
            }

            .botao-confirmacao-cancelar:active {
                transform: scale(0.98);
            }

            .botao-confirmacao-confirmar:active {
                transform: scale(0.98);
            }

            .modal-confirmacao-conteudo::-webkit-scrollbar {
                width: 6px;
            }

            .modal-confirmacao-conteudo::-webkit-scrollbar-track {
                background: rgba(0, 0, 0, 0.2);
                border-radius: 4px;
            }

            .modal-confirmacao-conteudo::-webkit-scrollbar-thumb {
                background: var(--primary);
                border-radius: 4px;
            }

            .modal-confirmacao-conteudo::-webkit-scrollbar-thumb:hover {
                background: rgba(58, 134, 255, 0.8);
            }

            @media (max-width: 480px) {
                .modal-confirmacao {
                    max-width: 95%;
                    margin: 0 10px;
                }

                .modal-confirmacao-cabecalho h2 {
                    font-size: 16px;
                }

                .modal-confirmacao-conteudo {
                    padding: 20px;
                }

                .modal-confirmacao-conteudo p {
                    font-size: 14px;
                }

                .modal-confirmacao-rodape {
                    flex-direction: column;
                    gap: 10px;
                }

                .modal-confirmacao-rodape button {
                    width: 100%;
                    min-width: unset;
                    justify-content: center;
                }

                /* Em alerta (um botão), o botão ocupa toda a largura */
                .modal-confirmacao-rodape.um-botao {
                    flex-direction: column;
                }
                
                .modal-confirmacao-rodape.um-botao button {
                    width: 100%;
                }
            }
        `;
        document.head.appendChild(style);
    }

    alertar(titulo, mensagem, textoBotao = 'OK') {
        return new Promise((resolve) => {
            this.resolve = resolve;

            const tituloEl = this.modal.querySelector('#modal-confirmacao-titulo');
            const mensagemEl = this.modal.querySelector('#modal-confirmacao-mensagem');
            const btnConfirmar = this.modal.querySelector('#modal-confirmacao-confirmar');
            const btnCancelar = this.modal.querySelector('#modal-confirmacao-cancelar');
            const rodape = this.modal.querySelector('.modal-confirmacao-rodape');

            if (tituloEl) tituloEl.textContent = titulo || 'Atenção';
            if (mensagemEl) mensagemEl.textContent = mensagem || '';
            if (btnConfirmar) btnConfirmar.textContent = textoBotao || 'OK';
            
            btnCancelar.style.display = 'none';
            
            rodape.classList.add('um-botao');

            btnConfirmar.style.width = '100%';
            btnConfirmar.style.minWidth = 'unset';

            this.overlay.style.display = 'flex';
        });
    }

    confirmar(titulo, mensagem, textoConfirmar = 'Confirmar', textoCancelar = 'Cancelar') {
        return new Promise((resolve) => {
            this.resolve = resolve;

            const tituloEl = this.modal.querySelector('#modal-confirmacao-titulo');
            const mensagemEl = this.modal.querySelector('#modal-confirmacao-mensagem');
            const btnConfirmar = this.modal.querySelector('#modal-confirmacao-confirmar');
            const btnCancelar = this.modal.querySelector('#modal-confirmacao-cancelar');
            const rodape = this.modal.querySelector('.modal-confirmacao-rodape');

            if (tituloEl) tituloEl.textContent = titulo || 'Confirmar Ação';
            if (mensagemEl) mensagemEl.textContent = mensagem || 'Tem certeza que deseja realizar esta ação?';
            if (btnConfirmar) btnConfirmar.textContent = textoConfirmar || 'Confirmar';
            if (btnCancelar) btnCancelar.textContent = textoCancelar || 'Cancelar';
            
            btnCancelar.style.display = 'block';
            btnCancelar.style.width = '';
            
            rodape.classList.remove('um-botao');

            btnConfirmar.style.width = '';
            btnConfirmar.style.minWidth = '120px';

            this.overlay.style.display = 'flex';
        });
    }

    mostrar(titulo, mensagem, textoConfirmar = 'Confirmar', textoCancelar = 'Cancelar') {
        if (!textoCancelar || textoCancelar === '') {
            return this.alertar(titulo, mensagem, textoConfirmar);
        }
        return this.confirmar(titulo, mensagem, textoConfirmar, textoCancelar);
    }

    fechar(resultado) {
        this.overlay.style.display = 'none';
        if (this.resolve) {
            this.resolve(resultado);
            this.resolve = null;
        }
    }

    static async alertar(titulo, mensagem, textoBotao = 'OK') {
        const modal = new ModalConfirmacao();
        return await modal.alertar(titulo, mensagem, textoBotao);
    }

    static async confirmar(titulo, mensagem, textoConfirmar = 'Confirmar', textoCancelar = 'Cancelar') {
        const modal = new ModalConfirmacao();
        return await modal.confirmar(titulo, mensagem, textoConfirmar, textoCancelar);
    }
}