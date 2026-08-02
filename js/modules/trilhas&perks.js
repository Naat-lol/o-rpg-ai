export class SistemaTrilhasPerks {
    constructor() {
        console.log('Sistema de Trilhas e Perks inicializado!');

        this.catalogoTrilhas = [
            {
                id: 'trilha-guardiao',
                nome: 'Guardião',
                descricao: 'Defesa e proteção. Focado em absorver dano e proteger aliados.',
                categoria: 'Defensivo'
            },
            {
                id: 'trilha-sobrevivente',
                nome: 'Sobrevivente',
                descricao: 'Resistência, fuga e adaptação. Capaz de sobreviver em qualquer situação adversa.',
                categoria: 'Defensivo'
            },
            {
                id: 'trilha-comandante',
                nome: 'Comandante',
                descricao: 'Estratégia, liderança e controle. Coordena aliados e dita o ritmo da batalha.',
                categoria: 'Tático'
            },
            {
                id: 'trilha-investigador',
                nome: 'Investigador',
                descricao: 'Observação, exploração e dedução. Mestre em encontrar pistas e desvendar mistérios.',
                categoria: 'Intelectual'
            },
            {
                id: 'trilha-trapaceiro',
                nome: 'Trapaceiro',
                descricao: 'Enganação, furtividade e improviso. Usa truques e subterfúgios para vencer.',
                categoria: 'Tático'
            },
            {
                id: 'trilha-diplomata',
                nome: 'Diplomata',
                descricao: 'Persuasão, negociação e influência. Resolve conflitos com palavras e inteligência social.',
                categoria: 'Sobrevivência'
            },
            {
                id: 'trilha-predador',
                nome: 'Predador',
                descricao: 'Caçada, emboscadas e execução. Especialista em perseguir e finalizar alvos.',
                categoria: 'Ofensivo'
            },
            {
                id: 'trilha-violento',
                nome: 'Violento',
                descricao: 'Ofensiva agressiva e mobilidade. Ataques rápidos e brutais que desestabilizam o inimigo.',
                categoria: 'Ofensivo'
            },
            {
                id: 'trilha-implacavel',
                nome: 'Implacável',
                descricao: 'Resistência e pressão constante. Personagens que não recuam e mantêm a ofensiva sem descanso.',
                categoria: 'Ofensivo'
            }
        ];

        this.catalogoTrilhas.sort((a, b) => a.nome.localeCompare(b.nome));

        this.catalogoPerks = [
        
{
    id: 'perk-reflexos-agucados',
    nome: 'Reflexos Aguçados',
    descricao: 'Você recebe vantagem em todos os testes de Iniciativa, reagindo mais rapidamente ao início de um combate ou situação de risco.',
    custo: 0,
    necessita: null
},
{
    id: 'perk-determinacao-inabalavel',
    nome: 'Determinação Inabalável',
    descricao: 'Uma vez por sessão, ao falhar em qualquer teste, você pode gastar 2 PD para realizá-lo novamente. O novo resultado deve ser aceito, mesmo que seja pior.',
    custo: 0,
    necessita: null
},
{
    id: 'perk-mochila-emergencia',
    nome: 'Mochila de Emergência',
    descricao: 'Uma vez por sessão, você pode declarar que trouxe consigo um item simples e comum que ainda não havia sido mencionado. O mestre decide se o item é plausível para a situação.',
    custo: 0,
    necessita: null
},
{
    id: 'perk-passos-ligeiros',
    nome: 'Passos Ligeiros',
    descricao: 'Seu deslocamento aumenta em +3 metros, permitindo cobrir maiores distâncias com mais facilidade durante perseguições, fugas e combates.',
    custo: 0,
    necessita: null
},
{
    id: 'perk-casca-grossa',
    nome: 'Casca Grossa',
    descricao: 'Você recebe +2 de Defesa, representando sua resistência natural a golpes e sua capacidade de suportar ataques com mais eficiência.',
    custo: 0,
    necessita: null
},
{
    id: 'perk-golpe-pesado',
    nome: 'Golpe Pesado',
    descricao: 'Você pode gastar 3 PD antes de realizar um ataque corpo a corpo. Caso o ataque acerte, ele causa +2d4 de dano adicional.',
    custo: 3,
    necessita: null
},
{
    id: 'perk-atirador-elite',
    nome: 'Atirador de Elite',
    descricao: 'Uma vez por sessão, você pode gastar 4 PD antes de realizar um ataque com uma arma de fogo. Caso o ataque acerte, você realiza a rolagem de dano com 1d8 a mais.',
    custo: 4,
    necessita: null
},
{
    id: 'perk-mente-inabalavel',
    nome: 'Mente Inabalável',
    descricao: 'Uma vez por sessão, ao falhar em um teste de Sanidade, você pode realizar esse teste novamente, ignorando o resultado anterior.',
    custo: 0,
    necessita: null
},
{
    id: 'perk-paramedico',
    nome: 'Paramédico',
    descricao: 'Sempre que recuperar a Vida de um aliado, ele recupera PV adicionais iguais ao seu valor de Constituição, graças ao seu conhecimento em primeiros socorros.',
    custo: 0,
    necessita: null
},
{
    id: 'perk-polivalente',
    nome: 'Polivalente',
    descricao: 'Uma vez por cena, você pode gastar 2 PD para receber vantagem em qualquer teste de perícia à sua escolha, adaptando seus conhecimentos à situação.',
    custo: 2,
    necessita: null
},
{
    id: 'perk-inspiracao',
    nome: 'Inspiração',
    descricao: 'Uma vez por cena, você pode gastar 2 PD para conceder vantagem no próximo teste realizado por um aliado em alcance curto, incentivando-o a superar seus próprios limites.',
    custo: 2,
    necessita: null
},
{
    id: 'perk-ecletico',
    nome: 'Eclético',
    descricao: 'No início de cada sessão, escolha uma perícia. Até o fim da sessão, você recebe vantagem em todos os testes realizados com essa perícia.',
    custo: 0,
    necessita: null
},
{
    id: 'perk-oportunista',
    nome: 'Oportunista',
    descricao: 'Uma vez por combate, quando um inimigo falhar em um ataque corpo a corpo contra você, seu próximo ataque contra esse alvo causa +1d6 de dano adicional.',
    custo: 0,
    necessita: null
},
{
    id: 'perk-folego-extra',
    nome: 'Fôlego Extra',
    descricao: 'Você recebe +2 de Vida máxima para cada 10% de Exposição adquirida, tornando-se cada vez mais resistente conforme evolui.',
    custo: 0,
    necessita: null
},
{
    id: 'perk-equilibrio-mental',
    nome: 'Equilíbrio Mental',
    descricao: 'Você recebe +5 de Sanidade máxima para cada 10% de Exposição adquirida, fortalecendo sua mente contra os horrores encontrados ao longo da jornada.',
    custo: 0,
    necessita: null
},
{
    id: 'perk-recuperacao-mental',
    nome: 'Recuperação Mental',
    descricao: 'Ao final de um combate, caso nenhum aliado tenha morrido durante a batalha, você recupera 1d4 de PD, representando o alívio e a confiança obtidos após superar o confronto sem perdas.',
    custo: 0,
    necessita: null
},
{
    id: 'perk-persistencia',
    nome: 'Persistência',
    descricao: 'Uma vez por sessão, quando sua Vida chegar a 0, você permanece consciente até o fim da rodada atual, podendo agir caso seu turno ainda não tenha passado. Ao término da rodada, caso não tenha sido curado, entra normalmente no estado Morrendo.',
    custo: 0,
    necessita: null
},
{
    id: 'perk-precisao-cirurgica',
    nome: 'Precisão Cirúrgica',
    descricao: 'Você pode gastar 3 PD antes de realizar um ataque para receber vantagem nessa rolagem.',
    custo: 3,
    necessita: null
},
{
    id: 'perk-perfeccionista',
    nome: 'Perfeccionista',
    descricao: 'Ao realizar um teste com desvantagem, você pode gastar 6 PD para anular completamente essa penalidade, realizando a rolagem normalmente.',
    custo: 6,
    necessita: null
},
{
    id: 'perk-sede-de-sangue-universal',
    nome: 'Sede de Sangue',
    descricao: 'Ao realizar um ataque, você pode gastar 6 PD para causar +3d6 de dano adicional caso o golpe acerte o alvo.',
    custo: 6,
    necessita: null
},
{
    id: 'perk-resistencia-forcada',
    nome: 'Resistência Forçada',
    descricao: 'Quando for alvo de um ataque, você pode gastar 5 PD para reduzir pela metade o dano do próximo golpe que atingir seu personagem. O efeito é encerrado após absorver esse ataque, independentemente do dano causado.',
    custo: 5,
    necessita: null
},

            {
                id: 'perk-muralha',
                nome: 'Muralha',
                descricao: 'Uma vez por combate, ao falhar em um bloqueio, você pode imediatamente realizar um novo teste de bloqueio, sem vantagem ou desvantagem.',
                custo: 3,
                necessita: 'trilha-guardiao'
            },
            {
                id: 'perk-interceptacao',
                nome: 'Interceptação',
                descricao: 'Uma vez por batalha, pode escolher entrar na frente do próximo ataque a um aliado no alcance do deslocamento. Caso o ataque seja feito, o jogador se desloca na frente do aliado que iria receber o ataque e toma o dano inteiro menos a defesa atual.',
                custo: 5,
                necessita: 'trilha-guardiao'
            },
            {
                id: 'perk-socorrista',
                nome: 'Socorrista',
                descricao: 'Levantar um aliado caído não consome sua ação e não exige teste.',
                custo: 0,
                necessita: 'trilha-guardiao'
            },
            {
                id: 'perk-ultimo-bastiao',
                nome: 'Último Bastião',
                descricao: 'Uma vez por sessão, quando sofrer um golpe crítico que causaria dano superior à metade da sua Vida máxima, esse dano é reduzido pela metade.',
                custo: 0,
                necessita: 'trilha-guardiao'
            },
            {
                id: 'perk-fortalecimento',
                nome: 'Fortalecimento',
                descricao: 'Uma vez por combate, ao sofrer um golpe crítico, recebe +5 de Defesa temporários no início do seu próximo turno.',
                custo: 0,
                necessita: 'trilha-guardiao'
            },

            {
                id: 'perk-instinto',
                nome: 'Instinto',
                descricao: 'Uma vez por sessão, ao ser alvo de um ataque surpresa ou armadilha, você pode realizar um teste para tentar evitar suas penalidades, mesmo que normalmente isso não fosse possível.',
                custo: 0,
                necessita: 'trilha-sobrevivente'
            },
            {
                id: 'perk-pe-na-estrada',
                nome: 'Pé na Estrada',
                descricao: 'Ignora completamente as penalidades causadas por terreno difícil.',
                custo: 0,
                necessita: 'trilha-sobrevivente'
            },
            {
                id: 'perk-ultimo-de-pe',
                nome: 'O Último de Pé',
                descricao: 'Uma vez por sessão, quando sua Vida chegaria a 0, você permanece com 1 de Vida. Porém, se até o fim da cena não recuperar sua Vida para acima da metade do valor máximo, entra automaticamente no estado Morrendo e precisará ser levantado por um aliado.',
                custo: 0,
                necessita: 'trilha-sobrevivente'
            },
            {
                id: 'perk-improviso',
                nome: 'Improviso',
                descricao: 'Ao utilizar uma arma improvisada, ela causa +1d6 de dano.',
                custo: 0,
                necessita: 'trilha-sobrevivente'
            },
            {
                id: 'perk-adaptavel',
                nome: 'Adaptável',
                descricao: 'Após sofrer um efeito negativo, você pode ativar esta habilidade para receber vantagem no próximo teste para resistir ao mesmo efeito. Porém, caso falhe no teste, as consequências desse efeito são dobradas.',
                custo: 4,
                necessita: 'trilha-sobrevivente'
            },

            {
                id: 'perk-ordem-direta',
                nome: 'Ordem Direta',
                descricao: 'Uma vez por combate, escolha um aliado. Ele pode agir imediatamente, realizando um turno extra. Após isso, você perde seu próximo turno.',
                custo: 6,
                necessita: 'trilha-comandante'
            },
            {
                id: 'perk-motivacao',
                nome: 'Motivação',
                descricao: 'Uma vez por combate, escolha um aliado. O próximo teste realizado por ele recebe vantagem. Caso ainda falhe no teste, ele perde 1d6 de Sanidade.',
                custo: 3,
                necessita: 'trilha-comandante'
            },
            {
                id: 'perk-reorganizacao',
                nome: 'Reorganização',
                descricao: 'Uma vez por combate, no seu turno, você pode alterar a ordem de iniciativa. Escolha a si mesmo ou um aliado que ainda não tenha agido na rodada anterior e mova sua posição para ser o último ou o primeiro na ordem de iniciativa.',
                custo: 4,
                necessita: 'trilha-comandante'
            },
            {
                id: 'perk-alvo-marcado',
                nome: 'Alvo Marcado',
                descricao: 'Escolha um inimigo. Todos os ataques contra esse alvo causam +1d6 de dano durante 1d4 rodadas.',
                custo: 4,
                necessita: 'trilha-comandante'
            },
            {
                id: 'perk-nao-desista',
                nome: 'Não Desista',
                descricao: 'Uma vez por sessão, quando um aliado dentro do alcance do seu deslocamento entrar no estado Morrendo por dano comum (não por um golpe crítico que tenha causado mais da metade da Vida máxima), você pode tentar levantá-lo realizando um teste de Diplomacia em vez de Medicina, sem precisar estar adjacente ao alvo, porém precisa estar no seu alcance de deslocamento.',
                custo: 5,
                necessita: 'trilha-comandante'
            },

            {
                id: 'perk-especialista',
                nome: 'Especialista',
                descricao: 'Antes de realizar um teste de Inteligência, você pode sacrificar 1d8 de Sanidade para receber vantagem nesse teste.',
                custo: 2,
                necessita: 'trilha-investigador'
            },
            {
                id: 'perk-reconstituicao',
                nome: 'Reconstituição',
                descricao: 'Uma vez por sessão, ao investigar uma cena, você pode reconstruir mentalmente os acontecimentos. Faça um teste de Inteligência. Em caso de sucesso, o mestre deve revelar um acontecimento importante que ocorreu naquele local.',
                custo: 4,
                necessita: 'trilha-investigador'
            },
            {
                id: 'perk-leitura-corporal',
                nome: 'Leitura Corporal',
                descricao: 'Recebe vantagem em todos os testes sociais.',
                custo: 0,
                necessita: 'trilha-investigador'
            },
            {
                id: 'perk-deducao-rapida',
                nome: 'Dedução Rápida',
                descricao: 'Ao falhar em um teste de Inteligência relacionado à investigação, você pode tentar novamente imediatamente. O novo teste é realizado com desvantagem.',
                custo: 3,
                necessita: 'trilha-investigador'
            },
            {
                id: 'perk-analise-fraqueza',
                nome: 'Análise de Fraqueza',
                descricao: 'Durante seu turno, você pode dedicar toda a sua ação para observar um inimigo. No início do seu próximo turno, o mestre revela um de seus pontos fracos. Durante 1 rodada, ataques que explorarem esse ponto fraco causam +1d6 de dano. Você pode revelar essa informação aos seus aliados.',
                custo: 5,
                necessita: 'trilha-investigador'
            },

            {
                id: 'perk-maos-leves',
                nome: 'Mãos Leves',
                descricao: 'Ao tentar furtar um item de um NPC ou inimigo, você pode ativar esta habilidade para realizar o teste de Furto com vantagem.',
                custo: 2,
                necessita: 'trilha-trapaceiro'
            },
            {
                id: 'perk-desaparecer',
                nome: 'Desaparecer',
                descricao: 'Uma vez por combate, ao sair da linha de visão de um inimigo, você pode realizar imediatamente um teste de Furtividade com vantagem para se esconder.',
                custo: 3,
                necessita: 'trilha-trapaceiro'
            },
            {
                id: 'perk-isca',
                nome: 'Isca',
                descricao: 'Uma vez por combate, escolha um inimigo e realize um teste de Persuasão contra ele. Se obtiver sucesso, o alvo deve gastar sua próxima ação tentando atacar você ou investigando sua posição.',
                custo: 4,
                necessita: 'trilha-trapaceiro'
            },
            {
                id: 'perk-jogo-sujo',
                nome: 'Jogo Sujo',
                descricao: 'Ao atacar um inimigo distraído, desprevenido ou que esteja atacando outro alvo, seus ataques causam +1d6 de dano.',
                custo: 0,
                necessita: 'trilha-trapaceiro'
            },
            {
                id: 'perk-blefador',
                nome: 'Blefador',
                descricao: 'Uma vez por sessão, ao falhar em um teste de Lábia, você pode realizá-lo novamente. O novo teste é feito com desvantagem.',
                custo: 3,
                necessita: 'trilha-trapaceiro'
            },

            {
                id: 'perk-cessar-fogo',
                nome: 'Cessar-Fogo',
                descricao: 'Uma vez por combate, escolha dois alvos que estejam lutando entre si. Faça um teste de Persuasão. Em caso de sucesso, ambos ficam impedidos de atacar um ao outro até o início do seu próximo turno.',
                custo: 5,
                necessita: 'trilha-diplomata'
            },
            {
                id: 'perk-voz-autoridade',
                nome: 'Voz de Autoridade',
                descricao: 'Uma vez por combate, escolha um NPC ou inimigo inteligente. Faça um teste de Persuasão. Se vencer, ele é obrigado a responder honestamente uma única pergunta simples.',
                custo: 4,
                necessita: 'trilha-diplomata'
            },
            {
                id: 'perk-pacificador',
                nome: 'Pacificador',
                descricao: 'Recebe vantagem em testes para impedir brigas, acalmar multidões ou convencer alguém a desistir de um conflito.',
                custo: 0,
                necessita: 'trilha-diplomata'
            },
            {
                id: 'perk-respeito-mutuo',
                nome: 'Respeito Mútuo',
                descricao: 'Após uma conversa bem-sucedida com um NPC, o primeiro teste social realizado contra ele durante a mesma cena recebe vantagem.',
                custo: 0,
                necessita: 'trilha-diplomata'
            },
            {
                id: 'perk-ultima-palavra',
                nome: 'Última Palavra',
                descricao: 'Uma vez por sessão, ao falhar em um teste de Persuasão, você pode transformá-lo em um sucesso parcial. O NPC não aceita totalmente sua proposta, mas faz uma concessão razoável.',
                custo: 5,
                necessita: 'trilha-diplomata'
            },

            {
                id: 'perk-cacador',
                nome: 'Caçador',
                descricao: 'Uma vez por combate, escolha um inimigo com menos de 10% da Vida máxima. Seu próximo ataque contra esse alvo pode finalizá-lo instantaneamente. Caso o ataque não seja capaz de matá-lo, você sofre 1d6 de Sanidade.',
                custo: 5,
                necessita: 'trilha-predador'
            },
            {
                id: 'perk-perseguicao',
                nome: 'Perseguição',
                descricao: 'Uma vez por combate, escolha um inimigo. Até o fim do combate, você recebe vantagem em testes para persegui-lo, alcançá-lo ou impedir sua fuga.',
                custo: 3,
                necessita: 'trilha-predador'
            },
            {
                id: 'perk-olhos-no-alvo',
                nome: 'Olhos no Alvo',
                descricao: 'No início do combate, escolha um inimigo para ser seu Alvo Principal até o fim da batalha. Caso consiga eliminá-lo, recupera 1d10 de Sanidade.',
                custo: 3,
                necessita: 'trilha-predador'
            },
            {
                id: 'perk-instinto-predatorio',
                nome: 'Instinto Predatório',
                descricao: 'Ao eliminar um inimigo, recupera 1d4 de PD.',
                custo: 0,
                necessita: 'trilha-predador'
            },
            {
                id: 'perk-emboscador',
                nome: 'Emboscador',
                descricao: 'Uma vez por combate, ao atacar um inimigo que não tenha percebido sua presença, seu ataque recebe vantagem e causa +1d6 de dano.',
                custo: 4,
                necessita: 'trilha-predador'
            },

            {
                id: 'perk-frenesi',
                nome: 'Frenesi',
                descricao: 'Sempre que eliminar um inimigo, você pode imediatamente realizar outra ação completa.',
                custo: 0,
                necessita: 'trilha-violento'
            },
            {
                id: 'perk-tudo-ou-nada',
                nome: 'Tudo ou Nada',
                descricao: 'Antes de realizar um ataque, você pode reduzir sua Defesa em 5 até o início do seu próximo turno. Se acertar o ataque, causa +2d6 de dano.',
                custo: 4,
                necessita: 'trilha-violento'
            },
            {
                id: 'perk-sequencia',
                nome: 'Sequência',
                descricao: 'Ao acertar dois ataques consecutivos no mesmo inimigo, o terceiro ataque contra esse alvo causa +1d6 de dano.',
                custo: 0,
                necessita: 'trilha-violento'
            },
            {
                id: 'perk-pressao',
                nome: 'Pressão',
                descricao: 'Ao causar dano ao mesmo inimigo durante dois turnos consecutivos, ele recebe desvantagem no próximo teste de Defesa.',
                custo: 0,
                necessita: 'trilha-violento'
            },
            {
                id: 'perk-combustivel-de-dor',
                nome: 'Combustivel De Dor',
                descricao: 'Sempre que sofrer dano, recebe +2 de dano corpo a corpo até o fim do próximo turno.',
                custo: 0,
                necessita: 'trilha-violento'
            },

            {
                id: 'perk-casca-dura',
                nome: 'Casca Dura',
                descricao: 'A primeira vez que sofrer um golpe crítico em um combate, o dano adicional causado pelo crítico é ignorado.',
                custo: 0,
                necessita: 'trilha-implacavel'
            },
            {
                id: 'perk-inquebravel',
                nome: 'Inquebrável',
                descricao: 'Quando sofrer um golpe que causaria um efeito negativo (empurrão, atordoamento, queda etc.), você pode realizar novamente o teste para resistir.',
                custo: 0,
                necessita: 'trilha-implacavel'
            },
            {
                id: 'perk-investida',
                nome: 'Investida',
                descricao: 'Uma vez por combate, você pode investir contra um inimigo e realizar um teste de Força contra ele para tentar derrubá-lo. Caso o alvo esteja desprevenido ou de costas, você realiza esse teste com vantagem.',
                custo: 4,
                necessita: 'trilha-implacavel'
            },
            {
                id: 'perk-resistencia-brutal',
                nome: 'Resistência Brutal',
                descricao: 'Ao terminar um combate com menos da metade da Vida máxima, recupera 1d4 de PD.',
                custo: 0,
                necessita: 'trilha-implacavel'
            },
            {
                id: 'perk-nunca-basta',
                nome: 'Nunca Basta',
                descricao: 'Enquanto estiver com menos de 30% da Vida máxima, seus ataques corpo a corpo causam +1d6 de dano.',
                custo: 0,
                necessita: 'trilha-implacavel'
            }
        ];

        this.catalogoPerks.sort((a, b) => a.nome.localeCompare(b.nome));

        this.trilhaAtiva = null;
        this.perksSelecionadas = [];

        this.inicializarUI();
    }

    atualizarCampoTrilha() {
        const campoTrilha = document.getElementById('trilha-principal');
        if (!campoTrilha) return;

        if (this.trilhaAtiva) {
            campoTrilha.textContent = this.trilhaAtiva.nome;
        } else {
            campoTrilha.textContent = '';
        }
    }

    inicializarUI() {
        this.renderizarTrilhaAtiva();
        this.renderizarPerks();
        this.atualizarCampoTrilha();

        const bloco = document.getElementById('trilha-ativa-bloco');
        if (bloco) {
            bloco.addEventListener('click', (e) => {
                if (e.target.closest('.botao-acao-minimal')) return;
                if (!this.trilhaAtiva) {
                    this.abrirModalTrilhas();
                } else {
                    bloco.classList.toggle('expandido');
                }
            });
        }

        const btnAddPerk = document.getElementById('adicionar-perk');
        if (btnAddPerk) {
            btnAddPerk.addEventListener('click', () => this.abrirModalPerks());
        }

        const fecharTrilhas = document.getElementById('fechar-modal-trilhas');
        if (fecharTrilhas) {
            fecharTrilhas.addEventListener('click', () => this.fecharModalTrilhas());
        }
        const fecharPerks = document.getElementById('fechar-modal-perks');
        if (fecharPerks) {
            fecharPerks.addEventListener('click', () => this.fecharModalPerks());
        }

        const buscaTrilhas = document.getElementById('trilhas-busca');
        if (buscaTrilhas) {
            buscaTrilhas.addEventListener('input', (e) => this.carregarTrilhasDisponiveis(e.target.value));
        }
        const buscaPerks = document.getElementById('perks-busca');
        if (buscaPerks) {
            buscaPerks.addEventListener('input', (e) => this.carregarPerksDisponiveis(e.target.value));
        }

        const overlayTrilhas = document.getElementById('modal-trilhas');
        const overlayPerks = document.getElementById('modal-perks');
        if (overlayTrilhas) {
            overlayTrilhas.addEventListener('click', (e) => {
                if (e.target === overlayTrilhas) this.fecharModalTrilhas();
            });
        }
        if (overlayPerks) {
            overlayPerks.addEventListener('click', (e) => {
                if (e.target === overlayPerks) this.fecharModalPerks();
            });
        }

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (overlayTrilhas && overlayTrilhas.classList.contains('aberto')) this.fecharModalTrilhas();
                if (overlayPerks && overlayPerks.classList.contains('aberto')) this.fecharModalPerks();
            }
        });
    }

    renderizarTrilhaAtiva() {
        const bloco = document.getElementById('trilha-ativa-bloco');
        if (!bloco) return;

        if (!this.trilhaAtiva) {
            bloco.innerHTML = `
                <div class="trilha-ativa-cabecalho">
                    <span class="trilha-ativa-placeholder">Selecionar Trilha</span>
                    <span class="trilha-ativa-seta">▼</span>
                </div>
            `;
            bloco.classList.remove('expandido');
        } else {
            const trilha = this.trilhaAtiva;
            bloco.innerHTML = `
                <div class="trilha-ativa-cabecalho">
                    <span class="trilha-ativa-nome">${trilha.nome}</span>
                    <span class="trilha-ativa-seta">▼</span>
                </div>
                <div class="trilha-ativa-conteudo">
                    <div class="trilha-ativa-interno">
                        <div class="trilha-ativa-descricao">${trilha.descricao}</div>
                        <div class="trilha-ativa-acoes">
                            <button class="botao-acao-minimal excluir" data-acao="excluir">Excluir</button>
                            <button class="botao-acao-minimal" data-acao="substituir">Substituir</button>
                        </div>
                    </div>
                </div>
            `;
            bloco.classList.remove('expandido');

            const btnExcluir = bloco.querySelector('[data-acao="excluir"]');
            const btnSubstituir = bloco.querySelector('[data-acao="substituir"]');
            btnExcluir.addEventListener('click', (e) => {
                e.stopPropagation();
                this.excluirTrilha();
            });
            btnSubstituir.addEventListener('click', (e) => {
                e.stopPropagation();
                this.abrirModalTrilhas();
            });
        }

        this.atualizarCampoTrilha();
    }

    excluirTrilha() {
        this.trilhaAtiva = null;
        this.renderizarTrilhaAtiva();
        this.renderizarPerks();
        this.atualizarCampoTrilha();
        this.mostrarMensagem('Trilha removida.', 'info');
    }

    renderizarPerks() {
        const lista = document.getElementById('perks-lista');
        const vazia = document.getElementById('perks-vazia');
        if (!lista) return;

        const itens = lista.querySelectorAll('.perk-item');
        itens.forEach(el => el.remove());

        const perksOrdenadas = [...this.perksSelecionadas].sort((a, b) => a.nome.localeCompare(b.nome));

        if (perksOrdenadas.length === 0) {
            if (vazia) vazia.style.display = 'block';
            return;
        }
        if (vazia) vazia.style.display = 'none';

        perksOrdenadas.forEach(perk => {
            const item = document.createElement('div');
            item.className = 'perk-item';
            item.dataset.id = perk.id;

            const nomeComCusto = perk.custo > 0 ? `${perk.nome} (${perk.custo} PD)` : perk.nome;

            item.innerHTML = `
                <div class="perk-cabecalho">
                    <span class="perk-nome">${nomeComCusto}</span>
                    <button class="perk-remover" title="Remover perk">×</button>
                    <span class="perk-seta">▼</span>
                </div>
                <div class="perk-conteudo">
                    <div class="perk-conteudo-interno">${perk.descricao}</div>
                </div>
            `;

            const cabecalho = item.querySelector('.perk-cabecalho');
            cabecalho.addEventListener('click', (e) => {
                if (e.target.closest('.perk-remover')) return;
                document.querySelectorAll('.perk-item.expandido').forEach(el => {
                    if (el !== item) el.classList.remove('expandido');
                });
                item.classList.toggle('expandido');
            });

            const btnRemover = item.querySelector('.perk-remover');
            btnRemover.addEventListener('click', (e) => {
                e.stopPropagation();
                this.removerPerk(perk.id);
            });

            lista.appendChild(item);
        });
    }

    removerPerk(id) {
        this.perksSelecionadas = this.perksSelecionadas.filter(p => p.id !== id);
        this.renderizarPerks();
        this.mostrarMensagem('Perk removida.', 'info');
    }

    abrirModalTrilhas() {
        const modal = document.getElementById('modal-trilhas');
        if (modal) {
            modal.classList.add('aberto');
            document.getElementById('trilhas-busca').value = '';
            this.carregarTrilhasDisponiveis('');
        }
    }

    fecharModalTrilhas() {
        document.getElementById('modal-trilhas').classList.remove('aberto');
    }

    carregarTrilhasDisponiveis(filtro = '') {
        const lista = document.getElementById('trilhas-disponiveis-lista');
        if (!lista) return;

        let trilhas = this.catalogoTrilhas;
        if (filtro) {
            const termo = filtro.toLowerCase();
            trilhas = trilhas.filter(t =>
                t.nome.toLowerCase().includes(termo) ||
                t.descricao.toLowerCase().includes(termo) ||
                t.categoria.toLowerCase().includes(termo)
            );
        }

        lista.innerHTML = '';
        if (trilhas.length === 0) {
            lista.innerHTML = '<div class="trilhas-disponiveis-vazia">Nenhuma trilha encontrada.</div>';
            return;
        }

        trilhas.forEach(trilha => {
            const item = document.createElement('div');
            item.className = 'trilha-disponivel-item';
            item.innerHTML = `
                <div class="trilha-disponivel-cabecalho">
                    <div class="trilha-disponivel-info">
                        <span class="trilha-disponivel-nome">${trilha.nome}</span>
                        <span class="trilha-disponivel-seta">▼</span>
                    </div>
                </div>
                <div class="trilha-disponivel-conteudo">
                    <div class="trilha-disponivel-conteudo-interno">
                        <p><strong>Categoria:</strong> ${trilha.categoria}</p>
                        <p>${trilha.descricao}</p>
                        <div class="trilha-disponivel-botoes">
                            <button class="botao-seguir-trilha" data-id="${trilha.id}">Seguir Trilha</button>
                        </div>
                    </div>
                </div>
            `;

            const cabecalho = item.querySelector('.trilha-disponivel-cabecalho');
            cabecalho.addEventListener('click', () => {
                item.classList.toggle('expandida');
            });

            const btnSeguir = item.querySelector('.botao-seguir-trilha');
            btnSeguir.addEventListener('click', (e) => {
                e.stopPropagation();
                this.selecionarTrilha(trilha.id);
            });

            lista.appendChild(item);
        });
    }

    selecionarTrilha(id) {
        const trilha = this.catalogoTrilhas.find(t => t.id === id);
        if (!trilha) return;
        this.trilhaAtiva = trilha;
        this.fecharModalTrilhas();
        this.renderizarTrilhaAtiva();
        this.renderizarPerks();
        this.atualizarCampoTrilha();
        this.mostrarMensagem(`Trilha "${trilha.nome}" selecionada!`, 'success');
    }

    abrirModalPerks() {
        const modal = document.getElementById('modal-perks');
        if (modal) {
            modal.classList.add('aberto');
            document.getElementById('perks-busca').value = '';
            this.carregarPerksDisponiveis('');
        }
    }

    fecharModalPerks() {
        document.getElementById('modal-perks').classList.remove('aberto');
    }

    carregarPerksDisponiveis(filtro = '') {
        const lista = document.getElementById('perks-disponiveis-lista');
        if (!lista) return;

        let perks = [...this.catalogoPerks];

        if (filtro) {
            const termo = filtro.toLowerCase();
            perks = perks.filter(p =>
                p.nome.toLowerCase().includes(termo) ||
                p.descricao.toLowerCase().includes(termo)
            );
        }

        const idsSelecionadas = this.perksSelecionadas.map(p => p.id);

        const perksDisponiveis = [];
        const perksBloqueadas = [];
        const perksSelecionadas = [];

        perks.forEach(perk => {
            const jaSelecionada = idsSelecionadas.includes(perk.id);
            
            if (jaSelecionada) {
                perksSelecionadas.push(perk);
                return;
            }

            let bloqueada = false;
            if (perk.necessita) {
                if (!this.trilhaAtiva || this.trilhaAtiva.id !== perk.necessita) {
                    bloqueada = true;
                }
            }

            if (bloqueada) {
                perksBloqueadas.push(perk);
            } else {
                perksDisponiveis.push(perk);
            }
        });

        perksDisponiveis.sort((a, b) => a.nome.localeCompare(b.nome));
        perksBloqueadas.sort((a, b) => a.nome.localeCompare(b.nome));
        perksSelecionadas.sort((a, b) => a.nome.localeCompare(b.nome));

        const perksOrdenadas = [...perksDisponiveis, ...perksBloqueadas, ...perksSelecionadas];

        lista.innerHTML = '';
        if (perksOrdenadas.length === 0) {
            lista.innerHTML = '<div class="perks-disponiveis-vazia">Nenhuma perk encontrada.</div>';
            return;
        }

        perksOrdenadas.forEach(perk => {
            const jaSelecionada = idsSelecionadas.includes(perk.id);
            
            let bloqueada = false;
            let textoBotao = 'Adicionar Perk';
            let nomeTrilhaRequerida = '';

            if (perk.necessita) {
                if (!this.trilhaAtiva || this.trilhaAtiva.id !== perk.necessita) {
                    bloqueada = true;
                    const trilhaReq = this.catalogoTrilhas.find(t => t.id === perk.necessita);
                    nomeTrilhaRequerida = trilhaReq ? trilhaReq.nome : 'trilha específica';
                    textoBotao = `Depende de ${nomeTrilhaRequerida}`;
                }
            }

            const descricaoComCusto = perk.custo > 0 
                ? `${perk.descricao} (Custo: ${perk.custo} PD)` 
                : perk.descricao;

            const item = document.createElement('div');
            item.className = 'perk-disponivel-item';
            if (bloqueada) item.classList.add('bloqueado');
            if (jaSelecionada) item.classList.add('selecionado');

            item.innerHTML = `
                <div class="perk-disponivel-cabecalho">
                    <div class="perk-disponivel-info">
                        <span class="perk-disponivel-nome">${perk.nome}</span>
                        ${jaSelecionada ? '<span class="perk-disponivel-status">✓ Adicionada</span>' : ''}
                        <span class="perk-disponivel-seta">▼</span>
                    </div>
                </div>
                <div class="perk-disponivel-conteudo">
                    <div class="perk-disponivel-conteudo-interno">
                        <p>${descricaoComCusto}</p>
                        <div class="perk-disponivel-botoes">
                            <button class="botao-adicionar-perk-modal" data-id="${perk.id}" ${jaSelecionada ? 'disabled' : ''} ${bloqueada ? 'disabled' : ''}>
                                ${jaSelecionada ? 'Já Adicionada' : textoBotao}
                            </button>
                        </div>
                    </div>
                </div>
            `;

            const cabecalho = item.querySelector('.perk-disponivel-cabecalho');
            cabecalho.addEventListener('click', () => {
                item.classList.toggle('expandida');
            });

            const btnAdd = item.querySelector('.botao-adicionar-perk-modal');
            if (!bloqueada && !jaSelecionada) {
                btnAdd.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.adicionarPerk(perk.id);
                });
            }

            lista.appendChild(item);
        });
    }

    adicionarPerk(id) {
        const perk = this.catalogoPerks.find(p => p.id === id);
        if (!perk) return;

        if (this.perksSelecionadas.some(p => p.id === id)) {
            this.mostrarMensagem('Perk já adicionada.', 'info');
            return;
        }

        if (perk.necessita) {
            if (!this.trilhaAtiva || this.trilhaAtiva.id !== perk.necessita) {
                this.mostrarMensagem('Esta perk requer uma trilha específica.', 'error');
                return;
            }
        }

        this.perksSelecionadas.push(perk);
        this.renderizarPerks();
        if (document.getElementById('modal-perks').classList.contains('aberto')) {
            this.carregarPerksDisponiveis(document.getElementById('perks-busca').value);
        }
        this.mostrarMensagem(`Perk "${perk.nome}" adicionada!`, 'success');
    }

    mostrarMensagem(texto, tipo = 'info') {
        document.querySelectorAll('.mensagem-trilha').forEach(msg => msg.remove());

        const mensagem = document.createElement('div');
        mensagem.className = `mensagem-trilha mensagem-${tipo}`;
        mensagem.textContent = texto;
        mensagem.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: ${tipo === 'success' ? 'var(--primary)' : tipo === 'error' ? 'var(--danger)' : '#666'};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            z-index: 1000;
            animation: slideIn 0.3s ease;
            max-width: 300px;
            box-shadow: 0 0px 0px black;
            font-family: 'Share Tech Mono', monospace;
            font-size: 14px;
        `;
        document.body.appendChild(mensagem);

        setTimeout(() => {
            mensagem.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (document.body.contains(mensagem)) document.body.removeChild(mensagem);
            }, 300);
        }, 3000);
    }
}