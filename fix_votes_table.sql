请在 Supabase SQL Editor 中运行以下 SQL 来检查和修复 votes 表结构：

-- 检查 votes 表结构
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'votes' AND table_schema = 'public'
ORDER BY ordinal_position;

-- 如果列名不匹配，重命名或添加正确的列
ALTER TABLE public.votes 
RENAME COLUMN voter_user_id TO voter_auth_user_id;

-- 或者如果列不存在，添加它
ALTER TABLE public.votes 
ADD COLUMN IF NOT EXISTS voter_auth_user_id uuid;

-- 确保列不为空
ALTER TABLE public.votes 
ALTER COLUMN voter_auth_user_id SET NOT NULL;

-- 刷新 schema cache
SELECT pg_notify('pgrst', 'reload schema');

