import Link from "next/link";
import { AuthHandler } from "./auth-handler";

export default function Home() {
	return (
		<>
			<AuthHandler />
			<main className="min-h-screen p-6 flex items-center justify-center">
				<div className="w-full max-w-2xl text-center space-y-6">
					<h1 className="text-3xl md:text-4xl font-bold">AI-Day 持续开放活动</h1>
					<p className="text-gray-600">提交你的作品，投出你珍贵的 3 票，让好创意被看见！</p>
					<div className="flex items-center justify-center gap-4">
						<Link
							aria-label="前往作品提交页"
							href="/submit"
							className="inline-flex items-center rounded-md bg-black text-white px-4 py-2 text-sm font-medium hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
						>
							作品提交页
						</Link>
						<Link
							aria-label="前往我要投票页"
							href="/vote"
							className="inline-flex items-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300"
						>
							我要投票页
						</Link>
					</div>
				</div>
			</main>
		</>
	);
}
