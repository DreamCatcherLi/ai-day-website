请在 Supabase SQL Editor 中运行以下 SQL 来重命名列：

-- 重命名列以匹配代码
ALTER TABLE public.votes 
RENAME COLUMN voter_user_id TO voter_auth_user_id;

-- 刷新 schema cache
SELECT pg_notify('pgrst', 'reload schema');

