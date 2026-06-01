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
  BarChart3,
  CalendarCheck,
  ClipboardList,
  LayoutDashboard,
  ShieldCheck,
  Users,
  Utensils,
} from "lucide-react";

const HomePage = async () => {
  const session = await auth();

  return (
    <div className="relative left-1/2 min-h-screen w-screen -translate-x-1/2 overflow-hidden bg-white">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(251,146,60,0.2),_transparent_32%),radial-gradient(circle_at_top_right,_rgba(34,197,94,0.16),_transparent_30%),linear-gradient(135deg,_#fff7ed,_#ffffff_48%,_#ecfdf5)]" />

      <div className="relative min-h-screen overflow-hidden bg-white px-4 py-8 md:px-8 md:py-10">
        <div
          className="pointer-events-none absolute left-0 top-0 h-[500px] w-[52%] bg-cover bg-left opacity-100 md:w-[46%]"
          style={{
            backgroundImage: "url('/images/catering-table.png')",
          }}
        />

        <div
          className="pointer-events-none absolute right-0 top-0 h-[500px] w-[52%] bg-cover bg-right opacity-100 md:w-[46%]"
          style={{
            backgroundImage: "url('/images/catering-food.png')",
          }}
        />

        <div className="pointer-events-none absolute inset-x-0 top-0 h-[520px] bg-[linear-gradient(90deg,_rgba(255,255,255,0.08),_rgba(255,255,255,0.78)_34%,_rgba(255,255,255,0.78)_66%,_rgba(255,255,255,0.08))]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[520px] bg-gradient-to-b from-white/0 via-white/20 to-white" />

        <div className="pointer-events-none absolute -left-10 bottom-20 h-40 w-40 rounded-full bg-orange-100/60 blur-3xl" />
        <div className="pointer-events-none absolute -right-10 bottom-16 h-48 w-48 rounded-full bg-emerald-100/70 blur-3xl" />

        <div className="relative z-10">
          <section className="mx-auto max-w-4xl space-y-6 pt-10 text-center md:pt-12">
            <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50/90 px-4 py-2 text-sm font-medium text-orange-700 shadow-sm backdrop-blur">
              <Utensils className="h-4 w-4 text-orange-500" />
              Catering Shift Management
            </div>

            <div className="space-y-4">
              <h1 className="bg-gradient-to-r from-orange-600 via-amber-600 to-emerald-700 bg-clip-text text-5xl font-bold tracking-tight text-transparent md:text-7xl">
                Shift Manager
              </h1>

              <p className="text-lg font-semibold text-slate-900 md:text-2xl">
                現場のシフト管理を、もっとスマートに。
              </p>

              <p className="mx-auto max-w-3xl leading-8 text-slate-700">
                案件管理、勤務枠、スタッフ割り振り、勤務不可情報、就労報告、月次集計までを一元管理。
                ケータリング現場の複雑なシフト運用を、シンプルに整理します。
              </p>
            </div>

            <div className="mx-auto grid max-w-3xl gap-3 pt-4 text-sm text-slate-700 md:grid-cols-3">
              <div className="rounded-xl border border-orange-100 bg-white/90 px-4 py-3 shadow-sm backdrop-blur">
                <div className="flex items-center justify-center gap-2">
                  <ClipboardList className="h-4 w-4 text-orange-500" />
                  <span className="font-medium">案件管理</span>
                </div>
              </div>

              <div className="rounded-xl border border-emerald-100 bg-white/90 px-4 py-3 shadow-sm backdrop-blur">
                <div className="flex items-center justify-center gap-2">
                  <Users className="h-4 w-4 text-emerald-600" />
                  <span className="font-medium">スタッフ割り振り</span>
                </div>
              </div>

              <div className="rounded-xl border border-amber-100 bg-white/90 px-4 py-3 shadow-sm backdrop-blur">
                <div className="flex items-center justify-center gap-2">
                  <BarChart3 className="h-4 w-4 text-amber-500" />
                  <span className="font-medium">月次集計</span>
                </div>
              </div>
            </div>
          </section>

          <section className="mx-auto mt-12 grid max-w-7xl gap-6 md:grid-cols-2">
            <Card className="group rounded-2xl border-orange-100 bg-white/95 text-slate-900 shadow-lg shadow-orange-100/50 backdrop-blur transition hover:-translate-y-1 hover:border-orange-200 hover:shadow-xl">
              <CardHeader className="space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-orange-600 ring-1 ring-orange-200">
                  <LayoutDashboard className="h-6 w-6" />
                </div>

                <div>
                  <CardTitle className="text-xl text-slate-900">
                    管理者ログイン
                  </CardTitle>
                  <p className="mt-2 text-sm text-slate-600">
                    案件・スタッフ・集計を管理する方はこちら
                  </p>
                </div>
              </CardHeader>

              <CardContent className="space-y-5">
                <p className="text-sm leading-6 text-slate-600">
                  案件作成、勤務枠作成、スタッフ割り振り、就労報告の確認、月次集計、メッセージ生成を行えます。
                </p>

                <Button
                  asChild
                  className="w-full rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/20 hover:from-orange-400 hover:to-amber-400 hover:text-white"
                >
                  <Link href={session ? "/admin" : "/login"}>
                    管理者として進む
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="group rounded-2xl border-emerald-100 bg-white/95 text-slate-900 shadow-lg shadow-emerald-100/50 backdrop-blur transition hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl">
              <CardHeader className="space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200">
                  <Users className="h-6 w-6" />
                </div>

                <div>
                  <CardTitle className="text-xl text-slate-900">
                    スタッフログイン
                  </CardTitle>
                  <p className="mt-2 text-sm text-slate-600">
                    シフト確認・勤務報告を行う方はこちら
                  </p>
                </div>
              </CardHeader>

              <CardContent className="space-y-5">
                <p className="text-sm leading-6 text-slate-600">
                  確定シフトの確認、勤務不可情報の登録、就労報告の提出を行えます。
                </p>

                <Button
                  asChild
                  className="w-full rounded-xl bg-gradient-to-r from-emerald-600 to-green-500 text-white shadow-lg shadow-emerald-500/20 hover:from-emerald-500 hover:to-green-400 hover:text-white"
                >
                  <Link href={session ? "/staff" : "/login"}>
                    スタッフとして進む
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </section>

          <section className="mx-auto mt-8 max-w-7xl rounded-2xl border border-orange-100 bg-orange-50/80 p-4 backdrop-blur">
            <div className="flex flex-col gap-3 text-sm text-slate-700 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-2">
                <CalendarCheck className="h-4 w-4 text-emerald-600" />
                <span>
                  ログイン後、権限に応じた画面へ自動的に進みます。
                </span>
              </div>

              <div className="flex items-center gap-2 text-emerald-700">
                <ShieldCheck className="h-4 w-4" />
                <span>Admin / Staff supported</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default HomePage;