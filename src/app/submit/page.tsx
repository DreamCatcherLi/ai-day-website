"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

const MIN_TITLE = 2;
const MAX_TITLE = 60;
const MIN_DESC = 10;
const MAX_DESC = 500;

const SubmitPage = () => {
	const supabase = getSupabaseBrowserClient();
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);
	const [showSuccess, setShowSuccess] = useState(false);

	const isValid = useMemo(() => {
		if (title.trim().length < MIN_TITLE || title.trim().length > MAX_TITLE) return false;
		if (description.trim().length < MIN_DESC || description.trim().length > MAX_DESC) return false;
		return true;
	}, [title, description]);

	useEffect(() => { 
		setError(null); 
		setSuccess(null); 
		setShowSuccess(false);
	}, [title, description]);

	const handleSubmit = useCallback(async (e: FormEvent) => {
		e.preventDefault();
		if (submitting) return;
		if (!isValid) { setError("请完善表单内容"); return; }
		setSubmitting(true);
		setError(null);
		setSuccess(null);
		setShowSuccess(false);
		
		try {
			const { data: { user } } = await supabase.auth.getUser();
			if (!user) { 
				setError("请先登录"); 
				return; 
			}
			
			const { data, error: insertError } = await supabase.from("works").insert({
				title: title.trim(),
				description: description.trim(),
				author_auth_user_id: user.id,
			}).select();
			
			if (insertError) { 
				console.error('Insert error:', insertError);
				setError(`提交失败：${insertError.message}`); 
				return; 
			}
			
			console.log('Submit success:', data);
			const successMessage = "🎉 提交成功！你的作品已出现在投票页，快去看看吧！";
			console.log('Setting success message:', successMessage);
			setSuccess(successMessage);
			setShowSuccess(true);
			setTitle("");
			setDescription("");
			
			console.log('Success state should be updated now');
			
			// 3秒后自动隐藏成功提示
			setTimeout(() => {
				console.log('Hiding success message');
				setShowSuccess(false);
			}, 3000);
		} catch (err: any) {
			console.error('Submit error:', err);
			setError(`提交失败：${err?.message ?? "请稍后重试"}`);
		} finally {
			setSubmitting(false);
		}
	}, [supabase, submitting, isValid, title, description]);

	return (
		<main className="min-h-screen p-6 flex items-center justify-center">
			<div className="w-full max-w-xl space-y-6">
				<h1 className="text-2xl font-semibold">作品提交</h1>
				<form onSubmit={handleSubmit} className="space-y-4" aria-label="提交作品表单">
					<div>
						<label htmlFor="title" className="block text-sm font-medium mb-1">作品名称</label>
						<input
							id="title"
							type="text"
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							placeholder={`长度 ${MIN_TITLE}-${MAX_TITLE}`}
							className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-black"
							aria-invalid={title.trim().length < MIN_TITLE || title.trim().length > MAX_TITLE}
						/>
					</div>
					<div>
						<label htmlFor="desc" className="block text-sm font-medium mb-1">作品简介</label>
						<textarea
							id="desc"
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							placeholder={`长度 ${MIN_DESC}-${MAX_DESC}`}
							rows={6}
							className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-black"
							aria-invalid={description.trim().length < MIN_DESC || description.trim().length > MAX_DESC}
						/>
					</div>
					<button
						type="submit"
						disabled={submitting || !isValid}
						className="inline-flex items-center rounded-md bg-black text-white px-4 py-2 text-sm font-medium hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-60"
					>
						{submitting ? (
							<>
								<svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
									<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
									<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
								</svg>
								提交中...
							</>
						) : (
							"提交作品"
						)}
					</button>
				</form>
				{error && (
					<div className="rounded-md bg-red-50 border border-red-200 p-3">
						<p className="text-sm text-red-700" role="alert">
							<strong>❌ {error}</strong>
						</p>
					</div>
				)}
				{showSuccess && success && (
					<div className="rounded-md bg-green-50 border border-green-200 p-3">
						<p className="text-sm text-green-700" role="status">
							<strong>✅ {success}</strong>
						</p>
						<p className="text-xs text-green-600 mt-1">
							现在可以去"我要投票页"查看你的作品了！
						</p>
					</div>
				)}
			</div>
		</main>
	);
};

export default SubmitPage; 