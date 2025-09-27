# MoviAPI - Sistema Completo de Hub de APIs

## 🚀 Visão Geral

MoviAPI é uma plataforma completa para gerenciamento e consumo de APIs, oferecendo um hub centralizado para desenvolvedores e empresas integrarem múltiplas APIs de forma eficiente.

## ✨ Funcionalidades Principais

- **🔐 Autenticação Segura**: Sistema completo de login/registro com validação por email
- **💳 Sistema de Créditos**: Compra de créditos via Stripe para uso das APIs
- **🔑 Gerenciamento de Tokens**: Criação e gerenciamento automático de API keys
- **📊 Dashboard Completo**: Interface intuitiva para monitoramento e controle
- **📈 Histórico de Requisições**: Rastreamento detalhado de todas as chamadas de API
- **🎬 APIs Disponíveis**: 
  - Gerador de Vídeos
  - Análise de Texto
  - Gerador de QR Code
  - Síntese de Voz
  - Parser de Documentos

## 🛠️ Tecnologias Utilizadas

- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth + Edge Functions)
- **Pagamentos**: Stripe
- **Deploy**: Vite + Supabase Hosting

## 🔧 Configuração do Projeto

### Pré-requisitos
- Node.js 18+
- Conta no Supabase
- Conta no Stripe (para pagamentos)

### Instalação

1. **Clone o repositório**
```bash
git clone <repository-url>
cd moviapi
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**
```bash
# Crie o arquivo .env
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
```

4. **Execute as migrações do banco**
```bash
supabase db push
```

5. **Inicie o servidor de desenvolvimento**
```bash
npm run dev
```

## 📧 Configuração de Email

Para habilitar a validação por email:

1. **No Dashboard do Supabase**:
   - Vá para Authentication → Settings
   - Habilite "Confirm email"
   - Configure Site URL: `http://localhost:3000`
   - Adicione Redirect URL: `http://localhost:3000/auth/callback`

2. **SMTP (Opcional)**:
   - Configure SMTP personalizado ou use o padrão do Supabase

## 💳 Configuração do Stripe

1. **Crie uma conta no Stripe**
2. **Configure os produtos** com os Price IDs corretos
3. **Configure o webhook** para: `https://seu-projeto.supabase.co/functions/v1/stripe-webhook-cli`
4. **Adicione as secrets** no Supabase:
   ```bash
   supabase secrets set STRIPE_SECRET_KEY=sk_...
   supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_...
   ```

## 🚀 Deploy

### Supabase Edge Functions
```bash
supabase functions deploy stripe-checkout --no-verify-jwt
supabase functions deploy stripe-webhook-cli --no-verify-jwt
```

### Frontend
```bash
npm run build
# Deploy para sua plataforma preferida
```

## 📊 Estrutura do Banco de Dados

### Tabelas Principais
- `users`: Dados dos usuários e créditos
- `api_endpoints`: APIs disponíveis
- `api_keys`: Tokens de acesso dos usuários
- `request_history`: Histórico de requisições
- `stripe_customers`: Integração com Stripe
- `stripe_orders`: Pedidos e pagamentos

## 🔒 Segurança

- **RLS (Row Level Security)** habilitado em todas as tabelas
- **Políticas de acesso** restritivas por usuário
- **Validação de email** obrigatória
- **Tokens seguros** com hash
- **Webhook verification** para Stripe

## 📖 Documentação da API

A documentação completa das APIs está disponível na seção "Documentation" do dashboard.

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🆘 Suporte

Para suporte, abra uma issue no GitHub ou entre em contato através do dashboard da aplicação.

---

**MoviAPI** - Simplificando a integração de APIs para desenvolvedores e empresas. 🚀
