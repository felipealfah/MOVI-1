# 🚀 Deploy Guide - MoviAPI

## Opções de Deploy

### 1️⃣ Vercel (Recomendado) ⭐

**Por que Vercel?**
- ✅ Deploy automático do Git
- ✅ HTTPS gratuito
- ✅ CI/CD integrado
- ✅ Edge Network global
- ✅ Preview deployments
- ✅ Variáveis de ambiente seguras

---

## 📋 Pré-requisitos

- [x] Conta no GitHub
- [x] Conta na Vercel (gratuita)
- [x] Projeto no Supabase configurado
- [x] Edge Functions deployadas no Supabase
- [x] Conta Stripe configurada (opcional para pagamentos)

---

## 🔧 Passo a Passo - Deploy na Vercel

### 1. Preparar o Repositório Git

```bash
# Entre no diretório do projeto
cd /Users/felipefull/Documents/Projetos/MOVI_API/MOVI-1

# Inicialize o Git (se ainda não tiver)
git init

# Adicione os arquivos
git add .

# Faça o commit inicial
git commit -m "Initial commit - MoviAPI ready for production"

# Crie um repositório no GitHub
# Acesse: https://github.com/new
# Nome sugerido: movi-api

# Conecte ao repositório remoto
git remote add origin https://github.com/SEU_USUARIO/movi-api.git

# Faça o push
git branch -M main
git push -u origin main
```

### 2. Deploy na Vercel

#### Opção A: Via Dashboard (Mais Fácil)

1. Acesse [vercel.com](https://vercel.com) e faça login
2. Clique em **"Add New..."** → **"Project"**
3. Importe o repositório do GitHub (`movi-api`)
4. Configure:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

5. **Adicione as variáveis de ambiente**:
   ```
   VITE_SUPABASE_URL=https://wrplwpcfwiiwfelwwzea.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   VITE_STRIPE_PRICE_BASIC=price_1SBh9MA3Ey5GjayWnkwgOAQD
   VITE_STRIPE_PRICE_PREMIUM=price_1SBhAmA3Ey5GjayWsBWfi0ty
   VITE_STRIPE_PRICE_BUSINESS=price_1SBhBdA3Ey5GjayWBMmMqteL
   ```

6. Clique em **"Deploy"** 🚀

#### Opção B: Via CLI (Mais Rápido)

```bash
# Instale a Vercel CLI
npm install -g vercel

# Faça login
vercel login

# Deploy (interativo)
vercel

# Ou deploy direto para produção
vercel --prod
```

Durante o processo, você será perguntado:
- Link to existing project? **No**
- What's your project's name? **movi-api**
- In which directory is your code located? **./**
- Want to override settings? **Yes**
  - Build Command: `npm run build`
  - Output Directory: `dist`
  - Development Command: `npm run dev`

Depois adicione as variáveis de ambiente:
```bash
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY
vercel env add VITE_STRIPE_PRICE_BASIC
vercel env add VITE_STRIPE_PRICE_PREMIUM
vercel env add VITE_STRIPE_PRICE_BUSINESS
```

### 3. Configurar o Supabase

Após o deploy, você receberá uma URL tipo: `https://movi-api.vercel.app`

**Atualize as configurações do Supabase:**

1. Acesse [Supabase Dashboard](https://supabase.com/dashboard)
2. Vá em **Authentication** → **URL Configuration**
3. Adicione em **Site URL**: `https://movi-api.vercel.app`
4. Adicione em **Redirect URLs**:
   ```
   https://movi-api.vercel.app/auth/callback
   https://movi-api.vercel.app
   ```

### 4. Testar o Deploy

1. Acesse sua URL da Vercel: `https://movi-api.vercel.app`
2. Faça login com um usuário de teste
3. Teste as funcionalidades:
   - ✅ Dashboard carrega
   - ✅ APIs listadas
   - ✅ Token de acesso visível
   - ✅ Histórico carrega
   - ✅ Compra de créditos (se Stripe configurado)

---

## 🔄 Deploy Contínuo (CI/CD)

Após configurado, **cada push no GitHub** fará deploy automático:

```bash
# Faça suas alterações
git add .
git commit -m "Update: descrição da mudança"
git push

# A Vercel automaticamente:
# 1. Detecta o push
# 2. Faz build do projeto
# 3. Roda testes (se configurados)
# 4. Faz deploy
# 5. Envia notificação
```

---

## 🌐 Outras Opções de Deploy

### 2️⃣ Netlify

```bash
# Instale a Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod
```

**Configurações:**
- Build command: `npm run build`
- Publish directory: `dist`

### 3️⃣ Railway

1. Acesse [railway.app](https://railway.app)
2. Conecte o GitHub
3. Selecione o repositório
4. Configure variáveis de ambiente
5. Deploy automático

### 4️⃣ Render

1. Acesse [render.com](https://render.com)
2. New → Static Site
3. Conecte o GitHub
4. Build command: `npm run build`
5. Publish directory: `dist`

---

## 🔒 Configuração de Variáveis de Ambiente

### Vercel Dashboard

1. Acesse seu projeto na Vercel
2. Settings → Environment Variables
3. Adicione cada variável:

| Name | Value | Environment |
|------|-------|-------------|
| `VITE_SUPABASE_URL` | `https://wrplwpcfwiiwfelwwzea.supabase.co` | Production |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGc...` | Production |
| `VITE_STRIPE_PRICE_BASIC` | `price_1SB...` | Production |
| `VITE_STRIPE_PRICE_PREMIUM` | `price_1SB...` | Production |
| `VITE_STRIPE_PRICE_BUSINESS` | `price_1SB...` | Production |

⚠️ **NUNCA** adicione `STRIPE_SECRET_KEY` no frontend! Ela fica apenas no Supabase:
```bash
supabase secrets set STRIPE_SECRET_KEY=sk_test_...
```

---

## 🐛 Troubleshooting

### Erro: "Build failed"
```bash
# Teste o build localmente
npm run build

# Se funcionar local, verifique:
# 1. Node version na Vercel (Settings → General → Node Version)
# 2. Variáveis de ambiente configuradas
# 3. Logs de build na Vercel
```

### Erro: "Page not found" em rotas
- ✅ Arquivo `vercel.json` já configurado com rewrites

### Erro: "Supabase not configured"
- Verifique se as variáveis `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` estão corretas
- Reinicie o deploy após adicionar variáveis

### Erro: "CORS" ou "Mixed Content"
- Certifique-se que a URL do Supabase é HTTPS
- Adicione a URL da Vercel no Supabase (Site URL)

---

## 📊 Monitoramento

### Vercel Analytics (Gratuito)
1. Settings → Analytics
2. Enable Web Analytics
3. Monitore:
   - Page views
   - Performance metrics
   - User geography

### Supabase Logs
```bash
# Ver logs das Edge Functions
supabase functions logs stripe-checkout

# Ver logs de autenticação
# Acesse: Supabase Dashboard → Authentication → Logs
```

---

## 🔄 Rollback

Se algo der errado:

### Via Dashboard Vercel
1. Deployments
2. Selecione um deploy anterior
3. Clique "..." → **Promote to Production**

### Via CLI
```bash
vercel rollback
```

---

## ✅ Checklist Final

Antes de ir para produção:

- [ ] Repositório no GitHub criado e atualizado
- [ ] Deploy na Vercel funcionando
- [ ] Variáveis de ambiente configuradas
- [ ] Supabase Site URL atualizada
- [ ] Edge Functions deployadas no Supabase
- [ ] Secrets do Stripe configurados no Supabase
- [ ] Teste de login funcionando
- [ ] Teste de compra de créditos (se aplicável)
- [ ] Analytics configurado (opcional)
- [ ] Custom domain configurado (opcional)

---

## 🎯 Próximos Passos

1. **Domínio Customizado** (Opcional)
   ```
   Vercel → Settings → Domains → Add Domain
   ```

2. **SSL Certificate** (Automático na Vercel)
   - HTTPS configurado automaticamente
   - Renovação automática

3. **Monitoring & Alerts**
   - Configure notificações de deploy
   - Monitor erros via Supabase Dashboard

---

## 📞 Suporte

- **Vercel Docs**: https://vercel.com/docs
- **Supabase Docs**: https://supabase.com/docs
- **Vite Docs**: https://vitejs.dev/guide/static-deploy.html

---

**🎉 Parabéns! Seu MoviAPI está online!** 🚀
