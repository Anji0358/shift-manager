import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { LinkButton } from "@/components/shared/link-button";
import { SubmitButton } from "@/components/shared/submit-button";
import { SuccessMessage } from "@/components/shared/success-message";
import { getEmployees } from "@/features/employees/queries";
import { deactivateEmployee } from "@/features/employees/actions";
import { formatMonth, formatYen } from "@/lib/format";
import type { EmployeeRole, EmploymentStatus } from "@prisma/client";

const roleLabel: Record<EmployeeRole, string> = {
    ADMIN: "管理者",
    STAFF: "スタッフ",
};

const employmentStatusLabel: Record<EmploymentStatus, string> = {
    ACTIVE: "在籍中",
    INACTIVE: "退職済み",
};

type AdminEmployeesPageProps = {
    searchParams: Promise<{
        message?: string;
    }>;
};

const AdminEmployeesPage = async ({
    searchParams,
}: AdminEmployeesPageProps) => {
    const { message } = await searchParams;
    const employees = await getEmployees();

    return (
        <div className="space-y-6">
            <section className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold">スタッフ管理</h1>
                    <p className="mt-2 text-slate-600">
                        スタッフの基本情報、権限、時給、在籍状況を管理します。
                    </p>
                </div>

                <LinkButton
                    href="/admin/employees/new"
                    pendingText="追加画面へ移動中..."
                >
                    スタッフを追加
                </LinkButton>
            </section>

            <SuccessMessage message={message} />

            <Card>
                <CardHeader>
                    <CardTitle>スタッフ一覧</CardTitle>
                </CardHeader>

                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>名前</TableHead>
                                <TableHead>メールアドレス</TableHead>
                                <TableHead>権限</TableHead>
                                <TableHead className="text-right">時給</TableHead>
                                <TableHead>勤め始めた年月</TableHead>
                                <TableHead>在籍状況</TableHead>
                                <TableHead className="text-right">操作</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {employees.map((employee) => (
                                <TableRow key={employee.id}>
                                    <TableCell className="font-medium">
                                        {employee.name}
                                    </TableCell>

                                    <TableCell>{employee.email}</TableCell>

                                    <TableCell>
                                        <Badge
                                            variant={
                                                employee.role === "ADMIN" ? "default" : "secondary"
                                            }
                                        >
                                            {roleLabel[employee.role]}
                                        </Badge>
                                    </TableCell>

                                    <TableCell className="text-right">
                                        {formatYen(employee.hourlyWage)}
                                    </TableCell>

                                    <TableCell>
                                        {formatMonth(employee.startedWorkingAt)}
                                    </TableCell>

                                    <TableCell>
                                        <Badge
                                            variant={
                                                employee.employmentStatus === "ACTIVE"
                                                    ? "secondary"
                                                    : "outline"
                                            }
                                        >
                                            {employmentStatusLabel[employee.employmentStatus]}
                                        </Badge>
                                    </TableCell>

                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <LinkButton
                                                href={`/admin/employees/${employee.id}/edit`}
                                                size="sm"
                                                variant="outline"
                                                pendingText="編集画面へ移動中..."
                                            >
                                                編集
                                            </LinkButton>

                                            {employee.employmentStatus === "ACTIVE" && (
                                                <form action={deactivateEmployee}>
                                                    <input
                                                        type="hidden"
                                                        name="employeeId"
                                                        value={employee.id}
                                                    />

                                                    <SubmitButton
                                                        size="sm"
                                                        variant="outline"
                                                        pendingText="処理中..."
                                                    >
                                                        退職済みにする
                                                    </SubmitButton>
                                                </form>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}

                            {employees.length === 0 && (
                                <TableRow>
                                    <TableCell
                                        colSpan={7}
                                        className="py-8 text-center text-sm text-slate-500"
                                    >
                                        登録されているスタッフはいません。
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default AdminEmployeesPage;