import { ModalConfirmacao } from './modal-confirmacao.js';

export class SistemaDadosPersonalizados {
    constructor(sistemaDados) {
        this.sistemaDados = sistemaDados;
        this.tiposDados = ['d4', 'd6', 'd8', 'd10', 'd12', 'd20', 'd100'];
        this.tipoDadoSelecionado = 'd20';
        this.quantidade = 1;
        this.modificador = 0;
        this.tipoRolagem = 'normal';
        this.vantagensDesvantagens = 1;
        
        this.opcoesExibicao = [
            { id: 'somente-somado', nome: 'Somente Somado', desc: 'Mostra apenas o resultado final' },
            { id: 'separado', nome: 'Resultados Separados', desc: 'Mostra cada dado individualmente' },
            { id: 'separado-e-somado', nome: 'Separado e Somado', desc: 'Mostra ambos os resultados' }
        ];
        this.exibicaoSelecionada = 'somente-somado';
        this.seletorAberto = false;
        
        this.inicializar();
        this.observarHistorico();
    }

    inicializar() {
        this.criarSelecaoTiposDados();
        this.criarSeletorExibicao();
        this.configurarEventos();
        this.carregarHistorico();
    }

    criarSeletorExibicao() {
        const container = document.querySelector('.config-secao-exibicao');
        if (!container) return;

        const selectOriginal = document.getElementById('dados-exibicao');
        if (selectOriginal) {
            selectOriginal.style.display = 'none';
        }

        const seletorDiv = document.createElement('div');
        seletorDiv.className = 'seletor-exibicao-custom';
        seletorDiv.id = 'seletor-exibicao-custom';

        const trigger = document.createElement('div');
        trigger.className = 'seletor-exibicao-trigger';
        trigger.id = 'seletor-exibicao-trigger';
        
        const opcaoAtual = this.opcoesExibicao.find(o => o.id === this.exibicaoSelecionada) || this.opcoesExibicao[0];
        
        trigger.innerHTML = `
            <div class="seletor-exibicao-visual">
                <div class="seletor-exibicao-info">
                    <span class="seletor-exibicao-nome" id="seletor-exibicao-nome">${opcaoAtual.nome}</span>
                    <span class="seletor-exibicao-desc" id="seletor-exibicao-desc">${opcaoAtual.desc}</span>
                </div>
            </div>
            <span class="seletor-exibicao-seta">▼</span>
        `;

        const opcoesLista = document.createElement('div');
        opcoesLista.className = 'seletor-exibicao-opcoes';
        opcoesLista.id = 'seletor-exibicao-opcoes';

        this.opcoesExibicao.forEach(opcao => {
            const item = document.createElement('div');
            item.className = 'exibicao-opcao';
            if (opcao.id === this.exibicaoSelecionada) {
                item.classList.add('selecionada');
            }
            item.dataset.id = opcao.id;
            
            item.innerHTML = `
                <div class="exibicao-opcao-info">
                    <span class="exibicao-opcao-nome">${opcao.nome}</span>
                    <span class="exibicao-opcao-desc">${opcao.desc}</span>
                </div>
            `;
            
            opcoesLista.appendChild(item);
        });

        seletorDiv.appendChild(trigger);
        seletorDiv.appendChild(opcoesLista);
        
        const label = container.querySelector('h3');
        if (label) {
            container.insertBefore(seletorDiv, label.nextSibling);
        } else {
            container.appendChild(seletorDiv);
        }

        this.seletorTrigger = trigger;
        this.seletorOpcoes = opcoesLista;
        this.seletorNome = document.getElementById('seletor-exibicao-nome');
        this.seletorDesc = document.getElementById('seletor-exibicao-desc');

        this.adicionarEstilosSeletor();
    }

    adicionarEstilosSeletor() {
        const style = document.createElement('style');
        style.textContent = `
            /* Ajustes para o seletor de exibição */
            .config-secao-exibicao {
                position: relative;
                z-index: 10;
            }
            
            .seletor-exibicao-custom {
                position: relative;
                z-index: 10;
            }
            
            .seletor-exibicao-opcoes {
                z-index: 100 !important;
            }
            
            /* Garantir que o botão de rolar fique acima */
            .dados-botao-container {
                position: relative;
                z-index: 1;
            }

            .seletor-exibicao-trigger:hover {
                border-color: var(--primary) !important;
                background: rgba(20, 20, 26, 0.9) !important;
                box-shadow: 0 0 15px rgba(58, 134, 255, 0.3) !important;
            }
            
            .seletor-exibicao-trigger.ativo .seletor-exibicao-seta {
                transform: rotate(180deg) !important;
                opacity: 1 !important;
            }
            
            .seletor-exibicao-opcoes.aberto {
                display: block !important;
                animation: slideDownExibicao 0.3s ease !important;
            }
            
            @keyframes slideDownExibicao {
                from {
                    opacity: 0;
                    transform: translateY(-15px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            .exibicao-opcao:hover {
                background: rgba(58, 134, 255, 0.15) !important;
                transform: translateX(5px) !important;
            }
            
            .exibicao-opcao.selecionada {
                background: linear-gradient(90deg, rgba(58, 134, 255, 0.2), rgba(58, 134, 255, 0.05)) !important;
                position: relative !important;
                border-left: 3px solid var(--primary) !important;
            }
            
            .exibicao-opcao.selecionada::after {
                content: '';
                position: absolute;
                right: 15px;
                color: var(--primary);
                font-weight: bold;
                font-size: 16px;
                text-shadow: 0 0 5px currentColor;
            }
            
            .seletor-exibicao-opcoes::-webkit-scrollbar {
                width: 6px;
            }
            
            .seletor-exibicao-opcoes::-webkit-scrollbar-track {
                background: rgba(0, 0, 0, 0.2);
                border-radius: 4px;
            }
            
            .seletor-exibicao-opcoes::-webkit-scrollbar-thumb {
                background: var(--primary);
                border-radius: 4px;
            }
            
            .seletor-exibicao-opcoes::-webkit-scrollbar-thumb:hover {
                background: rgba(58, 134, 255, 0.8);
            }
        `;
        document.head.appendChild(style);
    }

    configurarEventos() {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('tipo-dado-btn')) {
                this.tipoDadoSelecionado = e.target.dataset.tipo;
                
                document.querySelectorAll('.tipo-dado-btn').forEach(btn => {
                    btn.classList.remove('selecionado');
                });
                e.target.classList.add('selecionado');
            }
        });

        const quantidadeInput = document.getElementById('dados-quantidade');
        if (quantidadeInput) {
            quantidadeInput.addEventListener('change', (e) => {
                this.quantidade = parseInt(e.target.value) || 1;
            });
        }

        const modificadorInput = document.getElementById('dados-modificador');
        if (modificadorInput) {
            modificadorInput.addEventListener('change', (e) => {
                this.modificador = parseInt(e.target.value) || 0;
            });
        }

        const radiosRolagem = document.querySelectorAll('input[name="tipo-rolagem"]');
        const vantagemContainer = document.getElementById('vantagem-desvantagem-container');
        
        radiosRolagem.forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.tipoRolagem = e.target.value;
                
                if (vantagemContainer) {
                    vantagemContainer.style.display = 
                        (e.target.value === 'vantagem' || e.target.value === 'desvantagem') 
                        ? 'block' : 'none';
                }
            });
        });

        const vdNivel = document.getElementById('vd-nivel');
        if (vdNivel) {
            vdNivel.addEventListener('change', (e) => {
                this.vantagensDesvantagens = parseInt(e.target.value) || 1;
            });
            
            document.querySelectorAll('.vd-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const action = e.currentTarget.dataset.action;
                    let valor = parseInt(vdNivel.value) || 1;
                    
                    if (action === 'increase') {
                        valor = Math.min(5, valor + 1);
                    } else {
                        valor = Math.max(1, valor - 1);
                    }
                    
                    vdNivel.value = valor;
                    this.vantagensDesvantagens = valor;
                });
            });
        }

        if (this.seletorTrigger) {
            this.seletorTrigger.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleSeletorExibicao();
            });

            const opcoes = this.seletorOpcoes.querySelectorAll('.exibicao-opcao');
            opcoes.forEach(opcao => {
                opcao.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const id = opcao.dataset.id;
                    this.selecionarExibicao(id);
                    this.fecharSeletorExibicao();
                });
            });

            document.addEventListener('click', (e) => {
                if (this.seletorAberto && 
                    !this.seletorTrigger.contains(e.target) && 
                    !this.seletorOpcoes.contains(e.target)) {
                    this.fecharSeletorExibicao();
                }
            });
        }

        const rolarBtn = document.getElementById('rolar-dados');
        if (rolarBtn) {
            rolarBtn.addEventListener('click', () => {
                this.rolarDados();
            });
        }

        const limparBtn = document.getElementById('limpar-historico');
        if (limparBtn) {
            limparBtn.addEventListener('click', async () => {
                const confirmado = await ModalConfirmacao.confirmar(
                    'Limpar Histórico',
                    'Tem certeza que deseja limpar todo o histórico de rolagens? Esta ação não pode ser desfeita.',
                    'Limpar',
                    'Cancelar'
                );
                if (confirmado) {
                    this.sistemaDados.limparHistorico();
                    this.carregarHistorico();
                }
            });
        }

        const observer = new MutationObserver(() => {
            const abaDados = document.getElementById('aba-dados');
            if (abaDados && abaDados.classList.contains('ativa')) {
                this.carregarHistorico();
            }
        });

        observer.observe(document.body, {
            childList: false,
            subtree: true,
            attributes: true,
            attributeFilter: ['class']
        });
    }

    toggleSeletorExibicao() {
        if (this.seletorAberto) {
            this.fecharSeletorExibicao();
        } else {
            this.abrirSeletorExibicao();
        }
    }

    abrirSeletorExibicao() {
        this.seletorTrigger.classList.add('ativo');
        this.seletorOpcoes.classList.add('aberto');
        this.seletorAberto = true;
    }

    fecharSeletorExibicao() {
        this.seletorTrigger.classList.remove('ativo');
        this.seletorOpcoes.classList.remove('aberto');
        this.seletorAberto = false;
    }

    selecionarExibicao(id) {
        this.exibicaoSelecionada = id;
        
        const opcoes = this.seletorOpcoes.querySelectorAll('.exibicao-opcao');
        opcoes.forEach(opcao => {
            opcao.classList.toggle('selecionada', opcao.dataset.id === id);
        });

        const opcaoAtual = this.opcoesExibicao.find(o => o.id === id);
        if (opcaoAtual && this.seletorNome && this.seletorDesc) {
            this.seletorNome.textContent = opcaoAtual.nome;
            this.seletorDesc.textContent = opcaoAtual.desc;
        }

        const selectOriginal = document.getElementById('dados-exibicao');
        if (selectOriginal) {
            selectOriginal.value = id;
            selectOriginal.dispatchEvent(new Event('change', { bubbles: true }));
        }
    }

    rolarDados() {
        const config = {
            tipoDados: this.tipoDadoSelecionado,
            quantidade: this.quantidade,
            modificador: this.modificador,
            tipoRolagem: this.tipoRolagem,
            vantagensDesvantagens: this.vantagensDesvantagens,
            mostrarResultados: this.exibicaoSelecionada
        };

        this.sistemaDados.rolarDadosPersonalizados(config);
    }

    observarHistorico() {
        const sistemaDados = this.sistemaDados;
        const adicionarOriginal = sistemaDados.adicionarAoHistorico.bind(sistemaDados);
        
        sistemaDados.adicionarAoHistorico = (entrada) => {
            adicionarOriginal(entrada);
            setTimeout(() => {
                this.carregarHistorico();
            }, 100);
        };
    }

    carregarHistorico() {
        const container = document.getElementById('historico-lista');
        if (!container) return;

        const historico = this.sistemaDados.getHistorico();
        
        if (historico.length === 0) {
            container.innerHTML = '<div class="historico-vazio">Nenhuma rolagem</div>';
            return;
        }

        container.innerHTML = '';
        
        historico.slice(0, 20).forEach((entrada, index) => {
            const elemento = this.criarElementoHistorico(entrada);
            container.appendChild(elemento);
        });
    }

    criarElementoHistorico(entrada) {
        const div = document.createElement('div');
        div.className = 'historico-item';
        
        const data = new Date(entrada.timestamp);
        const hora = data.toLocaleTimeString('pt-BR', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        
        let conteudo = '';
        
        switch (entrada.tipo) {
            case 'Atributo':
                const cor = entrada.sucessos <= 0 ? '#D90012' :
                           entrada.sucessos === 1 ? '#00E10F' :
                           entrada.sucessos === 2 ? '#2E86AB' : '#A23B72';
                
                conteudo = `
                    <div class="historico-tipo" style="color: ${cor}">
                        ${entrada.nome}
                    </div>
                    <div class="historico-info">
                        <span class="historico-valor-ref">${entrada.valor}d20</span>
                    </div>
                    <div class="historico-resultado">
                        <span class="historico-valor" style="color: ${cor}">${entrada.sucessos}</span>
                        <span class="historico-sucessos">sucessos</span>
                    </div>
                    <div class="historico-detalhes">
                        ${entrada.resultados.join(', ')}
                    </div>
                    <div class="historico-hora">${hora}</div>
                `;
                break;
                
            case 'Personalizado':
                const dadosInfo = entrada.config.quantidade + entrada.config.tipoDados;
                const isD20 = entrada.config.tipoDados === 'd20';
                const valorLabel = isD20 ? 'sucessos' : 'resultado';
                const valorFinal = isD20 ? entrada.sucessos : entrada.resultadoFinal;
                
                conteudo = `
                    <div class="historico-tipo" style="color: var(--primary)">
                        ${dadosInfo}
                    </div>
                    <div class="historico-info">
                        <span class="historico-valor-ref">${entrada.config.tipoRolagem || 'Normal'}</span>
                    </div>
                    <div class="historico-resultado">
                        <span class="historico-valor">${valorFinal}</span>
                        <span class="historico-sucessos">${valorLabel}</span>
                    </div>
                    <div class="historico-detalhes">
                        ${entrada.todosResultados.join(', ')}
                    </div>
                    <div class="historico-hora">${hora}</div>
                `;
                break;
        }
        
        div.innerHTML = conteudo;
        return div;
    }

    criarSelecaoTiposDados() {
        const container = document.getElementById('dados-tipos');
        if (!container) return;

        container.innerHTML = '';
        
        this.tiposDados.forEach(tipo => {
            const button = document.createElement('button');
            button.className = 'tipo-dado-btn';
            button.textContent = tipo;
            button.dataset.tipo = tipo;
            
            if (tipo === this.tipoDadoSelecionado) {
                button.classList.add('selecionado');
            }
            
            container.appendChild(button);
        });
    }
}