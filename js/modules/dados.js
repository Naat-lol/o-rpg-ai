export class SistemaDados {
    constructor() {
        this.historico = this.carregarHistorico();
        this.notificacoesContainer = null;
        this.criarContainerNotificacoes();
    }

    criarContainerNotificacoes() {
        if (!this.notificacoesContainer) {
            this.notificacoesContainer = document.createElement('div');
            this.notificacoesContainer.className = 'notificacoes-container';
            document.body.appendChild(this.notificacoesContainer);
        }
    }

    rolarDado(faces) {
        return Math.floor(Math.random() * faces) + 1;
    }

    rolarVariosDados(quantidade, faces) {
        const resultados = [];
        for (let i = 0; i < quantidade; i++) {
            resultados.push(this.rolarDado(faces));
        }
        return resultados;
    }

    calcularSucessos(resultados) {
        let sucessos = 0;
        
        resultados.forEach((resultado) => {
            if (resultado === 20) { 
                sucessos += 2;
            } else if (resultado === 1) {
                sucessos -= 1;
            } else if (resultado > 10) { 
                sucessos += 1;
            }
        });
        
        return sucessos;
    }

    rolarTesteAtributo(nomeAtributo, valorAtributo) {
        console.log(`Rolando teste de atributo: ${nomeAtributo} (valor: ${valorAtributo})`);
        
        const quantidadeDados = Math.max(1, valorAtributo);
        
        const resultados = this.rolarVariosDados(quantidadeDados, 20);
        
        const sucessos = this.calcularSucessos(resultados);
        
        const cor = this.getCorPorSucessos(sucessos);
        
        this.adicionarAoHistorico({
            tipo: 'Atributo',
            nome: nomeAtributo,
            valor: valorAtributo,
            resultados: resultados,
            sucessos: sucessos,
            timestamp: new Date().toISOString()
        });
        
        this.mostrarNotificacao({
            titulo: nomeAtributo,
            tipo: 'atributo',
            dadosInfo: `${valorAtributo}d20`,
            resultados: resultados,
            valorFinal: sucessos,
            cor: cor,
            extraInfo: null,
            isD20: true
        });
        
        return {
            resultados: resultados,
            sucessos: sucessos
        };
    }

    rolarTesteSanidade(valorSanidade) {
        console.log(`Rolando teste de Sanidade (valor: ${valorSanidade})`);
        
        const resultado = this.rolarDado(100);
        
        const sucesso = resultado <= valorSanidade;
        
        const cor = sucesso ? '#00E10F' : '#D90012';
        
        this.adicionarAoHistorico({
            tipo: 'Sanidade',
            nome: 'Sanidade',
            valor: valorSanidade,
            resultado: resultado,
            sucesso: sucesso,
            timestamp: new Date().toISOString()
        });
        
        this.mostrarNotificacao({
            titulo: sucesso ? 'SUCESSO' : 'FRACASSO',
            tipo: 'sanidade',
            dadosInfo: '1d100',
            resultados: [resultado],
            valorFinal: resultado,
            cor: cor,
            extraInfo: null,
            isD20: false,
            sanidade: true,
            sucesso: sucesso,
            valorSanidade: valorSanidade
        });
        
        return {
            resultado: resultado,
            sucesso: sucesso
        };
    }

    rolarDadosPersonalizados(config) {
        const {
            tipoDados,
            quantidade,
            modificador = 0,
            tipoRolagem = 'normal',
            vantagensDesvantagens = 1
        } = config;

        const faces = parseInt(tipoDados.replace('d', ''));
        let dadosOriginais = [];
        let dadosExtras = [];
        
        let quantidadeFinal = quantidade;
        
        if (tipoRolagem === 'vantagem') {
            dadosOriginais = this.rolarVariosDados(quantidade, faces);
            dadosExtras = this.rolarVariosDados(vantagensDesvantagens, faces);
        } else if (tipoRolagem === 'desvantagem') {
            quantidadeFinal = Math.max(1, quantidade - vantagensDesvantagens);
            dadosOriginais = this.rolarVariosDados(quantidadeFinal, faces);
        } else {
            dadosOriginais = this.rolarVariosDados(quantidade, faces);
        }
        
        let resultadoFinal = 0;
        let sucessos = 0;
        let todosResultados = [];
        
        if (faces === 20) {
            todosResultados = [...dadosOriginais];
            if (tipoRolagem === 'vantagem') {
                todosResultados = [...dadosOriginais, ...dadosExtras];
            }
            
            sucessos = this.calcularSucessos(todosResultados);
            resultadoFinal = sucessos + modificador;
            
        } else {
            todosResultados = [...dadosOriginais];
            
            if (tipoRolagem === 'vantagem') {
                todosResultados = [...dadosOriginais, ...dadosExtras];
                const melhorResultado = Math.max(...todosResultados);
                resultadoFinal = melhorResultado + modificador;
            } else if (tipoRolagem === 'desvantagem') {
                const piorResultado = Math.min(...todosResultados);
                resultadoFinal = piorResultado + modificador;
            } else {
                const soma = todosResultados.reduce((a, b) => a + b, 0);
                resultadoFinal = soma + modificador;
            }
        }
        
        const entradaHistorico = {
            tipo: 'Personalizado',
            config: config,
            dadosOriginais: [...dadosOriginais],
            dadosExtras: [...dadosExtras],
            todosResultados: [...todosResultados],
            resultadoFinal: resultadoFinal,
            sucessos: sucessos,
            timestamp: new Date().toISOString()
        };
        
        this.adicionarAoHistorico(entradaHistorico);
        
        let infoExtra = '';
        if (tipoRolagem === 'vantagem') {
            infoExtra = `Vantagem (+${vantagensDesvantagens}d${faces})`;
        } else if (tipoRolagem === 'desvantagem') {
            infoExtra = `Desvantagem (-${vantagensDesvantagens}d${faces})`;
        }
        
        if (modificador !== 0) {
            infoExtra += ` Mod: ${modificador > 0 ? '+' : ''}${modificador}`;
        }
        
        const cor = 'var(--primary)';
        const titulo = `${quantidade}${tipoDados}${tipoRolagem !== 'normal' ? ` (${tipoRolagem})` : ''}`;
        
        this.mostrarNotificacao({
            titulo: titulo,
            tipo: 'personalizado',
            dadosInfo: `${quantidadeFinal}${tipoDados}`,
            resultados: todosResultados,
            valorFinal: resultadoFinal,
            cor: cor,
            extraInfo: infoExtra,
            isD20: faces === 20,
            modificador: modificador
        });
        
        return {
            dadosOriginais,
            dadosExtras,
            todosResultados,
            resultadoFinal,
            sucessos
        };
    }

    mostrarNotificacao(dados) {
        this.criarContainerNotificacoes();
        
        const notificacao = document.createElement('div');
        notificacao.className = 'notificacao-dados';
        notificacao.style.borderLeftColor = dados.cor;
        
        let valorLabel = dados.isD20 ? 'sucessos' : 'resultado';
        
        const resultadosFormatados = dados.resultados.map(r => {
            if (r === 20) return `<span style="color: #00E10F; font-weight: bold">${r}</span>`;
            if (r === 1) return `<span style="color: #D90012; font-weight: bold">${r}</span>`;
            if (r > 10 && dados.isD20) return `<span style="font-weight: bold">${r}</span>`;
            return `${r}`;
        }).join(', ');
        
        let sanidadeInfo = '';
        if (dados.sanidade) {
            sanidadeInfo = `
                <div class="notificacao-dados-rolados" style="margin-top: 8px; font-size: 13px; color: #aaa;">
                    ${dados.sucesso ? '' : ''} ${dados.sucesso ? 'Sucesso' : 'Fracasso'} (Sanidade: ${dados.valorSanidade})
                </div>
            `;
        }
        
        let conteudoHTML = `
            <div class="notificacao-cabecalho">
                <h3 class="notificacao-titulo" style="color: ${dados.cor}">
                    ${dados.titulo}
                </h3>
                <button class="notificacao-fechar" title="Fechar">×</button>
            </div>
            <div class="notificacao-conteudo">
                <div class="notificacao-superior">
                    <div>
                        <div class="notificacao-valor" style="color: ${dados.cor}">
                            ${dados.valorFinal}
                        </div>
                        <div class="notificacao-sucessos-texto">
                            ${dados.sanidade ? '' : valorLabel}
                        </div>
                    </div>
                    ${dados.extraInfo ? `
                        <div class="notificacao-vd">
                            ${dados.extraInfo}
                        </div>
                    ` : ''}
                </div>
                <div class="notificacao-dados-rolados">
                    <strong>${dados.dadosInfo}:</strong> ${resultadosFormatados}
                    ${dados.modificador !== undefined && dados.modificador !== 0 ? `
                        <br><strong>Modificador:</strong> ${dados.modificador > 0 ? '+' : ''}${dados.modificador}
                    ` : ''}
                </div>
                ${sanidadeInfo}
                <div class="notificacao-info">
                    Clique para fechar
                </div>
            </div>
        `;
        
        notificacao.innerHTML = conteudoHTML;
        
        this.notificacoesContainer.insertBefore(notificacao, this.notificacoesContainer.firstChild);
        
        if (this.notificacoesContainer.children.length > 3) {
            const ultima = this.notificacoesContainer.lastElementChild;
            if (ultima) {
                this.fecharNotificacao(ultima);
            }
        }
        
        const fecharBtn = notificacao.querySelector('.notificacao-fechar');
        fecharBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.fecharNotificacao(notificacao);
        });
        
        notificacao.addEventListener('click', () => {
            this.fecharNotificacao(notificacao);
        });
        
        setTimeout(() => {
            if (notificacao.parentNode) {
                this.fecharNotificacao(notificacao);
            }
        }, 8000);
    }

    fecharNotificacao(notificacao) {
        if (notificacao.classList.contains('fechando')) return;
        
        notificacao.classList.add('fechando');
        setTimeout(() => {
            if (notificacao.parentNode) {
                notificacao.parentNode.removeChild(notificacao);
            }
        }, 300);
    }

    getCorPorSucessos(sucessos) {
        if (sucessos <= 0) return '#ff0015';
        if (sucessos === 1) return '#218fd8';
        if (sucessos === 2) return '#30d108';
        return 'var(--primary)';
    }

    adicionarAoHistorico(entrada) {
        this.historico.unshift(entrada);
        if (this.historico.length > 20) {
            this.historico.pop();
        }
        this.salvarHistorico();
    }

    salvarHistorico() {
        try {
            localStorage.setItem('dadosHistorico', JSON.stringify(this.historico));
        } catch (e) {
            console.error('Erro ao salvar histórico:', e);
        }
    }

    carregarHistorico() {
        try {
            const historico = localStorage.getItem('dadosHistorico');
            return historico ? JSON.parse(historico) : [];
        } catch (e) {
            console.error('Erro ao carregar histórico:', e);
            return [];
        }
    }

    limparHistorico() {
        this.historico = [];
        this.salvarHistorico();
    }

    getHistorico() {
        return this.historico;
    }

    getHistoricoPorTipo(tipo) {
        return this.historico.filter(entrada => entrada.tipo === tipo);
    }
}