// portrait-data.js
function getPortraitData() {
    const dadosSalvos = JSON.parse(localStorage.getItem('fichaRPG'));
    if (dadosSalvos) {
        return {
            nome: dadosSalvos.nomePersonagem || 'Personagem',
            vida: `${dadosSalvos.vidaAtual || 0}/${dadosSalvos.vidaMax || 0}`,
            sanidade: `${dadosSalvos.sanidadeAtual || 0}/${dadosSalvos.sanidadeMax || 0}`,
            cor: dadosSalvos.corTema || '#44aaff',
            foto: (dadosSalvos.fotosSalvas && dadosSalvos.fotosSalvas.normal) || 'https://via.placeholder.com/150'
        };
    }
    return null;
}
