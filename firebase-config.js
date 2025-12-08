// 🔥 FIREBASE CONFIG v9 (MODULAR) - USE ESTA! 🔥

// Importar as funções do Firebase v9
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getDatabase, ref, set, get, onValue } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

// Sua configuração (você já tem!)
const firebaseConfig = {
  apiKey: "AIzaSyDl1UQNVkqNQ3T9szZd9gZdq4JtFbODCT4",
  authDomain: "o-rpg-ai.firebaseapp.com",
  databaseURL: "https://o-rpg-ai-default-rtdb.firebaseio.com",
  projectId: "o-rpg-ai",
  storageBucket: "o-rpg-ai.firebasestorage.app",
  messagingSenderId: "173674779968",
  appId: "1:173674779968:web:2826adc98eb75a287c96a5"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);
const provider = new GoogleAuthProvider();

// Variáveis globais
let usuarioLogado = null;
let usuarioUID = null;

// ==================================
// FUNÇÕES DE LOGIN/LOGOUT
// ==================================

async function fazerLogin() {
    try {
        const result = await signInWithPopup(auth, provider);
        console.log("✅ Login bem-sucedido:", result.user.displayName);
    } catch (error) {
        console.error("❌ Erro no login:", error);
        alert("Erro ao fazer login: " + error.message);
    }
}

async function fazerLogout() {
    try {
        await signOut(auth);
        console.log("✅ Logout realizado");
        usuarioLogado = null;
        usuarioUID = null;
        atualizarInterfaceLogin(false);
        carregarDados(); // Voltar para ficha local
    } catch (error) {
        console.error("❌ Erro no logout:", error);
    }
}

// ==================================
// ATUALIZAR INTERFACE DE LOGIN
// ==================================

function atualizarInterfaceLogin(logado, nome = null, foto = null) {
    const loginStatus = document.getElementById('login-status');
    const userInfo = document.getElementById('user-info');
    const userName = document.getElementById('user-name');
    const userPhoto = document.getElementById('user-photo');
    const btnLogin = document.getElementById('btn-login');
    const btnLogout = document.getElementById('btn-logout');
    
    if (!btnLogin && !logado) {
        // Ainda não carregou o DOM, tentar novamente
        setTimeout(() => atualizarInterfaceLogin(logado, nome, foto), 100);
        return;
    }
    
    if (logado) {
        if (loginStatus) loginStatus.classList.add('hidden');
        if (userInfo) {
            userInfo.classList.remove('hidden');
            if (nome) userName.textContent = nome.split(' ')[0];
            if (foto) userPhoto.src = foto;
        }
        if (btnLogout) btnLogout.onclick = fazerLogout;
    } else {
        if (loginStatus) loginStatus.classList.remove('hidden');
        if (userInfo) userInfo.classList.add('hidden');
        if (btnLogin) btnLogin.onclick = fazerLogin;
    }
}

// ==================================
// SALVAR FICHA NO FIREBASE
// ==================================

async function salvarFichaNoFirebase(dadosFicha) {
    if (!usuarioUID) {
        console.log("⚠️ Usuário não logado, salvando localmente");
        salvarDadosLocal(dadosFicha);
        return;
    }
    
    try {
        // Adicionar metadados
        const fichaCompleta = {
            ...dadosFicha,
            dono: usuarioUID,
            ultimaAtualizacao: Date.now(),
            nomeDono: usuarioLogado?.displayName || "Anônimo",
            fotoDono: usuarioLogado?.photoURL || ""
        };
        
        // Salvar no Firebase
        await set(ref(database, `fichas/${usuarioUID}`), fichaCompleta);
        console.log("✅ Ficha salva no Firebase!");
        
        // Backup local
        salvarDadosLocal(dadosFicha);
        
    } catch (error) {
        console.error("❌ Erro ao salvar no Firebase:", error);
        salvarDadosLocal(dadosFicha);
    }
}

// ==================================
// CARREGAR FICHA DO FIREBASE
// ==================================

async function carregarFichaDoFirebase() {
    if (!usuarioUID) {
        console.log("⚠️ Usuário não logado, carregando local");
        carregarDados();
        return;
    }
    
    try {
        const snapshot = await get(ref(database, `fichas/${usuarioUID}`));
        
        if (snapshot.exists()) {
            const dadosFirebase = snapshot.val();
            console.log("✅ Ficha carregada do Firebase");
            
            // Salvar localmente como cache
            localStorage.setItem('fichaRPG', JSON.stringify(dadosFirebase));
            
            // Recarregar a página com os novos dados
            if (!window.jaRecarregou) {
                window.jaRecarregou = true;
                location.reload();
            }
        } else {
            console.log("📭 Nenhuma ficha salva no Firebase");
            carregarDados();
        }
    } catch (error) {
        console.error("❌ Erro ao carregar do Firebase:", error);
        carregarDados();
    }
}

// ==================================
// ESCUTAR MUDANÇAS EM TEMPO REAL
// ==================================

function escutarMudancasTempoReal() {
    if (!usuarioUID) return;
    
    const fichaRef = ref(database, `fichas/${usuarioUID}`);
    
    onValue(fichaRef, (snapshot) => {
        if (snapshot.exists()) {
            const dados = snapshot.val();
            
            // Não atualizar se fomos nós que salvamos
            if (!window.foiEuQueSalvei) {
                console.log("🔄 Dados atualizados em tempo real");
                localStorage.setItem('fichaRPG', JSON.stringify(dados));
                
                // Atualizar a página sem recarregar
                if (typeof carregarDados === 'function') {
                    carregarDados();
                }
            }
            window.foiEuQueSalvei = false;
        }
    });
}

// ==================================
// FUNÇÕES AUXILIARES
// ==================================

function salvarDadosLocal(dados) {
    localStorage.setItem('fichaRPG', JSON.stringify(dados));
}

// ==================================
// INICIALIZAR FIREBASE
// ==================================

function inicializarFirebase() {
    // Escutar mudanças de autenticação
    onAuthStateChanged(auth, (user) => {
        if (user) {
            usuarioLogado = user;
            usuarioUID = user.uid;
            console.log("✅ Usuário logado:", user.displayName);
            
            atualizarInterfaceLogin(true, user.displayName, user.photoURL);
            carregarFichaDoFirebase();
            escutarMudancasTempoReal();
        } else {
            console.log("🔒 Usuário não logado");
            usuarioLogado = null;
            usuarioUID = null;
            atualizarInterfaceLogin(false);
        }
    });
    
    // Configurar botões de login/logout
    document.addEventListener('DOMContentLoaded', () => {
        const btnLogin = document.getElementById('btn-login');
        const btnLogout = document.getElementById('btn-logout');
        
        if (btnLogin) btnLogin.onclick = fazerLogin;
        if (btnLogout) btnLogout.onclick = fazerLogout;
    });
}

// Iniciar o Firebase
inicializarFirebase();

// Exportar funções para uso em outros arquivos
window.fazerLogin = fazerLogin;
window.fazerLogout = fazerLogout;
window.salvarFichaNoFirebase = salvarFichaNoFirebase;
