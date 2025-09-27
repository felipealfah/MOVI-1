# 🚀 Deploy Checklist - MoviAPI

## 📋 Pré-Deploy

### ✅ **Banco de Dados**
- [ ] Todas as migrações aplicadas
- [ ] Triggers funcionando corretamente
- [ ] RLS policies configuradas
- [ ] Dados de teste removidos

### ✅ **Supabase Edge Functions**
- [ ] `stripe-checkout` deployada
- [ ] `stripe-webhook-cli` deployada
- [ ] Secrets configuradas (STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET)

### ✅ **Stripe**
- [ ] Produtos criados com Price IDs corretos
- [ ] Webhook configurado para produção
- [ ] Keys de produção configuradas

### ✅ **Frontend**
- [ ] Variáveis de ambiente de produção
- [ ] Build funcionando sem erros
- [ ] Testes passando

## 🚀 Deploy Steps

### 1. **Supabase**
```bash
# Deploy edge functions
supabase functions deploy stripe-checkout --no-verify-jwt
supabase functions deploy stripe-webhook-cli --no-verify-jwt

# Configure secrets
supabase secrets set STRIPE_SECRET_KEY=sk_live_...
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_...
```

### 2. **Frontend**
```bash
# Build
npm run build

# Deploy to your platform
# (Vercel, Netlify, etc.)
```

### 3. **Stripe Webhook**
- Configure webhook URL: `https://your-project.supabase.co/functions/v1/stripe-webhook-cli`
- Test webhook delivery

## 🧪 Pós-Deploy

### ✅ **Testes**
- [ ] Signup/Login funcionando
- [ ] Email confirmation funcionando
- [ ] Compra de créditos funcionando
- [ ] APIs respondendo
- [ ] Webhook do Stripe funcionando

### ✅ **Monitoramento**
- [ ] Logs do Supabase
- [ ] Logs do Stripe
- [ ] Métricas de performance
- [ ] Alertas configurados

## 🆘 Rollback Plan

Se algo der errado:
1. Reverter deploy do frontend
2. Reverter edge functions se necessário
3. Verificar logs para identificar problema
4. Aplicar hotfix se possível