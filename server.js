const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Banco de dados simulado (Usuários autorizados no painel)
const usuariosValidos = {
    "admin": { senha: "123", codigo2FA: "123456" },
    "suporte": { senha: "999", codigo2FA: "654321" }
};

// Rota principal para carregar a tela do seu index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// PASSO 1: Valida Usuário e Senha e avisa que precisa do código 2FA
app.post('/api/login/passo1', (req, res) => {
    const { user, pass } = req.body;
    
    if (usuariosValidos[user] && usuariosValidos[user].senha === pass) {
        return res.json({ requer2FA: true, mensagem: "Código enviado para o e-mail cadastrado!" });
    }
    
    res.status(401).json({ erro: "Usuário ou senha incorretos!" });
});

// PASSO 2: Valida o Código de Segurança (2FA) enviado por "e-mail"
app.post('/api/login/passo2', (req, res) => {
    const { user, codigo } = req.body;
    
    if (usuariosValidos[user] && usuariosValidos[user].codigo2FA === codigo) {
        return res.json({ sucesso: true, usuario: user });
    }
    
    res.status(401).json({ erro: "Código de segurança inválido!" });
});

// Inicializa o servidor na porta da Render
app.listen(PORT, () => {
    console.log(`[SERVIDOR]: Rodando com sucesso na porta ${PORT}`);
});
          
