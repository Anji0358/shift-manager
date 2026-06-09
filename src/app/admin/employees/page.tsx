import { Badge } from "@/components/ui/badge";
import {
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
import { PageShell } from "@/components/shared/page-shell";
import { PageHeader } from "@/components/shared/page-header";
import { BridalCard } from "@/components/shared/bridal-card";
import { bridalStyles } from "@/components/shared/design-tokens";
import { getEmployees } from "@/features/employees/queries";
import { deactivateEmployee } from "@/features/employees/actions";
import { formatMonth, formatYen } from "@/lib/format";
import type { EmployeeRole, EmploymentStatus } from "@prisma/client";
import {
    PenLine,
    UserPlus,
    UsersRound,
} from "lucide-react";

const roleLabel: Record<EmployeeRole, string> = {
    ADMIN: "管理者",
    STAFF: "スタッフ",
};

const employmentStatusLabel: Record<EmploymentStatus, string> = {
    ACTIVE: "在籍中",
    INACTIVE: "退職済み",
};

const getRoleBadgeClassName = (role: EmployeeRole) => {
    if (role === "ADMIN") {
        return bridalStyles.badge.fulfilled;
    }

    return bridalStyles.badge.neutral;
};

const getEmploymentStatusBadgeClassName = (status: EmploymentStatus) => {
    if (status === "ACTIVE") {
        return bridalStyles.badge.fulfilled;
    }

    return "rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-500 shadow-none hover:bg-slate-50";
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
        <PageShell>
            <PageHeader
                title="スタッフ管理"
                description="スタッフの基本情報、権限、時給、在籍状況を管理します。"
                action={
                    <LinkButton
                        href="/admin/employees/new"
                        pendingText="追加画面へ移動中..."
                        className={bridalStyles.button.primary}
                    >
                        <UserPlus className="mr-2 h-4 w-4" />
                        スタッフを追加
                    </LinkButton>
                }
            />

            <div className="space-y-6">
                {message ? (
                    <div className={[bridalStyles.card.base, "px-5 py-4"].join(" ")}>
                        <SuccessMessage message={message} />
                    </div>
                ) : null}

                <BridalCard className="overflow-hidden">
                    <CardHeader className="p-5 pb-3">
                        <div className="flex items-start gap-3">
                            <div className={bridalStyles.icon.circle}>
                                <UsersRound className="h-5 w-5" />
                            </div>

                            <div>
                                <CardTitle
                                    className={[
                                        bridalStyles.text.title,
                                        "text-xl",
                                    ].join(" ")}
                                >
                                    スタッフ一覧
                                </CardTitle>
                                <p className="mt-1 text-sm text-slate-500">
                                    登録スタッフの権限、時給、在籍状況を確認します。
                                </p>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="p-5 pt-2">
                        <div className={bridalStyles.table.wrapper}>
                            <Table>
                                <TableHeader>
                                    <TableRow className={bridalStyles.table.headerRow}>
                                        <TableHead className={bridalStyles.table.head}>
                                            名前
                                        </TableHead>

                                        <TableHead className={bridalStyles.table.head}>
                                            メールアドレス
                                        </TableHead>

                                        <TableHead className={bridalStyles.table.head}>
                                            権限
                                        </TableHead>

                                        <TableHead
                                            className={[
                                                bridalStyles.table.head,
                                                "text-right",
                                            ].join(" ")}
                                        >
                                            時給
                                        </TableHead>

                                        <TableHead className={bridalStyles.table.head}>
                                            勤め始めた年月
                                        </TableHead>

                                        <TableHead className={bridalStyles.table.head}>
                                            在籍状況
                                        </TableHead>

                                        <TableHead
                                            className={[
                                                bridalStyles.table.head,
                                                "text-right",
                                            ].join(" ")}
                                        >
                                            操作
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>

                                <TableBody>
                                    {employees.map((employee) => (
                                        <TableRow
                                            key={employee.id}
                                            className={bridalStyles.table.row}
                                        >
                                            <TableCell>
                                                <p
                                                    className={[
                                                        bridalStyles.text.title,
                                                        "text-base",
                                                    ].join(" ")}
                                                >
                                                    {employee.name}
                                                </p>
                                            </TableCell>

                                            <TableCell className="text-sm text-slate-600">
                                                {employee.email}
                                            </TableCell>

                                            <TableCell>
                                                <Badge
                                                    className={getRoleBadgeClassName(
                                                        employee.role,
                                                    )}
                                                >
                                                    {roleLabel[employee.role]}
                                                </Badge>
                                            </TableCell>

                                            <TableCell className="whitespace-nowrap text-right text-sm font-medium text-slate-900">
                                                {formatYen(employee.hourlyWage)}
                                            </TableCell>

                                            <TableCell className="whitespace-nowrap text-sm text-slate-600">
                                                {formatMonth(employee.startedWorkingAt)}
                                            </TableCell>

                                            <TableCell>
                                                <Badge
                                                    className={getEmploymentStatusBadgeClassName(
                                                        employee.employmentStatus,
                                                    )}
                                                >
                                                    {
                                                        employmentStatusLabel[
                                                        employee.employmentStatus
                                                        ]
                                                    }
                                                </Badge>
                                            </TableCell>

                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <LinkButton
                                                        href={`/admin/employees/${employee.id}/edit`}
                                                        size="sm"
                                                        variant="outline"
                                                        pendingText="編集画面へ移動中..."
                                                        className={bridalStyles.button.secondary}
                                                    >
                                                        <PenLine className="mr-2 h-4 w-4" />
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
                                                                className={bridalStyles.button.danger}
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
                                                className="py-10 text-center text-sm text-slate-500"
                                            >
                                                登録されているスタッフはいません。
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </BridalCard>
            </div>
        </PageShell>
    );
};

export default AdminEmployeesPage;