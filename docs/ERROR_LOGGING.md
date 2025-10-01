# Sistema de Logging de Erros - MoviAPI

## 📋 Visão Geral

O MoviAPI implementa um sistema robusto de logging de erros que captura automaticamente todos os tipos de erros da aplicação e os salva no banco de dados para análise posterior.

## 🎯 Funcionalidades

### ✅ Tipos de Erros Capturados

- **🔴 JavaScript Errors**: Exceções não tratadas, erros de sintaxe
- **🌐 Network Errors**: Falhas de requisições HTTP, timeouts
- **🔐 Authentication Errors**: Falhas de login, token expirado
- **💳 Payment Errors**: Falhas no Stripe, checkout cancelado
- **🔌 API Errors**: Erros nas Edge Functions, APIs externas
- **⚛️ Render Errors**: Falhas de renderização React (Error Boundary)
- **❓ Unknown Errors**: Outros tipos de erro não categorizados

### ✅ Informações Coletadas

Para cada erro, o sistema coleta:
- **Mensagem do erro** e stack trace
- **Tipo de erro** categorizado
- **Componente** onde ocorreu (se aplicável)
- **URL** da página onde ocorreu
- **User Agent** do navegador
- **Timestamp** preciso
- **Metadata** adicional (contexto específico)
- **Criticidade** do erro
- **ID do usuário** (se autenticado)

## 🏗️ Arquitetura

### 📊 Banco de Dados

**Tabela: `error_logs`**
```sql
- id (UUID)
- user_id (UUID, referência para auth.users)
- error_type (ENUM)
- error_message (TEXT)
- error_stack (TEXT)
- component_name (TEXT)
- url (TEXT)
- user_agent (TEXT)
- timestamp (TIMESTAMP)
- metadata (JSONB)
- is_critical (BOOLEAN)
- resolved (BOOLEAN)
```

### 🔒 Segurança (RLS)

- **Usuários**: Só veem seus próprios erros
- **Inserção**: Qualquer pessoa pode inserir erros (para erros anônimos)
- **Service Role**: Acesso total para administração

## 🛠️ Implementação

### 🎣 Captura Global de Erros

**Hook: `useErrorHandler`**
```typescript
// Captura erros JavaScript não tratados
window.addEventListener('error', handleError);

// Captura promises rejeitadas
window.addEventListener('unhandledrejection', handleUnhandledRejection);
```

### ⚛️ Error Boundary React

**Componente: `ErrorBoundary`**
- Captura erros de renderização de componentes
- Exibe UI de fallback amigável
- Log automático no banco de dados
- Opção de retry/reload

### 📝 Funções de Logging

**Funções disponíveis:**
```typescript
// Erro genérico
logError(errorData)

// Erro JavaScript
logJavaScriptError(error, componentName?, metadata?)

// Erro de rede
logNetworkError(url, status, statusText, metadata?)

// Erro de API
logApiError(apiName, error, metadata?)

// Erro de renderização
logRenderError(componentName, error, metadata?)
```

## 🚀 Como Usar

### 📦 Configuração Automática

O sistema é **automaticamente ativado** quando você:
1. Executa a aplicação (`npm run dev`)
2. O hook `useErrorHandler()` é chamado no `App.tsx`
3. Error Boundaries estão wrapeando componentes principais

### 🛡️ Error Boundaries

Componentes principais já protegidos:
```typescript
<ErrorBoundary componentName="Sidebar">
  <Sidebar />
</ErrorBoundary>

<ErrorBoundary componentName="Header">
  <Header />
</ErrorBoundary>
```

### 📋 Logging Manual

```typescript
import { logJavaScriptError, logApiError } from '../lib/supabase';

// Em um try/catch
try {
  await riskyOperation();
} catch (error) {
  logJavaScriptError(error, 'MyComponent', { action: 'riskyOperation' });
  throw error; // Re-throw if needed
}

// Para erros de API
try {
  const response = await fetch('/api/data');
} catch (error) {
  logApiError('DataAPI', error, { endpoint: '/api/data' });
}
```

## 📈 Monitoramento

### 🔍 Visualização de Logs

**Componente: `ErrorLogs`**
- Lista todos os erros do usuário
- Filtros por tipo e criticidade
- Detalhes expandíveis (stack trace, metadata)
- Status de resolução

### 📊 Estatísticas

**View: `error_stats`**
```sql
SELECT * FROM error_stats;
-- Retorna: tipo, total, críticos, não resolvidos, usuários afetados
```

### 🧹 Limpeza Automática

**Função: `cleanup_old_error_logs()`**
- Remove erros resolvidos mais antigos que 30 dias
- Execução manual ou via cron job

## 🚦 Estados do Sistema

### ✅ Com Supabase Configurado
- Erros salvos na tabela `error_logs`
- RLS aplicado corretamente
- Logs visíveis no componente `ErrorLogs`

### ⚠️ Sem Supabase (Mock Mode)
- Erros logados apenas no console
- Fallback gracioso para desenvolvimento
- Não interrompe funcionalidade da app

## 🎛️ Configuração

### 🔧 Variáveis de Ambiente

Nenhuma configuração adicional necessária! O sistema usa as mesmas variáveis do Supabase:
```env
VITE_SUPABASE_URL=sua_url_aqui
VITE_SUPABASE_ANON_KEY=sua_chave_aqui
```

### 📋 Setup do Banco

1. Execute o script SQL:
```bash
psql -h localhost -U postgres -d postgres -f docs/database/error_logs_table.sql
```

2. Ou via Supabase Dashboard:
- Vá para SQL Editor
- Cole o conteúdo de `error_logs_table.sql`
- Execute

## 🐛 Troubleshooting

### ❌ Erros não aparecem no banco

**Verificar:**
1. Supabase está configurado? (veja console logs)
2. Tabela `error_logs` existe?
3. RLS policies estão ativas?
4. User authenticated para ver próprios logs?

### ❌ Error Boundary não funciona

**Verificar:**
1. Componente está wrapeado com `<ErrorBoundary>`?
2. Erro é de renderização (não async)?
3. Console do browser mostra o erro?

### ❌ Performance issues

**Soluções:**
1. Execute `cleanup_old_error_logs()` regularmente
2. Adicione índices customizados se necessário
3. Limite queries com `LIMIT`

## 🎯 Melhores Práticas

### ✅ DO
- Use Error Boundaries em componentes críticos
- Inclua metadata útil nos logs
- Marque erros críticos apropriadamente
- Monitore logs regularmente

### ❌ DON'T
- Não logue informações sensíveis (senhas, tokens)
- Não crie loops infinitos de logging
- Não ignore erros críticos
- Não logue excessivamente (spam)

## 📚 Exemplos de Uso

### 🔐 Erro de Autenticação
```typescript
try {
  await signIn(email, password);
} catch (error) {
  logError({
    error_type: 'authentication',
    error_message: `Login failed: ${error.message}`,
    metadata: { email, attempt: retryCount },
    is_critical: true
  });
}
```

### 💳 Erro de Pagamento
```typescript
try {
  const session = await createCheckoutSession(productId);
} catch (error) {
  logError({
    error_type: 'payment',
    error_message: `Stripe checkout failed: ${error.message}`,
    metadata: { productId, userId },
    is_critical: true
  });
}
```

### 🌐 Erro de Rede
```typescript
fetch('/api/data')
  .catch(error => {
    logNetworkError('/api/data', 0, 'Network Error', {
      userAgent: navigator.userAgent,
      online: navigator.onLine
    });
  });
```

---

## 🎉 Resultado

Com este sistema implementado, você terá:

- **🔍 Visibilidade total** dos erros da aplicação
- **📊 Dados históricos** para análise de tendências
- **🚨 Identificação rápida** de problemas críticos
- **🛠️ Debug facilitado** com stack traces e contexto
- **👥 Experiência do usuário** melhorada com fallbacks gracious

O sistema é **robusto**, **automático** e **não-intrusivo** - funciona silenciosamente no background capturando todos os erros para que você possa manter a aplicação estável e confiável! 🚀