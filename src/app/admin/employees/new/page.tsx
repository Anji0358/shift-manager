import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { LinkButton } from "@/components/shared/link-button";
import { EmployeeCreateForm } from "@/features/employees/components/employee-create-form";

const AdminNewEmployeePage = () => {
    return (
        <div className="space-y-6">
            <section>
                <h1 className="text-3xl font-bold">スタッフ追加</h1>
                <p className="mt-2 text-slate-600">
                    スタッフの名前、メールアドレス、権限、時給、勤務開始日、初期パスワードを登録します。
                </p>
            </section>

            <Card>
                <CardHeader>
                    <CardTitle>スタッフ情報</CardTitle>
                </CardHeader>

                <CardContent className="space-y-6">
                    <EmployeeCreateForm />

                    <div className="flex justify-end">
                        <LinkButton
                            href="/admin/employees"
                            variant="outline"
                            pendingText="スタッフ一覧へ移動中..."
                        >
                            一覧に戻る
                        </LinkButton>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default AdminNewEmployeePage;