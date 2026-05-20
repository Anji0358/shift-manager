import Link from "next/link";
import { Button } from "@/components/ui/button";

const EmployeeMonthlySummaryNotFound = () => {
    return (
        <div className="space-y-6">
            <section>
                <h1 className="text-3xl font-bold">給与明細が見つかりません</h1>
                <p className="mt-2 text-slate-600">
                    指定されたスタッフの対象月の就労報告が存在しないため、給与明細を表示できません。
                </p>
            </section>

            <Button asChild variant="outline">
                <Link href="/admin/monthly-summary">
                    月次集計へ戻る
                </Link>
            </Button>
        </div>
    );
};

export default EmployeeMonthlySummaryNotFound;