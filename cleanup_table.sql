请在 Supabase SQL Editor 中运行以下 SQL 来清理表结构：

-- 删除重复的列，只保留 author_auth_user_id
ALTER TABLE public.works DROP COLUMN IF EXISTS author_user_id;

-- 刷新 schema cache
SELECT pg_notify('pgrst', 'reload schema');

