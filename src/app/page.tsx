import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const HomePage = () => {
  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <h1 className="text-3xl font-bold">
          ケータリング現場向けシフト管理アプリ
        </h1>
        <p className="max-w-2xl text-slate-600">
          案件登録、勤務不可情報、候補者確認、シフト確定、就労報告、
          給与見込み計算までを一元管理するアプリです。
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>管理者</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-slate-600">
              案件管理、従業員管理、シフト確定、就労報告承認を行います。
            </p>
            <Button asChild>
              <Link href="/admin">管理者画面へ</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>従業員</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-slate-600">
              勤務不可情報の登録、確定シフト確認、就労報告提出を行います。
            </p>
            <Button asChild variant="secondary">
              <Link href="/staff">従業員画面へ</Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default HomePage;