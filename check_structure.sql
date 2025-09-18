请在 Supabase SQL Editor 中运行以下 SQL 来查看当前表结构：

SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'works' AND table_schema = 'public'
ORDER BY ordinal_position;

