export class SistemaPericias {
    constructor(sistemaDados) {
        this.pericias = this.criarListaPericias();
        this.atributosCache = {};
        
        this.tabelaCapacidade = [
            { min: 0, max: 19, bonus: 0, cor: 'cinza' },
            { min: 20, max: 29, bonus: 1, cor: 'branca' },
            { min: 30, max: 39, bonus: 2, cor: 'verde' },
            { min: 40, max: 49, bonus: 3, cor: 'azul' },
            { min: 50, max: 50, bonus: 4, cor: 'primaria' }
        ];
        
        this.inicializar();
        this.carregarValoresSalvos();
    }

    criarListaPericias() {
        return [
            { nome: "Atletismo", categoria: "FÍSICAS", atributo: "FOR", valorBase: 10, valor: 10, capacidade: 0 },
            { nome: "Acrobacia", categoria: "FÍSICAS", atributo: "DES", valorBase: 5, valor: 5, capacidade: 0 },
            { nome: "Desviar", categoria: "FÍSICAS", atributo: "DES", valorBase: 10, valor: 10, capacidade: 0 },
            { nome: "Furtividade", categoria: "FÍSICAS", atributo: "DES", valorBase: 5, valor: 5, capacidade: 0 },
            { nome: "Condução", categoria: "FÍSICAS", atributo: "DES", valorBase: 10, valor: 10, capacidade: 0 },
            { nome: "Arremesso", categoria: "FÍSICAS", atributo: "FOR", valorBase: 5, valor: 5, capacidade: 0 },
            { nome: "Resistência", categoria: "FÍSICAS", atributo: "CON", valorBase: 10, valor: 10, capacidade: 0 },

            { nome: "Briga", categoria: "COMBATE", atributo: "FOR", valorBase: 10, valor: 10, capacidade: 0 },
            { nome: "Bloquear", categoria: "COMBATE", atributo: "FOR", valorBase: 10, valor: 10, capacidade: 0 },
            { nome: "Tiro", categoria: "COMBATE", atributo: "DES", valorBase: 5, valor: 5, capacidade: 0 },
            { nome: "Armas Brancas", categoria: "COMBATE", atributo: "DES", valorBase: 5, valor: 5, capacidade: 0 },

            { nome: "Influência", categoria: "SOCIAL", atributo: "PRE", valorBase: 10, valor: 10, capacidade: 0 },
            { nome: "Iniciativa", categoria: "SOCIAL", atributo: "DES", valorBase: 10, valor: 10, capacidade: 0 },
            { nome: "Intimidação", categoria: "SOCIAL", atributo: "PRE", valorBase: 5, valor: 5, capacidade: 0 },
            { nome: "Disfarce", categoria: "SOCIAL", atributo: "PRE", valorBase: 0, valor: 0, capacidade: 0 },
            { nome: "Crédito", categoria: "SOCIAL", atributo: "PRE", valorBase: 5, valor: 5, capacidade: 0 },
            { nome: "Psicologia", categoria: "SOCIAL", atributo: "INT", valorBase: 5, valor: 5, capacidade: 0 },
            { nome: "Idiomas", categoria: "SOCIAL", atributo: "INT", valorBase: 10, valor: 10, capacidade: 0 },

            { nome: "Ciências", categoria: "CONHECIMENTO", atributo: "INT", valorBase: 5, valor: 5, capacidade: 0 },
            { nome: "Humanidades", categoria: "CONHECIMENTO", atributo: "INT", valorBase: 5, valor: 5, capacidade: 0 },
            { nome: "Ocultismo", categoria: "CONHECIMENTO", atributo: "INT", valorBase: 0, valor: 0, capacidade: 0 },
            { nome: "Investigação", categoria: "CONHECIMENTO", atributo: "INT", valorBase: 5, valor: 5, capacidade: 0 },
            { nome: "Sobrevivência", categoria: "CONHECIMENTO", atributo: "INT", valorBase: 10, valor: 10, capacidade: 0 },
            { nome: "Rastreamento", categoria: "CONHECIMENTO", atributo: "INT", valorBase: 5, valor: 5, capacidade: 0 },

            { nome: "Computação", categoria: "TÉCNICO", atributo: "INT", valorBase: 5, valor: 5, capacidade: 0 },
            { nome: "Mecânica", categoria: "TÉCNICO", atributo: "INT", valorBase: 5, valor: 5, capacidade: 0 },
            { nome: "Elétrica", categoria: "TÉCNICO", atributo: "INT", valorBase: 0, valor: 0, capacidade: 0 },
            { nome: "Medicina", categoria: "TÉCNICO", atributo: "INT", valorBase: 1, valor: 1, capacidade: 0 },
            { nome: "Demolições", categoria: "TÉCNICO", atributo: "INT", valorBase: 0, valor: 0, capacidade: 0 },
            { nome: "Gadgets", categoria: "TÉCNICO", atributo: "INT", valorBase: 0, valor: 0, capacidade: 0 },
            { nome: "Operação Pesada", categoria: "TÉCNICO", atributo: "DES", valorBase: 0, valor: 0, capacidade: 0 },

            { nome: "Encontrar", categoria: "PERCEPÇÃO", atributo: "INT", valorBase: 10, valor: 10, capacidade: 0 },
            { nome: "Escutar", categoria: "PERCEPÇÃO", atributo: "INT", valorBase: 10, valor: 10, capacidade: 0 },
            { nome: "Intuição", categoria: "PERCEPÇÃO", atributo: "INT", valorBase: 5, valor: 5, capacidade: 0 },
            { nome: "Percepção", categoria: "PERCEPÇÃO", atributo: "INT", valorBase: 5, valor: 5, capacidade: 0 },
            { nome: "Sentir Perigo", categoria: "PERCEPÇÃO", atributo: "INT", valorBase: 5, valor: 5, capacidade: 0 },

            { nome: "Roubo", categoria: "FURTIVIDADE AVANÇADA", atributo: "DES", valorBase: 0, valor: 0, capacidade: 0 },
            { nome: "Falsificação", categoria: "FURTIVIDADE AVANÇADA", atributo: "DES", valorBase: 0, valor: 0, capacidade: 0 },
            { nome: "Espionagem", categoria: "FURTIVIDADE AVANÇADA", atributo: "INT", valorBase: 0, valor: 0, capacidade: 0 }
        ];
    }

    atualizarAtributo(atributo, valor) {
        const valorNum = parseInt(valor) || 0;
        this.atributosCache[atributo] = valorNum;
        this.recalcularTodasCapacidades();
        this.atualizarCapacidadesNaInterface();
    }

    atualizarAtributos(atributos) {
        Object.keys(atributos).forEach(atributo => {
            this.atributosCache[atributo] = parseInt(atributos[atributo]) || 0;
        });
        this.recalcularTodasCapacidades();
        this.atualizarCapacidadesNaInterface();
    }

    obterInfoDaTabela(valorPericia) {
        return this.tabelaCapacidade.find(item => 
            valorPericia >= item.min && valorPericia <= item.max
        ) || this.tabelaCapacidade[0];
    }

    obterCorPorValor(valorPericia) {
        const info = this.obterInfoDaTabela(valorPericia);
        return info.cor;
    }

    obterBonusPorValor(valorPericia) {
        const info = this.obterInfoDaTabela(valorPericia);
        return info.bonus;
    }

    calcularCapacidade(pericia) {
        const valorPericia = pericia.valor || 0;
        const bonusTabela = this.obterBonusPorValor(valorPericia);
        const valorAtributo = this.atributosCache[pericia.atributo] || 0;
        
        return valorAtributo + bonusTabela;
    }

    recalcularTodasCapacidades() {
        this.pericias.forEach(pericia => {
            pericia.capacidade = this.calcularCapacidade(pericia);
        });
    }

    atualizarCapacidadesNaInterface() {
        this.pericias.forEach(pericia => {
            this.atualizarElementosPericia(pericia);
        });
    }

    atualizarElementosPericia(pericia) {
        const periciaElement = document.querySelector(`.pericia-item [data-nome="${pericia.nome}"]`)?.closest('.pericia-item');
        
        if (!periciaElement) return;
        
        const cor = this.obterCorPorValor(pericia.valor);
        const classeCor = `pericia-${cor}`;
        
        const todasCores = ['pericia-cinza', 'pericia-branca', 'pericia-verde', 'pericia-azul', 'pericia-primaria'];
        
        const atualizarElemento = (elemento) => {
            if (!elemento) return;
            
            todasCores.forEach(classe => {
                elemento.classList.remove(classe);
            });
            
            elemento.classList.add(classeCor);
        };
        
        const nomeElement = periciaElement.querySelector('.pericia-nome');
        if (nomeElement) {
            atualizarElemento(nomeElement);
            nomeElement.style.cursor = 'default';
        }
        
        const atributoElement = periciaElement.querySelector('.pericia-atributo');
        if (atributoElement) atualizarElemento(atributoElement);
        
        const capacidadeElement = periciaElement.querySelector('.pericia-capacidade');
        if (capacidadeElement) {
            capacidadeElement.textContent = pericia.capacidade;
            atualizarElemento(capacidadeElement);
        }
        
        const valorElement = periciaElement.querySelector('.pericia-valor');
        if (valorElement) atualizarElemento(valorElement);
    }

    inicializar() {
        this.criarListaPericiasHTML();
        this.configurarEventos();
    }

    criarListaPericiasHTML() {
        const container = document.getElementById('pericias-lista');
        if (!container) return;

        container.innerHTML = '<div class="pericias-carregando">Carregando perícias...</div>';
        
        setTimeout(() => {
            this.atualizarListaPericias();
        }, 50);
    }

    atualizarListaPericias() {
        const container = document.getElementById('pericias-lista');
        if (!container) return;

        if (this.pericias.length === 0) {
            container.innerHTML = '<div class="pericias-vazia">Nenhuma perícia encontrada</div>';
            return;
        }
        
        container.innerHTML = '';
        
        this.pericias.forEach(pericia => {
            const periciaElement = this.criarElementoPericia(pericia);
            container.appendChild(periciaElement);
        });
    }

    criarElementoPericia(pericia) {
        const div = document.createElement('div');
        div.className = 'pericia-item';
        
        const cor = this.obterCorPorValor(pericia.valor);
        const classeCor = `pericia-${cor}`;
        
        div.innerHTML = `
            <span class="pericia-nome ${classeCor}" data-nome="${pericia.nome}">
                ${pericia.nome}
            </span>
            <span class="pericia-atributo ${classeCor}">(${pericia.atributo})</span>
            <span class="pericia-capacidade ${classeCor}">${pericia.capacidade}</span>
            <div class="pericia-valor-container">
                <input type="number" 
                       class="pericia-valor ${classeCor}" 
                       data-nome="${pericia.nome}"
                       value="${pericia.valor}"
                       min="0"
                       max="50">
            </div>
        `;
        
        return div;
    }

    configurarEventos() {
        const buscaInput = document.getElementById('pericias-busca');
        if (buscaInput) {
            buscaInput.addEventListener('input', (e) => {
                this.filtrarPericias(e.target.value);
            });
        }
        
        document.addEventListener('input', (e) => {
            if (e.target.classList.contains('pericia-valor')) {
                const nomePericia = e.target.dataset.nome;
                const valor = parseInt(e.target.value) || 0;
                this.atualizarValorPericia(nomePericia, valor);
            }
        });
        
        document.addEventListener('change', (e) => {
            if (e.target.classList.contains('pericia-valor')) {
                const nomePericia = e.target.dataset.nome;
                const valor = parseInt(e.target.value) || 0;
                this.salvarValorPericia(nomePericia, valor);
            }
        });
    }

    filtrarPericias(termoBusca) {
        const container = document.getElementById('pericias-lista');
        if (!container) return;

        const termo = termoBusca.toLowerCase().trim();
        
        if (!termo) {
            this.atualizarListaPericias();
            return;
        }
        
        const periciasFiltradas = this.pericias.filter(pericia => 
            pericia.nome.toLowerCase().includes(termo) ||
            pericia.atributo.toLowerCase().includes(termo) ||
            pericia.categoria.toLowerCase().includes(termo)
        );
        
        if (periciasFiltradas.length === 0) {
            container.innerHTML = '<div class="pericias-vazia">Nenhuma perícia encontrada</div>';
            return;
        }
        
        container.innerHTML = '';
        periciasFiltradas.forEach(pericia => {
            const periciaElement = this.criarElementoPericia(pericia);
            container.appendChild(periciaElement);
        });
    }

    atualizarValorPericia(nomePericia, valor) {
        valor = Math.max(0, Math.min(50, valor));
        
        const pericia = this.pericias.find(p => p.nome === nomePericia);
        if (pericia) {
            pericia.valor = valor;
            pericia.capacidade = this.calcularCapacidade(pericia);
            this.atualizarElementosPericia(pericia);
        }
    }

    salvarValorPericia(nomePericia, valor) {
        this.atualizarValorPericia(nomePericia, valor);
        
        const valoresSalvos = this.carregarTodosValoresSalvos();
        valoresSalvos[nomePericia] = valor;
        localStorage.setItem('periciasRPG', JSON.stringify(valoresSalvos));
    }

    carregarValoresSalvos() {
    const valoresSalvos = this.carregarTodosValoresSalvos();
    
    if (Object.keys(valoresSalvos).length === 0) {
        this.pericias.forEach(pericia => {
            pericia.valor = pericia.valorBase || 0;
        });
    } else {
        this.pericias.forEach(pericia => {
            if (valoresSalvos[pericia.nome] !== undefined) {
                pericia.valor = valoresSalvos[pericia.nome];
                } else {
                    pericia.valor = pericia.valorBase || 0;
                }
           });
        }
    
        this.recalcularTodasCapacidades();
        this.atualizarListaPericias();
    }

    carregarTodosValoresSalvos() {
        try {
            const salvos = localStorage.getItem('periciasRPG');
            return salvos ? JSON.parse(salvos) : {};
        } catch (e) {
            console.error('Erro ao carregar perícias do localStorage:', e);
            return {};
        }
    }

    getValorPericia(nomePericia) {
        const pericia = this.pericias.find(p => p.nome === nomePericia);
        return pericia ? pericia.valor : 0;
    }

    getCapacidadePericia(nomePericia) {
        const pericia = this.pericias.find(p => p.nome === nomePericia);
        return pericia ? pericia.capacidade : 0;
    }

    obterPericiasPorAtributo(atributo) {
        return this.pericias.filter(p => p.atributo === atributo);
    }

    obterResumoPericias() {
        return this.pericias.map(p => ({
            nome: p.nome,
            categoria: p.categoria,
            atributo: p.atributo,
            valor: p.valor,
            capacidade: p.capacidade,
            bonus: this.obterBonusPorValor(p.valor),
            atributoValor: this.atributosCache[p.atributo] || 0,
            cor: this.obterCorPorValor(p.valor)
        }));
    }

    
    resetarParaValoresBase() {
     this.pericias.forEach(pericia => {
        pericia.valor = pericia.valorBase || 0;
         });
         this.recalcularTodasCapacidades();
         this.atualizarCapacidadesNaInterface();
    
         localStorage.removeItem('periciasRPG');
    }
}
