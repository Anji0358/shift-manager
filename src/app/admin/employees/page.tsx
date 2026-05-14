import Link from "next/link";
import { Button } from "@/components/ui/button";
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
import { getEmployees } from "@/features/employees/queries";
import { formatMonth, formatYen } from "@/lib/format";
import type { EmployeeRole, EmploymentStatus } from "@prisma/client";
import { deactivateEmployee } from "@/features/employees/actions";

const roleLabel: Record<EmployeeRole, string> = {
    ADMIN: "管理者",
    STAFF: "従業員",
};

const employmentStatusLabel: Record<EmploymentStatus, string> = {
    ACTIVE: "在籍中",
    INACTIVE: "退職済み",
};

const AdminEmployeesPage = async () => {
    const employees = await getEmployees();

    return (
        <div className="space-y-6">
            <section className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">従業員管理</h1>
                    <p className="mt-2 text-slate-600">
                        従業員の基本情報、権限、時給、在籍状況を管理します。
                    </p>
                </div>

                <Button asChild>
                    <Link href="/admin/employees/new">従業員を追加</Link>
                </Button>
            </section>

            <Card>
                <CardHeader>
                    <CardTitle>従業員一覧</CardTitle>
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
                                    <TableCell className="font-medium">{employee.name}</TableCell>
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
                                    <TableCell>{formatMonth(employee.startedWorkingAt)}</TableCell>
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
                                        {employee.employmentStatus === "ACTIVE" ? (
                                            <form action={deactivateEmployee}>
                                                <input type="hidden" name="employeeId" value={employee.id} />
                                                <Button size="sm" type="submit" variant="outline">
                                                    退職済みにする
                                                </Button>
                                            </form>
                                        ) : (
                                            <span className="text-sm text-slate-400">退職済み</span>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default AdminEmployeesPage;