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
      <div className="relative min-h-screen overflow-hidden bg-[#fffdf8]">
        {/* 背景画像 */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-[620px] bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/images/catering-background.png')",
          }}
        />

        {/* 背景を白く上品に見せるオーバーレイ */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[620px] bg-white/30" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[620px] bg-[linear-gradient(90deg,_rgba(255,255,255,0.05),_rgba(255,255,255,0.86)_32%,_rgba(255,255,255,0.86)_68%,_rgba(255,255,255,0.08))]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[640px] bg-gradient-to-b from-white/5 via-white/25 to-[#fffdf8]" />

        {/* 装飾 */}
        <div className="pointer-events-none absolute left-1/2 top-20 h-56 w-56 -translate-x-1/2 rounded-full bg-white/70 blur-3xl" />
        <div className="pointer-events-none absolute -left-16 bottom-24 h-44 w-44 rounded-full bg-amber-100/40 blur-3xl" />
        <div className="pointer-events-none absolute -right-16 bottom-20 h-52 w-52 rounded-full bg-yellow-100/50 blur-3xl" />

        <div className="relative z-10 px-4 py-6 md:px-8 md:py-8">
          {/* Hero */}
          <section className="mx-auto max-w-5xl space-y-4 pt-6 text-center md:pt-8">
            <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-[#d6b56d]/50 bg-white/82 px-4 py-1.5 text-xs font-medium text-[#b8872d] shadow-sm shadow-yellow-900/5 backdrop-blur md:text-sm">
              <span className="text-[#c79a45]">✦</span>
              <Utensils className="h-3.5 w-3.5 text-[#b8872d]" />
              <span>Catering Shift Management</span>
              <span className="text-[#c79a45]">✦</span>
            </div>

            <div className="space-y-3">
              <h1 className="font-serif text-5xl font-medium tracking-tight text-[#b8872d] drop-shadow-sm md:text-7xl">
                Shift Manager
              </h1>

              <div className="mx-auto flex max-w-xs items-center justify-center gap-3 text-[#c79a45]">
                <span className="h-px flex-1 bg-gradient-to-r from-transparent to-[#d6b56d]" />
                <span className="text-base">∞</span>
                <span className="h-px flex-1 bg-gradient-to-l from-transparent to-[#d6b56d]" />
              </div>

              <p className="text-lg font-semibold tracking-wide text-slate-900 md:text-xl">
                現場のシフト管理を、もっとスマートに。
              </p>

              <p className="mx-auto max-w-3xl text-sm leading-7 text-slate-700 md:text-base">
                案件管理、勤務枠、スタッフ割り振り、勤務不可情報、就労報告、月次集計までを一元管理。
                ケータリング現場の複雑なシフト運用を、シンプルに整理します。
              </p>
            </div>

            {/* 機能ナビ */}
            <div className="mx-auto grid max-w-5xl gap-3 pt-3 text-left md:grid-cols-3">
              <div className="group rounded-2xl border border-[#e8d8b8] bg-white/88 p-4 shadow-lg shadow-yellow-900/5 backdrop-blur transition hover:-translate-y-0.5 hover:bg-white">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#ead9b5] bg-[#fffaf0] text-[#b8872d]">
                    <ClipboardList className="h-5 w-5" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h2 className="font-serif text-xl font-medium text-slate-900">
                      案件管理
                    </h2>
                    <p className="mt-0.5 text-xs text-slate-500">
                      案件の登録・確認・編集
                    </p>
                  </div>

                  <ArrowRight className="h-4 w-4 text-[#b8872d] transition group-hover:translate-x-1" />
                </div>
              </div>

              <div className="group rounded-2xl border border-[#e8d8b8] bg-white/88 p-4 shadow-lg shadow-yellow-900/5 backdrop-blur transition hover:-translate-y-0.5 hover:bg-white">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#ead9b5] bg-[#fffaf0] text-[#b8872d]">
                    <Users className="h-5 w-5" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h2 className="font-serif text-xl font-medium text-slate-900">
                      スタッフ割り振り
                    </h2>
                    <p className="mt-0.5 text-xs text-slate-500">
                      シフト作成・スタッフ配置
                    </p>
                  </div>

                  <ArrowRight className="h-4 w-4 text-[#b8872d] transition group-hover:translate-x-1" />
                </div>
              </div>

              <div className="group rounded-2xl border border-[#e8d8b8] bg-white/88 p-4 shadow-lg shadow-yellow-900/5 backdrop-blur transition hover:-translate-y-0.5 hover:bg-white">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#ead9b5] bg-[#fffaf0] text-[#b8872d]">
                    <BarChart3 className="h-5 w-5" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h2 className="font-serif text-xl font-medium text-slate-900">
                      月次集計
                    </h2>
                    <p className="mt-0.5 text-xs text-slate-500">
                      集計・レポート・出力
                    </p>
                  </div>

                  <ArrowRight className="h-4 w-4 text-[#b8872d] transition group-hover:translate-x-1" />
                </div>
              </div>
            </div>
          </section>

          {/* Login Cards */}
          <section className="mx-auto mt-6 grid max-w-5xl gap-4 md:grid-cols-2">
            <Card className="group overflow-hidden rounded-2xl border-[#eadcc1] bg-white/88 text-slate-900 shadow-lg shadow-yellow-900/5 backdrop-blur transition hover:-translate-y-0.5 hover:bg-white hover:shadow-xl">
              <CardHeader className="space-y-3 border-b border-[#f0e5d0] bg-white/45 p-5">
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#ead9b5] bg-[#fffaf0] text-[#b8872d]">
                    <LayoutDashboard className="h-5 w-5" />
                  </div>

                  <div>
                    <CardTitle className="font-serif text-xl font-medium text-slate-900">
                      管理者ログイン
                    </CardTitle>
                    <p className="mt-1 text-sm text-slate-600">
                      案件・スタッフ・集計を管理する方はこちら
                    </p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4 p-5">
                <p className="text-sm leading-6 text-slate-600">
                  案件作成、勤務枠作成、スタッフ割り振り、就労報告の確認、月次集計、メッセージ生成を行えます。
                </p>

                <Button
                  asChild
                  className="h-11 w-full rounded-xl bg-[#b8872d] text-white shadow-md shadow-yellow-900/10 hover:bg-[#a77925] hover:text-white"
                >
                  <Link href={session ? "/admin" : "/login"}>
                    管理者として進む
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="group overflow-hidden rounded-2xl border-[#eadcc1] bg-white/88 text-slate-900 shadow-lg shadow-yellow-900/5 backdrop-blur transition hover:-translate-y-0.5 hover:bg-white hover:shadow-xl">
              <CardHeader className="space-y-3 border-b border-[#f0e5d0] bg-white/45 p-5">
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#ead9b5] bg-[#fffaf0] text-[#b8872d]">
                    <Users className="h-5 w-5" />
                  </div>

                  <div>
                    <CardTitle className="font-serif text-xl font-medium text-slate-900">
                      スタッフログイン
                    </CardTitle>
                    <p className="mt-1 text-sm text-slate-600">
                      シフト確認・勤務報告を行う方はこちら
                    </p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4 p-5">
                <p className="text-sm leading-6 text-slate-600">
                  確定シフトの確認、勤務不可情報の登録、就労報告の提出を行えます。
                </p>

                <Button
                  asChild
                  className="h-11 w-full rounded-xl bg-slate-900 text-white shadow-md shadow-slate-900/10 hover:bg-slate-700 hover:text-white"
                >
                  <Link href={session ? "/staff" : "/login"}>
                    スタッフとして進む
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </section>

          {/* Notice */}
          <section className="mx-auto mt-4 max-w-5xl rounded-2xl border border-[#eadcc1] bg-white/78 p-4 shadow-md shadow-yellow-900/5 backdrop-blur">
            <div className="flex flex-col gap-2 text-sm text-slate-700 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-2">
                <CalendarCheck className="h-4 w-4 text-[#b8872d]" />
                <span>
                  ログイン後、権限に応じた画面へ自動的に進みます。
                </span>
              </div>

              <div className="flex items-center gap-2 text-[#b8872d]">
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