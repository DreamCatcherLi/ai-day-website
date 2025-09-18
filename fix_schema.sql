请在 Supabase SQL Editor 中运行以下 SQL 来修复表结构：

-- 检查并添加缺失的列
ALTER TABLE public.works 
ADD COLUMN IF NOT EXISTS author_auth_user_id uuid NOT NULL;

-- 如果列已存在但为空，更新现有记录
UPDATE public.works 
SET author_auth_user_id = auth.uid() 
WHERE author_auth_user_id IS NULL;

-- 添加外键约束（如果需要）
ALTER TABLE public.works 
ADD CONSTRAINT fk_works_author 
FOREIGN KEY (author_auth_user_id) 
REFERENCES auth.users(id) 
ON DELETE CASCADE;

-- 刷新 schema cache
SELECT pg_notify('pgrst', 'reload schema');

