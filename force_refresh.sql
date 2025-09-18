请在 Supabase SQL Editor 中运行以下 SQL 来强制刷新缓存：

-- 强制刷新所有 schema cache
SELECT pg_notify('pgrst', 'reload schema');
SELECT pg_notify('pgrst', 'reload config');

-- 检查 votes 表是否真的存在 voter_auth_user_id 列
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'votes' AND table_schema = 'public' 
AND column_name LIKE '%voter%';

