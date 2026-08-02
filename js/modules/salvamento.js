(function() {
    'use strict';

    function coletarDados() {
        const dados = {};

        const atributos = {};
        document.querySelectorAll('.atributo-item').forEach(item => {
            const sigla = item.querySelector('.atributo-sigla')?.textContent.trim();
            const input = item.querySelector('input[type="number"]');
            if (sigla && input) {
                atributos[sigla] = parseInt(input.value) || 0;
            }
        });
        const expInput = document.querySelector('.input-porcentagem input[type="number"]');
        if (expInput) {
            atributos.EXP = parseInt(expInput.value) || 0;
        }
        dados.atributos = atributos;

        if (window.barrasRPG) {
            dados.barras = {
                vida: {
                    atual: window.barrasRPG.vida.getValorAtual(),
                    maximo: window.barrasRPG.vida.getValorMaximo()
                },
                sanidade: {
                    atual: window.barrasRPG.sanidade.getValorAtual(),
                    maximo: window.barrasRPG.sanidade.getValorMaximo()
                },
                desejo: {
                    atual: window.barrasRPG.desejo.getValorAtual(),
                    maximo: window.barrasRPG.desejo.getValorMaximo()
                }
            };
        }

        if (window.sistemaPericias) {
            const pericias = {};
            window.sistemaPericias.pericias.forEach(p => {
                pericias[p.nome] = p.valor;
            });
            dados.pericias = pericias;
        }

        if (window.sistemaInventario) {
            dados.inventario = window.sistemaInventario.itens;
        }

        if (window.sistemaDados) {
            dados.historicoDados = window.sistemaDados.getHistorico();
        }

        if (window.sistemaConfiguracoes) {
            dados.configuracoes = {
                corPrimaria: window.sistemaConfiguracoes.corPrimaria,
                corSelecionadaNome: window.sistemaConfiguracoes.corSelecionadaNome
            };
        }

        if (window.sistemaTrilhasPerks) {
            dados.trilhas = {
                trilhaAtiva: window.sistemaTrilhasPerks.trilhaAtiva,
                perksSelecionadas: window.sistemaTrilhasPerks.perksSelecionadas
            };
        }

        const condicoes = {};
        document.querySelectorAll('.status input[type="checkbox"]').forEach(cb => {
            const label = cb.closest('label');
            if (label) {
                const nome = label.textContent.trim();
                condicoes[nome] = cb.checked;
            }
        });
        dados.condicoes = condicoes;

        const infoGerais = {};
        const nomeInput = document.querySelector('input[placeholder="Nome do personagem"]');
        if (nomeInput) infoGerais.nomePersonagem = nomeInput.value;
        const jogadorInput = document.querySelector('input[placeholder="Nome do jogador"]');
        if (jogadorInput) infoGerais.nomeJogador = jogadorInput.value;
        const idadeInput = document.querySelector('input[placeholder="Idade"]');
        if (idadeInput) infoGerais.idade = idadeInput.value;
        const generoInput = document.querySelector('input[placeholder="Gênero"]');
        if (generoInput) infoGerais.genero = generoInput.value;
        const trilhaInput = document.getElementById('trilha-principal');
        if (trilhaInput) infoGerais.trilhaPrincipal = trilhaInput.value;
        const movimentoInput = document.querySelector('.campo-md:first-child input');
        const defesaInput = document.querySelector('.campo-md:last-child input');
        if (movimentoInput) infoGerais.movimento = movimentoInput.value;
        if (defesaInput) infoGerais.defesa = defesaInput.value;
        dados.infoGerais = infoGerais;

        const fotoImg = document.getElementById('foto-personagem');
        if (fotoImg && fotoImg.src && !fotoImg.src.includes('via.placeholder.com')) {
            dados.foto = fotoImg.src;
        }

        dados.dataSalvamento = new Date().toISOString();
        dados.versao = '1.0';
        return dados;
    }

    function restaurarDados(dados) {
        if (!dados) return;

        if (dados.atributos) {
            document.querySelectorAll('.atributo-item').forEach(item => {
                const sigla = item.querySelector('.atributo-sigla')?.textContent.trim();
                const input = item.querySelector('input[type="number"]');
                if (sigla && input && dados.atributos[sigla] !== undefined) {
                    input.value = dados.atributos[sigla];
                    input.dispatchEvent(new Event('change', { bubbles: true }));
                }
            });
            const expInput = document.querySelector('.input-porcentagem input[type="number"]');
            if (expInput && dados.atributos.EXP !== undefined) {
                expInput.value = dados.atributos.EXP;
                expInput.dispatchEvent(new Event('change', { bubbles: true }));
            }
        }

        if (dados.barras && window.barrasRPG) {
            if (dados.barras.vida) {
                window.barrasRPG.vida.setValores(
                    dados.barras.vida.atual,
                    dados.barras.vida.maximo
                );
            }
            if (dados.barras.sanidade) {
                window.barrasRPG.sanidade.setValores(
                    dados.barras.sanidade.atual,
                    dados.barras.sanidade.maximo
                );
            }
            if (dados.barras.desejo) {
                window.barrasRPG.desejo.setValores(
                    dados.barras.desejo.atual,
                    dados.barras.desejo.maximo
                );
            }
        }

        if (dados.pericias && window.sistemaPericias) {
            window.sistemaPericias.pericias.forEach(p => {
                p.valor = p.valorBase || 0;
            });
            
            window.sistemaPericias.pericias.forEach(p => {
                if (dados.pericias[p.nome] !== undefined) {
                    p.valor = dados.pericias[p.nome];
                }
            });
            
            window.sistemaPericias.recalcularTodasCapacidades();
            window.sistemaPericias.atualizarCapacidadesNaInterface();
            
            const valoresSalvos = {};
            window.sistemaPericias.pericias.forEach(p => {
                valoresSalvos[p.nome] = p.valor;
            });
            localStorage.setItem('periciasRPG', JSON.stringify(valoresSalvos));
        }

        if (dados.inventario && window.sistemaInventario) {
            window.sistemaInventario.itens = dados.inventario;
            window.sistemaInventario.salvarItens();
            window.sistemaInventario.carregarListaItens();
            window.sistemaInventario.atualizarResumo();
        }

        if (dados.historicoDados && window.sistemaDados) {
            window.sistemaDados.historico = dados.historicoDados;
            window.sistemaDados.salvarHistorico();
            if (window.sistemaDadosPersonalizados) {
                window.sistemaDadosPersonalizados.carregarHistorico();
            }
        }

        if (dados.configuracoes && window.sistemaConfiguracoes) {
            if (dados.configuracoes.corPrimaria) {
                window.sistemaConfiguracoes.mudarCorPrimaria(
                    dados.configuracoes.corPrimaria,
                    dados.configuracoes.corSelecionadaNome || 'Personalizada'
                );
            }
        }

        if (dados.trilhas && window.sistemaTrilhasPerks) {
            window.sistemaTrilhasPerks.trilhaAtiva = dados.trilhas.trilhaAtiva || null;
            window.sistemaTrilhasPerks.perksSelecionadas = dados.trilhas.perksSelecionadas || [];
            window.sistemaTrilhasPerks.renderizarTrilhaAtiva();
            window.sistemaTrilhasPerks.renderizarPerks();
        }

        if (dados.condicoes) {
            document.querySelectorAll('.status input[type="checkbox"]').forEach(cb => {
                const label = cb.closest('label');
                if (label) {
                    const nome = label.textContent.trim();
                    if (dados.condicoes[nome] !== undefined) {
                        cb.checked = dados.condicoes[nome];
                        cb.dispatchEvent(new Event('change', { bubbles: true }));
                    }
                }
            });
        }

        if (dados.infoGerais) {
            const nomeInput = document.querySelector('input[placeholder="Nome do personagem"]');
            if (nomeInput && dados.infoGerais.nomePersonagem !== undefined) {
                nomeInput.value = dados.infoGerais.nomePersonagem;
            }
            const jogadorInput = document.querySelector('input[placeholder="Nome do jogador"]');
            if (jogadorInput && dados.infoGerais.nomeJogador !== undefined) {
                jogadorInput.value = dados.infoGerais.nomeJogador;
            }
            const idadeInput = document.querySelector('input[placeholder="Idade"]');
            if (idadeInput && dados.infoGerais.idade !== undefined) {
                idadeInput.value = dados.infoGerais.idade;
            }
            const generoInput = document.querySelector('input[placeholder="Gênero"]');
            if (generoInput && dados.infoGerais.genero !== undefined) {
                generoInput.value = dados.infoGerais.genero;
            }
            const trilhaInput = document.getElementById('trilha-principal');
            if (trilhaInput && dados.infoGerais.trilhaPrincipal !== undefined) {
                trilhaInput.textContent = dados.infoGerais.trilhaPrincipal;
            }
            const movimentoInput = document.querySelector('.campo-md:first-child input');
            if (movimentoInput && dados.infoGerais.movimento !== undefined) {
                movimentoInput.value = dados.infoGerais.movimento;
            }
            const defesaInput = document.querySelector('.campo-md:last-child input');
            if (defesaInput && dados.infoGerais.defesa !== undefined) {
                defesaInput.value = dados.infoGerais.defesa;
            }
        }

        if (dados.foto) {
            const fotoImg = document.getElementById('foto-personagem');
            if (fotoImg) {
                fotoImg.src = dados.foto;
                try {
                    localStorage.setItem('fotoPersonagem', dados.foto);
                } catch (e) {
                    console.warn('Erro ao salvar foto no localStorage:', e);
                }
            }
        }

        if (window.sistemaTamanho) {
            window.sistemaTamanho.atualizarCalculos();
        }
        if (window.sistemaInventario) {
            window.sistemaInventario.atualizarResumo();
        }
        
        forcarAtualizacaoCores();
    }

    function resetarAtributosParaPadrao() {
        const valoresPadrao = {
            'FOR': 1,
            'DES': 1,
            'INT': 1,
            'CON': 1,
            'POD': 1,
            'PRE': 1,
            'SOR': 1,
            'TAM': 0,
            'EXP': 0
        };

        document.querySelectorAll('.atributo-item').forEach(item => {
            const sigla = item.querySelector('.atributo-sigla')?.textContent.trim();
            const input = item.querySelector('input[type="number"]');
            if (sigla && input && valoresPadrao[sigla] !== undefined) {
                input.value = valoresPadrao[sigla];
                input.dispatchEvent(new Event('change', { bubbles: true }));
            }
        });

        const expInput = document.querySelector('.input-porcentagem input[type="number"]');
        if (expInput) {
            expInput.value = 0;
            expInput.dispatchEvent(new Event('change', { bubbles: true }));
        }
    }

    function resetarTodosOsSistemas() {
        resetarAtributosParaPadrao();

        if (window.sistemaPericias && typeof window.sistemaPericias.resetarParaValoresBase === 'function') {
            window.sistemaPericias.resetarParaValoresBase();
        }

        if (window.barrasRPG) {
            if (window.barrasRPG.vida) {
                window.barrasRPG.vida.setValorMaximo(10);
                window.barrasRPG.vida.setValorAtual(10);
            }
            if (window.barrasRPG.sanidade) {
                window.barrasRPG.sanidade.setValorMaximo(100);
                window.barrasRPG.sanidade.setValorAtual(100);
            }
            if (window.barrasRPG.desejo) {
                window.barrasRPG.desejo.setValorMaximo(10);
                window.barrasRPG.desejo.setValorAtual(10);
            }
        }

        if (window.sistemaInventario) {
            window.sistemaInventario.itens = [];
            if (typeof window.sistemaInventario.salvarItens === 'function') {
                window.sistemaInventario.salvarItens();
            }
            if (typeof window.sistemaInventario.carregarListaItens === 'function') {
                window.sistemaInventario.carregarListaItens();
            }
            if (typeof window.sistemaInventario.atualizarResumo === 'function') {
                window.sistemaInventario.atualizarResumo();
            }
        }

        if (window.sistemaDados) {
            window.sistemaDados.historico = [];
            if (typeof window.sistemaDados.salvarHistorico === 'function') {
                window.sistemaDados.salvarHistorico();
            }
            if (window.sistemaDadosPersonalizados && typeof window.sistemaDadosPersonalizados.carregarHistorico === 'function') {
                window.sistemaDadosPersonalizados.carregarHistorico();
            }
        }

        if (window.sistemaTrilhasPerks) {
            window.sistemaTrilhasPerks.trilhaAtiva = null;
            window.sistemaTrilhasPerks.perksSelecionadas = [];
            if (typeof window.sistemaTrilhasPerks.renderizarTrilhaAtiva === 'function') {
                window.sistemaTrilhasPerks.renderizarTrilhaAtiva();
            }
            if (typeof window.sistemaTrilhasPerks.renderizarPerks === 'function') {
                window.sistemaTrilhasPerks.renderizarPerks();
            }
        }

        document.querySelectorAll('input[placeholder="Nome do personagem"]').forEach(el => el.value = '');
        document.querySelectorAll('input[placeholder="Nome do jogador"]').forEach(el => el.value = '');
        document.querySelectorAll('input[placeholder="Idade"]').forEach(el => el.value = '');
        document.querySelectorAll('input[placeholder="Gênero"]').forEach(el => el.value = '');
        document.querySelectorAll('.campo-md input[type="number"]').forEach(el => el.value = '0');
        
        document.querySelectorAll('.status input[type="checkbox"]').forEach(cb => {
            cb.checked = false;
            cb.dispatchEvent(new Event('change', { bubbles: true }));
        });

        const trilhaInput = document.getElementById('trilha-principal');
        if (trilhaInput) trilhaInput.textContent = '';

        const fotoImg = document.getElementById('foto-personagem');
        if (fotoImg) {
            fotoImg.src = 'https://via.placeholder.com/150';
        }
        localStorage.removeItem('fotoPersonagem');

        localStorage.removeItem('fichaCompleta');
        localStorage.removeItem('periciasRPG');
        localStorage.removeItem('inventarioRPG');
        localStorage.removeItem('historicoDados');
        localStorage.removeItem('corPrimaria');
    }

    function forcarAtualizacaoCores() {
        if (window.sistemaConfiguracoes) {
            setTimeout(() => {
                window.sistemaConfiguracoes.aplicarCorTextoBotao();
            }, 100);
        }
    }

    let timeoutSalvar = null;

    function salvarCompleto() {
        try {
            const dados = coletarDados();
            localStorage.setItem('fichaCompleta', JSON.stringify(dados));
        } catch (e) {
            console.error('Erro ao salvar ficha automaticamente:', e);
        }
    }

    function agendarSalvamento() {
        if (timeoutSalvar) clearTimeout(timeoutSalvar);
        timeoutSalvar = setTimeout(salvarCompleto, 500);
    }

    function baixarFicha() {
        try {
            const dados = coletarDados();
            const jsonStr = JSON.stringify(dados, null, 2);
            const blob = new Blob([jsonStr], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            const link = document.createElement('a');
            link.href = url;
            const nomePersonagem = document.querySelector('input[placeholder="Nome do personagem"]')?.value || 'ficha';
            link.download = `${nomePersonagem}_ficha.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            
            mostrarMensagem('Ficha exportada com sucesso.', 'success');
        } catch (e) {
            console.error('Erro ao exportar ficha:', e);
            mostrarMensagem('Erro ao exportar ficha.', 'error');
        }
    }

    function criarInputUpload() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.style.display = 'none';
        
        input.addEventListener('change', function(e) {
            const file = this.files[0];
            if (!file) return;
            
            const reader = new FileReader();
            reader.onload = function(event) {
                try {
                    const dados = JSON.parse(event.target.result);
                    restaurarDados(dados);
                    mostrarMensagem('Ficha carregada com sucesso.', 'success');
                } catch (error) {
                    console.error('Erro ao ler arquivo:', error);
                    mostrarMensagem('Arquivo inválido ou corrompido.', 'error');
                }
            };
            reader.readAsText(file);
            this.value = '';
        });
        
        document.body.appendChild(input);
        return input;
    }

    let inputUpload = null;

    function carregarDeArquivo() {
        if (!inputUpload) {
            inputUpload = criarInputUpload();
        }
        inputUpload.click();
    }

    async function limparDados() {
        const modalConfirmacao = window.ModalConfirmacao || await import('./modal-confirmacao.js').then(m => m.ModalConfirmacao);
        
        if (modalConfirmacao) {
            const confirmado = await modalConfirmacao.confirmar(
                'Deletar Dados',
                'Tem certeza que deseja apagar todos os dados salvos da ficha? Esta ação não pode ser desfeita.',
                'Deletar',
                'Cancelar'
            );
            if (confirmado) {
                resetarTodosOsSistemas();
                mostrarMensagem('Todos os dados foram resetados com sucesso!', 'success');
                setTimeout(() => {
                    location.reload();
                }, 500);
            }
        } else {
            if (confirm('Tem certeza que deseja apagar todos os dados salvos da ficha? Esta ação não pode ser desfeita.')) {
                resetarTodosOsSistemas();
                setTimeout(() => {
                    location.reload();
                }, 500);
                mostrarMensagem('Dados removidos. A página será recarregada.', 'info');
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

    function configurarEventosAutomaticos() {
        document.addEventListener('input', (e) => {
            if (e.target.matches('input[type="text"], input[type="number"]')) {
                agendarSalvamento();
            }
        });

        document.addEventListener('change', (e) => {
            if (e.target.matches('input[type="checkbox"]')) {
                agendarSalvamento();
            }
        });

        document.addEventListener('atributoAlterado', agendarSalvamento);
        document.addEventListener('valorAlterado', agendarSalvamento);
        document.addEventListener('maximoAlterado', agendarSalvamento);
        document.addEventListener('cargaAtualizada', agendarSalvamento);

        document.addEventListener('input', (e) => {
            if (e.target.classList.contains('pericia-valor')) {
                agendarSalvamento();
            }
        });

        document.addEventListener('click', (e) => {
            if (e.target.closest('#salvar-item') || e.target.closest('.botao-remover')) {
                agendarSalvamento();
            }
        });

        document.addEventListener('abaMudou', () => {
            setTimeout(agendarSalvamento, 100);
        });

        window.addEventListener('beforeunload', () => {
            salvarCompleto();
        });
    }

    function adicionarBotoesConfig() {
        const observer = new MutationObserver(() => {
            const configConteudo = document.querySelector('.config-conteudo');
            if (configConteudo && !document.getElementById('botoes-salvar')) {
                const secao = document.createElement('div');
                secao.className = 'config-secao';
                secao.id = 'botoes-salvar';
                secao.innerHTML = `
                    <h3 class="config-titulo">Gerenciar Ficha</h3>
                    <p class="config-descricao">Salvamento automático ativado. Exporte ou importe sua ficha.</p>
                    <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                        <button id="btn-baixar-ficha" class="botao-salvar" style="background: var(--primary); color: var(--button-text-color); border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-family: inherit;">Baixar Ficha</button>
                        <button id="btn-carregar-arquivo" class="botao-salvar" style="background: #444; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-family: inherit;">Carregar Ficha</button>
                        <button id="btn-limpar-dados" class="botao-salvar" style="background: #d32f2f; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-family: inherit;">Deletar Dados</button>
                    </div>
                `;
                configConteudo.appendChild(secao);

                document.getElementById('btn-baixar-ficha').addEventListener('click', baixarFicha);
                document.getElementById('btn-carregar-arquivo').addEventListener('click', carregarDeArquivo);
                document.getElementById('btn-limpar-dados').addEventListener('click', limparDados);

                const dadosStr = localStorage.getItem('fichaCompleta');
                if (dadosStr) {
                    try {
                        const dados = JSON.parse(dadosStr);
                        restaurarDados(dados);
                        console.log('Ficha carregada automaticamente do localStorage.');
                    } catch (e) {
                        console.warn('Erro ao carregar ficha automaticamente:', e);
                    }
                }

                observer.disconnect();
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            adicionarBotoesConfig();
            configurarEventosAutomaticos();
        });
    } else {
        adicionarBotoesConfig();
        configurarEventosAutomaticos();
    }

    window.salvarFichaCompleta = salvarCompleto;
    window.carregarFichaCompleta = carregarDeArquivo;
    window.baixarFicha = baixarFicha;
    window.limparDadosSalvos = limparDados;
    window.resetarAtributosParaPadrao = resetarAtributosParaPadrao;
    window.resetarTodosOsSistemas = resetarTodosOsSistemas;
})();