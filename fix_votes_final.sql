请在 Supabase SQL Editor 中运行以下 SQL 来检查和修复：

-- 检查当前 votes 表结构
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'votes' AND table_schema = 'public'
ORDER BY ordinal_position;

-- 如果 voter_auth_user_id 列不存在，添加它
ALTER TABLE public.votes 
ADD COLUMN IF NOT EXISTS voter_auth_user_id uuid;

-- 如果 voter_user_id 列存在，重命名它
ALTER TABLE public.votes 
RENAME COLUMN voter_user_id TO voter_auth_user_id;

-- 确保列不为空
ALTER TABLE public.votes 
ALTER COLUMN voter_auth_user_id SET NOT NULL;

-- 强制刷新 schema cache
SELECT pg_notify('pgrst', 'reload schema');

