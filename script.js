// ===== VARIÁVEIS GLOBAIS ===== //
let vidaAtual = 0;
let vidaMaxima = 0;
let sanidadeAtual = 0;
let sanidadeMaxima = 0;

// ===== PERÍCIAS DO CALL OF CTULHULHU ===== //
const pericias = [
  { nome: "Antropologia", atributo: "EDU", valor: 1 },
  { nome: "Arqueologia", atributo: "EDU", valor: 1 },
  { nome: "Arremessar", atributo: "FOR", valor: 25 },
  { nome: "Arte e Ofício", atributo: "EDU", valor: 5 },
  { nome: "Avaliar", atributo: "INT", valor: 5 },
  { nome: "Briga", atributo: "FOR", valor: 25 },
  { nome: "Chaveiro", atributo: "DES", valor: 1 },
  { nome: "Ciencias", atributo: "EDU", valor: 1 },
  { nome: "Computador", atributo: "EDU", valor: 5 },
  { nome: "Conduzir", atributo: "DES", valor: 20 },
  { nome: "Crédito", atributo: "CAR", valor: 15 },
  { nome: "Demolições", atributo: "EDU", valor: 1 },
  { nome: "Despistar", atributo: "CAR", valor: 5 },
  { nome: "Direito", atributo: "EDU", valor: 5 },
  { nome: "Disfarce", atributo: "CAR", valor: 5 },
  { nome: "Elétrica", atributo: "EDU", valor: 10 },
  { nome: "Escalar", atributo: "FOR", valor: 20 },
  { nome: "Escutar", atributo: "POD", valor: 25 },
  { nome: "Esconder", atributo: "DES", valor: 10 },
  { nome: "Esquivar", atributo: "DES", valor: 0 }, // Será calculado como DES x 2
  { nome: "Furtividade", atributo: "DES", valor: 20 },
  { nome: "História", atributo: "EDU", valor: 5 },
  { nome: "Intimidação", atributo: "CAR", valor: 15 },
  { nome: "Lábia", atributo: "CAR", valor: 5 },
  { nome: "Ler Lábios", atributo: "EDU", valor: 1 },
  { nome: "Língua Própria", atributo: "EDU", valor: 0 }, // Será calculado como EDU x 5
  { nome: "Língua Estrangeira", atributo: "EDU", valor: 1 },
  { nome: "Medicina", atributo: "EDU", valor: 1 },
  { nome: "Mecânica", atributo: "EDU", valor: 10 },
  { nome: "Mergulho", atributo: "FOR", valor: 1 },
  { nome: "Mitos de Cthulhu", atributo: "EDU", valor: 0 },
  { nome: "Natação", atributo: "FOR", valor: 20 },
  { nome: "Navegação", atributo: "EDU", valor: 10 },
  { nome: "Ocultismo", atributo: "INT", valor: 5 },
  { nome: "Operar Maquinário Pesado", atributo: "DES", valor: 1 },
  { nome: "Persuasão", atributo: "CAR", valor: 10 },
  { nome: "Pilotar", atributo: "DES", valor: 1 },
  { nome: "Primeiros Socorros", atributo: "EDU", valor: 30 },
  { nome: "Psicanálise", atributo: "EDU", valor: 1 },
  { nome: "Psicologia", atributo: "EDU", valor: 10 },
  { nome: "Pulo", atributo: "FOR", valor: 25 },
  { nome: "Rastrear", atributo: "INT", valor: 10 },
  { nome: "Sobrevivência", atributo: "EDU", valor: 10 },
  { nome: "Tiro com Arco", atributo: "DES", valor: 15 },
  { nome: "Tiro", atributo: "DES", valor: 25 },
  { nome: "Usar Bibliotecas", atributo: "EDU", valor: 20 },
  { nome: "Zoologia", atributo: "EDU", valor: 4 }
];

// ===== INICIALIZAÇÃO ===== //
document.addEventListener('DOMContentLoaded', function() {
  inicializarPericias();
  configurarAbas();
  configurarEventListeners();
  carregarDados();
  calcularAtributosDerivados();
});

// ===== SISTEMA DE ABAS ===== //
function configurarAbas() {
  document.querySelectorAll('.tabs button').forEach(button => {
    button.addEventListener('click', function() {
      document.querySelectorAll('.tabs button').forEach(btn => btn.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
      
      this.classList.add('active');
      document.getElementById(this.getAttribute('data-tab')).classList.add('active');
    });
  });
}

// ===== INICIALIZAÇÃO DE PERÍCIAS ===== //
function inicializarPericias() {
  const container = document.getElementById('lista-pericias');
  container.innerHTML = '';
  
  pericias.forEach(pericia => {
    const div = document.createElement('div');
    div.className = 'linha-pericia';
    
    let valorInicial = pericia.valor;
    if (pericia.nome === "Esquivar") {
      valorInicial = 0; // Será calculado dinamicamente
    } else if (pericia.nome === "Língua Própria") {
      valorInicial = 0; // Será calculado dinamicamente
    }
    
    div.innerHTML = `
      <span>${pericia.nome} <span class="pericia-atributo">(${pericia.atributo})</span></span>
      <input type="number" class="pericia-input" data-atributo="${pericia.atributo}" 
             data-nome="${pericia.nome}" value="${valorInicial}">
    `;
    container.appendChild(div);
  });
}

// ===== CÁLCULO DE ATRIBUTOS DERIVADOS ===== //
function calcularAtributosDerivados() {
  // Calcular Pontos de Vida (CON + CAR) / 10 (arredondado para cima)
  const constituicao = parseInt(document.getElementById('atributo-constituicao').value) || 0;
  const presenca = parseInt(document.getElementById('atributo-presenca').value) || 0;
  vidaMaxima = Math.ceil((constituicao + presenca) / 10);
  
  // Calcular Sanidade (POD x 5)
  const poder = parseInt(document.getElementById('atributo-poder').value) || 0;
  sanidadeMaxima = poder * 5;
  
  // Atualizar valores máximos
  document.getElementById('vida-max').value = vidaMaxima;
  document.getElementById('sanidade-max').value = sanidadeMaxima;
  
  // Ajustar valores atuais se necessário
  if (vidaAtual > vidaMaxima) vidaAtual = vidaMaxima;
  if (sanidadeAtual > sanidadeMaxima) sanidadeAtual = sanidadeMaxima;
  
  // Atualizar barras
  atualizarBarra('vida');
  atualizarBarra('sanidade');
  
  // Calcular perícias especiais
  calcularPericiasEspeciais();
}

function calcularPericiasEspeciais() {
  // Calcular Esquiva (DES x 2)
  const destreza = parseInt(document.getElementById('atributo-destreza').value) || 0;
  const esquivaInput = document.querySelector('.pericia-input[data-nome="Esquivar"]');
  if (esquivaInput) {
    esquivaInput.value = destreza * 2;
  }
  
  // Calcular Língua Própria (EDU x 5)
  const educacao = parseInt(document.getElementById('atributo-educacao').value) || 0;
  const linguaInput = document.querySelector('.pericia-input[data-nome="Língua Própria"]');
  if (linguaInput) {
    linguaInput.value = educacao * 5;
  }
}

// ===== SISTEMA DE BARRAS ===== //
function atualizarBarra(tipo) {
  if (tipo === 'vida') {
    const max = vidaMaxima || 1;
    const porcentagem = (vidaAtual / max) * 100;
    document.querySelector('#barra-vida .preenchimento').style.width = `${Math.min(100, Math.max(0, porcentagem))}%`;
    document.getElementById('texto-vida').textContent = `${vidaAtual} / ${vidaMaxima}`;
  } else {
    const max = sanidadeMaxima || 1;
    const porcentagem = (sanidadeAtual / max) * 100;
    document.querySelector('#barra-sanidade .preenchimento').style.width = `${Math.min(100, Math.max(0, porcentagem))}%`;
    document.getElementById('texto-sanidade').textContent = `${sanidadeAtual} / ${sanidadeMaxima}`;
  }
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

// ===== INVENTÁRIO ===== //
function adicionarItem() {
  const div = document.createElement('div');
  div.className = 'inventario-item';
  div.innerHTML = `
    <input type="text" placeholder="Nome do item">
    <input type="number" placeholder="Quantidade" value="1" min="1">
    <button class="btn-remover">X</button>
  `;
  document.getElementById('lista-inventario').appendChild(div);
  
  // Adicionar event listener ao botão de remover
  div.querySelector('.btn-remover').addEventListener('click', function() {
    div.remove();
    salvarDados();
  });
  
  // Adicionar listeners para salvar automaticamente
  div.querySelectorAll('input').forEach(el => {
    el.addEventListener('input', salvarDados);
  });
}

// ===== REGISTRO DE ATAQUES ===== //
function adicionarAtaque() {
  const div = document.createElement('div');
  div.className = 'ataque-item';
  div.innerHTML = `
    <input type="text" placeholder="Nome (ex: Desert Eagle)">
    <input type="text" placeholder="Dano (ex: 1d10+3)">
    <input type="text" placeholder="Tipo (ex: Balístico)">
    <button class="btn-remover-ataque">X</button>
  `;
  document.getElementById('lista-ataques').appendChild(div);
  
  // Adicionar event listener ao botão de remover
  div.querySelector('.btn-remover-ataque').addEventListener('click', function() {
    div.remove();
    salvarDados();
  });
  
  // Adicionar listeners para salvar automaticamente
  div.querySelectorAll('input').forEach(el => {
    el.addEventListener('input', salvarDados);
  });
}

// ===== SISTEMA DE SALVAMENTO ===== //
function salvarDados() {
  const dados = {
    // Dados básicos
    nomePersonagem: document.getElementById('nome-personagem').value,
    nomeJogador: document.getElementById('nome-jogador').value,
    idade: document.getElementById('idade').value,
    sexo: document.getElementById('sexo').value,
    nascimento: document.getElementById('nascimento').value,
    altura: document.getElementById('altura').value,
    peso: document.getElementById('peso').value,
    ocupacao: document.getElementById('ocupacao').value,

    // Atributos
    forca: document.getElementById('atributo-forca').value,
    destreza: document.getElementById('atributo-destreza').value,
    inteligencia: document.getElementById('atributo-inteligencia').value,
    constituicao: document.getElementById('atributo-constituicao').value,
    poder: document.getElementById('atributo-poder').value,
    presenca: document.getElementById('atributo-presenca').value,
    sorte: document.getElementById('atributo-sorte').value,
    educacao: document.getElementById('atributo-educacao').value,

    // Status
    vidaMax: document.getElementById('vida-max').value,
    sanidadeMax: document.getElementById('sanidade-max').value,
    vidaAtual: vidaAtual,
    sanidadeAtual: sanidadeAtual,
    insanidade: document.getElementById('insanidade').checked,
    morrendo: document.getElementById('morrendo').checked,
    inconsciente: document.getElementById('inconsciente').checked,
    lesaoGrave: document.getElementById('lesao-grave').checked,

    // Perícias
    pericias: Array.from(document.querySelectorAll('.pericia-input')).map(el => ({
      nome: el.getAttribute('data-nome'),
      valor: el.value
    })),

    // Inventário
    inventario: Array.from(document.querySelectorAll('#lista-inventario .inventario-item')).map(item => {
      const inputs = item.querySelectorAll('input');
      return {
        nome: inputs[0].value,
        quantidade: inputs[1].value
      };
    }),

    // Ataques
    ataques: Array.from(document.querySelectorAll('#lista-ataques .ataque-item')).map(item => {
      const inputs = item.querySelectorAll('input');
      return {
        nome: inputs[0].value,
        dano: inputs[1].value,
        tipo: inputs[2].value
      };
    }),

    // Anotações
    anotacoes: document.getElementById('anotacoes-texto').value
  };

  localStorage.setItem('fichaRPG', JSON.stringify(dados));
}

function carregarDados() {
  const dadosSalvos = localStorage.getItem('fichaRPG');
  if (!dadosSalvos) {
    // Se não há dados salvos, calcular atributos derivados
    calcularAtributosDerivados();
    return;
  }

  const dados = JSON.parse(dadosSalvos);

  // Dados básicos
  document.getElementById('nome-personagem').value = dados.nomePersonagem || '';
  document.getElementById('nome-jogador').value = dados.nomeJogador || '';
  document.getElementById('idade').value = dados.idade || '';
  document.getElementById('sexo').value = dados.sexo || '';
  document.getElementById('nascimento').value = dados.nascimento || '';
  document.getElementById('altura').value = dados.altura || '';
  document.getElementById('peso').value = dados.peso || '';
  document.getElementById('ocupacao').value = dados.ocupacao || '';

  // Atributos
  document.getElementById('atributo-forca').value = dados.forca || 0;
  document.getElementById('atributo-destreza').value = dados.destreza || 0;
  document.getElementById('atributo-inteligencia').value = dados.inteligencia || 0;
  document.getElementById('atributo-constituicao').value = dados.constituicao || 0;
  document.getElementById('atributo-poder').value = dados.poder || 0;
  document.getElementById('atributo-presenca').value = dados.presenca || 0;
  document.getElementById('atributo-sorte').value = dados.sorte || 0;
  document.getElementById('atributo-educacao').value = dados.educacao || 0;

  // Status
  document.getElementById('vida-max').value = dados.vidaMax || 0;
  document.getElementById('sanidade-max').value = dados.sanidadeMax || 0;
  vidaAtual = typeof dados.vidaAtual === 'number' ? dados.vidaAtual : 0;
  sanidadeAtual = typeof dados.sanidadeAtual === 'number' ? dados.sanidadeAtual : 0;
  document.getElementById('insanidade').checked = dados.insanidade || false;
  document.getElementById('morrendo').checked = dados.morrendo || false;
  document.getElementById('inconsciente').checked = dados.inconsciente || false;
  document.getElementById('lesao-grave').checked = dados.lesaoGrave || false;

  // Perícias
  if (dados.pericias) {
    dados.pericias.forEach(pericia => {
      const input = document.querySelector(`.pericia-input[data-nome="${pericia.nome}"]`);
      if (input) {
        input.value = pericia.valor;
      }
    });
  }

  // Inventário
  const listaInventario = document.getElementById('lista-inventario');
  listaInventario.innerHTML = '';
  if (dados.inventario && dados.inventario.length > 0) {
    dados.inventario.forEach(item => {
      const div = document.createElement('div');
      div.className = 'inventario-item';
      div.innerHTML = `
        <input type="text" placeholder="Nome do item" value="${item.nome || ''}">
        <input type="number" placeholder="Quantidade" value="${item.quantidade || 1}" min="1">
        <button class="btn-remover">X</button>
      `;
      listaInventario.appendChild(div);
      
      // Adicionar event listener ao botão de remover
      div.querySelector('.btn-remover').addEventListener('click', function() {
        div.remove();
        salvarDados();
      });
    });
  } else {
    // Adiciona um item vazio se não houver inventário salvo
    adicionarItem();
  }

  // Ataques
  const listaAtaques = document.getElementById('lista-ataques');
  listaAtaques.innerHTML = '';
  if (dados.ataques && dados.ataques.length > 0) {
    dados.ataques.forEach(ataque => {
      const div = document.createElement('div');
      div.className = 'ataque-item';
      div.innerHTML = `
        <input type="text" placeholder="Nome (ex: Desert Eagle)" value="${ataque.nome || ''}">
        <input type="text" placeholder="Dano (ex: 1d10+3)" value="${ataque.dano || ''}">
        <input type="text" placeholder="Tipo (ex: Balístico)" value="${ataque.tipo || ''}">
        <button class="btn-remover-ataque">X</button>
      `;
      listaAtaques.appendChild(div);
      
      // Adicionar event listener ao botão de remover
      div.querySelector('.btn-remover-ataque').addEventListener('click', function() {
        div.remove();
        salvarDados();
      });
    });
  } else {
    // Adiciona exemplos se não houver ataques salvos
    adicionarAtaque();
    adicionarAtaque();
  }

  // Anotações
  document.getElementById('anotacoes-texto').value = dados.anotacoes || '';

  // Atualiza as barras e efeitos visuais
  atualizarBarra('vida');
  atualizarBarra('sanidade');
  document.getElementById('barra-sanidade').classList.toggle('insano', dados.insanidade);
  document.querySelector('.ficha-container').classList.toggle('morrendo', dados.morrendo);
  document.querySelector('.ficha-container').classList.toggle('inconsciente', dados.inconsciente);
  document.querySelector('.ficha-container').classList.toggle('lesao-grave', dados.lesaoGrave);
  
  // Calcular atributos derivados após carregar os dados
  calcularAtributosDerivados();
}

// ===== CONFIGURAÇÃO DE EVENT LISTENERS ===== //
function configurarEventListeners() {
  // Configura listeners para salvar automaticamente
  document.querySelectorAll('input, select, textarea').forEach(el => {
    el.addEventListener('input', salvarDados);
  });

  // Configura listeners para atributos que afetam cálculos
  const atributosCalculo = ['atributo-constituicao', 'atributo-presenca', 'atributo-poder', 'atributo-destreza', 'atributo-educacao'];
  atributosCalculo.forEach(id => {
    document.getElementById(id).addEventListener('input', calcularAtributosDerivados);
  });

  // Configura listeners para checkboxes
  document.getElementById('insanidade').addEventListener('change', function() {
    document.getElementById('barra-sanidade').classList.toggle('insano', this.checked);
    salvarDados();
  });

  document.getElementById('morrendo').addEventListener('change', function() {
    document.querySelector('.ficha-container').classList.toggle('morrendo', this.checked);
    salvarDados();
  });

  document.getElementById('inconsciente').addEventListener('change', function() {
    document.querySelector('.ficha-container').classList.toggle('inconsciente', this.checked);
    salvarDados();
  });
  
  document.getElementById('lesao-grave').addEventListener('change', function() {
    document.querySelector('.ficha-container').classList.toggle('lesao-grave', this.checked);
    salvarDados();
  });

  // Configura listeners para os máximos das barras
  document.getElementById('vida-max').addEventListener('change', function() {
    vidaMaxima = parseInt(this.value) || 0;
    vidaAtual = Math.min(vidaAtual, vidaMaxima);
    atualizarBarra('vida');
  });

  document.getElementById('sanidade-max').addEventListener('change', function() {
    sanidadeMaxima = parseInt(this.value) || 0;
    sanidadeAtual = Math.min(sanidadeAtual, sanidadeMaxima);
    atualizarBarra('sanidade');
  });

  // Configura botões de adicionar
  document.getElementById('btn-adicionar-item').addEventListener('click', adicionarItem);
  document.querySelector('.btn-adicionar-ataque').addEventListener('click', adicionarAtaque);
  
  // Configura botão de salvar
  document.getElementById('btn-salvar-ficha').addEventListener('click', salvarDados);
}
