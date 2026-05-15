import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { EmployeeCreateForm } from "@/features/employees/components/employee-create-form";

const AdminNewEmployeePage = () => {
    return (
        <div className="space-y-6">
            <section>
                <h1 className="text-3xl font-bold">従業員追加</h1>
                <p className="mt-2 text-slate-600">
                    従業員の名前、メールアドレス、権限、時給、勤務開始日、初期パスワードを登録します。
                </p>
            </section>

            <Card>
                <CardHeader>
                    <CardTitle>従業員情報</CardTitle>
                </CardHeader>

                <CardContent className="space-y-6">
                    <EmployeeCreateForm />

                    <div className="flex justify-end">
                        <Button asChild variant="outline">
                            <Link href="/admin/employees">一覧に戻る</Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default AdminNewEmployeePage;