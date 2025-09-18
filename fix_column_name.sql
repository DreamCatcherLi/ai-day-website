请在 Supabase SQL Editor 中运行以下 SQL 来确认和修复列名：

-- 查看 works 表的确切列名
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'works' AND table_schema = 'public'
ORDER BY column_name;

-- 如果列名是 author_user_id，重命名为 author_auth_user_id
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'works' AND table_schema = 'public' 
        AND column_name = 'author_user_id'
    ) THEN
        ALTER TABLE public.works RENAME COLUMN author_user_id TO author_auth_user_id;
    END IF;
END $$;

-- 确保列存在且不为空
ALTER TABLE public.works 
ALTER COLUMN author_auth_user_id SET NOT NULL;

-- 刷新 schema cache
SELECT pg_notify('pgrst', 'reload schema');

