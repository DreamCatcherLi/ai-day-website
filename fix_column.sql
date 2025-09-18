请在 Supabase SQL Editor 中运行以下 SQL 来修复表结构：

-- 检查当前表结构
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'works' AND table_schema = 'public';

-- 如果列名不匹配，重命名或添加正确的列
ALTER TABLE public.works 
RENAME COLUMN author_user_id TO author_auth_user_id;

-- 或者如果列不存在，添加它
ALTER TABLE public.works 
ADD COLUMN IF NOT EXISTS author_auth_user_id uuid;

-- 确保列不为空
ALTER TABLE public.works 
ALTER COLUMN author_auth_user_id SET NOT NULL;

-- 刷新 schema cache
SELECT pg_notify('pgrst', 'reload schema');

