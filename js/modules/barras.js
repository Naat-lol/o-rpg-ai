export class BarraVital {
    constructor(container, tipo) {
        this.container = container;
        this.tipo = tipo;
        this.barra = container.querySelector('.barra');
        this.barraPreenchimento = container.querySelector('.barra-preenchimento');
        
        this.barraAtual = container.querySelector('.barra-atual');
        this.barraMaximo = container.querySelector('.barra-maximo');
        
        const botoesEsquerda = container.querySelector('.barra-botoes-esquerda');
        const botoesDireita = container.querySelector('.barra-botoes-direita');
        
        if (botoesEsquerda) {
            const botoesEsq = botoesEsquerda.querySelectorAll('button');
            if (botoesEsq.length >= 2) {
                this.botaoMenos10 = botoesEsq[0];
                this.botaoMenos1 = botoesEsq[1];
            }
        }
        
        if (botoesDireita) {
            const botoesDir = botoesDireita.querySelectorAll('button');
            if (botoesDir.length >= 2) {
                this.botaoMais1 = botoesDir[0];
                this.botaoMais10 = botoesDir[1];
            }
        }
        
        this.valorAtual = 0;
        this.valorMaximo = 0;
        this.estaPiscando = false;
        this.calculoAutomatico = true;

        this.atributosCache = {
            CON: 0,
            PRE: 0,
            POD: 0
        };
        
        this.atributosInicializados = {
            CON: false,
            PRE: false,
            POD: false
        };
        
        this.inicializar();
    }
    
    inicializar() {
        this.atualizarValores();
        
        this.barraMaximo.addEventListener('change', (e) => this.atualizarDoInputMaximo(e));
        this.barraMaximo.addEventListener('blur', (e) => this.atualizarDoInputMaximo(e));
        
        if (this.botaoMenos10) this.botaoMenos10.addEventListener('click', () => this.alterarValor(-10));
        if (this.botaoMenos1) this.botaoMenos1.addEventListener('click', () => this.alterarValor(-1));
        if (this.botaoMais1) this.botaoMais1.addEventListener('click', () => this.alterarValor(1));
        if (this.botaoMais10) this.botaoMais10.addEventListener('click', () => this.alterarValor(10));
        
        this.atualizarBarra();
        
        this.configurarListenerAtributos();
    }
    
    configurarListenerAtributos() {
        document.addEventListener('atributoAlterado', (e) => {
            const { atributo, valor } = e.detail;
            this.atributosCache[atributo] = valor;
            this.atributosInicializados[atributo] = (valor !== 0);

            if (this.deveRecalcularComAtributo(atributo)) {
                this.calcularValorMaximoAutomatico();
            }
        });
    }
    
    deveRecalcularComAtributo(atributo) {
        switch(this.tipo) {
            case 'Vida':
                return atributo === 'CON' || atributo === 'PRE';
            case 'Sanidade':
                return atributo === 'POD';
            case 'Desejo':
                return atributo === 'POD' || atributo === 'CON' || atributo === 'PRE';
            default:
                return false;
        }
    }
    
    temAtributosSuficientes() {
        switch(this.tipo) {
            case 'Sanidade':
                return this.atributosInicializados.POD && this.atributosCache.POD > 0;
                
            case 'Vida':
                return (this.atributosInicializados.CON || this.atributosInicializados.PRE) && 
                       (this.atributosCache.CON > 0 || this.atributosCache.PRE > 0);
                
            case 'Desejo':
                return (this.atributosInicializados.POD || this.atributosInicializados.CON || this.atributosInicializados.PRE) &&
                       (this.atributosCache.POD > 0 || this.atributosCache.CON > 0 || this.atributosCache.PRE > 0);
                
            default:
                return false;
        }
    }
    
    calcularValorMaximoAutomatico() {
        if (!this.calculoAutomatico) return;
        
        if (!this.temAtributosSuficientes()) {
            console.log(`Cálculo automático de ${this.tipo} ignorado: atributos insuficientes`);
            return;
        }
        
        let novoMaximo = 0;
        let novoAtual = this.valorAtual;

        switch(this.tipo) {
            case 'Sanidade':
                if (this.atributosCache.POD > 0) {
                    novoMaximo = this.atributosCache.POD * 5;
                    if (novoMaximo > 100) {
                        novoMaximo = 100 - (novoMaximo - 100);
                    }
                    if (this.valorMaximo > 0) {
                        const proporcao = this.valorAtual / this.valorMaximo;
                        novoAtual = Math.round(novoMaximo * proporcao);
                    } else {
                        novoAtual = novoMaximo;
                    }
                }
                break;
                
            case 'Vida':
                if (this.atributosCache.CON > 0 || this.atributosCache.PRE > 0) {
                    const somaCONPRE = this.atributosCache.CON + this.atributosCache.PRE;
                    novoMaximo = Math.ceil(somaCONPRE / 3 + 7);
                    if (this.valorMaximo > 0) {
                        const proporcao = this.valorAtual / this.valorMaximo;
                        novoAtual = Math.round(novoMaximo * proporcao);
                    } else {
                        novoAtual = novoMaximo;
                    }
                }
                break;
                
            case 'Desejo':
                if (this.atributosCache.POD > 0 || this.atributosCache.CON > 0 || this.atributosCache.PRE > 0) {
                    const calculo = (this.atributosCache.POD * 1.4) + 
                                  (this.atributosCache.CON * 1.8) + 
                                  (this.atributosCache.PRE * 1.9) + 47;
                    novoMaximo = Math.ceil(calculo / 5);
                    if (this.valorMaximo > 0) {
                        const proporcao = this.valorAtual / this.valorMaximo;
                        novoAtual = Math.round(novoMaximo * proporcao);
                    } else {
                        novoAtual = novoMaximo;
                    }
                }
                break;
        }
        
        novoMaximo = Math.max(novoMaximo, 0);
        novoAtual = Math.min(Math.max(novoAtual, 0), novoMaximo);
        
        if (novoMaximo !== this.valorMaximo || novoAtual !== this.valorAtual) {
            this.setValores(novoAtual, novoMaximo, true);
        }
    }
    
    atualizarValores() {
        this.barraAtual.textContent = this.valorAtual;
        this.barraMaximo.value = this.valorMaximo;
        this.atualizarDestaqueUltrapassado();
    }
    
    atualizarDestaqueUltrapassado() {
        this.barraAtual.classList.remove('ultrapassado');
        if (this.valorAtual > this.valorMaximo && this.valorMaximo > 0) {
            this.barraAtual.classList.add('ultrapassado');
        }
    }
    
    atualizarBarra() {
        let porcentagem = 0;
        if (this.valorMaximo > 0) {
            if (this.valorAtual >= this.valorMaximo) {
                porcentagem = 100;
            } else {
                porcentagem = Math.min(Math.max(this.valorAtual / this.valorMaximo * 100, 0), 100);
            }
        }
        
        this.barraPreenchimento.style.width = `${porcentagem}%`;
        
        this.aplicarEfeitosVisuais(porcentagem);
        this.atualizarDestaqueUltrapassado();
    }
    
    aplicarEfeitosVisuais(porcentagem) {
        this.removerEfeitos();
        
        if (this.valorAtual > this.valorMaximo && this.valorMaximo > 0) {
            return;
        }
        
        if (porcentagem <= 33) {
            this.barraPreenchimento.classList.add('critica');
            this.estaPiscando = true;
        } 
        else if (porcentagem <= 50) {
            this.barraPreenchimento.classList.add('muito-baixa');
            this.estaPiscando = false;
        }
        else if (porcentagem <= 75) {
            this.barraPreenchimento.classList.add('baixa');
            this.estaPiscando = false;
        }
    }
    
    removerEfeitos() {
        this.barraPreenchimento.classList.remove('baixa', 'muito-baixa', 'critica');
        this.estaPiscando = false;
    }
    
    alterarValor(valor) {
        const novoValor = this.valorAtual + valor;
        this.setValorAtual(novoValor);
    }
    
    setValorAtual(valor, naoDispararEvento = false) {
        this.valorAtual = Math.max(valor, 0);
        this.atualizarValores();
        this.atualizarBarra();
        
        if (!naoDispararEvento) {
            this.container.dispatchEvent(new CustomEvent('valorAlterado', {
                detail: {
                    tipo: this.tipo,
                    atual: this.valorAtual,
                    maximo: this.valorMaximo
                }
            }));
        }
    }
    
    setValorMaximo(valor, calculoAutomatico = false) {
        this.calculoAutomatico = !calculoAutomatico;
        
        const novoMaximo = Math.max(parseInt(valor) || 0, 0);
        this.valorMaximo = novoMaximo;
        
        this.atualizarValores();
        this.atualizarBarra();
        
        this.container.dispatchEvent(new CustomEvent('maximoAlterado', {
            detail: {
                tipo: this.tipo,
                maximo: this.valorMaximo
            }
        }));
        
        if (calculoAutomatico) {
            this.calculoAutomatico = true;
        }
    }
    
    setValores(atual, maximo, calculoAutomatico = false) {
        this.calculoAutomatico = !calculoAutomatico;
        
        const novoMaximo = Math.max(parseInt(maximo) || 0, 0);
        this.valorMaximo = novoMaximo;
        
        const novoAtual = Math.max(parseInt(atual) || 0, 0);
        this.valorAtual = novoAtual;
        
        this.atualizarValores();
        this.atualizarBarra();
        
        this.container.dispatchEvent(new CustomEvent('valorAlterado', {
            detail: {
                tipo: this.tipo,
                atual: this.valorAtual,
                maximo: this.valorMaximo
            }
        }));
        
        this.container.dispatchEvent(new CustomEvent('maximoAlterado', {
            detail: {
                tipo: this.tipo,
                maximo: this.valorMaximo
            }
        }));
        
        if (calculoAutomatico) {
            this.calculoAutomatico = true;
        }
    }
    
    atualizarDoInputMaximo(event) {
        const input = event.target;
        const novoMaximo = parseInt(input.value);
        
        if (!isNaN(novoMaximo) && novoMaximo >= 0) {
            this.calculoAutomatico = false;
            this.setValorMaximo(novoMaximo);
        } else {
            input.value = this.valorMaximo;
        }
    }
    
    getValorAtual() {
        return this.valorAtual;
    }
    
    getValorMaximo() {
        return this.valorMaximo;
    }
    
    estaEmEstadoCritico() {
        if (this.valorMaximo === 0) return false;
        if (this.valorAtual > this.valorMaximo) return false;
        const porcentagem = (this.valorAtual / this.valorMaximo) * 100;
        return porcentagem <= 33;
    }
    
    atualizarVisual() {
        this.atualizarValores();
        this.atualizarBarra();
    }
    
    atualizarAtributo(atributo, valor) {
        const valorNum = parseInt(valor) || 0;
        this.atributosCache[atributo] = valorNum;
        this.atributosInicializados[atributo] = (valorNum !== 0);
        
        if (this.deveRecalcularComAtributo(atributo)) {
            this.calcularValorMaximoAutomatico();
        }
    }
    
    setCalculoAutomatico(ativo) {
        this.calculoAutomatico = ativo;
    }
    
    forcarCalculo() {
        this.calcularValorMaximoAutomatico();
    }
    
    getAtributosCache() {
        return { ...this.atributosCache };
    }
    
    isCalculoAutomatico() {
        return this.calculoAutomatico;
    }
}