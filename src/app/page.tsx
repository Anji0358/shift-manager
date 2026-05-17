import Link from "next/link";
import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const HomePage = async () => {
  const session = await auth();

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-5xl flex-col justify-center space-y-8">
      <section className="space-y-3 text-center">
        <p className="text-sm font-medium text-slate-500">
          Catering Shift Management
        </p>
        <h1 className="text-4xl font-bold tracking-tight">Shift Manager</h1>
        <p className="mx-auto max-w-2xl text-slate-600">
          ケータリング現場向けに、案件管理・シフト確定・勤務不可情報・就労報告・月次集計を一元管理するアプリです。
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>管理メニュー</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-slate-600">
              案件作成、勤務枠作成、シフト確定、就労報告の承認を行います。
            </p>
            <Button asChild className="w-full">
              <Link href={session ? "/admin" : "/login"}>
                管理メニューへ
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>スタッフメニュー</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-slate-600">
              確定シフトの確認、勤務不可情報の登録、就労報告の提出を行います。
            </p>
            <Button asChild variant="outline" className="w-full">
              <Link href={session ? "/staff" : "/login"}>
                スタッフメニューへ
              </Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default HomePage;