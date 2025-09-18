请在 Supabase SQL Editor 中运行以下 SQL 来修复依赖问题：

-- 先删除依赖的 RLS 策略
DROP POLICY IF EXISTS works_insert_by_auth ON public.works;
DROP POLICY IF EXISTS works_insert_owner_only ON public.works;

-- 删除重复的列
ALTER TABLE public.works DROP COLUMN IF EXISTS author_user_id CASCADE;

-- 重新创建正确的 RLS 策略
CREATE POLICY works_insert_owner_only ON public.works
FOR INSERT 
WITH CHECK (auth.uid() = author_auth_user_id);

-- 刷新 schema cache
SELECT pg_notify('pgrst', 'reload schema');

