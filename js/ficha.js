import { BarraVital } from './modules/barras.js';
import { SistemaDados } from './modules/dados.js';
import { SistemaAbas } from './modules/abas.js';
import { SistemaPericias } from './modules/pericias.js';
import { SistemaConfiguracoes } from './modules/configuracoes.js';
import { SistemaDadosPersonalizados } from './modules/dados-personalizados.js';
import { SistemaInventario } from './modules/inventario.js';
import { SistemaTrilhasPerks } from './modules/trilhas&perks.js';
import { SistemaTamanho } from './modules/tamanho.js';
import { ModalAtributo } from './modules/modal-atributo.js';
import { ModalConfirmacao } from './modules/modal-confirmacao.js';

let sistemaPericiasGlobal = null;
let modalAtributoGlobal = null;

document.addEventListener('DOMContentLoaded', function() {
    const sistemaAbas = new SistemaAbas();

    const barras = inicializarBarras();

    const sistemaDados = new SistemaDados();

    const sistemaPericias = new SistemaPericias(sistemaDados);
    sistemaPericiasGlobal = sistemaPericias;

    const modalAtributo = new ModalAtributo(sistemaDados, sistemaPericias);
    modalAtributoGlobal = modalAtributo;

    const sistemaConfiguracoes = new SistemaConfiguracoes();

    const sistemaDadosPersonalizados = new SistemaDadosPersonalizados(sistemaDados);

    const sistemaInventario = new SistemaInventario();

    const sistemaTamanho = new SistemaTamanho();

    const sistemaTrilhasPerks = new SistemaTrilhasPerks();

    sistemaTrilhasPerks.setSistemas(barras, sistemaTamanho);

    configurarEventosAtributos(sistemaDados, barras, sistemaInventario, sistemaPericias, sistemaTamanho, modalAtributo);

    configurarEventoSanidade(sistemaDados, barras.sanidade);

    configurarUploadFoto();

    console.log('Ficha RPG inicializada!');

    window.barrasRPG = barras;
    window.sistemaDados = sistemaDados;
    window.sistemaAbas = sistemaAbas;
    window.sistemaPericias = sistemaPericias;
    window.sistemaConfiguracoes = sistemaConfiguracoes;
    window.sistemaDadosPersonalizados = sistemaDadosPersonalizados;
    window.sistemaInventario = sistemaInventario;
    window.sistemaTrilhasPerks = sistemaTrilhasPerks;
    window.sistemaTamanho = sistemaTamanho;
    window.modalAtributo = modalAtributo;

    function aplicarCores() {
        setTimeout(() => {
            sistemaConfiguracoes.aplicarCorTextoBotao();
        }, 200);
    }

    aplicarCores();

    document.addEventListener('abaMudou', aplicarCores);

    setInterval(aplicarCores, 1000);
});

function inicializarBarras() {
    const containers = {
        vida: document.querySelector('.barra-container.vida'),
        sanidade: document.querySelector('.barra-container.sanidade'),
        desejo: document.querySelector('.barra-container.desejo')
    };

    const barras = {
        vida: new BarraVital(containers.vida, 'Vida'),
        sanidade: new BarraVital(containers.sanidade, 'Sanidade'),
        desejo: new BarraVital(containers.desejo, 'Desejo')
    };

    barras.vida.setValorMaximo(10);
    barras.vida.setValorAtual(10);

    barras.sanidade.setValorMaximo(100);
    barras.sanidade.setValorAtual(100);

    barras.desejo.setValorMaximo(10);
    barras.desejo.setValorAtual(10);

    return barras;
}

function configurarEventosAtributos(sistemaDados, barras, sistemaInventario, sistemaPericias, sistemaTamanho, modalAtributo) {
    console.log('Configurando eventos de atributos com modal...');

    const todosAtributos = document.querySelectorAll('.atributo-item');

    const atributosIniciais = {};
    todosAtributos.forEach((atributoItem) => {
        const inputValor = atributoItem.querySelector('input[type="number"]');
        const siglaAtributo = atributoItem.querySelector('.atributo-sigla').textContent.trim();
        const valor = parseInt(inputValor.value) || 0;
        atributosIniciais[siglaAtributo] = valor;
    });

    if (sistemaPericias && sistemaPericias.atualizarAtributos) {
        sistemaPericias.atualizarAtributos(atributosIniciais);
    }

    todosAtributos.forEach((atributoItem) => {
        const inputValor = atributoItem.querySelector('input[type="number"]');
        const siglaAtributo = atributoItem.querySelector('.atributo-sigla').textContent.trim();
        const nomeAtributo = atributoItem.querySelector('.atributo-nome').textContent;

        const isClicavel = atributoItem.querySelector('.atributo-sigla.texto-clicavel');

        inputValor.addEventListener('change', (e) => {
            const valor = parseInt(e.target.value) || 0;

            console.log(`Atributo ${siglaAtributo} alterado para: ${valor}`);

            document.dispatchEvent(new CustomEvent('atributoAlterado', {
                detail: {
                    atributo: siglaAtributo,
                    valor: valor
                }
            }));

            if (barras.vida) barras.vida.atualizarAtributo(siglaAtributo, valor);
            if (barras.sanidade) barras.sanidade.atualizarAtributo(siglaAtributo, valor);
            if (barras.desejo) barras.desejo.atualizarAtributo(siglaAtributo, valor);

            if (sistemaInventario && (siglaAtributo === 'FOR' || siglaAtributo === 'CON' || siglaAtributo === 'TAM')) {
                sistemaInventario.atualizarAtributo(siglaAtributo, valor);
            }

            if (sistemaPericias && sistemaPericias.atualizarAtributo) {
                sistemaPericias.atualizarAtributo(siglaAtributo, valor);
            }

            if (sistemaTamanho && (siglaAtributo === 'FOR' || siglaAtributo === 'DES' || siglaAtributo === 'TAM')) {
                sistemaTamanho.atualizarCalculos();
            }
        });

        if (isClicavel) {
            const siglaElement = atributoItem.querySelector('.atributo-sigla');

            siglaElement.style.cursor = 'pointer';
            siglaElement.title = `Clique para testar ${nomeAtributo}`;

            siglaElement.addEventListener('mouseenter', () => {
                siglaElement.style.color = 'var(--primary, #3A86FF)';
                siglaElement.style.textShadow = '0 0 20px rgba(58, 134, 255, 0.3)';
            });

            siglaElement.addEventListener('mouseleave', () => {
                siglaElement.style.color = '';
                siglaElement.style.textShadow = '';
            });

            siglaElement.addEventListener('click', () => {
                const valorAtributo = parseInt(inputValor.value) || 0;

                console.log(`Clicou no atributo ${nomeAtributo} com valor ${valorAtributo}`);

                if (valorAtributo > 0) {
                    if (modalAtributo && modalAtributo.abrir) {
                        modalAtributo.abrir({
                            sigla: siglaAtributo,
                            valor: valorAtributo,
                            nome: nomeAtributo
                        });
                    } else {
                        sistemaDados.rolarTesteAtributo(nomeAtributo, valorAtributo);
                    }
                } else {
                    alert(`Por favor, insira um valor para ${nomeAtributo} antes de rolar.`);
                }
            });
        }

        const nomeElement = atributoItem.querySelector('.atributo-nome');
        if (isClicavel && nomeElement) {
            nomeElement.style.cursor = 'pointer';
            nomeElement.addEventListener('click', () => {
                const valorAtributo = parseInt(inputValor.value) || 0;

                if (valorAtributo > 0) {
                    if (modalAtributo && modalAtributo.abrir) {
                        modalAtributo.abrir({
                            sigla: siglaAtributo,
                            valor: valorAtributo,
                            nome: nomeAtributo
                        });
                    } else {
                        sistemaDados.rolarTesteAtributo(nomeAtributo, valorAtributo);
                    }
                }
            });
        }
    });

    console.log(`Eventos configurados para ${todosAtributos.length} atributos`);
}

function configurarEventoSanidade(sistemaDados, barraSanidade) {
    const tituloSanidade = document.querySelector('.barra-container.sanidade .barra-titulo.texto-clicavel');

    if (tituloSanidade) {
        tituloSanidade.style.cursor = 'pointer';
        tituloSanidade.title = 'Rolar teste de Sanidade (1d100)';

        tituloSanidade.addEventListener('mouseenter', () => {
            tituloSanidade.style.color = 'var(--primary, #3A86FF)';
            tituloSanidade.style.textShadow = '0 0 20px rgba(58, 134, 255, 0.3)';
        });

        tituloSanidade.addEventListener('mouseleave', () => {
            tituloSanidade.style.color = '';
            tituloSanidade.style.textShadow = '';
        });

        tituloSanidade.addEventListener('click', () => {
            const valorAtualSanidade = barraSanidade.getValorAtual();

            if (valorAtualSanidade > 0) {
                sistemaDados.rolarTesteSanidade(valorAtualSanidade);
            } else {
                alert('A sanidade está zerada!');
            }
        });
    }
}

function configurarUploadFoto() {
    const fotoContainer = document.getElementById('foto-container');
    const inputFile = document.getElementById('upload-foto');
    const fotoImg = document.getElementById('foto-personagem');
    const btnSubstituir = document.getElementById('foto-substituir');
    const btnRemover = document.getElementById('foto-remover');
    const overlay = document.getElementById('foto-overlay');

    if (!fotoContainer || !inputFile || !fotoImg) return;

    function temFoto() {
        return fotoImg.src && !fotoImg.src.includes('via.placeholder.com') && !fotoImg.src.includes('data:image/svg');
    }

    function atualizarOverlay() {
        if (temFoto()) {
            fotoContainer.classList.remove('sem-foto');
            btnRemover.style.display = 'flex';
            btnSubstituir.querySelector('.foto-btn-text').textContent = 'Substituir';
            overlay.classList.remove('visivel');
        } else {
            fotoContainer.classList.add('sem-foto');
            btnRemover.style.display = 'none';
            btnSubstituir.querySelector('.foto-btn-text').textContent = 'Adicionar Foto';
            overlay.classList.add('visivel');
        }
    }

    fotoContainer.addEventListener('mouseenter', () => {
        if (temFoto()) {
            overlay.classList.add('visivel');
        }
    });

    fotoContainer.addEventListener('mouseleave', () => {
        if (temFoto()) {
            overlay.classList.remove('visivel');
        }
    });

    btnSubstituir.addEventListener('click', function(e) {
        e.stopPropagation();

        if (temFoto()) {
            ModalConfirmacao.confirmar(
                'Alterar Foto',
                'Já existe uma foto selecionada. Deseja substituí-la por uma nova?',
                'Substituir',
                'Cancelar'
            ).then(confirmado => {
                if (confirmado) {
                    inputFile.click();
                }
            });
        } else {
            inputFile.click();
        }
    });

    btnRemover.addEventListener('click', function(e) {
        e.stopPropagation();

        ModalConfirmacao.confirmar(
            'Remover Foto',
            'Tem certeza que deseja remover a foto atual?',
            'Remover',
            'Cancelar'
        ).then(confirmado => {
            if (confirmado) {
                removerFoto();
            }
        });
    });

    function removerFoto() {
        fotoImg.src = 'https://via.placeholder.com/150';
        localStorage.removeItem('fotoPersonagem');
        atualizarOverlay();
        mostrarMensagem('Foto removida com sucesso!', 'info');
        document.dispatchEvent(new CustomEvent('fotoRemovida'));
    }

    inputFile.addEventListener('change', function(e) {
        const file = this.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            mostrarMensagem('Por favor, selecione uma imagem válida.', 'error');
            this.value = '';
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            mostrarMensagem('A imagem deve ter no máximo 5MB.', 'error');
            this.value = '';
            return;
        }

        const reader = new FileReader();

        reader.onload = function(event) {
            fotoImg.src = event.target.result;
            try {
                localStorage.setItem('fotoPersonagem', event.target.result);
                mostrarMensagem('Foto atualizada com sucesso!', 'success');
                atualizarOverlay();
            } catch (e) {
                if (e.name === 'QuotaExceededError') {
                    mostrarMensagem('Imagem muito grande para salvar localmente. A foto será mantida na sessão atual.', 'info');
                    atualizarOverlay();
                } else {
                    console.error('Erro ao salvar foto:', e);
                    mostrarMensagem('Erro ao salvar foto.', 'error');
                }
            }
            document.dispatchEvent(new CustomEvent('fotoAtualizada'));
        };

        reader.onerror = function() {
            mostrarMensagem('Erro ao ler a imagem.', 'error');
        };

        reader.readAsDataURL(file);
        this.value = '';
    });

    try {
        const fotoSalva = localStorage.getItem('fotoPersonagem');
        if (fotoSalva && fotoSalva.startsWith('data:image/')) {
            fotoImg.src = fotoSalva;
            console.log('Foto carregada do localStorage.');
        }
    } catch (e) {
        console.warn('Erro ao carregar foto do localStorage:', e);
    }

    setTimeout(atualizarOverlay, 150);

    fotoImg.addEventListener('load', function() {
        atualizarOverlay();
    });

    configurarDragAndDrop();
}

function configurarDragAndDrop() {
    const fotoContainer = document.getElementById('foto-container');
    if (!fotoContainer) return;

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        fotoContainer.addEventListener(eventName, (e) => {
            e.preventDefault();
            e.stopPropagation();
        });
    });

    fotoContainer.addEventListener('dragover', () => {
        fotoContainer.style.borderColor = 'var(--primary, #3A86FF)';
        fotoContainer.style.transform = 'scale(1.02)';
    });

    fotoContainer.addEventListener('dragleave', () => {
        fotoContainer.style.borderColor = '';
        fotoContainer.style.transform = '';
    });

    fotoContainer.addEventListener('drop', (e) => {
        fotoContainer.style.borderColor = '';
        fotoContainer.style.transform = '';

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            const file = files[0];
            if (file.type.startsWith('image/')) {
                const fotoImg = document.getElementById('foto-personagem');
                const temFoto = fotoImg && fotoImg.src && !fotoImg.src.includes('via.placeholder.com');

                if (temFoto) {
                    ModalConfirmacao.confirmar(
                        'Alterar Foto',
                        'Já existe uma foto selecionada. Deseja substituí-la pela imagem arrastada?',
                        'Substituir',
                        'Cancelar'
                    ).then(confirmado => {
                        if (confirmado) {
                            processarArquivo(file);
                        }
                    });
                } else {
                    processarArquivo(file);
                }
            } else {
                mostrarMensagem('Arraste apenas imagens.', 'error');
            }
        }
    });

    function processarArquivo(file) {
        const inputFile = document.getElementById('upload-foto');
        if (inputFile) {
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            inputFile.files = dataTransfer.files;
            inputFile.dispatchEvent(new Event('change'));
        }
    }
}

function mostrarMensagem(texto, tipo = 'info') {
    if (window.sistemaTrilhasPerks && typeof window.sistemaTrilhasPerks.mostrarMensagem === 'function') {
        window.sistemaTrilhasPerks.mostrarMensagem(texto, tipo);
        return;
    }
    const msg = document.createElement('div');
    msg.className = `mensagem-trilha mensagem-${tipo}`;
    msg.textContent = texto;
    msg.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: ${tipo === 'success' ? 'var(--primary)' : tipo === 'error' ? '#d32f2f' : '#666'};
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        z-index: 10000;
        animation: fadeInUp 0.3s ease;
        max-width: 300px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.5);
        font-family: 'Share Tech Mono', monospace;
        font-size: 14px;
    `;
    document.body.appendChild(msg);
    setTimeout(() => {
        msg.style.opacity = '0';
        msg.style.transition = 'opacity 0.3s';
        setTimeout(() => {
            if (document.body.contains(msg)) document.body.removeChild(msg);
        }, 300);
    }, 3000);
}

export function enviarAtributosParaPericias() {
    if (!sistemaPericiasGlobal) return;

    const atributos = {};
    const inputsAtributos = document.querySelectorAll('.atributo-item input[type="number"]');

    inputsAtributos.forEach((input) => {
        const siglaElement = input.closest('.atributo-item').querySelector('.atributo-sigla');
        if (siglaElement) {
            const sigla = siglaElement.textContent.trim();
            const valor = parseInt(input.value) || 0;
            atributos[sigla] = valor;
        }
    });

    if (sistemaPericiasGlobal.atualizarAtributos) {
        sistemaPericiasGlobal.atualizarAtributos(atributos);
    }
}

export function getBarraVida() {
    return window.barrasRPG?.vida;
}

export function getBarraSanidade() {
    return window.barrasRPG?.sanidade;
}

export function getBarraDesejo() {
    return window.barrasRPG?.desejo;
}

export function getSistemaDados() {
    return window.sistemaDados;
}

export function getSistemaAbas() {
    return window.sistemaAbas;
}

export function getSistemaPericias() {
    return window.sistemaPericias;
}

export function getSistemaConfiguracoes() {
    return window.sistemaConfiguracoes;
}

export function getSistemaDadosPersonalizados() {
    return window.sistemaDadosPersonalizados;
}

export function getSistemaInventario() {
    return window.sistemaInventario;
}

export function getSistemaTrilhasPerks() {
    return window.sistemaTrilhasPerks;
}

export function getSistemaTamanho() {
    return window.sistemaTamanho;
}

export function getModalAtributo() {
    return window.modalAtributo;
}