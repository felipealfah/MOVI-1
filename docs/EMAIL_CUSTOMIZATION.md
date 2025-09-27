# 📧 Guia de Customização de Emails - MoviAPI

## 🎯 Como Customizar Emails no Supabase

### 1. Acesso ao Dashboard
```
URL: https://supabase.com/dashboard/project/wrplwpcfwiiwfelwwzea/auth/templates
Caminho: Authentication → Email Templates
```

### 2. Templates Disponíveis

#### 📝 **Confirm Signup** (Confirmação de Cadastro)
- **Quando é enviado:** Após criar conta
- **Propósito:** Confirmar email do usuário
- **Variáveis disponíveis:**
  - `{{ .Email }}` - Email do usuário
  - `{{ .Token }}` - Token de confirmação
  - `{{ .TokenHash }}` - Hash do token
  - `{{ .SiteURL }}` - URL do seu site
  - `{{ .ConfirmationURL }}` - URL completa de confirmação

#### 🔐 **Magic Link** (Login Mágico)
- **Quando é enviado:** Login sem senha
- **Variáveis disponíveis:**
  - `{{ .Email }}`
  - `{{ .Token }}`
  - `{{ .TokenHash }}`
  - `{{ .SiteURL }}`
  - `{{ .ConfirmationURL }}`

#### 🔄 **Reset Password** (Reset de Senha)
- **Quando é enviado:** Esqueci minha senha
- **Variáveis disponíveis:**
  - `{{ .Email }}`
  - `{{ .Token }}`
  - `{{ .TokenHash }}`
  - `{{ .SiteURL }}`
  - `{{ .ConfirmationURL }}`

### 3. Template Personalizado para MoviAPI

#### 📧 **Subject (Assunto):**
```
Confirme sua conta na MoviAPI
```

#### 📝 **Body (HTML):**
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirme sua conta - MoviAPI</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .container {
            background-color: #ffffff;
            border: 2px solid #000000;
            padding: 40px;
            text-align: center;
        }
        .logo {
            width: 64px;
            height: 64px;
            background-color: #000000;
            color: #ffffff;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 20px;
        }
        .title {
            font-size: 28px;
            font-weight: bold;
            color: #000000;
            margin-bottom: 10px;
        }
        .subtitle {
            font-size: 16px;
            color: #666666;
            margin-bottom: 30px;
        }
        .button {
            display: inline-block;
            background-color: #000000;
            color: #ffffff;
            padding: 15px 30px;
            text-decoration: none;
            font-weight: bold;
            font-size: 16px;
            border: none;
            cursor: pointer;
            margin: 20px 0;
        }
        .button:hover {
            background-color: #333333;
        }
        .info {
            background-color: #f8f9fa;
            border: 1px solid #000000;
            padding: 20px;
            margin: 30px 0;
            text-align: left;
        }
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            font-size: 14px;
            color: #666;
        }
        .link {
            color: #000000;
            word-break: break-all;
            font-family: monospace;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Logo -->
        <div class="logo">
            &lt;/&gt;
        </div>
        
        <!-- Título -->
        <h1 class="title">Bem-vindo à MoviAPI!</h1>
        <p class="subtitle">Confirme seu email para começar a usar nossa plataforma</p>
        
        <!-- Botão Principal -->
        <a href="{{ .ConfirmationURL }}" class="button">
            Confirmar Email
        </a>
        
        <!-- Informações -->
        <div class="info">
            <h3 style="margin-top: 0; color: #000000;">🎯 O que você ganha:</h3>
            <ul style="text-align: left; margin: 0; padding-left: 20px;">
                <li><strong>1.000 créditos grátis</strong> para começar</li>
                <li><strong>API Key automática</strong> já configurada</li>
                <li><strong>Acesso completo</strong> a todas as APIs</li>
                <li><strong>Dashboard profissional</strong> para gerenciar tudo</li>
            </ul>
        </div>
        
        <!-- Link alternativo -->
        <p style="margin-top: 30px; font-size: 14px; color: #666;">
            Se o botão não funcionar, copie e cole este link no seu navegador:
        </p>
        <p class="link">{{ .ConfirmationURL }}</p>
        
        <!-- Footer -->
        <div class="footer">
            <p><strong>MoviAPI</strong> - Sistema Completo de Hub de APIs</p>
            <p>Este email foi enviado para <strong>{{ .Email }}</strong></p>
            <p>Se você não criou uma conta, pode ignorar este email.</p>
        </div>
    </div>
</body>
</html>
```

### 4. Configurações Avançadas

#### 🔧 **Site URL Configuration:**
```
Site URL: https://seudominio.com
Additional Redirect URLs: 
- http://localhost:3000
- https://localhost:3000
- https://seudominio.com/auth/callback
```

#### ⏰ **Token Expiry:**
```
Email confirmation: 24 hours (padrão)
Password reset: 1 hour (padrão)
```

### 5. Testando o Template

#### 🧪 **Como testar:**
1. Crie uma conta de teste
2. Verifique o email recebido
3. Ajuste o template se necessário
4. Repita até ficar perfeito

#### 📱 **Teste em diferentes clientes:**
- Gmail (web/mobile)
- Outlook (web/desktop)
- Apple Mail
- Thunderbird

### 6. Boas Práticas

#### ✅ **Design:**
- Use cores da marca (preto/branco para MoviAPI)
- Mantenha design limpo e profissional
- Botão de ação bem visível
- Responsive para mobile

#### ✅ **Conteúdo:**
- Assunto claro e direto
- Explicar o que o usuário ganha
- Incluir link alternativo
- Footer com informações da empresa

#### ✅ **Técnico:**
- Teste em diferentes clientes de email
- Use CSS inline para compatibilidade
- Inclua texto alternativo
- Mantenha HTML simples

### 7. Variáveis Personalizadas

Se precisar de mais dados do usuário, você pode:

1. **Adicionar metadados no signup:**
```typescript
await supabase.auth.signUp({
  email,
  password,
  options: {
    data: {
      name: 'Felipe',
      company: 'MinhaEmpresa',
      plan: 'free'
    }
  }
});
```

2. **Usar no template:**
```html
<p>Olá {{ .UserMetaData.name }}!</p>
<p>Empresa: {{ .UserMetaData.company }}</p>
```

### 8. Troubleshooting

#### ❌ **Problemas comuns:**
- **Email não chega:** Verificar spam/lixo eletrônico
- **Link não funciona:** Verificar Site URL nas configurações
- **Template quebrado:** Validar HTML e CSS inline
- **Variáveis não aparecem:** Verificar sintaxe `{{ .Variable }}`

#### 🔍 **Debug:**
- Logs em Authentication → Logs
- Testar com diferentes provedores de email
- Verificar configurações de SMTP (se customizado)