# 📧 Configuração de Email no Supabase

## 🎯 Configurações Necessárias

### 1. **Authentication Settings**
No Dashboard do Supabase:
- Vá para **Authentication → Settings**
- Procure por **"Confirm email"**
- **HABILITE** a confirmação por email
- **Site URL**: `http://localhost:3000` (desenvolvimento)
- **Redirect URLs**: `http://localhost:3000/auth/callback`

### 2. **SMTP Settings (Opcional)**
- Se quiser usar SMTP personalizado
- Caso contrário, use o padrão do Supabase

### 3. **Email Templates**
- Vá para **Authentication → Email Templates**
- Customize os templates se necessário

## 🧪 Como Testar

1. **Faça signup** com email real
2. **Verifique se recebe** o email de confirmação
3. **Clique no link** do email
4. **Deve redirecionar** para `/auth/callback`
5. **Depois para o dashboard**

## 🔍 Verificar Status

Execute no SQL Editor:

```sql
-- Verificar usuários e status de confirmação
SELECT 
  id, 
  email, 
  email_confirmed_at,
  created_at
FROM auth.users 
ORDER BY created_at DESC 
LIMIT 5;
```

## ⚠️ Problemas Comuns

- **Email não chega**: Verificar spam/lixo eletrônico
- **Link não funciona**: Verificar Site URL nas configurações
- **Redirect falha**: Verificar Redirect URLs