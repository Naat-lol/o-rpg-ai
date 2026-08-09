export class SistemaTamanho {
    constructor() {
        this.campoMovimento = document.querySelector('.movimento-defesa .campo-md:nth-child(1) input');
        this.campoDefesa = document.querySelector('.movimento-defesa .campo-md:nth-child(2) input');
        this.movimentoBase = 0;
        this.defesaBase = 0;
        this.configurarObservadores();
        console.log('SistemaTamanho inicializado!');
    }

    configurarObservadores() {
        document.addEventListener('atributoAlterado', (evento) => {
            const { atributo, valor } = evento.detail;
            if (atributo === 'FOR' || atributo === 'DES' || atributo === 'TAM') {
                this.calcularValores();
            }
        });

        const inputsAtributos = document.querySelectorAll('.atributo-item input[type="number"]');
        inputsAtributos.forEach(input => {
            input.addEventListener('change', () => {
                const atributoItem = input.closest('.atributo-item');
                const sigla = atributoItem.querySelector('.atributo-sigla').textContent.trim();
                if (sigla === 'FOR' || sigla === 'DES' || sigla === 'TAM') {
                    this.calcularValores();
                }
            });
        });

        setTimeout(() => this.calcularValores(), 100);
    }

    calcularValores() {
        const forca = this.obterValorAtributo('FOR');
        const destreza = this.obterValorAtributo('DES');
        const tamanho = this.obterValorAtributo('TAM');

        const defesaBase = this.calcularDefesaBase(forca, tamanho);
        const movimento = this.calcularMovimento(destreza, tamanho);

        this.defesaBase = defesaBase;
        this.movimentoBase = movimento;

        if (this.campoDefesa) {
            this.campoDefesa.value = defesaBase;
        }
        if (this.campoMovimento) {
            this.campoMovimento.value = movimento;
        }

        document.dispatchEvent(new CustomEvent('movimentoDefesaBaseAtualizado', {
            detail: {
                movimentoBase: this.movimentoBase,
                defesaBase: this.defesaBase
            }
        }));
    }

    calcularDefesaBase(forca, tamanho) {
        if (tamanho < 8) tamanho = 8;
        const parteTamanho = Math.floor((tamanho - 8) / 4);
        const parteForca = Math.floor(forca / 2);
        return parteTamanho + 1 + parteForca;
    }

    calcularMovimento(destreza, tamanho) {
        const parteCalculo = Math.floor((destreza * 5 + (18 - tamanho)) / 6);
        return 8 + parteCalculo;
    }

    obterValorAtributo(sigla) {
        const atributoItem = Array.from(document.querySelectorAll('.atributo-item')).find(item => {
            const siglaElement = item.querySelector('.atributo-sigla');
            return siglaElement && siglaElement.textContent.trim() === sigla;
        });

        if (atributoItem) {
            const input = atributoItem.querySelector('input[type="number"]');
            return parseInt(input.value) || 0;
        }
        return 0;
    }

    atualizarCalculos() {
        this.calcularValores();
    }

    getMovimentoBase() {
        return this.movimentoBase;
    }

    getDefesaBase() {
        return this.defesaBase;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.sistemaTamanho = new SistemaTamanho();
});

export function getSistemaTamanho() {
    return window.sistemaTamanho;
}