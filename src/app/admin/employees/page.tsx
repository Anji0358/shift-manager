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
import { mockEmployees } from "@/features/shared/mock-data";

const roleLabel = {
    ADMIN: "管理者",
    STAFF: "従業員",
};

const employmentStatusLabel = {
    ACTIVE: "在籍中",
    INACTIVE: "退職済み",
};

const AdminEmployeesPage = () => {
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
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {mockEmployees.map((employee) => (
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
                                        {employee.hourlyWage.toLocaleString()}円
                                    </TableCell>
                                    <TableCell>{employee.startedWorkingAt}</TableCell>
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