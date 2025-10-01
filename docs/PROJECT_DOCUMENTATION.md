# Documentação Completa da Aplicação MoviAPI

## 1. Visão Geral da Arquitetura

A MoviAPI é uma plataforma completa para gerenciamento e consumo de APIs, oferecendo um hub centralizado para desenvolvedores e empresas integrarem múltiplas APIs de forma eficiente.

**Arquitetura:**
- **Frontend**: SPA React + TypeScript com Vite como build tool
- **Backend**: Supabase (PostgreSQL + Auth + Edge Functions)
- **Pagamentos**: Stripe para sistema de créditos
- **Estilização**: Tailwind CSS

## 2. Estrutura de Pastas e Arquivos

```
MOVI-1/
├── package.json              # Dependências e scripts do Vite
├── vite.config.ts           # Configuração do Vite
├── tailwind.config.js       # Configuração do Tailwind CSS
├── tsconfig.json            # Configuração principal do TypeScript
├── tsconfig.app.json        # Configuração TypeScript para app
├── tsconfig.node.json       # Configuração TypeScript para Node.js
├── postcss.config.js        # Configuração do PostCSS
├── eslint.config.js         # Configuração do ESLint
├── README.md                # Documentação principal
├── docs/                    # Documentação do projeto
│   ├── PROJECT_DOCUMENTATION.md
│   ├── EMAIL_CUSTOMIZATION.md
│   └── TROUBLESHOOTING.md
├── scripts/                 # Scripts de setup e deploy
│   ├── setup/
│   └── deployment/
├── src/                     # Código-fonte do frontend
│   ├── main.tsx            # Ponto de entrada React
│   ├── App.tsx             # Componente principal
│   ├── index.css           # Estilos globais
│   ├── vite-env.d.ts       # Tipos do Vite
│   ├── components/         # Componentes React
│   │   ├── auth/           # Autenticação
│   │   ├── views/          # Páginas principais
│   │   ├── payments/       # Componentes de pagamento
│   │   └── debug/          # Componentes de debug
│   ├── contexts/           # Contextos React
│   ├── lib/                # Bibliotecas e utilitários
│   ├── data/               # Dados estáticos
│   └── types/              # Definições de tipos
└── supabase/               # Backend Supabase
    ├── config.toml         # Configuração do Supabase
    ├── functions/          # Edge Functions
    │   ├── stripe-checkout/
    │   └── stripe-webhook-cli/
    └── migrations/         # Migrações do banco
```

## 3. Tecnologias Utilizadas

### Frontend
- **React 18**: Framework principal
- **TypeScript**: Tipagem estática
- **Vite**: Build tool e dev server
- **Tailwind CSS**: Framework CSS utility-first
- **Lucide React**: Biblioteca de ícones

### Backend & Infraestrutura
- **Supabase**: BaaS completo
  - PostgreSQL Database
  - Authentication
  - Edge Functions (Deno)
- **Stripe**: Processamento de pagamentos

### Ferramentas de Desenvolvimento
- **ESLint**: Linting de código
- **PostCSS**: Processamento de CSS
- **Autoprefixer**: Prefixos CSS automáticos

## 4. Funcionalidades Principais

### 🔐 Sistema de Autenticação
- Registro e login com validação por email
- Recuperação de senha
- Gerenciamento de sessões

### 💳 Sistema de Créditos
- Compra de créditos via Stripe
- Múltiplos pacotes de créditos disponíveis
- Histórico de transações

### 🔑 Gerenciamento de API Keys
- Geração automática de tokens
- Gerenciamento de múltiplas chaves
- Controle de acesso por chave

### 📊 Dashboard
- Visão geral da conta
- Monitoramento de uso
- Estatísticas de consumo

### 🎬 APIs Disponíveis
- **Gerador de Vídeos**: Criação de vídeos automatizados
- **Análise de Texto**: Processamento de linguagem natural
- **Gerador de QR Code**: Criação de códigos QR
- **Síntese de Voz**: Text-to-speech
- **Parser de Documentos**: Extração de dados de documentos

### 📈 Histórico e Monitoramento
- Log detalhado de requisições
- Rastreamento de custos
- Análise de performance

## 5. Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Inicia servidor de desenvolvimento (Vite)
npm run build        # Build de produção
npm run preview      # Preview do build local
npm run lint         # Executa ESLint

# Supabase
supabase start       # Inicia ambiente local
supabase stop        # Para ambiente local
supabase db push     # Aplica migrações
supabase functions deploy <function-name>  # Deploy de functions
```

## 6. Configuração do Ambiente

### Variáveis de Ambiente (.env)
```env
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
```

### Configuração do Supabase (supabase/config.toml)
```toml
[auth]
site_url = "http://localhost:5173"  # Porta padrão do Vite
additional_redirect_urls = ["https://localhost:5173"]

[edge_functions]
verify_jwt = false  # Para webhooks do Stripe
```

### Segredos do Supabase
```bash
supabase secrets set STRIPE_SECRET_KEY=sk_...
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_...
```

## 7. APIs e Endpoints

### Frontend → Supabase
Todas as operações do frontend são feitas através do cliente Supabase (`src/lib/supabase.ts`):

- `signUp()`: Registro de usuário
- `signIn()`: Login
- `signOut()`: Logout
- `getCurrentUser()`: Dados do usuário atual
- `getApiEndpoints()`: Lista de APIs disponíveis
- `getUserApiKeys()`: Chaves do usuário
- `createApiKey()`: Criação de nova chave
- `getUserHistory()`: Histórico de uso

### Edge Functions
**`POST /functions/v1/stripe-checkout`**
- Cria sessão de pagamento no Stripe
- Requer autenticação JWT
- Retorna URL de checkout

**`POST /functions/v1/stripe-webhook-cli`**
- Processa webhooks do Stripe
- Atualiza créditos do usuário
- Valida assinatura do webhook

## 8. Fluxos Principais

### Fluxo de Autenticação
1. Usuário se registra → Supabase Auth
2. Email de confirmação enviado
3. Usuário confirma → Callback de auth
4. Trigger cria perfil na tabela `users`
5. Contexto React atualizado

### Fluxo de Compra de Créditos
1. Usuário seleciona pacote
2. Frontend chama Edge Function
3. Stripe Checkout Session criada
4. Usuário completa pagamento
5. Webhook atualiza créditos no banco

### Fluxo de Uso de API
1. Requisição com API key
2. Validação da chave
3. Verificação de créditos
4. Processamento da requisição
5. Débito de créditos
6. Log no histórico

## 9. Estrutura do Banco de Dados

### Tabelas Principais
- **`auth.users`**: Autenticação (Supabase)
- **`public.users`**: Perfis e créditos
- **`public.api_endpoints`**: Catálogo de APIs
- **`public.api_keys`**: Chaves de acesso
- **`public.request_history`**: Histórico de uso
- **`public.stripe_customers`**: Integração Stripe
- **`public.stripe_orders`**: Pedidos e pagamentos

### Políticas de Segurança (RLS)
- Habilitado em todas as tabelas
- Usuários acessam apenas seus próprios dados
- Validação de ownership em todas as queries

## 10. Deploy e Produção

### Build da Aplicação
```bash
npm run build  # Gera pasta dist/ com arquivos estáticos
```

### Deploy das Edge Functions
```bash
supabase functions deploy stripe-checkout --no-verify-jwt
supabase functions deploy stripe-webhook-cli --no-verify-jwt
```

### Hospedagem
- **Frontend**: Qualquer provedor de hosting estático (Vercel, Netlify, etc.)
- **Backend**: Infraestrutura do Supabase

## 11. Monitoramento e Logs

### Supabase Dashboard
- Logs das Edge Functions
- Métricas de autenticação
- Performance do banco de dados

### Stripe Dashboard
- Status de pagamentos
- Logs de webhooks
- Métricas de receita

## 12. Troubleshooting

### Problemas Comuns
1. **Vite não inicia**: Verificar porta 5173 disponível
2. **Supabase connection**: Verificar variáveis de ambiente
3. **Stripe webhooks**: Verificar configuração de secrets
4. **Build errors**: Verificar dependências do TypeScript

### Logs Úteis
```bash
# Logs do Supabase local
supabase logs

# Logs das Edge Functions
supabase functions logs stripe-checkout

# Logs de build do Vite
npm run build
```

---

**MoviAPI** - Hub completo de APIs com React, TypeScript e Vite 🚀