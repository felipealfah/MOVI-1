-- Debug SQL para investigar o problema de signup
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

-- 6. Testar inserção manual (para ver se é problema de permissão)
-- CUIDADO: Só execute se quiser testar
-- INSERT INTO users (id, email, name, credits) 
-- VALUES (gen_random_uuid(), 'test@example.com', 'Test User', 0);

-- 7. Verificar logs de erro (se disponível)
-- SELECT * FROM pg_stat_activity WHERE state = 'active';