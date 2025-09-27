// ===== VARIÁVEIS GLOBAIS E CÓDIGO EXISTENTE ===== //
let vidaAtual = 0;
let vidaMaxima = 0;
let sanidadeAtual = 0;
let sanidadeMaxima = 0;
let fotosSalvas = {};
let inventario = [];
let ataques = [];
let traumasFobias = [];

let deslocamentoM = '';
let deslocamentoQ = '';
let defesa = '';

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
// CÓDIGO NOVO E CORRIGIDO
document.addEventListener('DOMContentLoaded', function() {
    carregarDados();
    inicializarAbas();
    configurarEventListeners();
    inicializarSeletorCores();
    inicializarPericias();
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
                <span class="pericia-item-nome pericia-link" data-nome-pericia="${pericia.nome}">${pericia.nome} <small>(${pericia.atributo})</small></span>
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

    // Adiciona o event listener para os novos "botões" de perícia
    document.querySelectorAll('.pericia-link').forEach(link => {
        link.addEventListener('click', function() {
            const nomePericia = this.getAttribute('data-nome-pericia');
            const valorPericia = parseInt(document.querySelector(`.pericia-input[data-nome="${nomePericia}"]`).value);
            rolarPericia(nomePericia, valorPericia);
        });
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

// ===== LÓGICA DE ROLAGEM DE PERÍCIA E OVERLAY ===== //
function rolarPericia(nome, valor) {
    const resultadoDado = Math.floor(Math.random() * 100) + 1;
    let resultadoTexto = "";
    let classeResultado = "";
    
    const umTerco = Math.floor(valor / 3);
    const doisTercos = Math.floor(valor * 2 / 3);
    
    // O seu cálculo de desastre estava com erro (valor == 100). 
    // Corrigi para um exemplo comum (rolagem acima de 95, ou 100).
    const desastreValor = 100; 

    // Referência ao contêiner de confete
    const confetti = document.getElementById('confetti-container');

    // Inicialmente, remove a classe caso tenha ficado ativa por algum erro
    confetti.classList.remove('show-confetti');

    if (resultadoDado <= umTerco) {
        resultadoTexto = "EXTREMO";
        classeResultado = "extremo";
        
        // >>> CÓDIGO DO CONFETE AQUI <<<
        confetti.classList.add('show-confetti');
        
        // Remove a classe após 3 segundos para parar a animação
        setTimeout(() => {
            confetti.classList.remove('show-confetti');
        }, 3000); 
        // -----------------------------
        
    } else if (resultadoDado <= doisTercos) {
        resultadoTexto = "ÓTIMO";
        classeResultado = "otimo";
    } else if (resultadoDado <= valor) {
        resultadoTexto = "NORMAL";
        classeResultado = "normal";
    } else if (resultadoDado >= desastreValor) {
        resultadoTexto = "DESASTRE";
        classeResultado = "desastre";
    } else if (resultadoDado > valor) {
         resultadoTexto = "FALHA";
         classeResultado = "falha";
    }
    
    // Cria o overlay e o modal
    const overlay = document.createElement('div');
    overlay.className = 'rolagem-overlay';
    
    const modal = document.createElement('div');
    modal.className = 'rolagem-modal';
    
    modal.innerHTML = `
        <span class="rolagem-titulo">${nome}</span>
        <span class="rolagem-resultado ${classeResultado}">${resultadoTexto}</span>
        <span class="rolagem-dados">1d100 = ${resultadoDado} (Meta: ${valor})</span>
    `;

    // Adiciona o modal ao overlay e o overlay ao body
    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    // Remove o overlay ao clicar em qualquer lugar
    overlay.addEventListener('click', () => {
        document.body.removeChild(overlay);
        // Garante que o confete pare se o usuário fechar o modal antes
        confetti.classList.remove('show-confetti'); 
    });
}

// ===== FUNÇÃO PARA ROLAR SANIDADE ===== //
function rolarSanidade() {
    // Usa as variáveis globais que já estão definidas
    const valorSanidadeAtual = sanidadeAtual
    
    const resultadoDado = Math.floor(Math.random() * 100) + 1;
    let resultadoTexto = "";
    let classeResultado = "";

    if (resultadoDado <= valorSanidadeAtual) {
        resultadoTexto = "SUCESSO";
        classeResultado = "sucesso";
    } else {
        resultadoTexto = "FALHA";
        classeResultado = "falha";
    }
    
    const overlay = document.createElement('div');
    overlay.className = 'rolagem-overlay';
    
    const modal = document.createElement('div');
    modal.className = 'rolagem-modal';
    
    modal.innerHTML = `
        <span class="rolagem-titulo">Sanidade</span>
        <span class="rolagem-resultado ${classeResultado}">${resultadoTexto}</span>
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
    const preenchimento = tipo === 'vida' ? 
        document.getElementById('barra-vida-preenchimento') : 
        document.getElementById('barra-sanidade-preenchimento');
    
    const texto = tipo === 'vida' ? 
        document.getElementById('texto-vida') : 
        document.getElementById('texto-sanidade');
    
    const max = tipo === 'vida' ? vidaMaxima : sanidadeMaxima;
    const atual = tipo === 'vida' ? vidaAtual : sanidadeAtual;

    const porcentagem = max > 0 ? (atual / max) * 100 : 0;
    preenchimento.style.width = `${Math.min(100, Math.max(0, porcentagem))}%`;
    texto.textContent = `${atual} / ${max}`;
    
    // Atualizar o escurecimento da cor
    atualizarEscurecimentoBarra(tipo);
    
    if (tipo === 'vida' || tipo === 'sanidade') {
        atualizarFotoEstado();
    }
    aplicarEfeitosVisuais();
}




function mudarStatus(tipo, quantidade) {
    if (tipo === 'vida') {
        vidaAtual = Math.min(Math.max(0, vidaAtual + quantidade), vidaMaxima);
        atualizarBarra('vida');
        atualizarEscurecimentoBarra('vida');
    } else if (tipo === 'sanidade') {
        sanidadeAtual = Math.min(Math.max(0, sanidadeAtual + quantidade), sanidadeMaxima);
        atualizarBarra('sanidade');
        atualizarEscurecimentoBarra('sanidade');
    }
    salvarDados();
}

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
    } else if (vidaAtual <= vidaMaxima / 2 && fotosSalvas.metadeVida) {
        fotoSelecionada = fotosSalvas.metadeVida;
    } else if (sanidadeAtual <= sanidadeMaxima / 2 && fotosSalvas.metadeSanidade) {
        fotoSelecionada = fotosSalvas.metadeSanidade;
    }

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
function adicionarItem() {
    const input = document.getElementById('novo-item'); // CORREÇÃO: O ID correto é 'novo-item'
    const nomeItem = input.value.trim();
    if (nomeItem) {
        inventario.push(nomeItem);
        atualizarListaInventario();
        input.value = '';
        salvarDados();
    }
}

function removerItem(event) {
    const item = event.target.closest('.item-inventario');
    if (item) {
        const nomeItem = item.querySelector('span').textContent;
        const index = inventario.indexOf(nomeItem);
        if (index > -1) {
            inventario.splice(index, 1);
            atualizarListaInventario();
            salvarDados();
        }
    }
}

function atualizarListaInventario() {
    const lista = document.getElementById('lista-inventario');
    lista.innerHTML = '';
    inventario.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'item-inventario';
        itemDiv.innerHTML = `
            <span>${item}</span>
            <button class="btn-remover">X</button>
        `;
        lista.appendChild(itemDiv);
    });
}

// ===== LÓGICA DE ATAQUES ===== //
function adicionarAtaque() {
    // Busca os valores de todos os inputs de ataque
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
        ataques.push(novoAtaque);
        atualizarListaAtaques();
        
        // Limpa todos os campos
        nomeInput.value = '';
        danoInput.value = '';
        tipoInput.value = '';
        alcanceInput.value = '';

        salvarDados();
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
    lista.innerHTML = ''; // Limpa a lista antes de recriar
    ataques.forEach(ataque => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'ataque-item';
        // Cria o HTML para o ataque com todas as suas propriedades
        itemDiv.innerHTML = `
            <h4>${ataque.nome}</h4>
            <p>Dano: <span>${ataque.dano}</span></p>
            <p>Tipo: <span>${ataque.tipo}</span></p>
            <p>Alcance: <span>${ataque.alcance}</span></p>
            <button class="btn-remover">X</button>
        `;
        lista.appendChild(itemDiv);
    });
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

// ===== SALVAR E CARREGAR DADOS ===== //
function salvarDados() {
    const dados = {
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
        deslocamentoQ: document.getElementById('deslocamento-q')?.value || '',
        defesa: document.getElementById('defesa-input')?.value || '',
        
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

        // Perícias
        pericias: {},
        
        // Ataques
        ataques: window.ataques,

        // Inventário
        inventario: window.inventario,

        // Anotações
        anotacoes: document.getElementById('anotacoes-texto')?.value || '',
        
        // Dados
        dadoTipo: document.getElementById('dado-tipo')?.value || '',
        dadoQuantidade: document.getElementById('dado-quantidade')?.value || '',
        dadoModificador: document.getElementById('dado-modificador')?.value || '',
        
        // Seletor de Cores
        corTema: document.documentElement.style.getPropertyValue('--dominant-color'),
        
        // Fotos
        fotosSalvas: window.fotosSalvas,
        
        // Nova aba "Coisas Importantes"
        backgroundTexto: document.getElementById('background-texto')?.value || '',
        pessoasImportantesTexto: document.getElementById('pessoas-importantes-texto')?.value || '',
        segredosTexto: document.getElementById('segredos-texto')?.value || '',
        traumasFobias: window.traumasFobias,
        objetivoPrincipalTexto: document.getElementById('objetivo-principal-texto')?.value || '',
        objetivoSecundarioTexto: document.getElementById('objetivo-secundario-texto')?.value || '',
        outrasImportantesTexto: document.getElementById('outras-importantes-texto')?.value || ''
    };

    // Salvar valores das perícias
    document.querySelectorAll('.pericia-input').forEach(input => {
        dados.pericias[input.dataset.nome] = input.value;
    });
    
    localStorage.setItem('fichaRPG', JSON.stringify(dados));
    console.log("✅ Dados salvos - Vida:", vidaAtual, "/", vidaMaxima, "Sanidade:", sanidadeAtual, "/", sanidadeMaxima);
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
        document.getElementById('deslocamento-q').value = dadosSalvos.deslocamentoQ || '';
        document.getElementById('defesa-input').value = dadosSalvos.defesa || '';
        
        // === VIDA E SANIDADE - CORRIGIDO ===
        // Primeiro carrega os valores MÁXIMOS dos campos HTML (se existirem)
        const vidaMaxHTML = parseInt(document.getElementById('vida-Max').value);
        const sanidadeMaxHTML = parseInt(document.getElementById('sanidade-Max').value);
        
        // Usa os valores salvos, se não existir, usa os do HTML, se não existir, usa 10
        vidaMaxima = parseInt(dadosSalvos.vidaMax) || vidaMaxHTML || 10;
        sanidadeMaxima = parseInt(dadosSalvos.sanidadeMax) || sanidadeMaxHTML || 10;
        
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

        document.getElementById('lesao-grave').checked = dadosSalvos.lesaoGrave || false;
        document.getElementById('em-choque').checked = dadosSalvos.emChoque || false;
        document.getElementById('inconsciente').checked = dadosSalvos.inconsciente || false;
        document.getElementById('insanidade').checked = dadosSalvos.insanidade || false;

        // Atributos
        document.getElementById('atributo-forca').value = dadosSalvos.forca || '0';
        document.getElementById('atributo-destreza').value = dadosSalvos.destreza || '0';
        document.getElementById('atributo-inteligencia').value = dadosSalvos.inteligencia || '0';
        document.getElementById('atributo-constituicao').value = dadosSalvos.constituicao || '0';
        document.getElementById('atributo-poder').value = dadosSalvos.poder || '0';
        document.getElementById('atributo-presenca').value = dadosSalvos.presenca || '0';
        document.getElementById('atributo-sorte').value = dadosSalvos.sorte || '0';
        document.getElementById('atributo-educacao').value = dadosSalvos.educacao || '0';

        // Perícias
        periciasSalvas = dadosSalvos.pericias || {};
        inicializarPericias();

        // Ataques
        ataques = dadosSalvos.ataques || [];
        atualizarListaAtaques();
        
        // Inventário
        inventario = dadosSalvos.inventario || [];
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
            document.getElementById('cor-picker-display').style.backgroundColor = dadosSalvos.corTema;
            document.querySelectorAll('.cor-swatch').forEach(swatch => {
                swatch.classList.remove('active');
                if (swatch.style.backgroundColor === dadosSalvos.corTema) {
                    swatch.classList.add('active');
                }
            });
        }
        
        // Fotos
        fotosSalvas = dadosSalvos.fotosSalvas || {};

        // Nova aba "Coisas Importantes"
        document.getElementById('background-texto').value = dadosSalvos.backgroundTexto || '';
        document.getElementById('pessoas-importantes-texto').value = dadosSalvos.pessoasImportantesTexto || '';
        document.getElementById('segredos-texto').value = dadosSalvos.segredosTexto || '';
        traumasFobias = dadosSalvos.traumasFobias || [];
        atualizarListaTraumasFobias();
        document.getElementById('objetivo-principal-texto').value = dadosSalvos.objetivoPrincipalTexto || '';
        document.getElementById('objetivo-secundario-texto').value = dadosSalvos.objetivoSecundarioTexto || '';
        document.getElementById('outras-importantes-texto').value = dadosSalvos.outrasImportantesTexto || '';
        
    } else {
        // SE NÃO HÁ DADOS SALVOS, usa os valores dos campos HTML
        console.log("Nenhum dado salvo encontrado, usando valores padrão");
        vidaMaxima = parseInt(document.getElementById('vida-Max').value) || 10;
        sanidadeMaxima = parseInt(document.getElementById('sanidade-Max').value) || 10;
        vidaAtual = vidaMaxima;
        sanidadeAtual = sanidadeMaxima;
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

    const resultadoTexto = `Resultado: ${resultadoTotal} (Rolagens: ${rolagens.join(', ')}) + ${modificador}`;
    document.getElementById('resultado-dado').textContent = resultadoTexto;
    salvarDados();
}

function resetTotal() {
    document.getElementById('modal-reset-1').classList.remove('hidden');
}

function resetFinal() {
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

    document.getElementById('btn-reset').addEventListener('click', resetTotal);
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
    document.getElementById('deslocamento-q').addEventListener('input', salvarDados);
    document.getElementById('defesa-input').addEventListener('input', salvarDados);
    document.getElementById('rolar-sanidade').addEventListener('click', rolarSanidade);
}