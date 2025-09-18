请在 Supabase SQL Editor 中运行以下 SQL 来修复 RLS 策略：

-- 删除现有的 works 插入策略
DROP POLICY IF EXISTS works_insert_owner_only ON public.works;

-- 重新创建正确的插入策略
CREATE POLICY works_insert_owner_only ON public.works
FOR INSERT 
WITH CHECK (auth.uid() = author_auth_user_id);

-- 确保 RLS 已启用
ALTER TABLE public.works ENABLE ROW LEVEL SECURITY;

-- 刷新权限
SELECT pg_notify('pgrst', 'reload schema');

