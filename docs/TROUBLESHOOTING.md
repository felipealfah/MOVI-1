# 🔧 Troubleshooting - MoviAPI

## 🚨 Problemas Comuns

### 1. **Erro de Signup: "relation api_keys does not exist"**

**Sintomas:**
- Usuário não consegue se cadastrar
- Erro 500 no signup
- Log: `ERROR: relation "api_keys" does not exist`

**Solução:**
```sql
-- Execute no SQL Editor do Supabase
-- Verificar se tabela existe
SELECT table_name FROM information_schema.tables WHERE table_name = 'api_keys';

-- Se não existir, executar migração
-- Se existir, corrigir função:
\i scripts/database/fix_api_key_function.sql
```

### 2. **Email de Confirmação Não Chega**

**Sintomas:**
- Usuário faz signup mas não recebe email
- Não consegue fazer login

**Solução:**
1. Verificar configurações no Supabase:
   - Authentication → Settings
   - "Confirm email" deve estar HABILITADO
2. Verificar spam/lixo eletrônico
3. Testar com email diferente

### 3. **Pagamento Não Processa**

**Sintomas:**
- Checkout do Stripe abre mas não processa
- Créditos não são adicionados após pagamento

**Solução:**
1. Verificar webhook do Stripe:
   ```bash
   # Testar webhook
   curl https://your-project.supabase.co/functions/v1/stripe-webhook-cli
   ```
2. Verificar logs no Supabase Functions
3. Verificar se secrets estão configuradas

### 4. **API Keys Não São Criadas**

**Sintomas:**
- Usuário criado mas sem API key
- Página de tokens vazia

**Solução:**
```sql
-- Criar API key manualmente
INSERT INTO public.api_keys (
  user_id,
  name,
  key_hash,
  key_preview,
  is_active
) VALUES (
  'USER_ID_AQUI',
  'Default API Key',
  'sk-' || replace('USER_ID_AQUI'::text, '-', ''),
  'sk-' || substring(replace('USER_ID_AQUI'::text, '-', '') from 1 for 8) || '...',
  true
);
```

## 🔍 Debug Commands

### **Verificar Estado do Sistema:**
```sql
-- Usuários recentes
SELECT id, email, name, credits FROM users ORDER BY created_at DESC LIMIT 5;

-- API keys
SELECT user_id, name, key_preview FROM api_keys ORDER BY created_at DESC LIMIT 5;

-- Triggers
SELECT trigger_name, event_object_table FROM information_schema.triggers 
WHERE event_object_table = 'users';
```

### **Logs do Supabase:**
1. Dashboard → Logs
2. Filtrar por erro
3. Verificar timestamp do problema

### **Teste de Webhook:**
```bash
# Testar se edge function responde
curl -X GET https://your-project.supabase.co/functions/v1/stripe-webhook-cli
```

## 📞 Quando Pedir Ajuda

Se os problemas persistirem:
1. **Colete logs** específicos
2. **Documente passos** para reproduzir
3. **Inclua configurações** relevantes
4. **Teste em ambiente limpo** se possível

## 🆘 Contatos de Emergência

- **Supabase Support**: Dashboard → Support
- **Stripe Support**: Dashboard do Stripe
- **GitHub Issues**: Repositório do projeto