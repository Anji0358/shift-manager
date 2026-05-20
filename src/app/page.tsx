import Link from "next/link";
import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowRight,
  CalendarCheck,
  LayoutDashboard,
  ShieldCheck,
  Users,
} from "lucide-react";

const HomePage = async () => {
  const session = await auth();

  return (
    <div className="relative mx-auto flex min-h-[75vh] max-w-6xl flex-col justify-center overflow-hidden px-4 py-10">
      <div className="absolute inset-0 -z-10 rounded-[2rem] bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.35),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(168,85,247,0.28),_transparent_35%),linear-gradient(135deg,_#020617,_#0f172a_45%,_#111827)]" />

      <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] px-6 py-10 shadow-2xl backdrop-blur md:px-10 md:py-14">
        <section className="mx-auto max-w-3xl space-y-6 text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium text-slate-200">
            <ShieldCheck className="h-4 w-4 text-blue-300" />
            Catering Shift Management
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tight text-white md:text-6xl">
              Shift Manager
            </h1>

            <p className="text-lg font-medium text-blue-100 md:text-xl">
              現場のシフト管理を、もっとスマートに。
            </p>

            <p className="mx-auto max-w-2xl leading-7 text-slate-300">
              案件管理、勤務枠、スタッフ割り振り、勤務不可情報、就労報告、月次集計までを一元管理。
              ケータリング現場の複雑なシフト運用を、シンプルに整理します。
            </p>
          </div>

          <div className="mx-auto grid max-w-2xl gap-3 pt-2 text-sm text-slate-300 md:grid-cols-3">
            <div className="rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3">
              案件管理
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3">
              スタッフ割り振り
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3">
              月次集計
            </div>
          </div>
        </section>

        <section className="mt-10 grid gap-5 md:grid-cols-2">
          <Card className="group rounded-2xl border-white/10 bg-white/[0.08] text-white shadow-xl backdrop-blur transition hover:-translate-y-1 hover:bg-white/[0.12]">
            <CardHeader className="space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/20 text-blue-200 ring-1 ring-blue-300/20">
                <LayoutDashboard className="h-6 w-6" />
              </div>

              <div>
                <CardTitle className="text-xl text-white">管理者ログイン</CardTitle>
                <p className="mt-2 text-sm text-slate-300">
                  案件・スタッフ・集計を管理する方はこちら
                </p>
              </div>
            </CardHeader>

            <CardContent className="space-y-5">
              <p className="text-sm leading-6 text-slate-300">
                案件作成、勤務枠作成、スタッフ割り振り、就労報告の確認、月次集計を行えます。
              </p>

              <Button
                asChild
                className="w-full rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/20 hover:from-blue-400 hover:to-indigo-400 hover:text-white"
              >
                <Link href={session ? "/admin" : "/login"}>
                  管理者として進む
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="group rounded-2xl border-white/10 bg-white/[0.08] text-white shadow-xl backdrop-blur transition hover:-translate-y-1 hover:bg-white/[0.12]">
            <CardHeader className="space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/20 text-violet-200 ring-1 ring-violet-300/20">
                <Users className="h-6 w-6" />
              </div>

              <div>
                <CardTitle className="text-xl text-white">スタッフログイン</CardTitle>
                <p className="mt-2 text-sm text-slate-300">
                  シフト確認・勤務報告を行う方はこちら
                </p>
              </div>
            </CardHeader>

            <CardContent className="space-y-5">
              <p className="text-sm leading-6 text-slate-300">
                確定シフトの確認、勤務不可情報の登録、就労報告の提出を行えます。
              </p>

              <Button
                asChild
                className="w-full rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white shadow-lg shadow-violet-500/20 hover:from-violet-400 hover:to-fuchsia-400 hover:text-white"
              >
                <Link href={session ? "/staff" : "/login"}>
                  スタッフとして進む
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </section>

        <section className="mt-8 rounded-2xl border border-white/10 bg-white/[0.05] p-4">
          <div className="flex flex-col gap-3 text-sm text-slate-300 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-2">
              <CalendarCheck className="h-4 w-4 text-blue-300" />
              <span>ログイン後、権限に応じた画面へ自動的に進みます。</span>
            </div>

            <span className="text-slate-400">
              Admin / Staff supported
            </span>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomePage;