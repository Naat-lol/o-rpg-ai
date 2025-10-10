// ===== VARIÁVEIS GLOBAIS E CÓDIGO EXISTENTE ===== //
let vidaAtual = 0;
let vidaMaxima = 0;
let sanidadeAtual = 0;
let sanidadeMaxima = 0;
const MAX_NEGATIVO_VIDA = -10;
const MAX_NEGATIVO_SANIDADE = -3;
let fotosSalvas = {};
let inventario = [];
let ataques = [];
let traumasFobias = [];
let historicoRolagens = [];
let ordenacaoAtual = 'alfabetica';

let deslocamentoM = '';
let defesa = '';

// ===== INICIALIZAÇÃO ===== //
document.addEventListener('DOMContentLoaded', function() {
    carregarDados();
    inicializarAbas();
    configurarEventListeners();
    inicializarSeletorCores();
    inicializarPericias();
    inicializarMenuConfig();
});

// Paleta de cores para o seletor personalizado
const coresDisponiveis = [
    '#FF3838', // Vermelho (intensificado)
    '#FF5500', // Laranja (mais forte)
    '#FFFF00', // Amarelo (mantido)
    '#00FF00', // Verde (intensificado)
    '#00FFFF', // Ciano (mantido)
    '#0000FF', // Azul (intensificado)
    '#9D00FF', // Roxo (mantido)
    '#FF00FF'  // Magenta (mantido)
];

// ===== CONFIGURAÇÕES DO MENU LATERAL ===== //

function inicializarMenuConfig() {
    const menuToggle = document.getElementById('config-toggle');
    const configMenu = document.getElementById('config-menu');
    const closeBtn = document.getElementById('close-config');
    const overlay = document.createElement('div');
    overlay.className = 'config-overlay';
    document.body.appendChild(overlay);

    // Abrir/fechar menu
    menuToggle.addEventListener('click', () => {
        // Verifica se o menu já está aberto
        if (configMenu.classList.contains('open')) {
            // Se estiver aberto, fecha
            configMenu.classList.remove('open');
            overlay.classList.remove('active');
        } else {
            // Se estiver fechado, abre
            configMenu.classList.add('open');
            overlay.classList.add('active');
        }
    });

    // Fechar menu (função auxiliar)
    function fecharMenu() {
        configMenu.classList.remove('open');
        overlay.classList.remove('active');
    }

    closeBtn.addEventListener('click', fecharMenu);
    overlay.addEventListener('click', fecharMenu);

    // Configurar botões do menu
    document.getElementById('config-portrait').addEventListener('click', () => {
        window.open('portrait.html', '_blank');
        fecharMenu();
    });

    document.getElementById('config-exportar').addEventListener('click', () => {
        exportarFicha();
        fecharMenu();
    });

    document.getElementById('config-importar').addEventListener('click', () => {
        document.getElementById('config-import-file').click();
    });

    document.getElementById('config-import-file').addEventListener('change', processarArquivoImportado);

    document.getElementById('config-reset').addEventListener('click', () => {
        resetTotal();
        fecharMenu();
    });

    // Inicializar seletor de cores no menu
    inicializarSeletorCoresConfig();
}

function inicializarSeletorCoresConfig() {
    const pickerDisplay = document.getElementById('config-cor-picker-display');
    const paleta = document.getElementById('config-cor-picker-paleta');

    // Definir cor atual
    const corAtual = getComputedStyle(document.documentElement).getPropertyValue('--dominant-color').trim();
    pickerDisplay.style.backgroundColor = corAtual;

    pickerDisplay.addEventListener('click', () => {
        paleta.classList.toggle('hidden');
    });

    // Limpar paleta existente
    paleta.innerHTML = '';

    coresDisponiveis.forEach(cor => {
        const swatch = document.createElement('div');
        swatch.className = 'cor-swatch';
        swatch.style.backgroundColor = cor;
        
        // Marcar como ativo se for a cor atual
        if (cor === corAtual) {
            swatch.classList.add('active');
        }
        
        swatch.addEventListener('click', () => {
            document.documentElement.style.setProperty('--dominant-color', cor);
            pickerDisplay.style.backgroundColor = cor;
            
            document.querySelectorAll('.cor-swatch').forEach(s => s.classList.remove('active'));
            swatch.classList.add('active');
            salvarDados();
            paleta.classList.add('hidden');
        });
        paleta.appendChild(swatch);
    });

    // Fechar paleta ao clicar fora
    document.addEventListener('click', (e) => {
        if (!paleta.contains(e.target) && !pickerDisplay.contains(e.target)) {
            paleta.classList.add('hidden');
        }
    });
}

// ===== PERÍCIAS NOVAS ===== //
// Perícias em ordem alfabética

const pericias = {
    fisicas: [
        { nome: "Acrobacia", atributo: "DES", valor: 10 },
        { nome: "Arremessar", atributo: "FOR", valor: 25 },
        { nome: "Atletismo", atributo: "FOR", valor: 15 },
        { nome: "Conduzir", atributo: "DES", valor: 20 },
        { nome: "Escalar", atributo: "FOR", valor: 20 },
        { nome: "Esquivar", atributo: "DES", valor: 10 },
        { nome: "Furtividade", atributo: "DES", valor: 20 },
        { nome: "Mergulho", atributo: "FOR", valor: 1 },
        { nome: "Natação", atributo: "FOR", valor: 20 },
        { nome: "Pulo", atributo: "FOR", valor: 25 },
        { nome: "Resistência Física", atributo: "CON", valor: 15 },
    ],
    combate: [
        { nome: "Armas Brancas", atributo: "DES", valor: 20 },
        { nome: "Armas Improvisadas", atributo: "FOR", valor: 10 },
        { nome: "Briga", atributo: "FOR", valor: 25 },
        { nome: "Combate Tático", atributo: "INT", valor: 5 },
        { nome: "Tiro", atributo: "DES", valor: 25 },
        { nome: "Tiro com Arco", atributo: "DES", valor: 15 },
    ],
    social: [
        { nome: "Carisma Online", atributo: "CAR", valor: 10 },
        { nome: "Crédito", atributo: "CAR", valor: 15 },
        { nome: "Disfarce", atributo: "CAR", valor: 5 },
        { nome: "Intimidação", atributo: "CAR", valor: 15 },
        { nome: "Lábia", atributo: "CAR", valor: 5 },
        { nome: "Leitura Social", atributo: "INT", valor: 10 },
        { nome: "Ler Lábios", atributo: "EDU", valor: 1 },
        { nome: "Língua Estrangeira", atributo: "EDU", valor: 1 },
        { nome: "Língua Própria", atributo: "EDU", valor: 25 },
        { nome: "Negociação", atributo: "CAR", valor: 10 },
        { nome: "Persuasão", atributo: "CAR", valor: 10 },
        { nome: "Psicologia", atributo: "EDU", valor: 10 },
    ],
    conhecimento: [
        { nome: "Antropologia", atributo: "EDU", valor: 1 },
        { nome: "Arqueologia", atributo: "EDU", valor: 1 },
        { nome: "Ciências", atributo: "EDU", valor: 1 },
        { nome: "Criptografia", atributo: "INT", valor: 5 },
        { nome: "Cultura Pop", atributo: "EDU", valor: 5 },
        { nome: "História", atributo: "EDU", valor: 5 },
        { nome: "Navegação", atributo: "EDU", valor: 10 },
        { nome: "Ocultismo", atributo: "INT", valor: 5 },
        { nome: "Rastrear", atributo: "INT", valor: 10 },
        { nome: "Sobrevivência", atributo: "EDU", valor: 10 },
        { nome: "Teoria da Conspiração", atributo: "INT", valor: 1 },
        { nome: "Usar Bibliotecas", atributo: "EDU", valor: 20 },
        { nome: "Zoologia", atributo: "EDU", valor: 4 },
    ],
    tecnico: [
        { nome: "Chaveiro", atributo: "DES", valor: 1 },
        { nome: "Computador", atributo: "EDU", valor: 5 },
        { nome: "Demolições", atributo: "EDU", valor: 1 },
        { nome: "Direito", atributo: "EDU", valor: 5 },
        { nome: "Drones e Robótica", atributo: "EDU", valor: 5 },
        { nome: "Elétrica", atributo: "EDU", valor: 10 },
        { nome: "Hackear", atributo: "INT", valor: 1 },
        { nome: "Improvisar Gadgets", atributo: "INT", valor: 5 },
        { nome: "Mecânica", atributo: "EDU", valor: 10 },
        { nome: "Medicina", atributo: "EDU", valor: 1 },
        { nome: "Operar Maquinário Pesado", atributo: "DES", valor: 1 },
        { nome: "Pilotar", atributo: "DES", valor: 1 },
        { nome: "Primeiros Socorros", atributo: "EDU", valor: 30 },
        { nome: "Segurança Digital", atributo: "INT", valor: 5 },
    ],
    percepcao: [
        { nome: "Encontrar", atributo: "INT", valor: 25 },
        { nome: "Escutar", atributo: "INT", valor: 20 },
        { nome: "Intuição", atributo: "INT", valor: 5 },
        { nome: "Observar Detalhes", atributo: "INT", valor: 20 },
        { nome: "Sentir Perigo", atributo: "INT", valor: 10 },
    ],
    "furtividade-avancada": [
        { nome: "Arrombamento Digital", atributo: "INT", valor: 5 },
        { nome: "Espionagem", atributo: "INT", valor: 5 },
        { nome: "Falsificação", atributo: "DES", valor: 5 },
        { nome: "Roubo", atributo: "DES", valor: 10 },
    ]
};

// ===== FUNÇÃO PARA CRIAR A VISUALIZAÇÃO DE TODAS AS PERÍCIAS ===== //
function criarVisualizacaoTodasPericias() {
    const container = document.getElementById('pericias-container');
    
    // Remove qualquer conteúdo existente
    container.innerHTML = '';
    
    // Cria um contêiner único para todas as perícias
    const todasDiv = document.createElement('div');
    todasDiv.id = 'pericias-todas';
    todasDiv.className = 'pericias-categoria-item active';
    
    const listaDiv = document.createElement('div');
    listaDiv.className = 'lista-pericias-categoria';
    
    // Coleta TODAS as perícias de todas as categorias
    const todasPericias = [];
    for (const categoria in pericias) {
        pericias[categoria].forEach(pericia => {
            todasPericias.push(pericia);
        });
    }
    
    // Cria os elementos para cada perícia
    todasPericias.forEach(pericia => {
        const valor = periciasSalvas[pericia.nome] !== undefined
            ? periciasSalvas[pericia.nome]
            : pericia.valor;
        
        const div = criarElementoPericia(pericia, valor);
        listaDiv.appendChild(div);
    });
    
    todasDiv.appendChild(listaDiv);
    container.appendChild(todasDiv);
    
    // Reaplica os event listeners e cores
    reaplicarEventListenersPericias();
    aplicarCoresPericias();
}

// ===== FUNÇÃO PARA REAPLICAR EVENT LISTENERS ===== //
function reaplicarEventListenersPericias() {
    document.querySelectorAll('.pericia-input').forEach(input => {
        input.addEventListener('input', function () {
            salvarDados();
            aplicarCoresPericias();
        });
    });

    document.querySelectorAll('.pericia-link').forEach(link => {
        link.addEventListener('click', function () {
            const nome = this.getAttribute('data-nome-pericia');
            const valor = parseInt(document.querySelector(`.pericia-input[data-nome="${nome}"]`).value);
            rolarPericia(nome, valor);
        });
    });
}

function coletarValoresPericias() {
    return Array.from(document.querySelectorAll('.pericia-input'))
        .map(input => parseInt(input.value) || 0);
}

function calcularLimitesCores(valores) {
    const ordenados = [...valores].sort((a, b) => a - b);
    const min = ordenados[0];
    const max = ordenados[ordenados.length - 1];
    const intervalo = max - min;

    return {
        limiteBaixo: min + Math.floor(intervalo / 3),
        limiteMedio: min + Math.floor(2 * intervalo / 3)
    };
}

function aplicarClassesCores(limites) {
    document.querySelectorAll('.pericia-input').forEach(input => {
        const valor = parseInt(input.value) || 0;

        input.classList.remove(
            'pericia-valor-baixo',
            'pericia-valor-medio',
            'pericia-valor-alto',
            'colorizado'
        );

        if (valor <= limites.limiteBaixo) {
            input.classList.add('pericia-valor-baixo');
        } else if (valor <= limites.limiteMedio) {
            input.classList.add('pericia-valor-medio');
        } else {
            input.classList.add('pericia-valor-alto');
        }

        input.classList.add('colorizado');
    });
}

function aplicarCoresPericias() {
    const valores = coletarValoresPericias();
    const limites = calcularLimitesCores(valores);
    aplicarClassesCores(limites);
}

function ordenarItensPorTipo(itens, tipo) {
    switch (tipo) {
        case 'alfabetica':
            return itens.sort((a, b) => {
                const nomeA = a.querySelector('.pericia-item-nome').textContent.toLowerCase();
                const nomeB = b.querySelector('.pericia-item-nome').textContent.toLowerCase();
                return nomeA.localeCompare(nomeB);
            });
        case 'valor':
            return itens.sort((a, b) => {
                const valorA = parseInt(a.querySelector('.pericia-input').value) || 0;
                const valorB = parseInt(b.querySelector('.pericia-input').value) || 0;
                return valorB - valorA;
            });
        case 'atributo':
            return itens.sort((a, b) => {
                const attrA = a.querySelector('.pericia-item-nome small').textContent;
                const attrB = b.querySelector('.pericia-item-nome small').textContent;
                return attrA.localeCompare(attrB);
            });
        default:
            return itens;
    }
}

function ordenarPericias(tipoOrdenacao) {
    const container = document.getElementById('pericias-container');
    const categorias = container.querySelectorAll('.pericias-categoria-item');

    categorias.forEach(categoria => {
        const lista = categoria.querySelector('.lista-pericias-categoria');
        const itens = Array.from(lista.querySelectorAll('.pericia-item'));
        const ordenados = ordenarItensPorTipo(itens, tipoOrdenacao);

        lista.innerHTML = '';
        ordenados.forEach(item => lista.appendChild(item));
    });

    ordenacaoAtual = tipoOrdenacao; // ← ATUALIZA A VARIÁVEL GLOBAL
    aplicarCoresPericias();
    salvarDados(); // ← SALVA IMEDIATAMENTE
}

function inicializarOrganizadorPericias() {
    const selectOrdenacao = document.getElementById('ordenar-pericias');

    // Define o valor salvo no select
    if (selectOrdenacao) {
        selectOrdenacao.value = ordenacaoAtual;
    }

    selectOrdenacao.addEventListener('change', function () {
        ordenarPericias(this.value);
        salvarDados(); // Salva imediatamente ao mudar
    });

    aplicarCoresPericias();
}

function criarElementoPericia(pericia, valorSalvo) {
    const div = document.createElement('div');
    div.className = 'pericia-item';
    div.setAttribute('data-nome', pericia.nome.toLowerCase());
    div.innerHTML = `
        <span class="pericia-item-nome pericia-link" data-nome-pericia="${pericia.nome}">
            ${pericia.nome} <small>(${pericia.atributo})</small>
        </span>
        <input type="number" class="pericia-input" data-nome="${pericia.nome}" 
               value="${valorSalvo}" min="0">
    `;
    return div;
}

function montarCategoriaPericias(categoria, lista) {
    const categoriaDiv = document.createElement('div');
    categoriaDiv.id = `pericias-${categoria}`;
    categoriaDiv.className = 'pericias-categoria-item';

    const listaDiv = document.createElement('div');
    listaDiv.className = 'lista-pericias-categoria';

    lista.forEach(pericia => {
        const valor = periciasSalvas[pericia.nome] !== undefined
            ? periciasSalvas[pericia.nome]
            : pericia.valor;
        listaDiv.appendChild(criarElementoPericia(pericia, valor));
    });

    categoriaDiv.appendChild(listaDiv);
    return categoriaDiv;
}

// Objeto para armazenar os valores salvos das perícias
let periciasSalvas = {};

// Mapeamento de chaves para nomes de fotos
const fotoTipos = {
    normal: "Normal",
    metadeVida: "Metade Vida (≤50%)",
    metadeSanidade: "Metade Sanidade (≤50%)",
    metadeVidaEmetadeSanidade: "Metade Vida & Sanidade (≤50%)", // Linha adicionada
    lesaoGrave: "Lesão Grave",
    inconsciente: "Inconsciente",
    insano: "Insano",
    choque: "Em Choque",
    "lesao-grave-em-choque": "Lesão Grave + Em Choque",
    "lesao-grave-insano": "Lesão Grave + Insano",
    "insano-em-choque": "Insano + Em Choque",
};

// ===== SISTEMA DE ABAS E SUB-ABAS ===== //
function salvarAbaAtiva(abaId) {
    localStorage.setItem('abaAtiva', abaId);
}

function carregarAbaAtiva() {
    return localStorage.getItem('abaAtiva') || 'tab-principal';
}

function inicializarAbas() {
    // Carrega a aba salva ou usa a principal como padrão
    const abaSalva = carregarAbaAtiva();
    
    document.querySelectorAll('.tabs button').forEach(button => {
        button.addEventListener('click', function() {
            document.querySelectorAll('.tabs button').forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

            this.classList.add('active');
            const tabId = this.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
            
            // Salva a aba selecionada
            salvarAbaAtiva(tabId);
            salvarDados();
        });
    });

    document.querySelectorAll('.sub-tabs button').forEach(button => {
        button.addEventListener('click', function() {
            document.querySelectorAll('.sub-tabs button').forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            const subTabId = this.getAttribute('data-sub-tab');
            mostrarPericias(subTabId);
            salvarDados();
        });
    });

    // Aplica a aba salva após inicializar os event listeners
    aplicarAbaSalva(abaSalva);
}

function aplicarAbaSalva(abaId) {
    // Remove active de todas as abas
    document.querySelectorAll('.tabs button').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

    // Encontra o botão correspondente à aba salva
    const botaoAbaSalva = document.querySelector(`.tabs button[data-tab="${abaId}"]`);
    const conteudoAbaSalva = document.getElementById(abaId);

    // Se encontrou a aba salva, ativa ela, senão usa a principal
    if (botaoAbaSalva && conteudoAbaSalva) {
        botaoAbaSalva.classList.add('active');
        conteudoAbaSalva.classList.add('active');
    } else {
        // Fallback para a aba principal
        document.querySelector('.tabs button[data-tab="tab-principal"]').classList.add('active');
        document.getElementById('tab-principal').classList.add('active');
        salvarAbaAtiva('tab-principal');
    }
}

// Função rolarAtributo modificada
function rolarAtributo(nome, valor) {
    const resultadoDado = Math.floor(Math.random() * 100) + 1;
    let resultadoTexto = "";
    let classeResultado = "";
    
    const umTerco = Math.floor(valor / 3);
    const doisTercos = Math.floor(valor * 2 / 3);
    const desastreValor = 100;

    if (resultadoDado <= umTerco) {
        resultadoTexto = "EXTREMO";
        classeResultado = "historico-extremo";
    } else if (resultadoDado <= doisTercos) {
        resultadoTexto = "ÓTIMO";
        classeResultado = "historico-otimo";
    } else if (resultadoDado <= valor) {
        resultadoTexto = "NORMAL";
        classeResultado = "historico-normal";
    } else if (resultadoDado >= desastreValor) {
        resultadoTexto = "DESASTRE";
        classeResultado = "historico-desastre";
    } else if (resultadoDado > valor) {
        resultadoTexto = "FALHA";
        classeResultado = "historico-falha";
    }
    
    // Adiciona ao histórico
    adicionarAoHistorico(
        `Atributo: ${nome}`,
        resultadoTexto,
        `1d100 = ${resultadoDado} (Meta: ${valor})`,
        classeResultado
    );
    
    // Resto do código existente (overlay)
    const overlay = document.createElement('div');
    overlay.className = 'rolagem-overlay';
    
    const modal = document.createElement('div');
    modal.className = 'rolagem-modal';
    
    modal.innerHTML = `
        <span class="rolagem-titulo">${nome}</span>
        <span class="rolagem-resultado ${classeResultado.replace('historico-', '')}">${resultadoTexto}</span>
        <span class="rolagem-dados">1d100 = ${resultadoDado} (Meta: ${valor})</span>
    `;

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    overlay.addEventListener('click', () => {
        document.body.removeChild(overlay);
    });
}

// ===== INICIALIZAÇÃO DE PERÍCIAS ===== //
function inicializarPericias() {
    const container = document.getElementById('pericias-container');
    container.innerHTML = '';

    // Cria TODAS as categorias, incluindo as individuais
    for (const categoria in pericias) {
        const categoriaDiv = montarCategoriaPericias(categoria, pericias[categoria]);
        container.appendChild(categoriaDiv);
    }

    // Aplica os event listeners iniciais
    reaplicarEventListenersPericias();

    // Configurar o seletor de ordenação com o valor salvo
    const selectOrdenacao = document.getElementById('ordenar-pericias');
    if (selectOrdenacao) {
        selectOrdenacao.value = ordenacaoAtual;
    }

    // Aplicar ordenação APÓS criar todos os elementos
    setTimeout(() => {
        inicializarOrganizadorPericias();
        ordenarPericias(ordenacaoAtual); // Usa a ordenação salva
        
        // Mostra a categoria ativa
        const subTab = document.querySelector('.sub-tabs button.active')?.getAttribute('data-sub-tab') || 'todas';
        mostrarPericias(subTab);
    }, 100);

    document.getElementById('pericia-search').addEventListener('input', filtrarPericias);
}

function mostrarPericias(categoria) {
    const container = document.getElementById('pericias-container');
    
    // Esconde todas as categorias primeiro
    document.querySelectorAll('.pericias-categoria-item').forEach(el => {
        el.classList.remove('active');
    });
    
    if (categoria === 'todas') {
        // Se for "Todas", cria a visualização unificada
        criarVisualizacaoTodasPericias();
        
        // Garante que a div "todas" fique ativa
        const todasDiv = document.getElementById('pericias-todas');
        if (todasDiv) {
            todasDiv.classList.add('active');
        }
    } else {
        // Se for uma categoria específica, mostra normalmente
        const categoriaElement = document.getElementById(`pericias-${categoria}`);
        if (categoriaElement) {
            categoriaElement.classList.add('active');
        } else {
            // Se a categoria não existe, cria ela
            if (pericias[categoria]) {
                const novaCategoriaDiv = montarCategoriaPericias(categoria, pericias[categoria]);
                container.appendChild(novaCategoriaDiv);
                novaCategoriaDiv.classList.add('active');
                
                // Reaplica os event listeners
                reaplicarEventListenersPericias();
            }
        }
    }
    
    // Reaplica a ordenação atual
    ordenarPericias(ordenacaoAtual);
    salvarDados();
}

// ===== LÓGICA DE FILTRAGEM DE PERÍCIAS ===== //
function filtrarPericias(event) {
    const termoPesquisa = event.target.value.toLowerCase().trim();
    
    if (termoPesquisa.length > 0) {
        // Se há termo de pesquisa, força mostrar a aba "Todas"
        document.querySelectorAll('.sub-tabs button').forEach(btn => btn.classList.remove('active'));
        const btnTodas = document.querySelector('[data-sub-tab="todas"]');
        if (btnTodas) {
            btnTodas.classList.add('active');
        }
        criarVisualizacaoTodasPericias();
    }
    
    const todasPericias = document.querySelectorAll('.pericia-item');
    
    todasPericias.forEach(item => {
        const nomePericia = item.getAttribute('data-nome');
        
        if (termoPesquisa.length > 0) {
            item.classList.toggle('hidden', !nomePericia.includes(termoPesquisa));
        } else {
            item.classList.remove('hidden');
            // Quando não há pesquisa, mostra a categoria ativa normalmente
            const categoriaAtiva = document.querySelector('.sub-tabs button.active')?.getAttribute('data-sub-tab');
            mostrarPericias(categoriaAtiva || 'todas');
        }
    });
}

// ===== LÓGICA DE ROLAGEM DE PERÍCIA E OVERLAY ===== //
function rolarPericia(nome, valor) {
    const resultadoDado = Math.floor(Math.random() * 100) + 1;
    let resultadoTexto = "";
    let classeResultado = "";
    
    const umTerco = Math.floor(valor / 3);
    const doisTercos = Math.floor(valor * 2 / 3);
    const desastreValor = 100; 
    
    if (resultadoDado <= umTerco) {
        resultadoTexto = "EXTREMO";
        classeResultado = "historico-extremo";
    } else if (resultadoDado <= doisTercos) {
        resultadoTexto = "ÓTIMO";
        classeResultado = "historico-otimo";
    } else if (resultadoDado <= valor) {
        resultadoTexto = "NORMAL";
        classeResultado = "historico-normal";
    } else if (resultadoDado >= desastreValor) {
        resultadoTexto = "DESASTRE";
        classeResultado = "historico-desastre";
    } else if (resultadoDado > valor) {
        resultadoTexto = "FALHA";
        classeResultado = "historico-falha";
    }
    
    // Adiciona ao histórico
    adicionarAoHistorico(
        `Perícia: ${nome}`,
        resultadoTexto,
        `1d100 = ${resultadoDado} (Meta: ${valor})`,
        classeResultado
    );
    
    // Resto do código existente (overlay)
    const overlay = document.createElement('div');
    overlay.className = 'rolagem-overlay';
    
    const modal = document.createElement('div');
    modal.className = 'rolagem-modal';
    
    modal.innerHTML = `
        <span class="rolagem-titulo">${nome}</span>
        <span class="rolagem-resultado ${classeResultado.replace('historico-', '')}">${resultadoTexto}</span>
        <span class="rolagem-dados">1d100 = ${resultadoDado} (Meta: ${valor})</span>
    `;

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    overlay.addEventListener('click', () => {
        document.body.removeChild(overlay);
    });
}

// ===== FUNÇÃO PARA ROLAR SANIDADE ===== //
function rolarSanidade() {
    const valorSanidadeAtual = sanidadeAtual;
    const resultadoDado = Math.floor(Math.random() * 100) + 1;
    let resultadoTexto = "";
    let classeResultado = "";

    if (resultadoDado <= valorSanidadeAtual) {
        resultadoTexto = "SUCESSO";
        classeResultado = "historico-sucesso";
    } else {
        resultadoTexto = "FALHA";
        classeResultado = "historico-falha";
    }
    
    // Adiciona ao histórico
    adicionarAoHistorico(
        'Sanidade',
        resultadoTexto,
        `1d100 = ${resultadoDado} (Meta: ${valorSanidadeAtual})`,
        classeResultado
    );
    
    // Resto do código existente (overlay)
    const overlay = document.createElement('div');
    overlay.className = 'rolagem-overlay';
    
    const modal = document.createElement('div');
    modal.className = 'rolagem-modal';
    
    modal.innerHTML = `
        <span class="rolagem-titulo">Sanidade</span>
        <span class="rolagem-resultado ${classeResultado.replace('historico-', '')}">${resultadoTexto}</span>
        <span class="rolagem-dados">1d100 = ${resultadoDado} (Meta: ${valorSanidadeAtual})</span>
    `;

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    overlay.addEventListener('click', () => {
        document.body.removeChild(overlay);
    });
}

// ===== ESTILIZAÇÃO DO NOVO OVERLAY (CSS) ===== //
/*

*/
// ===== FUNÇÃO SIMPLIFICADA PARA ATUALIZAR ESCURECIMENTO ===== //
function atualizarEscurecimentoBarra(tipo) {
    const preenchimento = tipo === 'vida' ? 
        document.getElementById('barra-vida-preenchimento') : 
        document.getElementById('barra-sanidade-preenchimento');
    
    const max = tipo === 'vida' ? vidaMaxima : sanidadeMaxima;
    const atual = tipo === 'vida' ? vidaAtual : sanidadeAtual;
    
    // Calcula o brilho baseado na porcentagem (0% = preto, 100% = cor normal)
    const porcentagem = max > 0 ? (atual / max) * 100 : 0;
    const brilho = Math.max(20, Math.min(100, porcentagem)); // Mínimo de 20% para não ficar totalmente preto
    
    // Usa filter para escurecer a cor (mais performático)
    preenchimento.style.filter = `brightness(${brilho}%)`;
    
    // Define a cor base da barra
    if (tipo === 'vida') {
        preenchimento.style.backgroundColor = '#ff5555'; // Vermelho para vida
    } else {
        preenchimento.style.backgroundColor = '#8a4dff'; // Roxo para sanidade
    }
}

function atualizarBarra(tipo) {
    const maxInput = document.getElementById(`${tipo}-Max`);
    
    const barraPreenchimento = document.getElementById(`barra-${tipo}-preenchimento`);
    const barraNegativa = document.getElementById(`barra-${tipo}-negativa`);
    const barraTexto = document.getElementById(`texto-${tipo}`);
    
    if (!maxInput || !barraPreenchimento || !barraNegativa || !barraTexto) return;

    let valorAtual = (tipo === 'vida') ? vidaAtual : sanidadeAtual;
    let valorMax = parseInt(maxInput.value) || 0;
    
    const maxNegativo = (tipo === 'vida') ? MAX_NEGATIVO_VIDA : MAX_NEGATIVO_SANIDADE;
    
    if (valorAtual >= 0) {
        const percentualPositivo = (valorMax > 0) ? (valorAtual / valorMax) * 100 : 0;
        
        barraPreenchimento.style.width = `${Math.min(100, percentualPositivo)}%`;
        barraNegativa.style.width = '0%';
        
    } else {
        barraPreenchimento.style.width = '0%';
        
        const valorAbsoluto = Math.abs(valorAtual);
        const maxAbsoluto = Math.abs(maxNegativo);
        
        const percentualNegativo = (maxAbsoluto > 0) ? (valorAbsoluto / maxAbsoluto) * 100 : 0;
        
        barraNegativa.style.width = `${Math.min(100, percentualNegativo)}%`;
    }

    barraTexto.textContent = `${valorAtual} / ${valorMax}`;
    
    atualizarEscurecimentoBarra(tipo);
}

function mudarStatus(tipo, quantidade) {
    const maxNegativo = (tipo === 'vida') ? MAX_NEGATIVO_VIDA : MAX_NEGATIVO_SANIDADE;
    
    if (tipo === 'vida') {
        vidaAtual += quantidade;
        
        vidaAtual = Math.min(vidaAtual, vidaMaxima); 
        vidaAtual = Math.max(vidaAtual, maxNegativo); 
        
        atualizarBarra('vida');
        
    } else if (tipo === 'sanidade') {
        sanidadeAtual += quantidade;
        
        sanidadeAtual = Math.min(sanidadeAtual, sanidadeMaxima); 
        sanidadeAtual = Math.max(sanidadeAtual, maxNegativo); 
        
        atualizarBarra('sanidade');
    }
    
    atualizarFotoEstado();
    salvarDados();
}

function abrirModalFotos() {
    const modal = document.getElementById('modal-fotos');
    const campos = document.getElementById('campos-fotos');
    campos.innerHTML = '';
    
    for (const key in fotoTipos) {
        const div = document.createElement('div');
        div.className = 'campo-foto-item';
        
        // Verifica se já existe uma foto salva para este tipo
        const temFotoSalva = fotosSalvas[key];
        
        div.innerHTML = `
            <label>${fotoTipos[key]}:</label>
            <input type="file" id="input-foto-${key}" accept="image/*">
            ${temFotoSalva ? '<span class="foto-carregada">✓ Foto carregada</span>' : ''}
        `;
        campos.appendChild(div);
        
        // Configurar o event listener para cada input de arquivo
        const input = document.getElementById(`input-foto-${key}`);
        
        // Se já tem foto salva, mostra um preview (opcional)
        if (temFotoSalva) {
            console.log(`📸 Foto já carregada para: ${key}`);
        }
        
        input.addEventListener('change', function(event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    // **CORREÇÃO: Garante que o objeto fotosSalvas está sendo atualizado**
                    fotosSalvas[key] = e.target.result;
                    console.log(`✅ Foto salva para: ${key}`, fotosSalvas[key] ? 'COM dados' : 'SEM dados');
                    
                    // Atualiza a interface para mostrar que a foto foi carregada
                    const parentDiv = input.parentElement;
                    let checkmark = parentDiv.querySelector('.foto-carregada');
                    if (!checkmark) {
                        checkmark = document.createElement('span');
                        checkmark.className = 'foto-carregada';
                        parentDiv.appendChild(checkmark);
                    }
                    checkmark.textContent = ' ✓ Foto carregada';
                    
                    // **CORREÇÃO: Salva os dados IMEDIATAMENTE após carregar a foto**
                    salvarDados();
                    
                    // Atualiza a foto do personagem
                    atualizarFotoEstado();
                };
                reader.onerror = function() {
                    console.error(`❌ Erro ao carregar foto para: ${key}`);
                };
                reader.readAsDataURL(file);
            }
        });
    }
    modal.style.display = 'flex';
}

function fecharModalFotos() {
    document.getElementById('modal-fotos').style.display = 'none';
}

function atualizarFotoEstado() {
    const fotoElemento = document.getElementById('foto-personagem');
    const lesaoGrave = document.getElementById('lesao-grave').checked;
    const emChoque = document.getElementById('em-choque').checked;
    const inconsciente = document.getElementById('inconsciente').checked;
    const insano = document.getElementById('insanidade').checked;
    
    let fotoSelecionada = fotosSalvas.normal || 'https://via.placeholder.com/150';

    // Ordem de prioridade para as fotos (do mais específico para o mais geral)
    if (inconsciente && fotosSalvas.inconsciente) {
        fotoSelecionada = fotosSalvas.inconsciente;
    } else if (lesaoGrave && emChoque && fotosSalvas['lesao-grave-em-choque']) {
        fotoSelecionada = fotosSalvas['lesao-grave-em-choque'];
    } else if (lesaoGrave && insano && fotosSalvas['lesao-grave-insano']) {
        fotoSelecionada = fotosSalvas['lesao-grave-insano'];
    } else if (emChoque && insano && fotosSalvas['insano-em-choque']) {
        fotoSelecionada = fotosSalvas['insano-em-choque'];
    } else if (lesaoGrave && fotosSalvas.lesaoGrave) {
        fotoSelecionada = fotosSalvas.lesaoGrave;
    } else if (emChoque && fotosSalvas.choque) {
        fotoSelecionada = fotosSalvas.choque;
    } else if (insano && fotosSalvas.insano) {
        fotoSelecionada = fotosSalvas.insano;
    } else if (vidaAtual <= vidaMaxima / 2 && sanidadeAtual <= sanidadeMaxima / 2 && fotosSalvas.metadeVidaEmetadeSanidade) {
        fotoSelecionada = fotosSalvas.metadeVidaEmetadeSanidade;
    } else if (vidaAtual <= vidaMaxima / 2 && fotosSalvas.metadeVida) {
        fotoSelecionada = fotosSalvas.metadeVida;
    } else if (sanidadeAtual <= sanidadeMaxima / 2 && fotosSalvas.metadeSanidade) {
        fotoSelecionada = fotosSalvas.metadeSanidade;
    }

    console.log("🔄 Atualizando foto para:", fotoSelecionada.substring(0, 50) + "...");
    console.log("📸 Fotos disponíveis:", Object.keys(fotosSalvas));
    fotoElemento.src = fotoSelecionada;
}

function aplicarEfeitosVisuais() {
    const fichaContainer = document.querySelector('.ficha-container');
    const fotoContainer = document.getElementById('foto-container');
    const barraVida = document.getElementById('barra-vida');
    const barraSanidade = document.getElementById('barra-sanidade');

    fichaContainer.classList.remove('lesao-grave', 'em-choque', 'inconsciente');
    fotoContainer.classList.remove('pulsar-vermelho', 'pulsar-azul', 'pulsar-vermelho-azul', 'pulsar-vermelho-roxo', 'pulsar-azul-roxo');
    barraVida.classList.remove('lesao-grave');
    barraSanidade.classList.remove('insano');

    const lesaoGrave = document.getElementById('lesao-grave').checked;
    const emChoque = document.getElementById('em-choque').checked;
    const inconsciente = document.getElementById('inconsciente').checked;
    const insano = document.getElementById('insanidade').checked;

    if (lesaoGrave) {
        fichaContainer.classList.add('lesao-grave');
        barraVida.classList.add('lesao-grave');
    }
    if (emChoque) {
        fichaContainer.classList.add('em-choque');
    }
    if (inconsciente) {
        fichaContainer.classList.add('inconsciente');
    }
    if (insano) {
        barraSanidade.classList.add('insano');
    }

    if (lesaoGrave && emChoque) {
        fotoContainer.classList.add('pulsar-vermelho-azul');
    } else if (lesaoGrave && insano) {
        fotoContainer.classList.add('pulsar-vermelho-roxo');
    } else if (emChoque && insano) {
        fotoContainer.classList.add('pulsar-azul-roxo');
    } else if (lesaoGrave) {
        fotoContainer.classList.add('pulsar-vermelho');
    } else if (emChoque) {
        fotoContainer.classList.add('pulsar-azul');
    } else if (insano) {
        fotoContainer.classList.add('pulsar-roxo');
    }
}
// ===== LÓGICA DE INVENTÁRIO ===== //
// ===== FUNÇÃO ATUALIZADA PARA ADICIONAR ITEM ===== //
function adicionarItem() {
    const nomeInput = document.getElementById('novo-item');
    const tipoInput = document.getElementById('item-tipo');
    const pesoInput = document.getElementById('item-peso');
    const quantidadeInput = document.getElementById('item-quantidade');
    
    const nome = nomeInput.value.trim();
    const tipo = tipoInput.value.trim();
    const peso = parseFloat(pesoInput.value) || 0;
    const quantidade = parseInt(quantidadeInput.value) || 1;

    if (nome) {
        // Verifica se o item já existe
        const itemExistenteIndex = inventario.findIndex(item => 
            item.nome.toLowerCase() === nome.toLowerCase() && 
            item.tipo === tipo
        );
        
        if (itemExistenteIndex !== -1) {
            // Se já existe, aumenta a quantidade
            inventario[itemExistenteIndex].quantidade += quantidade;
        } else {
            // Se não existe, adiciona novo item
            inventario.push({
                nome: nome,
                tipo: tipo,
                peso: peso,
                quantidade: quantidade
            });
        }
        
        atualizarListaInventario();
        
        // Limpa os campos
        nomeInput.value = '';
        tipoInput.value = '';
        pesoInput.value = '';
        quantidadeInput.value = '1';
        
        salvarDados();
    }
}

// ===== FUNÇÃO DO CONTADOR (INCLUI ITENS COM 0) ===== //
function atualizarContadorInventario() {
    const totalItens = inventario.length;
    const quantidadeTotal = inventario.reduce((total, item) => total + (item.quantidade || 0), 0);
    const itensComQuantidade = inventario.filter(item => (item.quantidade || 0) > 0).length;
    
    document.getElementById('total-itens').textContent = totalItens;
    document.getElementById('quantidade-total').textContent = quantidadeTotal;
    
}

// ===== FUNÇÃO CORRIGIDA PARA MUDAR QUANTIDADE ===== //
function mudarQuantidadeItem(index, acao) {
    if (index < 0 || index >= inventario.length) return;
    
    const item = inventario[index];
    
    // Garante que quantidade existe e trata 0 corretamente
    if (item.quantidade === undefined || item.quantidade === null) {
        item.quantidade = 1;
    }
    
    let novaQuantidade = item.quantidade;
    
    switch (acao) {
        case 'increase':
            novaQuantidade += 1;
            break;
        case 'decrease':
            novaQuantidade = Math.max(0, novaQuantidade - 1);
            break;
        case 'set-zero':
            novaQuantidade = 0;
            break;
    }
    
    item.quantidade = novaQuantidade;
    atualizarListaInventario();
    salvarDados();
}

// ===== FUNÇÃO CORRIGIDA PARA REMOVER ITEM ===== //
function removerItem(event) {
    // Só remove se clicou EXATAMENTE no botão de remover
    if (event.target.classList.contains('btn-remover')) {
        const item = event.target.closest('.item-inventario');
        if (item) {
            const index = parseInt(item.getAttribute('data-index'));
            if (index > -1) {
                inventario.splice(index, 1);
                atualizarListaInventario();
                salvarDados();
            }
        }
    }
}

// ===== FUNÇÃO ATUALIZADA PARA MOSTRAR ITENS COM 0 ===== //
function atualizarListaInventario() {
    const lista = document.getElementById('lista-inventario');
    lista.innerHTML = '';
    
    inventario.forEach((item, index) => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'item-inventario';
        
        // Adiciona classe se quantidade for 0
        if (item.quantidade === 0) {
            itemDiv.classList.add('quantidade-zero');
        }
        
        itemDiv.setAttribute('data-index', index);
        
        const quantidade = item.quantidade || 0;
        const quantidadeClass = quantidade === 0 ? 'quantidade-display zero' : 'quantidade-display';
        
        itemDiv.innerHTML = `
            <div class="item-info">
                <span class="item-nome">${item.nome}</span>
                <span class="item-detalhes">Tipo: ${item.tipo || '-'} | Peso: ${item.peso || 0}</span>
                <div class="controles-quantidade">
                    <button class="btn-quantidade" data-action="decrease" data-index="${index}">-</button>
                    <span class="${quantidadeClass}">${quantidade}</span>
                    <button class="btn-quantidade" data-action="increase" data-index="${index}">+</button>
                    <button class="btn-quantidade" id="zeraritens" data-action="set-zero" data-index="${index}" title="Zerar">Zerar</button>
                </div>
            </div>
            <button class="btn-remover">X</button>
        `;
        lista.appendChild(itemDiv);
    });
    
    atualizarContadorInventario();
}

// ===== LÓGICA DE ATAQUES ===== //
function adicionarAtaque() {
    const nomeInput = document.getElementById('ataque-nome');
    const danoInput = document.getElementById('ataque-dano');
    const tipoInput = document.getElementById('ataque-tipo');
    const alcanceInput = document.getElementById('ataque-alcance');

    const nomeAtaque = nomeInput.value.trim();
    if (nomeAtaque) {
        const novoAtaque = {
            nome: nomeAtaque,
            dano: danoInput.value.trim() || '-',
            tipo: tipoInput.value.trim() || '-',
            alcance: alcanceInput.value.trim() || '-'
        };
        
        // ⚠️ CORREÇÃO: Use a variável global diretamente
        ataques.push(novoAtaque);
        atualizarListaAtaques();
        
        // Limpa os campos
        nomeInput.value = '';
        danoInput.value = '';
        tipoInput.value = '';
        alcanceInput.value = '';

        // ⚠️ CORREÇÃO: Salva os dados IMEDIATAMENTE
        salvarDados();
        
        console.log("✅ Ataque adicionado:", novoAtaque);
        console.log("📦 Lista de ataques agora:", ataques);
    }
}

function removerAtaque(event) {
    const item = event.target.closest('.ataque-item');
    if (item && event.target.classList.contains('btn-remover')) {
        const nomeItem = item.querySelector('h4').textContent;
        // Encontra o índice do ataque pelo nome
        const index = ataques.findIndex(ataque => ataque.nome === nomeItem);
        if (index > -1) {
            ataques.splice(index, 1);
            atualizarListaAtaques();
            salvarDados();
        }
    }
}

function atualizarListaAtaques() {
    const lista = document.getElementById('ataques-container');
    lista.innerHTML = ''; // ⚠️ ISSO ESTÁ LIMPANDO A LISTA
    
    // ⚠️ VERIFIQUE SE 'ataques' EXISTE E TEM ITENS
    console.log("🔍 Ataques para carregar:", ataques);
    
    if (ataques && ataques.length > 0) {
        ataques.forEach(ataque => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'ataque-item';
            itemDiv.innerHTML = `
                <h4>${ataque.nome}</h4>
                <p>Dano: <span>${ataque.dano}</span></p>
                <p>Tipo: <span>${ataque.tipo}</span></p>
                <p>Alcance: <span>${ataque.alcance}</span></p>
                <button class="btn-remover">X</button>
            `;
            lista.appendChild(itemDiv);
        });
    } else {
        console.log("❌ Nenhum ataque para exibir");
    }
}

// ===== LÓGICA DOS TRAUMAS E FOBIAS ===== //
function adicionarTraumaFobia() {
    const input = document.getElementById('trauma-fobia-input');
    const nomeTraumaFobia = input.value.trim();
    if (nomeTraumaFobia) {
        traumasFobias.push(nomeTraumaFobia);
        atualizarListaTraumasFobias();
        input.value = '';
        salvarDados();
    }
}

function removerTraumaFobia(event) {
    const item = event.target.closest('.item-trauma-fobia');
    if (item) {
        const nomeItem = item.querySelector('span').textContent;
        const index = traumasFobias.indexOf(nomeItem);
        if (index > -1) {
            traumasFobias.splice(index, 1);
            atualizarListaTraumasFobias();
            salvarDados();
        }
    }
}

function atualizarListaTraumasFobias() {
    const lista = document.getElementById('lista-traumas-fobias');
    lista.innerHTML = '';
    traumasFobias.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'item-trauma-fobia';
        itemDiv.innerHTML = `
            <span>${item}</span>
            <button class="btn-remover">X</button>
        `;
        lista.appendChild(itemDiv);
    });
}

// ===== FUNÇÃO PRINCIPAL DO HISTÓRICO ===== //
function adicionarAoHistorico(tipo, resultado, detalhes, classeResultado = '') {
    const timestamp = new Date().toLocaleString('pt-BR');
    
    const itemHistorico = {
        id: Date.now(),
        tipo: tipo,
        resultado: resultado,
        detalhes: detalhes,
        classeResultado: classeResultado,
        timestamp: timestamp
    };
    
    historicoRolagens.unshift(itemHistorico); // Adiciona no início do array
    
    // Limita o histórico aos 50 itens mais recentes
    if (historicoRolagens.length > 50) {
        historicoRolagens = historicoRolagens.slice(0, 50);
    }
    
    atualizarListaHistorico();
    salvarDados();
}

function atualizarListaHistorico() {
    const lista = document.getElementById('lista-historico');
    lista.innerHTML = '';
    
    if (historicoRolagens.length === 0) {
        lista.innerHTML = '<div class="item-historico" style="text-align: center; color: #666;">Nenhuma rolagem registrada ainda</div>';
        return;
    }
    
    historicoRolagens.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'item-historico';
        itemDiv.innerHTML = `
            <div class="historico-tipo">${item.tipo}</div>
            <div class="historico-detalhes">
                <span class="historico-resultado ${item.classeResultado}">${item.resultado}</span>
                <span class="historico-dados">${item.detalhes}</span>
            </div>
            <div class="historico-timestamp">${item.timestamp}</div>
        `;
        lista.appendChild(itemDiv);
    });
}

function limparHistorico() {
    const modal = document.createElement('div');
    modal.className = 'modal-import-export';
    modal.innerHTML = `
        <div class="modal-import-export-content">
            <h2>⚠️ Limpar Histórico</h2>
            <p>Tem certeza que deseja limpar todo o histórico de rolagens?</p>
            <p>Esta ação não pode ser desfeita.</p>
            <div class="modal-import-export-buttons">
                <button id="btn-limpar-historico-confirm">Sim, Limpar Tudo</button>
                <button id="btn-limpar-historico-cancel">Cancelar</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    document.getElementById('btn-limpar-historico-confirm').addEventListener('click', () => {
        historicoRolagens = [];
        atualizarListaHistorico();
        salvarDados();
        document.body.removeChild(modal);
    });
    
    document.getElementById('btn-limpar-historico-cancel').addEventListener('click', () => {
        document.body.removeChild(modal);
    });
}

// ===== SALVAR E CARREGAR DADOS ===== //
function salvarDados() {
    const dados = {

        //As abas
        abaAtiva: localStorage.getItem('abaAtiva') || 'tab-principal',
        subAbaAtiva: document.querySelector('.sub-tabs button.active')?.getAttribute('data-sub-tab') || 'fisicas',

        // Aba Principal
        nomePersonagem: document.getElementById('nome-personagem')?.value || '',
        nomeJogador: document.getElementById('nome-jogador')?.value || '',
        idade: document.getElementById('idade')?.value || '',
        sexo: document.getElementById('sexo')?.value || '',
        nascimento: document.getElementById('nascimento')?.value || '',
        altura: document.getElementById('altura')?.value || '',
        peso: document.getElementById('peso')?.value || '',
        ocupacao: document.getElementById('ocupacao')?.value || '',
        deslocamentoM: document.getElementById('deslocamento-m')?.value || '',
        defesa: document.getElementById('defesa-input')?.value || '',
        
        historicoRolagens:historicoRolagens,
        
        // VIDA E SANIDADE - CORRIGIDO
        vidaMax: vidaMaxima,  // ← Usa a variável global
        sanidadeMax: sanidadeMaxima, // ← Usa a variável global
        vidaAtual: vidaAtual, // ← Usa a variável global
        sanidadeAtual: sanidadeAtual, // ← Usa a variável global
        
        lesaoGrave: document.getElementById('lesao-grave')?.checked || false,
        emChoque: document.getElementById('em-choque')?.checked || false,
        inconsciente: document.getElementById('inconsciente')?.checked || false,
        insanidade: document.getElementById('insanidade')?.checked || false,

        // Atributos
        forca: document.getElementById('atributo-forca')?.value || '',
        destreza: document.getElementById('atributo-destreza')?.value || '',
        inteligencia: document.getElementById('atributo-inteligencia')?.value || '',
        constituicao: document.getElementById('atributo-constituicao')?.value || '',
        poder: document.getElementById('atributo-poder')?.value || '',
        presenca: document.getElementById('atributo-presenca')?.value || '',
        sorte: document.getElementById('atributo-sorte')?.value || '',
        educacao: document.getElementById('atributo-educacao')?.value || '',
        tamanho: document.getElementById('atributo-tamanho')?.value || '',
        corrupcao: document.getElementById('atributo-corrupcao')?.value || '',
        
        // Perícias
        pericias: {},
        ordenacaoPericias: ordenacaoAtual,
        
        // Ataques
        ataques: ataques || [],

        // Inventário
        inventario: inventario || [],

        // Anotações
        anotacoes: document.getElementById('anotacoes-texto')?.value || '',
        
        // Dados
        dadoTipo: document.getElementById('dado-tipo')?.value || '',
        dadoQuantidade: document.getElementById('dado-quantidade')?.value || '',
        dadoModificador: document.getElementById('dado-modificador')?.value || '',
        
        // Seletor de Cores
        corTema: document.documentElement.style.getPropertyValue('--dominant-color'),
        
        // Fotos
        fotosSalvas: fotosSalvas,
        
        // Nova aba "Coisas Importantes"
        backgroundTexto: document.getElementById('background-texto')?.value || '',
        pessoasImportantesTexto: document.getElementById('pessoas-importantes-texto')?.value || '',
        segredosTexto: document.getElementById('segredos-texto')?.value || '',
        traumasFobias: traumasFobias || [],
        objetivoPrincipalTexto: document.getElementById('objetivo-principal-texto')?.value || '',
        objetivoSecundarioTexto: document.getElementById('objetivo-secundario-texto')?.value || '',
        outrasImportantesTexto: document.getElementById('outras-importantes-texto')?.value || '',
        habilidadesTexto: document.getElementById('habilidades-texto')?.value || '',
    };

    // Salvar valores das perícias
    document.querySelectorAll('.pericia-input').forEach(input => {
        dados.pericias[input.dataset.nome] = input.value;
    });
    
    localStorage.setItem('fichaRPG', JSON.stringify(dados));
    console.log("✅ Dados salvos - Fotos:", Object.keys(fotosSalvas).length);
      console.log("💾 Salvando fotos:", Object.keys(fotosSalvas).length, "fotos");
    if (Object.keys(fotosSalvas).length > 0) {
        console.log("📸 Chaves das fotos salvas:", Object.keys(fotosSalvas));
    }
}

function carregarDados() {
    const dadosSalvos = JSON.parse(localStorage.getItem('fichaRPG'));

    console.log("=== INÍCIO CARREGAMENTO ===");
    console.log("Dados encontrados:", dadosSalvos !== null);

    if (dadosSalvos) {
        console.log("Vida salva:", dadosSalvos.vidaAtual, "/", dadosSalvos.vidaMax);
        console.log("Sanidade salva:", dadosSalvos.sanidadeAtual, "/", dadosSalvos.sanidadeMax);

        // Aba Principal
        document.getElementById('nome-personagem').value = dadosSalvos.nomePersonagem || '';
        document.getElementById('nome-jogador').value = dadosSalvos.nomeJogador || '';
        document.getElementById('idade').value = dadosSalvos.idade || '';
        document.getElementById('sexo').value = dadosSalvos.sexo || '';
        document.getElementById('nascimento').value = dadosSalvos.nascimento || '';
        document.getElementById('altura').value = dadosSalvos.altura || '';
        document.getElementById('peso').value = dadosSalvos.peso || '';
        document.getElementById('ocupacao').value = dadosSalvos.ocupacao || '';
        document.getElementById('deslocamento-m').value = dadosSalvos.deslocamentoM || '';
        document.getElementById('defesa-input').value = dadosSalvos.defesa || '';
        
        // === VIDA E SANIDADE - CORRIGIDO ===
        // Primeiro carrega os valores MÁXIMOS dos campos HTML (se existirem)
        const vidaMaxHTML = parseInt(document.getElementById('vida-Max').value);
        const sanidadeMaxHTML = parseInt(document.getElementById('sanidade-Max').value);
        
        // Usa os valores salvos, se não existir, usa os do HTML, se não existir, usa 10
        vidaMaxima = parseInt(dadosSalvos.vidaMax) || vidaMaxHTML || 10;
        sanidadeMaxima = parseInt(dadosSalvos.sanidadeMax) || sanidadeMaxHTML || 10;
        
        historicoRolagens = dadosSalvos.historicoRolagens || [];
        atualizarListaHistorico();
        
        // Atualiza os campos HTML com os valores corretos
        document.getElementById('vida-Max').value = vidaMaxima;
        document.getElementById('sanidade-Max').value = sanidadeMaxima;
        
        // Carrega os valores ATUAIS (se não existir, usa os máximos)
        vidaAtual = (dadosSalvos.vidaAtual !== null && dadosSalvos.vidaAtual !== undefined) 
            ? parseInt(dadosSalvos.vidaAtual) 
            : vidaMaxima;
            
        sanidadeAtual = (dadosSalvos.sanidadeAtual !== null && dadosSalvos.sanidadeAtual !== undefined) 
            ? parseInt(dadosSalvos.sanidadeAtual) 
            : sanidadeMaxima;

        console.log("Valores carregados - Vida:", vidaAtual, "/", vidaMaxima, "Sanidade:", sanidadeAtual, "/", sanidadeMaxima);

                const subAbaSalva = dadosSalvos.subAbaAtiva || 'fisicas';
        setTimeout(() => {
            document.querySelectorAll('.sub-tabs button').forEach(btn => btn.classList.remove('active'));
            const subBtnAtivo = document.querySelector(`.sub-tabs button[data-sub-tab="${subAbaSalva}"]`);
            if (subBtnAtivo) {
                subBtnAtivo.classList.add('active');
                mostrarPericias(subAbaSalva);
            }
        }, 100);

const lesaoGraveCheckbox = document.getElementById('lesao-grave');
const emChoqueCheckbox = document.getElementById('em-choque');
const inconscienteCheckbox = document.getElementById('inconsciente');
const insanidadeCheckbox = document.getElementById('insanidade');

if (lesaoGraveCheckbox) lesaoGraveCheckbox.checked = dadosSalvos.lesaoGrave || false;
if (emChoqueCheckbox) emChoqueCheckbox.checked = dadosSalvos.emChoque || false;
if (inconscienteCheckbox) inconscienteCheckbox.checked = dadosSalvos.inconsciente || false;
if (insanidadeCheckbox) insanidadeCheckbox.checked = dadosSalvos.insanidade || false;

// E adicione estas linhas APÓS carregar os checkboxes:
setTimeout(() => {
    aplicarEfeitosVisuais();
}, 100);
        
        // Atributos
        document.getElementById('atributo-forca').value = dadosSalvos.forca || '0';
        document.getElementById('atributo-destreza').value = dadosSalvos.destreza || '0';
        document.getElementById('atributo-inteligencia').value = dadosSalvos.inteligencia || '0';
        document.getElementById('atributo-constituicao').value = dadosSalvos.constituicao || '0';
        document.getElementById('atributo-poder').value = dadosSalvos.poder || '0';
        document.getElementById('atributo-presenca').value = dadosSalvos.presenca || '0';
        document.getElementById('atributo-sorte').value = dadosSalvos.sorte || '0';
        document.getElementById('atributo-educacao').value = dadosSalvos.educacao || '0';
        document.getElementById('atributo-tamanho').value = dadosSalvos.tamanho || '0';
        document.getElementById('atributo-corrupcao').value = dadosSalvos.corrupcao || '0';
        

        // Perícias
        periciasSalvas = dadosSalvos.pericias || {};
        ordenacaoAtual = dadosSalvos.ordenacaoPericias || 'alfabetica'
        inicializarPericias();

        // Ataques
        ataques = dadosSalvos.ataques || [];
        atualizarListaAtaques();
        
       // Inventário
        inventario = dadosSalvos.inventario || [];
        inventario = inventario.map(item => {
    if (typeof item === 'string') {
        return {
            nome: item,
            tipo: '',
            peso: 0,
            quantidade: 1
        };
    }
    // Garante que itens antigos tenham quantidade
    if (item.quantidade === undefined) {
        item.quantidade = 1;
    }
    return item;
});
atualizarListaInventario();

        // Anotações
        document.getElementById('anotacoes-texto').value = dadosSalvos.anotacoes || '';

        // Dados
        document.getElementById('dado-tipo').value = dadosSalvos.dadoTipo || '100';
        document.getElementById('dado-quantidade').value = dadosSalvos.dadoQuantidade || '1';
        document.getElementById('dado-modificador').value = dadosSalvos.dadoModificador || '0';

        // Seletor de Cores
        if (dadosSalvos.corTema) {
        document.documentElement.style.setProperty('--dominant-color', dadosSalvos.corTema);
        
        // Atualizar ambos os displays de cor
        const mainDisplay = document.getElementById('cor-picker-display');
        const configDisplay = document.getElementById('config-cor-picker-display');
        
        if (mainDisplay) mainDisplay.style.backgroundColor = dadosSalvos.corTema;
        if (configDisplay) configDisplay.style.backgroundColor = dadosSalvos.corTema;
        
        document.querySelectorAll('.cor-swatch').forEach(swatch => {
            swatch.classList.remove('active');
            if (swatch.style.backgroundColor === dadosSalvos.corTema) {
                swatch.classList.add('active');
            }
        });
    }
        
        //fotos
        fotosSalvas = dadosSalvos.fotosSalvas || {};
        console.log("📸 Fotos carregadas:", Object.keys(fotosSalvas).length, "fotos");
        if (Object.keys(fotosSalvas).length > 0) {
            console.log("📸 Chaves das fotos carregadas:", Object.keys(fotosSalvas));
        }

        // Nova aba "Coisas Importantes"
        document.getElementById('background-texto').value = dadosSalvos.backgroundTexto || '';
        document.getElementById('pessoas-importantes-texto').value = dadosSalvos.pessoasImportantesTexto || '';
        document.getElementById('segredos-texto').value = dadosSalvos.segredosTexto || '';
        traumasFobias = dadosSalvos.traumasFobias || [];
        atualizarListaTraumasFobias();
        document.getElementById('objetivo-principal-texto').value = dadosSalvos.objetivoPrincipalTexto || '';
        document.getElementById('objetivo-secundario-texto').value = dadosSalvos.objetivoSecundarioTexto || '';
        document.getElementById('outras-importantes-texto').value = dadosSalvos.outrasImportantesTexto || '';
        document.getElementById('habilidades-texto').value = dadosSalvos.habilidadesTexto || '';
        
        setTimeout(() => {
            atualizarFotoEstado();
        }, 100);
    } else {
        // SE NÃO HÁ DADOS SALVOS, usa os valores dos campos HTML
        console.log("Nenhum dado salvo encontrado, usando valores padrão");
        vidaMaxima = parseInt(document.getElementById('vida-Max').value) || 10;
        sanidadeMaxima = parseInt(document.getElementById('sanidade-Max').value) || 10;
        vidaAtual = vidaMaxima;
        sanidadeAtual = sanidadeMaxima;
        
        // **CORREÇÃO: Inicializa o objeto de fotos vazio**
        fotosSalvas = {};
    }
    
    // Atualizar barras de vida e sanidade após o carregamento
    atualizarBarra('vida');
    atualizarBarra('sanidade');
    atualizarEscurecimentoBarra('vida');
    atualizarEscurecimentoBarra('sanidade');

    console.log("=== FIM CARREGAMENTO ===");
    console.log("Vida final:", vidaAtual, "/", vidaMaxima);
    console.log("Sanidade final:", sanidadeAtual, "/", sanidadeMaxima);
}

// ===== OUTRAS FUNÇÕES E LISTENERS ===== //
function rolarDado() {
    const tipo = parseInt(document.getElementById('dado-tipo').value);
    const quantidade = parseInt(document.getElementById('dado-quantidade').value);
    const modificador = parseInt(document.getElementById('dado-modificador').value);

    let resultadoTotal = 0;
    let rolagens = [];
    for (let i = 0; i < quantidade; i++) {
        const rolagem = Math.floor(Math.random() * tipo) + 1;
        rolagens.push(rolagem);
        resultadoTotal += rolagem;
    }
    resultadoTotal += modificador;

    const resultadoTexto = `Resultado: ${resultadoTotal}`;
    const detalhesTexto = `${quantidade}d${tipo} = [${rolagens.join(', ')}] ${modificador >= 0 ? '+' : ''}${modificador}`;
    
    // Adiciona ao histórico
    adicionarAoHistorico(
        `Dado: ${quantidade}d${tipo}`,
        resultadoTotal.toString(),
        detalhesTexto,
        'historico-normal'
    );
    
    // Atualiza a interface
    document.getElementById('resultado-dado').textContent = resultadoTexto + ' (' + detalhesTexto + ')';
    salvarDados();
}

function resetTotal() {
    document.getElementById('modal-reset-1').classList.remove('hidden');
}

function resetFinal() {
    historicoRolagens = [];
    localStorage.removeItem('fichaRPG');
    location.reload(); // Recarrega a página para resetar tudo
}

function inicializarSeletorCores() {
    const pickerDisplay = document.getElementById('cor-picker-display');
    const paleta = document.getElementById('cor-picker-paleta');

    pickerDisplay.addEventListener('click', () => {
        paleta.classList.toggle('hidden');
    });

    coresDisponiveis.forEach(cor => {
        const swatch = document.createElement('div');
        swatch.className = 'cor-swatch';
        swatch.style.backgroundColor = cor;
        swatch.addEventListener('click', () => {
            document.documentElement.style.setProperty('--dominant-color', cor);
            pickerDisplay.style.backgroundColor = cor;
            document.querySelectorAll('.cor-swatch').forEach(s => s.classList.remove('active'));
            swatch.classList.add('active');
            salvarDados();
        });
        paleta.appendChild(swatch);
    });
}
// ===== SISTEMA DE EXPORTAÇÃO/IMPORTAÇÃO - COMPATÍVEL COM CELULAR ===== //

// Função para exportar a ficha (compatível com mobile)
function exportarFicha() {
    const dadosSalvos = localStorage.getItem('fichaRPG');
    
    if (!dadosSalvos) {
        mostrarModalMensagem('Não há dados para exportar!', 'aviso');
        return;
    }
    
    try {
        // Tenta usar a API de Download padrão
        const blob = new Blob([dadosSalvos], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        const nomePersonagem = JSON.parse(dadosSalvos).nomePersonagem || 'personagem';
        const nomeArquivo = `ficha_${nomePersonagem.replace(/[^\w]/g, '_')}_${Date.now()}.json`;
        
        a.href = url;
        a.download = nomeArquivo;
        a.style.display = 'none';
        
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        // Limpa a URL após um tempo
        setTimeout(() => URL.revokeObjectURL(url), 1000);
        
        mostrarModalExportacao();
        
    } catch (error) {
        console.log('Método padrão falhou, tentando método alternativo...', error);
        exportarFichaAlternativo(dadosSalvos);
    }
}

// Método alternativo para dispositivos móveis
function exportarFichaAlternativo(dadosSalvos) {
    try {
        const nomePersonagem = JSON.parse(dadosSalvos).nomePersonagem || 'personagem';
        const nomeArquivo = `ficha_${nomePersonagem.replace(/[^\w]/g, '_')}_${Date.now()}.json`;
        
        // Método 2: Usando File System Access API (navegadores modernos)
        if ('showSaveFilePicker' in window) {
            exportarComFilePicker(dadosSalvos, nomeArquivo);
            return;
        }
        
        // Método 3: Fallback - criar link de dados
        exportarComDataURL(dadosSalvos, nomeArquivo);
        
    } catch (error) {
        console.log('Método alternativo falhou, usando fallback final...', error);
        exportarFichaFallback(dadosSalvos);
    }
}

// Método com File System Access API (navegadores modernos)
async function exportarComFilePicker(dadosSalvos, nomeArquivo) {
    try {
        const options = {
            suggestedName: nomeArquivo,
            types: [{
                description: 'Arquivos JSON',
                accept: { 'application/json': ['.json'] }
            }]
        };
        
        const fileHandle = await window.showSaveFilePicker(options);
        const writable = await fileHandle.createWritable();
        await writable.write(dadosSalvos);
        await writable.close();
        
        mostrarModalExportacao();
    } catch (error) {
        if (error.name !== 'AbortError') {
            console.error('Erro File System API:', error);
            exportarComDataURL(dadosSalvos, nomeArquivo);
        }
    }
}

// Método com Data URL (fallback)
function exportarComDataURL(dadosSalvos, nomeArquivo) {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(dadosSalvos);
    const a = document.createElement('a');
    a.href = dataStr;
    a.download = nomeArquivo;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    mostrarModalExportacao();
}

// Fallback final - mostrar dados para copiar manualmente
function exportarFichaFallback(dadosSalvos) {
    try {
        const dadosFormatados = JSON.stringify(JSON.parse(dadosSalvos), null, 2);
        mostrarModalDadosManuais(dadosFormatados);
    } catch (error) {
        mostrarModalMensagem('Erro ao exportar ficha. Tente novamente.', 'erro');
    }
}

// Modal para mostrar dados manuais (fallback)
function mostrarModalDadosManuais(dadosFormatados) {
    const modal = document.createElement('div');
    modal.className = 'modal-import-export';
    modal.innerHTML = `
        <div class="modal-import-export-content" style="max-width: 90vw;">
            <h2>📋 Copiar Dados da Ficha</h2>
            <p>Seu dispositivo não suporta download automático. Copie os dados abaixo:</p>
            <textarea id="dados-manuais" style="
                width: 100%;
                height: 200px;
                background: #1a1a1e;
                color: #ececec;
                border: 1px solid #333;
                border-radius: 6px;
                padding: 10px;
                font-family: 'Courier New', monospace;
                font-size: 12px;
                resize: vertical;
                margin: 10px 0;
            ">${dadosFormatados}</textarea>
            <button id="btn-copiar-dados" style="
                background: var(--dominant-color);
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 6px;
                cursor: pointer;
                margin: 5px;
            ">Copiar para Área de Transferência</button>
            <div class="modal-import-export-buttons">
                <button id="btn-fechar-manual">Fechar</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Focar e selecionar o texto
    const textarea = document.getElementById('dados-manuais');
    textarea.select();
    textarea.focus();
    
    document.getElementById('btn-copiar-dados').addEventListener('click', () => {
        textarea.select();
        try {
            navigator.clipboard.writeText(textarea.value).then(() => {
                const btn = document.getElementById('btn-copiar-dados');
                btn.textContent = '✓ Copiado!';
                btn.style.background = '#00ff00';
                btn.style.color = '#000';
                setTimeout(() => {
                    btn.textContent = 'Copiar para Área de Transferência';
                    btn.style.background = 'var(--dominant-color)';
                    btn.style.color = 'white';
                }, 2000);
            });
        } catch (error) {
            // Fallback para navegadores antigos
            textarea.select();
            document.execCommand('copy');
            const btn = document.getElementById('btn-copiar-dados');
            btn.textContent = '✓ Copiado!';
            setTimeout(() => {
                btn.textContent = 'Copiar para Área de Transferência';
            }, 2000);
        }
    });
    
    document.getElementById('btn-fechar-manual').addEventListener('click', () => {
        document.body.removeChild(modal);
    });
}

// Modal de exportação (atualizado)
function mostrarModalExportacao() {
    const modal = document.createElement('div');
    modal.className = 'modal-import-export';
    modal.innerHTML = `
        <div class="modal-import-export-content">
            <h2>✅ Ficha Exportada</h2>
            <p>Sua ficha foi exportada com sucesso!</p>
            <p>Verifique sua pasta de downloads.</p>
            <div class="modal-import-export-buttons">
                <button id="btn-export-close">Fechar</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    document.getElementById('btn-export-close').addEventListener('click', () => {
        document.body.removeChild(modal);
    });
}

// Modal de mensagem genérico
function mostrarModalMensagem(mensagem, tipo = 'info') {
    const modal = document.createElement('div');
    modal.className = 'modal-import-export';
    modal.innerHTML = `
        <div class="modal-import-export-content">
            <h2>${tipo === 'erro' ? '❌ Erro' : tipo === 'aviso' ? '⚠️ Aviso' : 'ℹ️ Informação'}</h2>
            <p>${mensagem}</p>
            <div class="modal-import-export-buttons">
                <button id="btn-msg-close">Fechar</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    document.getElementById('btn-msg-close').addEventListener('click', () => {
        document.body.removeChild(modal);
    });
}

// Função para importar ficha (mantida igual, mas com melhor tratamento de erro)
function importarFicha() {
    const input = document.getElementById('import-file');
    
    // Reset do input para permitir selecionar o mesmo arquivo novamente
    input.value = '';
    input.click();
}

// Função para processar o arquivo importado (com melhor tratamento de erro)
function processarArquivoImportado(event) {
    const file = event.target.files[0];
    
    if (!file) return;
    
    // Verifica tamanho do arquivo (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
        mostrarModalMensagem('Arquivo muito grande! Máximo 5MB.', 'erro');
        return;
    }
    
    if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
        mostrarModalMensagem('Por favor, selecione um arquivo JSON válido.', 'erro');
        return;
    }
    
    const reader = new FileReader();
    
    reader.onload = function(e) {
        try {
            const dados = JSON.parse(e.target.result);
            
            // Validação mais robusta do arquivo
            if (!validarArquivoFicha(dados)) {
                mostrarModalMensagem('Arquivo inválido! Este não parece ser um arquivo de ficha RPG válido.', 'erro');
                return;
            }
            
            mostrarModalImportacao(dados);
            
        } catch (error) {
            console.error('Erro ao processar arquivo:', error);
            mostrarModalMensagem('Erro ao ler o arquivo. Certifique-se de que é um JSON válido e não está corrompido.', 'erro');
        }
    };
    
    reader.onerror = function() {
        mostrarModalMensagem('Erro ao ler o arquivo. Tente novamente.', 'erro');
    };
    
    reader.readAsText(file);
}

// Função para validar se o arquivo é uma ficha válida
function validarArquivoFicha(dados) {
    // Verifica se tem pelo menos alguns campos esperados
    const camposEsperados = ['nomePersonagem', 'pericias', 'vidaMax', 'sanidadeMax'];
    const camposPresentes = camposEsperados.filter(campo => campo in dados);
    
    // Considera válido se tiver pelo menos 2 campos esperados
    return camposPresentes.length >= 2;
}

// ===== FUNÇÃO PARA APLICAR DADOS IMPORTADOS ===== //
function aplicarDadosImportados(dados) {
    try {
        // Salva os dados no localStorage
        localStorage.setItem('fichaRPG', JSON.stringify(dados));
        
        // Recarrega a página para aplicar todas as mudanças
        location.reload();
        
    } catch (error) {
        mostrarModalMensagem('Erro ao importar os dados: ' + error.message, 'erro');
        console.error('Erro ao aplicar dados importados:', error);
    }
}

// Modal de importação
function mostrarModalImportacao(dados) {
    const nomePersonagem = dados.nomePersonagem || 'Personagem sem nome';
    
    const modal = document.createElement('div');
    modal.className = 'modal-import-export';
    modal.innerHTML = `
        <div class="modal-import-export-content">
            <h2>⚠️ Importar Ficha</h2>
            <p>Você está prestes a importar a ficha de:</p>
            <p><strong>"${nomePersonagem}"</strong></p>
            <p>Isso sobrescreverá TODOS os dados atuais.</p>
            <p>Tem certeza que deseja continuar?</p>
            <div class="modal-import-export-buttons">
                <button id="btn-import-confirm">Sim, Importar</button>
                <button id="btn-import-cancel">Cancelar</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    document.getElementById('btn-import-confirm').addEventListener('click', () => {
        aplicarDadosImportados(dados);
        document.body.removeChild(modal);
    });
    
    document.getElementById('btn-import-cancel').addEventListener('click', () => {
        document.body.removeChild(modal);
    });
}

// ===== CONFIGURAÇÃO DOS EVENT LISTENERS CORRIGIDA ===== //
function configurarEventListenersInventario() {
    const listaInventario = document.getElementById('lista-inventario');
    
    // APENAS UM listener que trata todos os tipos de clique
    listaInventario.addEventListener('click', function(event) {
        const target = event.target;
        
        // Se clicou em botão de quantidade
        if (target.classList.contains('btn-quantidade')) {
            const index = parseInt(target.getAttribute('data-index'));
            const acao = target.getAttribute('data-action');
            mudarQuantidadeItem(index, acao);
            return; // Para aqui, não continua
        }
        
        // Se clicou em botão de remover
        if (target.classList.contains('btn-remover')) {
            const item = target.closest('.item-inventario');
            if (item) {
                const index = parseInt(item.getAttribute('data-index'));
                if (index > -1) {
                    inventario.splice(index, 1);
                    atualizarListaInventario();
                    salvarDados();
                }
            }
            return; // Para aqui, não continua
        }
    });
}

function configurarEventListeners() {
    // Adicionar listeners para os inputs de texto e números para salvar automaticamente
    document.querySelectorAll('.info-personagem input, .info-personagem select, .secao-atributos input, .secao-anotacoes textarea, .secao-importantes textarea').forEach(el => {
        el.addEventListener('input', salvarDados);
    });

    // Listeners para os checkboxes de status
    document.querySelectorAll('.secao-status input[type="checkbox"]').forEach(el => {
        el.addEventListener('change', () => {
            aplicarEfeitosVisuais();
            atualizarFotoEstado();
            salvarDados();
        });
    });
    document.getElementById('vida-10').addEventListener('click', () => mudarStatus('vida', -10));
    document.getElementById('vida-1').addEventListener('click', () => mudarStatus('vida', -1));
    document.getElementById('vida+1').addEventListener('click', () => mudarStatus('vida', 1));
    document.getElementById('vida+10').addEventListener('click', () => mudarStatus('vida', 10));

    document.getElementById('sanidade-10').addEventListener('click', () => mudarStatus('sanidade', -10));
    document.getElementById('sanidade-1').addEventListener('click', () => mudarStatus('sanidade', -1));
    document.getElementById('sanidade+1').addEventListener('click', () => mudarStatus('sanidade', 1));
    document.getElementById('sanidade+10').addEventListener('click', () => mudarStatus('sanidade', 10));

    document.getElementById('btn-limpar-historico').addEventListener('click', limparHistorico);
    document.getElementById('btn-adicionar-item').addEventListener('click', adicionarItem);
    document.getElementById('lista-inventario').addEventListener('click', removerItem);
    document.querySelector('.btn-adicionar-ataque').addEventListener('click', adicionarAtaque);
    document.getElementById('ataques-container').addEventListener('click', removerAtaque);

    document.getElementById('foto-container').addEventListener('click', abrirModalFotos);
    document.getElementById('modal-fotos').addEventListener('click', function(event) {
        if (event.target === this) {
            fecharModalFotos();
        }
    });

      document.querySelectorAll('.atributo-nome.pericia-link').forEach(link => {
        link.addEventListener('click', function() {
            const nomeAtributo = this.getAttribute('data-nome-atributo');
            const inputAtributo = this.parentElement.querySelector('.atributo-valor');
            const valorAtributo = parseInt(inputAtributo.value) || 0;
            rolarAtributo(nomeAtributo, valorAtributo);
        });
    });
    
    

    document.getElementById('btn-reset-1-confirm').addEventListener('click', () => {
        document.getElementById('modal-reset-1').classList.add('hidden');
        document.getElementById('modal-reset-2').classList.remove('hidden');
    });
    document.getElementById('btn-reset-1-cancel').addEventListener('click', () => {
        document.getElementById('modal-reset-1').classList.add('hidden');
    });
    document.getElementById('btn-reset-2-confirm').addEventListener('click', resetFinal);
    document.getElementById('btn-reset-2-cancel').addEventListener('click', () => {
        document.getElementById('modal-reset-2').classList.add('hidden');
    });
    
    document.getElementById('btn-rolar').addEventListener('click', rolarDado);

document.getElementById('vida-Max').addEventListener('input', (event) => {
    vidaMaxima = parseInt(event.target.value) || 0;
    if (vidaAtual > vidaMaxima) {
        vidaAtual = vidaMaxima;
    }
    atualizarBarra('vida');
    salvarDados();
});
document.getElementById('sanidade-Max').addEventListener('input', (event) => {
    sanidadeMaxima = parseInt(event.target.value) || 0;
    if (sanidadeAtual > sanidadeMaxima) {
        sanidadeAtual = sanidadeMaxima;
    }
    atualizarBarra('sanidade');
    salvarDados();
});
    document.getElementById('btn-adicionar-trauma-fobia').addEventListener('click', adicionarTraumaFobia);
    document.getElementById('lista-traumas-fobias').addEventListener('click', removerTraumaFobia);
    document.getElementById('deslocamento-m').addEventListener('input', salvarDados);
    document.getElementById('defesa-input').addEventListener('input', salvarDados);
    document.getElementById('rolar-sanidade').addEventListener('click', rolarSanidade);
    inicializarMenuConfig();
    configurarEventListenersInventario();
    document.getElementById('btn-portrait').addEventListener('click', () => {
    window.open('portrait.html', '_blank');
});
}