import {
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { LinkButton } from "@/components/shared/link-button";
import { PageShell } from "@/components/shared/page-shell";
import { PageHeader } from "@/components/shared/page-header";
import { AppCard } from "@/components/shared/app-card";
import { appStyles } from "@/components/shared/design-tokens";
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
                        className={appStyles.button.secondary}
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        スタッフ一覧へ戻る
                    </LinkButton>
                }
            />

            <AppCard>
                <CardHeader className="p-5 pb-3">
                    <div className="flex items-start gap-3">
                        <div className={appStyles.icon.circle}>
                            <UserPlus className="h-5 w-5" />
                        </div>

                        <div>
                            <CardTitle
                                className={[
                                    appStyles.text.title,
                                    "text-xl",
                                ].join(" ")}
                            >
                                スタッフ情報
                            </CardTitle>
                            <p className={["mt-1", appStyles.text.muted].join(" ")}>
                                登録後、スタッフは設定されたメールアドレスと初期パスワードでログインできます。
                            </p>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="space-y-6 p-5 pt-2">
                    <EmployeeCreateForm />

                    <div
                        className={[
                            "flex justify-end border-t pt-5",
                            appStyles.border.soft,
                        ].join(" ")}
                    >
                        <LinkButton
                            href="/admin/employees"
                            variant="outline"
                            pendingText="スタッフ一覧へ移動中..."
                            className={appStyles.button.secondary}
                        >
                            一覧に戻る
                        </LinkButton>
                    </div>
                </CardContent>
            </AppCard>
        </PageShell>
    );
};

export default AdminNewEmployeePage;