// ===== VARIÁVEIS GLOBAIS ===== //
let vidaAtual = 0;
let vidaMaxima = 0;
let sanidadeAtual = 0;
let sanidadeMaxima = 0;
let fotosSalvas = {};

// Paleta de cores para o seletor personalizado
const coresDisponiveis = [
    '#44aaff', // Azul
    '#00ff00', // Verde
    '#ffff00', // Amarelo
    '#ff00ff', // Magenta
    '#ff5555', // Vermelho
    '#00ffff', // Ciano
    '#ff9900', // Laranja
    '#8a4dff' // Roxo
];

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
    "lesao-grave-inconsciente": "Lesão Grave + Inconsciente",
    "lesao-grave-insano": "Lesão Grave + Insano",
    "insano-em-choque": "Insano + Em Choque",
    "insano-inconsciente": "Insano + Inconsciente"
};

// ===== INICIALIZAÇÃO ===== //
document.addEventListener('DOMContentLoaded', function() {
    carregarDados();
    inicializarAbas();
    configurarEventListeners();
    inicializarSeletorCores();
    inicializarPericias(); // Garante que as perícias são inicializadas ao carregar
});

// ===== SISTEMA DE ABAS E SUB-ABAS ===== //
function inicializarAbas() {
    document.querySelectorAll('.tabs button').forEach(button => {
        button.addEventListener('click', function() {
            document.querySelectorAll('.tabs button').forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

            this.classList.add('active');
            const tabId = this.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
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
}

// ===== INICIALIZAÇÃO DE PERÍCIAS ===== //
function inicializarPericias() {
    const container = document.getElementById('pericias-container');
    container.innerHTML = '';

    for (const categoria in pericias) {
        const categoriaDiv = document.createElement('div');
        categoriaDiv.id = `pericias-${categoria}`;
        categoriaDiv.className = 'pericias-categoria-item';
        
        const listaCategoria = document.createElement('div');
        listaCategoria.className = 'lista-pericias-categoria';
        
        pericias[categoria].forEach(pericia => {
            const valorSalvo = periciasSalvas[pericia.nome] !== undefined ? periciasSalvas[pericia.nome] : pericia.valor;
            const div = document.createElement('div');
            div.className = 'pericia-item';
            div.setAttribute('data-nome', pericia.nome.toLowerCase());
            div.innerHTML = `
                <span class="pericia-item-nome">${pericia.nome} <small>(${pericia.atributo})</small></span>
                <input type="number" class="pericia-input" data-nome="${pericia.nome}" value="${valorSalvo}" min="0">
            `;
            listaCategoria.appendChild(div);
        });
        
        categoriaDiv.appendChild(listaCategoria); // Adicionado para exibir as perícias corretamente
        container.appendChild(categoriaDiv);
    }
    
    // Adiciona o event listener de input para as perícias
    document.querySelectorAll('.pericia-input').forEach(input => {
        input.addEventListener('input', salvarDados);
    });
    
    // Mostra a sub-aba ativa após o carregamento
    const subTabAtiva = document.querySelector('.sub-tabs button.active')?.getAttribute('data-sub-tab') || 'fisicas';
    mostrarPericias(subTabAtiva);

    document.getElementById('pericia-search').addEventListener('input', filtrarPericias);
}

function mostrarPericias(categoria) {
    document.querySelectorAll('.pericias-categoria-item').forEach(el => el.classList.remove('active'));
    const categoriaElement = document.getElementById(`pericias-${categoria}`);
    if (categoriaElement) {
        categoriaElement.classList.add('active');
    }
}

// ===== LÓGICA DE FILTRAGEM DE PERÍCIAS ===== //
function filtrarPericias(event) {
    const termoPesquisa = event.target.value.toLowerCase().trim();
    const todasPericias = document.querySelectorAll('.pericia-item');

    todasPericias.forEach(item => {
        const nomePericia = item.getAttribute('data-nome');
        
        if (termoPesquisa.length > 0) {
            if (nomePericia.includes(termoPesquisa)) {
                item.classList.remove('hidden');
                
                const categoria = item.closest('.pericias-categoria-item').id.replace('pericias-', '');
                document.querySelectorAll('.sub-tabs button').forEach(btn => btn.classList.remove('active'));
                const btnCategoria = document.querySelector(`[data-sub-tab="${categoria}"]`);
                if (btnCategoria) {
                    btnCategoria.classList.add('active');
                }
                
                mostrarPericias(categoria);
            } else {
                item.classList.add('hidden');
            }
        } else {
            item.classList.remove('hidden');
            const categoriaAtiva = document.querySelector('.sub-tabs button.active')?.getAttribute('data-sub-tab');
            mostrarPericias(categoriaAtiva || 'fisicas');
        }
    });
}

// ===== SISTEMA DE BARRAS ===== //
function atualizarBarra(tipo) {
    const preenchimento = tipo === 'vida' ? document.getElementById('barra-vida-preenchimento') : document.getElementById('barra-sanidade-preenchimento');
    const texto = tipo === 'vida' ? document.getElementById('texto-vida') : document.getElementById('texto-sanidade');
    
    const max = tipo === 'vida' ? vidaMaxima : sanidadeMaxima;
    const atual = tipo === 'vida' ? vidaAtual : sanidadeAtual;

    const porcentagem = max > 0 ? (atual / max) * 100 : 0;
    preenchimento.style.width = `${Math.min(100, Math.max(0, porcentagem))}%`;
    texto.textContent = `${atual} / ${max}`;
    
    if (tipo === 'vida' || tipo === 'sanidade') {
        atualizarFotoEstado();
    }
    aplicarEfeitosVisuais();
    salvarDados();
}

function mudarStatus(tipo, valor) {
    if (tipo === 'vida') {
        vidaAtual = Math.max(0, Math.min(vidaAtual + valor, vidaMaxima));
    } else {
        sanidadeAtual = Math.max(0, Math.min(sanidadeAtual + valor, sanidadeMaxima));
    }
    atualizarBarra(tipo);
}

// ===== SISTEMA DE FOTOS ===== //
function abrirModalFotos() {
    const modal = document.getElementById('modal-fotos');
    const campos = document.getElementById('campos-fotos');
    campos.innerHTML = '';
    
    for (const key in fotoTipos) {
        const div = document.createElement('div');
        div.className = 'campo-foto-item';
        div.innerHTML = `
            <label>${fotoTipos[key]}:</label>
            <input type="file" id="input-foto-${key}" accept="image/*">
        `;
        campos.appendChild(div);

        document.getElementById(`input-foto-${key}`).addEventListener('change', function(event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    fotosSalvas[key] = e.target.result;
                    atualizarFotoEstado();
                    salvarDados();
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

    if (vidaAtual <= vidaMaxima / 2 && sanidadeAtual <= sanidadeMaxima / 2 && fotosSalvas.metadeVidaEmetadeSanidade) { // Linha adicionada
        fotoSelecionada = fotosSalvas.metadeVidaEmetadeSanidade;
    } else if (inconsciente && lesaoGrave && fotosSalvas['lesao-grave-inconsciente']) {
        fotoSelecionada = fotosSalvas['lesao-grave-inconsciente'];
    } else if (inconsciente && insano && fotosSalvas['insano-inconsciente']) {
        fotoSelecionada = fotosSalvas['insano-inconsciente'];
    } else if (inconsciente && fotosSalvas.inconsciente) {
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
    } else if (sanidadeAtual <= sanidadeMaxima / 2 && fotosSalvas.metadeSanidade) {
        fotoSelecionada = fotosSalvas.metadeSanidade;
    } else if (vidaAtual <= vidaMaxima / 2 && fotosSalvas.metadeVida) {
        fotoSelecionada = fotosSalvas.metadeVida;
    }

    fotoElemento.src = fotoSelecionada;
}

// ===== ROLAGEM DE DADOS ===== //
function rolarDado(max) {
    const resultado = Math.floor(Math.random() * max) + 1;
    document.getElementById('resultado-dado').textContent = `1d${max} = ${resultado}`;
}

// ===== INVENTÁRIO E ATAQUES ===== //
function adicionarItem() {
    const div = document.createElement('div');
    div.className = 'inventario-item';
    div.innerHTML = `
        <input type="text" placeholder="Nome do item">
        <input type="number" placeholder="Quantidade" value="" min="1">
        <input type="number" placeholder="Dano" value="" min="1"
        <button class="btn-remover">X</button>
    `;
    const listaInventario = document.getElementById('lista-inventario');
    listaInventario.appendChild(div);

    const inputs = div.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('input', salvarDados);
    });

    div.querySelector('.btn-remover').addEventListener('click', () => {
        div.remove();
        salvarDados();
    });

    salvarDados();
}

function adicionarAtaque() {
    const div = document.createElement('div');
    div.className = 'ataque-item';
    div.innerHTML = `
        <input type="text" placeholder="Nome (ex: Desert Eagle)">
        <input type="text" placeholder="Dano (ex: 1d10+3)">
        <input type="text" placeholder="Tipo (ex: Balístico)">
        <button class="btn-remover-ataque">X</button>
    `;
    const listaAtaques = document.getElementById('lista-ataques');
    listaAtaques.appendChild(div);

    const inputs = div.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('input', salvarDados);
    });

    div.querySelector('.btn-remover-ataque').addEventListener('click', () => {
        div.remove();
        salvarDados();
    });

    salvarDados();
}

// ===== SELETOR DE CORES PERSONALIZADO ===== //
function inicializarSeletorCores() {
    const display = document.getElementById('cor-picker-display');
    const paleta = document.getElementById('cor-picker-paleta');
    
    display.addEventListener('click', () => {
        paleta.classList.toggle('hidden');
    });

    coresDisponiveis.forEach(cor => {
        const swatch = document.createElement('div');
        swatch.className = 'cor-swatch';
        swatch.style.backgroundColor = cor;
        swatch.setAttribute('data-cor', cor);
        
        swatch.addEventListener('click', () => {
            document.documentElement.style.setProperty('--dominant-color', cor);
            display.style.backgroundColor = cor;
            document.querySelectorAll('.cor-swatch').forEach(s => s.classList.remove('active'));
            swatch.classList.add('active');
            salvarDados();
            paleta.classList.add('hidden');
        });
        
        paleta.appendChild(swatch);
    });

    document.addEventListener('click', (event) => {
        if (!document.getElementById('cor-picker').contains(event.target)) {
            paleta.classList.add('hidden');
        }
    });
}

// ===== SISTEMA DE SALVAMENTO AUTOMÁTICO ===== //
function salvarDados() {
    const periciasSalvar = {};
    document.querySelectorAll('.pericia-input').forEach(input => {
        periciasSalvar[input.getAttribute('data-nome')] = parseInt(input.value) || 0;
    });

    const inventarioSalvar = [];
    document.querySelectorAll('#lista-inventario .inventario-item').forEach(item => {
        const nome = item.querySelector('input[type="text"]').value;
        const quantidade = item.querySelector('input[type="number"]').value;
        inventarioSalvar.push({ nome, quantidade: parseInt(quantidade) || 1 });
    });

    const ataquesSalvar = [];
    document.querySelectorAll('#lista-ataques .ataque-item').forEach(ataque => {
        const inputs = ataque.querySelectorAll('input');
        ataquesSalvar.push({ nome: inputs[0].value, dano: inputs[1].value, tipo: inputs[2].value });
    });
    
    const corTema = document.documentElement.style.getPropertyValue('--dominant-color') || coresDisponiveis[0];

    const dados = {
        nomePersonagem: document.getElementById('nome-personagem').value,
        nomeJogador: document.getElementById('nome-jogador').value,
        idade: document.getElementById('idade').value,
        sexo: document.getElementById('sexo').value,
        nascimento: document.getElementById('nascimento').value,
        altura: document.getElementById('altura').value,
        peso: document.getElementById('peso').value,
        ocupacao: document.getElementById('ocupacao').value,
        
        fotos: fotosSalvas,

        forca: document.getElementById('atributo-forca').value,
        destreza: document.getElementById('atributo-destreza').value,
        inteligencia: document.getElementById('atributo-inteligencia').value,
        constituicao: document.getElementById('atributo-constituicao').value,
        poder: document.getElementById('atributo-poder').value,
        presenca: document.getElementById('atributo-presenca').value,
        sorte: document.getElementById('atributo-sorte').value,
        educacao: document.getElementById('atributo-educacao').value,

        vidaMax: parseInt(document.getElementById('vida-max').value) || 0,
        vidaAtual: vidaAtual,
        sanidadeMax: parseInt(document.getElementById('sanidade-max').value) || 0,
        sanidadeAtual: sanidadeAtual,
        insanidade: document.getElementById('insanidade').checked,
        emChoque: document.getElementById('em-choque').checked,
        inconsciente: document.getElementById('inconsciente').checked,
        lesaoGrave: document.getElementById('lesao-grave').checked,

        pericias: periciasSalvar,

        inventario: inventarioSalvar,
        ataques: ataquesSalvar,

        anotacoes: document.getElementById('anotacoes-texto').value,
        
        corTema: corTema,
        
        tabAtiva: document.querySelector('.tabs button.active')?.getAttribute('data-tab') || 'tab-principal',
        subTabAtiva: document.querySelector('.sub-tabs button.active')?.getAttribute('data-sub-tab') || 'fisicas'
    };

    localStorage.setItem('fichaRPG', JSON.stringify(dados));
}

function carregarDados() {
    const dadosSalvos = localStorage.getItem('fichaRPG');
    if (!dadosSalvos) {
        vidaAtual = 10;
        sanidadeAtual = 10;
        
        document.getElementById('vida-max').value = 10;
        document.getElementById('sanidade-max').value = 10;

        vidaMaxima = 10;
        sanidadeMaxima = 10;
        
        inicializarPericias();
        adicionarItem();
        adicionarAtaque();
        adicionarAtaque();
        
        setTimeout(() => {
            atualizarBarra('vida');
            atualizarBarra('sanidade');
            salvarDados();
        }, 100);

        return;
    }

    const dados = JSON.parse(dadosSalvos);

    document.getElementById('nome-personagem').value = dados.nomePersonagem || '';
    document.getElementById('nome-jogador').value = dados.nomeJogador || '';
    document.getElementById('idade').value = dados.idade || '';
    document.getElementById('sexo').value = dados.sexo || '';
    document.getElementById('nascimento').value = dados.nascimento || '';
    document.getElementById('altura').value = dados.altura || '';
    document.getElementById('peso').value = dados.peso || '';
    document.getElementById('ocupacao').value = dados.ocupacao || '';
    document.getElementById('atributo-forca').value = dados.forca || 0;
    document.getElementById('atributo-destreza').value = dados.destreza || 0;
    document.getElementById('atributo-inteligencia').value = dados.inteligencia || 0;
    document.getElementById('atributo-constituicao').value = dados.constituicao || 0;
    document.getElementById('atributo-poder').value = dados.poder || 0;
    document.getElementById('atributo-presenca').value = dados.presenca || 0;
    document.getElementById('atributo-sorte').value = dados.sorte || 0;
    document.getElementById('atributo-educacao').value = dados.educacao || 0;
    
    const corTemaSalva = dados.corTema || coresDisponiveis[0];
    document.documentElement.style.setProperty('--dominant-color', corTemaSalva);
    document.getElementById('cor-picker-display').style.backgroundColor = corTemaSalva;

    fotosSalvas = dados.fotos || {};
    
    document.getElementById('insanidade').checked = dados.insanidade || false;
    document.getElementById('em-choque').checked = dados.emChoque || false;
    document.getElementById('inconsciente').checked = dados.inconsciente || false;
    document.getElementById('lesao-grave').checked = dados.lesaoGrave || false;

    vidaMaxima = parseInt(dados.vidaMax) || 10;
    sanidadeMaxima = parseInt(dados.sanidadeMax) || 10;
    document.getElementById('vida-max').value = vidaMaxima;
    document.getElementById('sanidade-max').value = sanidadeMaxima;
    
    vidaAtual = typeof dados.vidaAtual === 'number' ? dados.vidaAtual : vidaMaxima;
    sanidadeAtual = typeof dados.sanidadeAtual === 'number' ? dados.sanidadeAtual : sanidadeMaxima;

    periciasSalvas = dados.pericias || {};
    inicializarPericias();

    const listaInventario = document.getElementById('lista-inventario');
    listaInventario.innerHTML = '';
    if (dados.inventario && dados.inventario.length > 0) {
        dados.inventario.forEach(item => {
            const div = document.createElement('div');
            div.className = 'inventario-item';
            div.innerHTML = `<input type="text" placeholder="Nome do item" value="${item.nome || ''}"><input type="number" placeholder="Quantidade" value="${item.quantidade || 1}" min="1"><button class="btn-remover">X</button>`;
            listaInventario.appendChild(div);
            div.querySelector('.btn-remover').addEventListener('click', () => { div.remove(); salvarDados(); });
            div.querySelectorAll('input').forEach(el => el.addEventListener('input', salvarDados));
        });
    } else {
        adicionarItem();
    }

    const listaAtaques = document.getElementById('lista-ataques');
    listaAtaques.innerHTML = '';
    if (dados.ataques && dados.ataques.length > 0) {
        dados.ataques.forEach(ataque => {
            const div = document.createElement('div');
            div.className = 'ataque-item';
            div.innerHTML = `<input type="text" placeholder="Nome (ex: Desert Eagle)" value="${ataque.nome || ''}"><input type="text" placeholder="Dano (ex: 1d10+3)" value="${ataque.dano || ''}"><input type="text" placeholder="Tipo (ex: Balístico)" value="${ataque.tipo || ''}"><button class="btn-remover-ataque">X</button>`;
            listaAtaques.appendChild(div);
            div.querySelector('.btn-remover-ataque').addEventListener('click', () => { div.remove(); salvarDados(); });
            div.querySelectorAll('input').forEach(el => el.addEventListener('input', salvarDados));
        });
    } else {
        adicionarAtaque();
        adicionarAtaque();
    }

    document.getElementById('anotacoes-texto').value = dados.anotacoes || '';

    const tabAtiva = dados.tabAtiva || 'tab-principal';
    const subTabAtiva = dados.subTabAtiva || 'fisicas';
    
    const btnTab = document.querySelector(`.tabs button[data-tab="${tabAtiva}"]`);
    if (btnTab) {
        document.querySelector('.tabs button.active')?.classList.remove('active');
        document.querySelector('.tab-content.active')?.classList.remove('active');
        btnTab.classList.add('active');
        document.getElementById(tabAtiva).classList.add('active');
    }

    const btnSubTab = document.querySelector(`.sub-tabs button[data-sub-tab="${subTabAtiva}"]`);
    if (btnSubTab) {
        document.querySelector('.sub-tabs button.active')?.classList.remove('active');
        btnSubTab.classList.add('active');
    }
    
    aplicarEfeitosVisuais();
    atualizarFotoEstado();
    atualizarBarra('vida');
    atualizarBarra('sanidade');
    
    
}

function aplicarEfeitosVisuais() {
    const fichaContainer = document.querySelector('.ficha-container');
    const fotoContainer = document.querySelector('.foto-container');
    const barraVida = document.getElementById('barra-vida');
    const barraSanidade = document.getElementById('barra-sanidade');

    const lesaoGrave = document.getElementById('lesao-grave').checked;
    const emChoque = document.getElementById('em-choque').checked;
    const inconsciente = document.getElementById('inconsciente').checked;
    const insano = document.getElementById('insanidade').checked;

    fichaContainer.classList.remove('lesao-grave', 'em-choque', 'inconsciente');
    fotoContainer.classList.remove('pulsar-vermelho', 'pulsar-azul', 'pulsar-vermelho-azul', 'pulsar-vermelho-roxo', 'pulsar-azul-roxo', 'pulsar-azul-roxo');
    barraVida.classList.remove('lesao-grave');
    barraSanidade.classList.remove('insano');

    if (lesaoGrave) {
        fichaContainer.classList.add('lesao-grave');
        barraVida.classList.add('lesao-grave');
        if (emChoque) {
            fotoContainer.classList.add('pulsar-vermelho-azul');
        } else if (insano) {
            fotoContainer.classList.add('pulsar-vermelho-roxo');
        } else {
            fotoContainer.classList.add('pulsar-vermelho');
        }
    }
    
    if (emChoque && !lesaoGrave) {
        fichaContainer.classList.add('em-choque');
        if (insano) {
            fotoContainer.classList.add('pulsar-azul-roxo');
        } else {
            fotoContainer.classList.add('pulsar-azul');
        }
    }
    
    if (inconsciente) {
        fichaContainer.classList.add('inconsciente');
    }
    
    if (insano) {
        barraSanidade.classList.add('insano');
    }
}

function resetTotal() {
    const modal1 = document.getElementById('modal-reset-1');
    const modal2 = document.getElementById('modal-reset-2');
    const btn1Confirm = document.getElementById('btn-reset-1-confirm');
    const btn1Cancel = document.getElementById('btn-reset-1-cancel');
    const btn2Confirm = document.getElementById('btn-reset-2-confirm');
    const btn2Cancel = document.getElementById('btn-reset-2-cancel');

    // Mostra primeiro modal
    modal1.classList.remove('hidden');

    // Cancelar primeira confirmação
    btn1Cancel.onclick = () => {
        modal1.classList.add('hidden');
    };

    // Confirmar primeira etapa
    btn1Confirm.onclick = () => {
        modal1.classList.add('hidden');
        modal2.classList.remove('hidden');
    };

    // Cancelar segunda confirmação
    btn2Cancel.onclick = () => {
        modal2.classList.add('hidden');
    };

    // Confirmar segunda etapa: reseta tudo
    btn2Confirm.onclick = () => {
        // Apagar localStorage
        localStorage.removeItem('fichaRPG');

        // Resetar variáveis globais
        vidaAtual = 0;
        vidaMaxima = 0;
        sanidadeAtual = 0;
        sanidadeMaxima = 0;
        fotosSalvas = {};
        periciasSalvas = {};

        // Resetar imagem do personagem
        document.getElementById('foto-personagem').src = 'https://via.placeholder.com/150';

        // Limpar todos os inputs
        document.querySelectorAll('input, select, textarea').forEach(el => {
            if (el.type === 'checkbox') el.checked = false;
            else if (el.type === 'file') el.value = '';
            else el.value = '';
        });

        // Limpar listas de inventário e ataques
        document.getElementById('lista-inventario').innerHTML = '';
        document.getElementById('lista-ataques').innerHTML = '';

        // Limpar anotações
        document.getElementById('anotacoes-texto').value = '';

        // Fecha modal e recarrega a página
        modal2.classList.add('hidden');
        location.reload();
    };
}

// ===== CONFIGURAÇÃO DE EVENT LISTENERS ===== //
function configurarEventListeners() {
    document.querySelectorAll('input, select, textarea').forEach(el => {
        el.addEventListener('input', salvarDados);
    });

    document.getElementById('vida-max').addEventListener('input', function() {
        vidaMaxima = parseInt(this.value) || 0;
        if (vidaAtual > vidaMaxima) {
            vidaAtual = vidaMaxima;
        }
        atualizarBarra('vida');
    });

    document.getElementById('sanidade-max').addEventListener('input', function() {
        sanidadeMaxima = parseInt(this.value) || 0;
        if (sanidadeAtual > sanidadeMaxima) {
            sanidadeAtual = sanidadeMaxima;
        }
        atualizarBarra('sanidade');
    });

    document.querySelectorAll('.status-checkboxes input[type="checkbox"]').forEach(el => {
        el.addEventListener('change', () => {
            aplicarEfeitosVisuais();
            atualizarFotoEstado();
            salvarDados();
        });
    });

    // Controles de Vida
    document.getElementById('vida-10').addEventListener('click', () => mudarStatus('vida', -10));
    document.getElementById('vida-1').addEventListener('click', () => mudarStatus('vida', -1));
    document.getElementById('vida+1').addEventListener('click', () => mudarStatus('vida', 1));
    document.getElementById('vida+10').addEventListener('click', () => mudarStatus('vida', 10));

    // Controles de Sanidade
    document.getElementById('sanidade-10').addEventListener('click', () => mudarStatus('sanidade', -10));
    document.getElementById('sanidade-1').addEventListener('click', () => mudarStatus('sanidade', -1));
    document.getElementById('sanidade+1').addEventListener('click', () => mudarStatus('sanidade', 1));
    document.getElementById('sanidade+10').addEventListener('click', () => mudarStatus('sanidade', 10));

    // Outros botões
    document.getElementById('btn-adicionar-item').addEventListener('click', adicionarItem);
    document.querySelector('.btn-adicionar-ataque').addEventListener('click', adicionarAtaque);

    // Fotos
    document.getElementById('foto-container').addEventListener('click', abrirModalFotos);
    document.getElementById('modal-fotos').addEventListener('click', function(event) {
        if (event.target === this) {
            fecharModalFotos();
        }
    });

    // Botão de reset total
    document.getElementById('btn-reset').addEventListener('click', resetTotal);
}