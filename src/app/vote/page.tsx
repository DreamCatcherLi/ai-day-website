"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

type WorkItem = {
	id: string;
	title: string;
	description: string;
	created_at: string;
	votes_count?: number;
};

type VoteRecord = {
	work_id: string;
};

const VotePage = () => {
	const supabase = getSupabaseBrowserClient();
	const [works, setWorks] = useState<WorkItem[]>([]);
	const [myVotes, setMyVotes] = useState<VoteRecord[]>([]);
	const [loading, setLoading] = useState(true);
	const [voting, setVoting] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);

	const remaining = useMemo(() => Math.max(0, 3 - myVotes.length), [myVotes.length]);

	const load = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const { data: { user } } = await supabase.auth.getUser();
			if (!user) { setError("请先登录"); setLoading(false); return; }

			// load works with votes count via view if exists, fallback to base table
			let { data: worksData, error: worksErr } = await supabase.from("works_with_votes").select("*").order("created_at", { ascending: false });
			if (worksErr) {
				const alt = await supabase.from("works").select("*").order("created_at", { ascending: false });
				if (alt.error) throw alt.error;
				worksData = (alt.data || []).map((w: Record<string, unknown>) => ({ ...w, votes_count: undefined }));
			}
			setWorks((worksData || []) as WorkItem[]);

			const { data: votesData, error: votesErr } = await supabase
				.from("votes")
				.select("work_id")
				.eq("voter_auth_user_id", user.id);
			if (votesErr) throw votesErr;
			setMyVotes((votesData || []) as VoteRecord[]);
		} catch (e: unknown) {
			setError(e instanceof Error ? e.message : "加载失败");
		} finally {
			setLoading(false);
		}
	}, [supabase]);

	useEffect(() => { load(); }, [load]);

	const handleVote = useCallback(async (workId: string) => {
		if (voting) return;
		if (remaining <= 0) { setError("可用票数已用完"); return; }
		if (myVotes.some((v) => v.work_id === workId)) { setError("不可重复投票"); return; }
		setVoting(workId);
		setError(null);
		try {
			const { data: { user } } = await supabase.auth.getUser();
			if (!user) { setError("请先登录"); return; }
			const { error: insErr } = await supabase.from("votes").insert({
				voter_auth_user_id: user.id,
				work_id: workId,
			});
			if (insErr) { setError(insErr.message); return; }
			// optimistic update
			setMyVotes((prev) => [...prev, { work_id: workId }]);
			setWorks((prev) => prev.map((w) => w.id === workId ? { ...w, votes_count: (w.votes_count ?? 0) + 1 } : w));
		} catch (e: unknown) {
			setError(e instanceof Error ? e.message : "投票失败");
		} finally {
			setVoting(null);
		}
	}, [supabase, voting, remaining, myVotes]);

	if (loading) return <main className="min-h-screen p-6 flex items-center justify-center">加载中...</main>;

	return (
		<main className="min-h-screen p-6 mx-auto max-w-4xl">
			<div className="flex items-center justify-between mb-6">
				<h1 className="text-2xl font-semibold">我要投票</h1>
				<p className="text-sm text-gray-600">剩余票数：{remaining}</p>
			</div>
			{error && <p className="text-sm text-red-600 mb-4" role="alert">{error}</p>}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				{works.map((w) => (
					<div key={w.id} className="rounded-lg border border-gray-200 p-4">
						<h2 className="font-medium text-lg mb-2">{w.title}</h2>
						<p className="text-sm text-gray-600 mb-3 whitespace-pre-line">{w.description}</p>
						<div className="flex items-center justify-between">
							<span className="text-sm text-gray-500">票数：{w.votes_count ?? "-"}</span>
							<button
								aria-label={`为 ${w.title} 投票`}
								disabled={voting === w.id || remaining <= 0 || myVotes.some((v) => v.work_id === w.id)}
								onClick={() => handleVote(w.id)}
								className="inline-flex items-center rounded-md bg-black text-white px-3 py-1.5 text-xs font-medium hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-60"
							>
								{myVotes.some((v) => v.work_id === w.id) ? "已投票" : (voting === w.id ? "投票中..." : "投票")}
							</button>
						</div>
					</div>
				))}
			</div>
		</main>
	);
};

export default VotePage; 