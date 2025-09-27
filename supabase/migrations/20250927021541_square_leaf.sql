-- Debug SQL para investigar problemas de signup
-- Execute este SQL no SQL Editor do Supabase para diagnosticar

-- 1. Verificar se a tabela users existe e sua estrutura
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'users' 
ORDER BY ordinal_position;

-- 2. Verificar se o trigger existe
SELECT 
    trigger_name,
    event_manipulation,
    event_object_table,
    action_statement
FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';

-- 3. Verificar se a função existe
SELECT 
    routine_name,
    routine_type,
    routine_definition
FROM information_schema.routines 
WHERE routine_name = 'handle_new_user';

-- 4. Verificar políticas RLS na tabela users
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'users';

-- 5. Verificar se RLS está habilitado
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE tablename = 'users';

-- 6. Verificar triggers relacionados a API keys
SELECT trigger_name, event_object_table, action_statement
FROM information_schema.triggers 
WHERE event_object_table IN ('users', 'auth.users')
ORDER BY trigger_name;

-- 7. Verificar usuários criados recentemente
SELECT id, email, name, credits, created_at 
FROM public.users 
ORDER BY created_at DESC 
LIMIT 5;

-- 8. Verificar API keys criadas
SELECT user_id, name, key_preview, is_active, created_at
FROM public.api_keys 
ORDER BY created_at DESC 
LIMIT 5;

-- 9. Verificar status de confirmação de email
SELECT 
  id, 
  email, 
  email_confirmed_at,
  created_at
FROM auth.users 
ORDER BY created_at DESC 
LIMIT 5;