// app.js

// Importa o objeto auth do nosso arquivo de configuração
import { auth } from './firebase-config.js';

// Importa as funções de autenticação necessárias da V9
// Note que estamos acessando os namespaces do global `firebase`
const { signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged } = firebase.auth;

// Obtém as funções do Vue globalmente (do script Vue importado no HTML)
const { createApp, ref } = Vue; 

// --- 1. Definição do Componente Login (Vue Component) ---
const LoginComponent = {
    template: `
        <div class="login-container">
            <div class="login-card">
                <h2>🔑 Acesso ao Sistema</h2>
                <form @submit.prevent="login">
                    
                    <div class="input-group">
                        <label for="email">E-mail</label>
                        <input type="email" id="email" v-model="email" required>
                    </div>

                    <div class="input-group">
                        <label for="password">Senha</label>
                        <input type="password" id="password" v-model="password" required>
                    </div>

                    <p v-if="error" class="error-message">{{ error }}</p>

                    <button type="submit" class="btn-login" :disabled="isLoading">
                        {{ isLoading ? 'Entrando...' : 'Entrar' }}
                    </button>
                    
                    <button type="button" class="btn-signup" @click="signup" :disabled="isLoading">
                        Criar Nova Conta
                    </button>

                </form>
            </div>
        </div>
    `,
    
    setup() {
        const email = ref('');
        const password = ref('');
        const error = ref(null);
        const isLoading = ref(false);

        const handleError = (err) => {
             // ... (o código de tratamento de erro do Firebase é o mesmo) ...
             switch (err.code) {
                case 'auth/user-not-found':
                case 'auth/wrong-password':
                    error.value = 'E-mail ou senha inválidos.';
                    break;
                case 'auth/invalid-email':
                    error.value = 'O formato do e-mail é inválido.';
                    break;
                case 'auth/weak-password':
                    error.value = 'A senha deve ter pelo menos 6 caracteres.';
                    break;
                case 'auth/email-already-in-use':
                    error.value = 'Este e-mail já está em uso.';
                    break;
                default:
                    error.value = 'Ocorreu um erro. Tente novamente.';
            }
        };

        const login = async () => {
            error.value = null;
            isLoading.value = true;
            try {
                // Usa a função importada
                await signInWithEmailAndPassword(auth, email.value, password.value);
                alert("Login realizado com sucesso! (Redirecionar)"); 
            } catch (err) {
                handleError(err);
            } finally {
                isLoading.value = false;
            }
        };

        const signup = async () => {
            error.value = null;
            isLoading.value = true;
            try {
                // Usa a função importada
                await createUserWithEmailAndPassword(auth, email.value, password.value);
                alert("Conta criada e login realizado com sucesso! (Redirecionar)"); 
            } catch (err) {
                handleError(err);
            } finally {
                isLoading.value = false;
            }
        };

        return { email, password, error, isLoading, login, signup };
    }
};

// --- 2. Criação e Montagem da Aplicação Vue ---
const app = createApp(LoginComponent);
app.mount('#app');

// Monitorar o estado de autenticação (usando a função importada)
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log("Usuário logado:", user.email);
    } else {
        console.log("Nenhum usuário logado.");
    }
});