-- Função robusta que trata valores nulos no signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- Log para debug (opcional)
  RAISE LOG 'Creating user: id=%, email=%, name=%', 
    new.id, 
    new.email, 
    COALESCE(new.raw_user_meta_data->>'name', 'User');
  
  -- Inserir usuário com tratamento de valores nulos
  INSERT INTO public.users (id, email, name, credits)
  VALUES (
    new.id, 
    new.email, 
    COALESCE(new.raw_user_meta_data->>'name', 'User'), -- Se name for null, usa 'User'
    0
  );
  
  RETURN new;
EXCEPTION
  WHEN OTHERS THEN
    -- Log do erro para debug
    RAISE LOG 'Error creating user: %', SQLERRM;
    RAISE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;