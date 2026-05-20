import { LinkButton } from "@/components/shared/link-button";

const EmployeeMonthlySummaryNotFound = () => {
    return (
        <div className="space-y-6">
            <section>
                <h1 className="text-3xl font-bold">給与明細が見つかりません</h1>
                <p className="mt-2 text-slate-600">
                    指定されたスタッフの対象月の就労報告が存在しないため、給与明細を表示できません。
                </p>
            </section>

            <LinkButton href="/admin/monthly-summary" variant="outline">
                月次集計へ戻る
            </LinkButton>
        </div>
    );
};

export default EmployeeMonthlySummaryNotFound;