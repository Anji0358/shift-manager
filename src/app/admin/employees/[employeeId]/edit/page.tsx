import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { SuccessMessage } from "@/components/shared/success-message";
import { updateEmployee } from "@/features/employees/actions";
import { getEmployeeById } from "@/features/employees/queries";

type AdminEmployeeEditPageProps = {
    params: Promise<{
        employeeId: string;
    }>;
    searchParams: Promise<{
        message?: string;
    }>;
};

const formatMonthInputValue = (date: Date) => {
    return date.toISOString().slice(0, 7);
};

const AdminEmployeeEditPage = async ({
    params,
    searchParams,
}: AdminEmployeeEditPageProps) => {
    const { employeeId } = await params;
    const { message } = await searchParams;

    const employee = await getEmployeeById(employeeId);

    if (!employee) {
        notFound();
    }

    return (
        <div className="space-y-8">
            <section className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold">スタッフ情報編集</h1>
                    <p className="mt-2 text-slate-600">
                        「{employee.name}」の基本情報とログイン情報を編集します。
                    </p>
                </div>

                <Button asChild variant="outline">
                    <Link href="/admin/employees">スタッフ一覧へ戻る</Link>
                </Button>
            </section>

            <SuccessMessage message={message} />

            <Card>
                <CardHeader>
                    <CardTitle>基本情報</CardTitle>
                </CardHeader>

                <CardContent>
                    <form action={updateEmployee} className="space-y-6">
                        <input type="hidden" name="employeeId" value={employee.id} />

                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="name">名前</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    defaultValue={employee.name}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">メールアドレス</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    defaultValue={employee.email}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>権限</Label>
                                <Select name="role" defaultValue={employee.role}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="権限を選択" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ADMIN">管理者</SelectItem>
                                        <SelectItem value="STAFF">スタッフ</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>在籍状況</Label>
                                <Select
                                    name="employmentStatus"
                                    defaultValue={employee.employmentStatus}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="在籍状況を選択" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ACTIVE">在籍中</SelectItem>
                                        <SelectItem value="INACTIVE">退職済み</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="hourlyWage">時給</Label>
                                <Input
                                    id="hourlyWage"
                                    name="hourlyWage"
                                    type="number"
                                    min={0}
                                    step={1}
                                    defaultValue={employee.hourlyWage}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="startedWorkingAt">勤め始めた年月</Label>
                                <Input
                                    id="startedWorkingAt"
                                    name="startedWorkingAt"
                                    type="month"
                                    defaultValue={formatMonthInputValue(employee.startedWorkingAt)}
                                    required
                                />
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="newPassword">新しいパスワード</Label>
                                <Input
                                    id="newPassword"
                                    name="newPassword"
                                    type="password"
                                    placeholder="変更する場合のみ入力"
                                />
                                <p className="text-sm text-slate-500">
                                    空欄の場合、現在のパスワードは変更されません。
                                    入力した場合は、このパスワードでスタッフがログインできるようになります。
                                </p>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3">
                            <Button asChild variant="outline">
                                <Link href="/admin/employees">キャンセル</Link>
                            </Button>

                            <Button type="submit">保存する</Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default AdminEmployeeEditPage;