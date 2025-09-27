# 📥 Guia de Download do Projeto

## 🗂️ Estrutura de arquivos necessários:

```
projeto/
├── package.json
├── .env (criar)
├── src/
│   ├── App.tsx
│   ├── main.tsx
│   ├── index.css
│   ├── stripe-config.ts
│   ├── lib/
│   │   ├── supabase.ts
│   │   └── stripe.ts
│   ├── contexts/
│   │   └── AuthContext.tsx
│   └── components/
│       ├── Header.tsx
│       ├── Sidebar.tsx
│       ├── auth/
│       ├── views/
│       └── payments/
├── supabase/
│   ├── config.toml
│   ├── functions/
│   │   └── stripe-webhook-cli/
│   │       └── index.ts
│   └── migrations/ (todos os arquivos)
├── index.html
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
├── tsconfig.app.json
└── tsconfig.node.json
```

## 🚀 Comandos após download:

1. `npm install`
2. Criar `.env` com suas chaves
3. `supabase login`
4. `supabase link --project-ref wrplwpcfwiiwfelwwzea`
5. `supabase functions deploy stripe-webhook-cli --no-verify-jwt`
6. Configurar secrets do Stripe
7. `npm run dev`

## 🎯 URL final do webhook:
`https://wrplwpcfwiiwfelwwzea.supabase.co/functions/v1/stripe-webhook-cli`