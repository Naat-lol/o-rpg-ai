import { ModalConfirmacao } from './modal-confirmacao.js';

export class SistemaInventario {
    constructor() {
        this.itens = this.carregarItensSalvos();
        this.tiposItens = [
            { id: 'consumivel', nome: 'Consumível', pesoPadrao: 0.1, quantidadeEditavel: true },
            { id: 'arma_leve', nome: 'Arma Leve', pesoPadrao: 2.0, quantidadeEditavel: false },
            { id: 'arma_pesada', nome: 'Arma Pesada', pesoPadrao: 5.0, quantidadeEditavel: false },
            { id: 'armadura', nome: 'Armadura', pesoPadrao: 8.0, quantidadeEditavel: false },
            { id: 'equipamento', nome: 'Equipamento', pesoPadrao: 2.0, quantidadeEditavel: false },
            { id: 'municao', nome: 'Munição', pesoPadrao: 0.1, quantidadeEditavel: true },
            { id: 'documento', nome: 'Documento', pesoPadrao: 0.1, quantidadeEditavel: true },
            { id: 'valiosos', nome: 'Valiosos', pesoPadrao: 0.1, quantidadeEditavel: true },
            { id: 'outros', nome: 'Outros', pesoPadrao: 0.5, quantidadeEditavel: true }
        ];
        this.tipoFiltroAtual = 'TODOS';
        this.itemEditando = null;
        this.tipoSelecionado = this.tiposItens[0].id;
        this.seletorTipoAberto = false;
        
        this.atributosCache = {
            FOR: 0,
            CON: 0,
            TAM: 0
        };
        
        this.calculoAutomaticoCarga = true;
        
        this.inicializar();
        this.atualizarResumo();
    }

    inicializar() {
        this.criarFiltros();
        this.carregarListaItens();
        this.configurarModal();
        this.configurarEventos();
        
        this.configurarListenerAtributos();
    }

    configurarListenerAtributos() {
        document.addEventListener('atributoAlterado', (e) => {
            const { atributo, valor } = e.detail;
            
            if (atributo === 'FOR' || atributo === 'CON' || atributo === 'TAM') {
                this.atributosCache[atributo] = parseInt(valor) || 0;
                
                if (this.calculoAutomaticoCarga) {
                    this.calcularCapacidadeAutomatica();
                }
            }
        });
    }

    calcularCapacidadeAutomatica() {
        if (!this.calculoAutomaticoCarga) return;
        
        const { FOR, CON, TAM } = this.atributosCache;
        
        let capacidade = 0;
        
        if (FOR > 0 || CON > 0) {
            const somaFORCON = FOR + CON;
            const metade = somaFORCON * 0.5;
            const ceilMetade = Math.ceil(metade);
            const ajusteTAM = TAM - 10;
            capacidade = ceilMetade + ajusteTAM;
            capacidade = Math.max(1, capacidade);
        } else {
            capacidade = 50;
        }
        
        this.atualizarCapacidadeUI(capacidade);
    }

    atualizarCapacidadeUI(capacidade) {
        const pesoMaximoElement = document.getElementById('peso-maximo');
        if (pesoMaximoElement) {
            pesoMaximoElement.value = capacidade;
            this.atualizarResumo();
        }
        
        const capacidadeElement = document.querySelector('.resumo-item:nth-child(3)');
        if (capacidadeElement) {
            const { FOR, CON, TAM } = this.atributosCache;
            capacidadeElement.title = 
                `Fórmula: ceil((${FOR} + ${CON}) × 0.5) + (${TAM} − 10) = ${capacidade} kg\n` +
                `Detalhe: ceil(${FOR+CON} × 0.5) = ${Math.ceil((FOR+CON) * 0.5)} + (${TAM} - 10) = ${capacidade}`;
        }
    }

    getCapacidadeAtual() {
        const pesoMaximoElement = document.getElementById('peso-maximo');
        if (pesoMaximoElement) {
            return parseInt(pesoMaximoElement.value) || 0;
        }
        return 0;
    }

    criarFiltros() {
        const container = document.getElementById('inventario-filtros');
        if (!container) return;

        container.innerHTML = '';
        
        const botaoTodos = document.createElement('button');
        botaoTodos.className = 'filtro-tipo ativo';
        botaoTodos.textContent = 'TODOS';
        botaoTodos.dataset.tipo = 'TODOS';
        container.appendChild(botaoTodos);
        
        this.tiposItens.forEach(tipo => {
            const botao = document.createElement('button');
            botao.className = 'filtro-tipo';
            botao.textContent = tipo.nome;
            botao.dataset.tipo = tipo.id;
            container.appendChild(botao);
        });
    }

    carregarListaItens() {
        const container = document.getElementById('inventario-lista');
        if (!container) return;

        let itensFiltrados = [...this.itens];
        
        if (this.tipoFiltroAtual !== 'TODOS') {
            const tipoSelecionado = this.tiposItens.find(t => t.id === this.tipoFiltroAtual);
            if (tipoSelecionado) {
                itensFiltrados = itensFiltrados.filter(item => item.tipo === tipoSelecionado.id);
            }
        }
        
        itensFiltrados.sort((a, b) => {
            if (a.quantidade === 0 && b.quantidade > 0) return 1;
            if (a.quantidade > 0 && b.quantidade === 0) return -1;
            return a.nome.localeCompare(b.nome, 'pt-BR');
        });
        
        if (itensFiltrados.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 40px; color: #666; font-style: italic;">
                    Nenhum item no inventário
                </div>
            `;
            return;
        }
        
        container.innerHTML = '';
        itensFiltrados.forEach(item => {
            const elemento = this.criarElementoItem(item);
            container.appendChild(elemento);
        });
    }

    criarElementoItem(item) {
        const tipoItem = this.tiposItens.find(t => t.id === item.tipo) || this.tiposItens[0];
        const estaZerado = item.quantidade === 0;
        
        const div = document.createElement('div');
        div.className = `item-inventario ${estaZerado ? 'zerado' : ''}`;
        div.dataset.id = item.id;
        
        const pesoTotal = (item.peso * item.quantidade).toFixed(2);
        
        div.innerHTML = `
            <div class="item-nome" data-id="${item.id}">
                ${item.nome}
                ${item.descricao ? '<div style="font-size: 12px; color: #666; margin-top: 5px;">' + item.descricao + '</div>' : ''}
            </div>
            <div class="item-tipo">${tipoItem.nome}</div>
            <div class="item-quantidade">
                <div class="controle-quantidade-item">
                    ${tipoItem.quantidadeEditavel ? `
                        <button class="btn-diminuir" data-id="${item.id}" ${item.quantidade === 0 ? 'disabled' : ''}>-</button>
                        <input type="number" 
                               class="quantidade-input" 
                               data-id="${item.id}"
                               value="${item.quantidade}"
                               min="0"
                               ${tipoItem.quantidadeEditavel ? '' : 'disabled'}
                               style="${tipoItem.quantidadeEditavel ? '' : 'opacity: 0.5; cursor: not-allowed;'}">
                        <button class="btn-aumentar" data-id="${item.id}">+</button>
                    ` : `
                        <div style="text-align: center; padding: 8px; color: ${estaZerado ? '#666' : '#fff'};">
                            ${item.quantidade}
                        </div>
                    `}
                </div>
            </div>
            <div class="item-peso">
                <span>${pesoTotal}</span> kg
                <div style="font-size: 11px; color: #666;">(${item.peso}kg/un)</div>
            </div>
            <div class="item-acoes">
                <button class="botao-acao botao-editar" data-id="${item.id}" title="Editar">
                    Editar
                </button>
                <button class="botao-acao botao-remover" data-id="${item.id}" title="Remover">
                    Deletar
                </button>
            </div>
        `;
        
        return div;
    }

    configurarModal() {
        const tipoSelect = document.getElementById('item-tipo');
        if (!tipoSelect) return;

        tipoSelect.style.display = 'none';
        
        this.criarSeletorTipoPersonalizado();

        const quantidadeInput = document.getElementById('item-quantidade');
        const btnDiminuir = document.querySelector('.btn-quantidade[data-acao="diminuir"]');
        const btnAumentar = document.querySelector('.btn-quantidade[data-acao="aumentar"]');
        
        if (btnDiminuir && btnAumentar && quantidadeInput) {
            btnDiminuir.addEventListener('click', () => {
                let valor = parseInt(quantidadeInput.value) || 0;
                if (valor > 0) {
                    quantidadeInput.value = valor - 1;
                }
            });
            
            btnAumentar.addEventListener('click', () => {
                let valor = parseInt(quantidadeInput.value) || 0;
                quantidadeInput.value = valor + 1;
            });
        }
    }

    criarSeletorTipoPersonalizado() {
        const selectOriginal = document.getElementById('item-tipo');
        if (!selectOriginal) return;

        const container = selectOriginal.parentElement;
        
        const seletorDiv = document.createElement('div');
        seletorDiv.className = 'seletor-tipo-custom';
        seletorDiv.id = 'seletor-tipo-custom';
        seletorDiv.style.cssText = `
            width: 100%;
            position: relative;
            z-index: 10;
        `;

        const trigger = document.createElement('div');
        trigger.className = 'seletor-tipo-trigger';
        trigger.id = 'seletor-tipo-trigger';
        trigger.style.cssText = `
            background: rgba(20, 20, 26, 0.8);
            border: 2px solid var(--border);
            border-radius: 10px;
            padding: 14px 16px;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            justify-content: space-between;
            align-items: center;
        `;
        
        const tipoAtual = this.tiposItens.find(t => t.id === this.tipoSelecionado) || this.tiposItens[0];
        
        trigger.innerHTML = `
            <div class="seletor-tipo-visual" style="display: flex; align-items: center; gap: 12px;">
                <div class="seletor-tipo-info" style="display: flex; flex-direction: column; gap: 3px;">
                    <span class="seletor-tipo-nome" id="seletor-tipo-nome" style="
                        color: #eaeaea;
                        font-size: 15px;
                        font-weight: 500;
                        letter-spacing: 0.5px;
                    ">${tipoAtual.nome}</span>
                    <span class="seletor-tipo-desc" id="seletor-tipo-desc" style="
                        color: #888;
                        font-size: 12px;
                    ">Peso: ${tipoAtual.pesoPadrao}kg</span>
                </div>
            </div>
            <span class="seletor-tipo-seta" style="
                color: var(--primary);
                font-size: 12px;
                transition: transform 0.3s ease;
                opacity: 0.8;
            ">▼</span>
        `;

        const opcoesLista = document.createElement('div');
        opcoesLista.className = 'seletor-tipo-opcoes';
        opcoesLista.id = 'seletor-tipo-opcoes';
        opcoesLista.style.cssText = `
            position: absolute;
            top: calc(100% + 8px);
            left: 0;
            right: 0;
            background: rgba(20, 20, 26, 0.98);
            border: 2px solid var(--border);
            border-radius: 12px;
            max-height: 200px;
            overflow-y: auto;
            z-index: 100;
            display: none;
            box-shadow: 0 15px 40px rgba(0, 0, 0, 0.7);
            backdrop-filter: blur(10px);
        `;

        this.tiposItens.forEach(tipo => {
            const item = document.createElement('div');
            item.className = 'tipo-opcao';
            if (tipo.id === this.tipoSelecionado) {
                item.classList.add('selecionada');
            }
            item.dataset.id = tipo.id;
            item.style.cssText = `
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 10px 15px;
                cursor: pointer;
                transition: all 0.2s ease;
                border-bottom: 1px solid rgba(255, 255, 255, 0.06);
            `;
            
            item.innerHTML = `
                <div class="tipo-opcao-info" style="display: flex; flex-direction: column; gap: 2px; flex-grow: 1;">
                    <span class="tipo-opcao-nome" style="color: #eaeaea; font-size: 14px; font-weight: 500;">${tipo.nome}</span>
                    <span class="tipo-opcao-desc" style="color: #888; font-size: 12px;">Peso: ${tipo.pesoPadrao}kg</span>
                </div>
            `;
            
            opcoesLista.appendChild(item);
        });

        seletorDiv.appendChild(trigger);
        seletorDiv.appendChild(opcoesLista);
        
        const label = container.querySelector('label');
        if (label) {
            container.insertBefore(seletorDiv, label.nextSibling);
        } else {
            container.appendChild(seletorDiv);
        }

        this.seletorTipoTrigger = trigger;
        this.seletorTipoOpcoes = opcoesLista;
        this.seletorTipoNome = document.getElementById('seletor-tipo-nome');
        this.seletorTipoDesc = document.getElementById('seletor-tipo-desc');

        this.configurarEventosSeletorTipo();
        this.adicionarEstilosSeletorTipo();
    }

    adicionarEstilosSeletorTipo() {
        const style = document.createElement('style');
        style.textContent = `
            .seletor-tipo-trigger:hover {
                border-color: var(--primary) !important;
                background: rgba(20, 20, 26, 0.9) !important;
                box-shadow: 0 0 15px rgba(58, 134, 255, 0.3) !important;
            }
            
            .seletor-tipo-trigger.ativo .seletor-tipo-seta {
                transform: rotate(180deg) !important;
                opacity: 1 !important;
            }
            
            .seletor-tipo-opcoes.aberto {
                display: block !important;
                animation: slideDownTipo 0.3s ease !important;
            }
            
            @keyframes slideDownTipo {
                from {
                    opacity: 0;
                    transform: translateY(-15px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            .tipo-opcao:hover {
                background: rgba(58, 134, 255, 0.15) !important;
                transform: translateX(5px) !important;
            }
            
            .tipo-opcao.selecionada {
                background: linear-gradient(90deg, rgba(58, 134, 255, 0.2), rgba(58, 134, 255, 0.05)) !important;
                position: relative !important;
                border-left: 3px solid var(--primary) !important;
            }
            
            .tipo-opcao.selecionada::after {
                content: '✓';
                position: absolute;
                right: 15px;
                color: var(--primary);
                font-weight: bold;
                font-size: 16px;
                text-shadow: 0 0 5px currentColor;
            }
            
            .seletor-tipo-opcoes::-webkit-scrollbar {
                width: 6px;
            }
            
            .seletor-tipo-opcoes::-webkit-scrollbar-track {
                background: rgba(0, 0, 0, 0.2);
                border-radius: 4px;
            }
            
            .seletor-tipo-opcoes::-webkit-scrollbar-thumb {
                background: var(--primary);
                border-radius: 4px;
            }
            
            .seletor-tipo-opcoes::-webkit-scrollbar-thumb:hover {
                background: rgba(58, 134, 255, 0.8);
            }
        `;
        document.head.appendChild(style);
    }

    configurarEventosSeletorTipo() {
        if (!this.seletorTipoTrigger) return;

        this.seletorTipoTrigger.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleSeletorTipo();
        });

        const opcoes = this.seletorTipoOpcoes.querySelectorAll('.tipo-opcao');
        opcoes.forEach(opcao => {
            opcao.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = opcao.dataset.id;
                this.selecionarTipo(id);
                this.fecharSeletorTipo();
            });
        });

        document.addEventListener('click', (e) => {
            if (this.seletorTipoAberto && 
                !this.seletorTipoTrigger.contains(e.target) && 
                !this.seletorTipoOpcoes.contains(e.target)) {
                this.fecharSeletorTipo();
            }
        });
    }

    toggleSeletorTipo() {
        if (this.seletorTipoAberto) {
            this.fecharSeletorTipo();
        } else {
            this.abrirSeletorTipo();
        }
    }

    abrirSeletorTipo() {
        this.seletorTipoTrigger.classList.add('ativo');
        this.seletorTipoOpcoes.classList.add('aberto');
        this.seletorTipoAberto = true;
    }

    fecharSeletorTipo() {
        this.seletorTipoTrigger.classList.remove('ativo');
        this.seletorTipoOpcoes.classList.remove('aberto');
        this.seletorTipoAberto = false;
    }

    selecionarTipo(id) {
        this.tipoSelecionado = id;
        
        const tipo = this.tiposItens.find(t => t.id === id);
        if (!tipo) return;
        
        const opcoes = this.seletorTipoOpcoes.querySelectorAll('.tipo-opcao');
        opcoes.forEach(opcao => {
            opcao.classList.toggle('selecionada', opcao.dataset.id === id);
        });

        if (this.seletorTipoNome && this.seletorTipoDesc) {
            this.seletorTipoNome.textContent = tipo.nome;
            this.seletorTipoDesc.textContent = `Peso: ${tipo.pesoPadrao}kg`;
        }

        const selectOriginal = document.getElementById('item-tipo');
        if (selectOriginal) {
            selectOriginal.value = id;
            selectOriginal.dispatchEvent(new Event('change', { bubbles: true }));
        }

        const pesoInput = document.getElementById('item-peso');
        if (pesoInput) {
            pesoInput.value = tipo.pesoPadrao;
        }
    }

    configurarEventos() {
        document.getElementById('adicionar-item')?.addEventListener('click', () => {
            this.abrirModal();
        });
        
        document.querySelectorAll('.filtro-tipo').forEach(botao => {
            botao.addEventListener('click', (e) => {
                const tipo = e.currentTarget.dataset.tipo;
                this.mudarFiltro(tipo);
            });
        });
        
        const buscaInput = document.getElementById('inventario-busca');
        if (buscaInput) {
            let timeoutBusca;
            buscaInput.addEventListener('input', (e) => {
                clearTimeout(timeoutBusca);
                timeoutBusca = setTimeout(() => {
                    this.filtrarPorBusca(e.target.value);
                }, 300);
            });
        }
        
        document.getElementById('fechar-modal')?.addEventListener('click', () => {
            this.fecharModal();
        });
        
        document.getElementById('cancelar-item')?.addEventListener('click', () => {
            this.fecharModal();
        });
        
        document.getElementById('salvar-item')?.addEventListener('click', () => {
            this.salvarItem();
        });
        
        document.getElementById('modal-inventario')?.addEventListener('click', (e) => {
            if (e.target.id === 'modal-inventario') {
                this.fecharModal();
            }
        });
        
        document.addEventListener('click', (e) => {
            const elemento = e.target;
            
            if (elemento.classList.contains('botao-editar')) {
                const id = elemento.dataset.id;
                this.editarItem(id);
            }
            
            if (elemento.classList.contains('botao-remover')) {
                const id = elemento.dataset.id;
                this.removerItem(id);
            }
            
            if (elemento.classList.contains('btn-diminuir')) {
                const id = elemento.dataset.id;
                this.alterarQuantidade(id, -1);
            }
            
            if (elemento.classList.contains('btn-aumentar')) {
                const id = elemento.dataset.id;
                this.alterarQuantidade(id, 1);
            }
            
            if (elemento.classList.contains('item-nome')) {
                const id = elemento.dataset.id;
                this.toggleDetalhesItem(id);
            }
        });
        
        document.addEventListener('change', (e) => {
            if (e.target.classList.contains('quantidade-input')) {
                const id = e.target.dataset.id;
                const novaQuantidade = parseInt(e.target.value) || 0;
                this.atualizarQuantidadeItem(id, novaQuantidade);
            }
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.fecharModal();
                this.fecharSeletorTipo();
            }
        });
    }

    abrirModal(item = null) {
        this.itemEditando = item;
        const modal = document.getElementById('modal-inventario');
        const titulo = document.getElementById('modal-titulo');
        
        this.tipoSelecionado = this.tiposItens[0].id;
        
        if (item) {
            titulo.textContent = 'Editar Item';
            
            document.getElementById('item-nome').value = item.nome;
            this.tipoSelecionado = item.tipo;
            const tipo = this.tiposItens.find(t => t.id === item.tipo);
            if (tipo && this.seletorTipoNome && this.seletorTipoDesc) {
                this.seletorTipoNome.textContent = tipo.nome;
                this.seletorTipoDesc.textContent = `Peso: ${tipo.pesoPadrao}kg`;
            }
            const opcoes = this.seletorTipoOpcoes?.querySelectorAll('.tipo-opcao');
            opcoes?.forEach(opcao => {
                opcao.classList.toggle('selecionada', opcao.dataset.id === item.tipo);
            });
            document.getElementById('item-quantidade').value = item.quantidade;
            document.getElementById('item-peso').value = item.peso;
            document.getElementById('item-descricao').value = item.descricao || '';
        } else {
            titulo.textContent = 'Novo Item';
            
            document.getElementById('item-nome').value = '';
            this.tipoSelecionado = this.tiposItens[0].id;
            const tipo = this.tiposItens[0];
            if (this.seletorTipoNome && this.seletorTipoDesc) {
                this.seletorTipoNome.textContent = tipo.nome;
                this.seletorTipoDesc.textContent = `Peso: ${tipo.pesoPadrao}kg`;
            }
            const opcoes = this.seletorTipoOpcoes?.querySelectorAll('.tipo-opcao');
            opcoes?.forEach(opcao => {
                opcao.classList.toggle('selecionada', opcao.dataset.id === this.tiposItens[0].id);
            });
            document.getElementById('item-quantidade').value = 1;
            document.getElementById('item-peso').value = this.tiposItens[0].pesoPadrao;
            document.getElementById('item-descricao').value = '';
        }
        
        const selectOriginal = document.getElementById('item-tipo');
        if (selectOriginal) {
            selectOriginal.value = this.tipoSelecionado;
        }
        
        modal.classList.add('aberto');
        
        setTimeout(() => {
            document.getElementById('item-nome').focus();
        }, 100);
    }

    fecharModal() {
        const modal = document.getElementById('modal-inventario');
        modal.classList.remove('aberto');
        this.itemEditando = null;
        this.fecharSeletorTipo();
    }

    async salvarItem() {
        const nome = document.getElementById('item-nome').value.trim();
        const tipo = this.tipoSelecionado;
        const quantidade = parseInt(document.getElementById('item-quantidade').value) || 0;
        const peso = parseFloat(document.getElementById('item-peso').value) || 0;
        const descricao = document.getElementById('item-descricao').value.trim();
        
        if (!nome) {
            await ModalConfirmacao.alertar(
                'Atenção',
                'Por favor, insira um nome para o item.',
                'OK'
            );
            document.getElementById('item-nome').focus();
            return;
        }
        
        if (peso < 0) {
            await ModalConfirmacao.confirmar(
                'Atenção',
                'O peso não pode ser negativo.',
                'OK',
                ''
            );
            document.getElementById('item-peso').focus();
            return;
        }
        
        if (quantidade < 0) {
            await ModalConfirmacao.confirmar(
                'Atenção',
                'A quantidade não pode ser negativa.',
                'OK',
                ''
            );
            document.getElementById('item-quantidade').focus();
            return;
        }
        
        const tipoItem = this.tiposItens.find(t => t.id === tipo);
        if (!tipoItem) {
            await ModalConfirmacao.confirmar(
                'Erro',
                'Tipo de item inválido.',
                'OK',
                ''
            );
            return;
        }
        
        if (this.itemEditando) {
            const item = this.itens.find(i => i.id === this.itemEditando.id);
            if (item) {
                item.nome = nome;
                item.tipo = tipo;
                item.quantidade = quantidade;
                item.peso = peso;
                item.descricao = descricao;
                item.dataAtualizacao = new Date().toISOString();
            }
        } else {
            const novoItem = {
                id: Date.now().toString(),
                nome,
                tipo,
                quantidade,
                peso,
                descricao,
                dataCriacao: new Date().toISOString(),
                dataAtualizacao: new Date().toISOString()
            };
            
            this.itens.push(novoItem);
        }
        
        this.salvarItens();
        this.carregarListaItens();
        this.atualizarResumo();
        this.fecharModal();
    }

    editarItem(id) {
        const item = this.itens.find(i => i.id === id);
        if (item) {
            this.abrirModal(item);
        }
    }

    async removerItem(id) {
        const confirmado = await ModalConfirmacao.confirmar(
            'Remover Item',
            'Tem certeza que deseja remover este item do inventário? Esta ação não pode ser desfeita.',
            'Remover',
            'Cancelar'
        );
        if (confirmado) {
            this.itens = this.itens.filter(item => item.id !== id);
            this.salvarItens();
            this.carregarListaItens();
            this.atualizarResumo();
        }
    }

    async removerTodosItens() {
        const confirmado = await ModalConfirmacao.confirmar(
            'Remover Todos os Itens',
            'Tem certeza que deseja remover TODOS os itens do inventário? Esta ação não pode ser desfeita.',
            'Remover Todos',
            'Cancelar'
        );
        if (confirmado) {
            this.itens = [];
            this.salvarItens();
            this.carregarListaItens();
            this.atualizarResumo();
        }
    }

    alterarQuantidade(id, delta) {
        const item = this.itens.find(i => i.id === id);
        if (!item) return;
        
        const tipoItem = this.tiposItens.find(t => t.id === item.tipo);
        if (tipoItem && !tipoItem.quantidadeEditavel) {
            ModalConfirmacao.confirmar(
                'Atenção',
                'A quantidade deste tipo de item não pode ser alterada.',
                'OK',
                ''
            );
            return;
        }
        
        const novaQuantidade = Math.max(0, item.quantidade + delta);
        this.atualizarQuantidadeItem(id, novaQuantidade);
    }

    atualizarQuantidadeItem(id, novaQuantidade) {
        const item = this.itens.find(i => i.id === id);
        if (item) {
            const tipoItem = this.tiposItens.find(t => t.id === item.tipo);
            if (tipoItem && !tipoItem.quantidadeEditavel) {
                ModalConfirmacao.confirmar(
                    'Atenção',
                    'A quantidade deste tipo de item não pode ser alterada.',
                    'OK',
                    ''
                );
                return;
            }
            
            item.quantidade = Math.max(0, novaQuantidade);
            item.dataAtualizacao = new Date().toISOString();
            
            this.salvarItens();
            this.carregarListaItens();
            this.atualizarResumo();
        }
    }

    toggleDetalhesItem(id) {
        const itemElement = document.querySelector(`.item-inventario[data-id="${id}"]`);
        if (itemElement) {
            const detalhes = itemElement.querySelector('.item-detalhes');
            if (detalhes) {
                detalhes.classList.toggle('expandido');
            }
        }
    }

    mudarFiltro(tipo) {
        this.tipoFiltroAtual = tipo;
        
        document.querySelectorAll('.filtro-tipo').forEach(botao => {
            if (botao.dataset.tipo === tipo) {
                botao.classList.add('ativo');
            } else {
                botao.classList.remove('ativo');
            }
        });
        
        this.carregarListaItens();
    }

    filtrarPorBusca(texto) {
        const itens = document.querySelectorAll('.item-inventario');
        const busca = texto.toLowerCase();
        
        if (busca === '') {
            itens.forEach(item => {
                item.style.display = 'grid';
            });
            return;
        }
        
        itens.forEach(item => {
            const nome = item.querySelector('.item-nome').textContent.toLowerCase();
            const tipo = item.querySelector('.item-tipo').textContent.toLowerCase();
            const descricao = item.querySelector('.item-descricao')?.textContent.toLowerCase() || '';
            
            if (nome.includes(busca) || tipo.includes(busca) || descricao.includes(busca)) {
                item.style.display = 'grid';
            } else {
                item.style.display = 'none';
            }
        });
    }

    atualizarResumo() {
        const totalItens = this.itens.reduce((total, item) => total + item.quantidade, 0);
        const pesoTotal = this.itens.reduce((total, item) => 
            total + (item.peso * item.quantidade), 0
        ).toFixed(2);
        
        const pesoMaximo = this.getCapacidadeAtual();
        const percentualCarga = pesoMaximo > 0 ? (pesoTotal / pesoMaximo) * 100 : 0;
        
        const totalItensElement = document.getElementById('total-itens');
        const pesoTotalElement = document.getElementById('peso-total');
        const pesoMaximoElement = document.getElementById('peso-maximo');
        const barraPeso = document.getElementById('barra-peso');
        
        if (totalItensElement) totalItensElement.textContent = totalItens;
        if (pesoTotalElement) pesoTotalElement.textContent = pesoTotal;
        if (pesoMaximoElement && !this.calculoAutomaticoCarga) {
            pesoMaximoElement.textContent = pesoMaximo;
        }
        
        if (barraPeso) {
            const percentual = Math.min(100, percentualCarga);
            barraPeso.style.width = `${percentual}%`;
            
            if (percentualCarga > 90) {
                barraPeso.classList.add('critico');
                barraPeso.style.background = 'linear-gradient(90deg, #ff5555, #ff8888)';
            } else if (percentualCarga > 70) {
                barraPeso.classList.remove('critico');
                barraPeso.style.background = 'linear-gradient(90deg, #ffaa00, #ffcc44)';
            } else {
                barraPeso.classList.remove('critico');
                barraPeso.style.background = 'linear-gradient(90deg, var(--primary), #4dffaa)';
            }
            
            barraPeso.title = `${pesoTotal}kg / ${pesoMaximo}kg (${percentualCarga.toFixed(1)}%)`;
        }
        
        document.dispatchEvent(new CustomEvent('cargaAtualizada', {
            detail: {
                pesoTotal: parseFloat(pesoTotal),
                pesoMaximo: pesoMaximo,
                percentual: percentualCarga,
                estaSobrecarregado: percentualCarga > 100
            }
        }));
    }

    salvarItens() {
        try {
            localStorage.setItem('inventarioRPG', JSON.stringify(this.itens));
        } catch (e) {
            console.error('Erro ao salvar inventário:', e);
        }
    }

    carregarItensSalvos() {
        try {
            const salvos = localStorage.getItem('inventarioRPG');
            return salvos ? JSON.parse(salvos) : [];
        } catch (e) {
            console.error('Erro ao carregar inventário:', e);
            return [];
        }
    }

    adicionarItem(nome, tipo, quantidade = 1, peso = null, descricao = '') {
        const tipoItem = this.tiposItens.find(t => t.id === tipo);
        if (!tipoItem) return null;
        
        const novoItem = {
            id: Date.now().toString(),
            nome,
            tipo,
            quantidade,
            peso: peso !== null ? peso : tipoItem.pesoPadrao,
            descricao,
            dataCriacao: new Date().toISOString(),
            dataAtualizacao: new Date().toISOString()
        };
        
        this.itens.push(novoItem);
        this.salvarItens();
        this.carregarListaItens();
        this.atualizarResumo();
        
        return novoItem;
    }

    getItensPorTipo(tipoId) {
        return this.itens.filter(item => item.tipo === tipoId);
    }

    getItensZerados() {
        return this.itens.filter(item => item.quantidade === 0);
    }

    getPesoTotal() {
        return this.itens.reduce((total, item) => 
            total + (item.peso * item.quantidade), 0
        ).toFixed(2);
    }

    exportarParaCSV() {
        const cabecalhos = ['Nome', 'Tipo', 'Quantidade', 'Peso Unitário', 'Peso Total', 'Descrição'];
        const linhas = this.itens.map(item => [
            `"${item.nome}"`,
            `"${item.tipo}"`,
            item.quantidade,
            item.peso,
            (item.peso * item.quantidade).toFixed(2),
            `"${item.descricao || ''}"`
        ]);
        
        const csv = [
            cabecalhos.join(','),
            ...linhas.map(linha => linha.join(','))
        ].join('\n');
        
        return csv;
    }

    atualizarAtributo(atributo, valor) {
        if (atributo === 'FOR' || atributo === 'CON' || atributo === 'TAM') {
            const valorNum = parseInt(valor) || 0;
            this.atributosCache[atributo] = valorNum;
            
            if (this.calculoAutomaticoCarga) {
                this.calcularCapacidadeAutomatica();
            }
        }
    }

    setCalculoAutomaticoCarga(ativo) {
        this.calculoAutomaticoCarga = ativo;
        if (ativo) {
            this.calcularCapacidadeAutomatica();
        }
    }

    forcarCalculoCapacidade() {
        this.calcularCapacidadeAutomatica();
    }

    setCapacidadeManual(capacidade) {
        this.calculoAutomaticoCarga = false;
        this.atualizarCapacidadeUI(capacidade);
    }

    restaurarCalculoAutomatico() {
        this.calculoAutomaticoCarga = true;
        this.calcularCapacidadeAutomatica();
    }

    getFormulaAtual() {
        const { FOR, CON, TAM } = this.atributosCache;
        const capacidade = this.getCapacidadeAtual();
        const calculoIntermediario = Math.ceil((FOR + CON) * 0.5);
        const ajusteTAM = TAM - 10;
        
        return {
            formula: `ceil((${FOR} + ${CON}) × 0.5) + (${TAM} − 10)`,
            passoAPasso: `ceil(${FOR + CON} × 0.5) = ${calculoIntermediario} + ${ajusteTAM} = ${capacidade}`,
            capacidade: capacidade
        };
    }
}