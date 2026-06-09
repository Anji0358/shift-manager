import {
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { LinkButton } from "@/components/shared/link-button";
import { PageShell } from "@/components/shared/page-shell";
import { PageHeader } from "@/components/shared/page-header";
import { BridalCard } from "@/components/shared/bridal-card";
import { bridalStyles } from "@/components/shared/design-tokens";
import { EmployeeCreateForm } from "@/features/employees/components/employee-create-form";
import {
    ArrowLeft,
    UserPlus,
} from "lucide-react";

const AdminNewEmployeePage = () => {
    return (
        <PageShell>
            <PageHeader
                title="スタッフ追加"
                description="スタッフの名前、メールアドレス、権限、時給、勤務開始日、初期パスワードを登録します。"
                action={
                    <LinkButton
                        href="/admin/employees"
                        variant="outline"
                        pendingText="スタッフ一覧へ移動中..."
                        className={bridalStyles.button.secondary}
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        スタッフ一覧へ戻る
                    </LinkButton>
                }
            />

            <BridalCard>
                <CardHeader className="p-5 pb-3">
                    <div className="flex items-start gap-3">
                        <div className={bridalStyles.icon.circle}>
                            <UserPlus className="h-5 w-5" />
                        </div>

                        <div>
                            <CardTitle
                                className={[
                                    bridalStyles.text.title,
                                    "text-xl",
                                ].join(" ")}
                            >
                                スタッフ情報
                            </CardTitle>
                            <p className="mt-1 text-sm text-slate-500">
                                登録後、スタッフは設定されたメールアドレスと初期パスワードでログインできます。
                            </p>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="space-y-6 p-5 pt-2">
                    <EmployeeCreateForm />

                    <div className="flex justify-end border-t border-[#f0e5d0] pt-5">
                        <LinkButton
                            href="/admin/employees"
                            variant="outline"
                            pendingText="スタッフ一覧へ移動中..."
                            className={bridalStyles.button.secondary}
                        >
                            一覧に戻る
                        </LinkButton>
                    </div>
                </CardContent>
            </BridalCard>
        </PageShell>
    );
};

export default AdminNewEmployeePage;