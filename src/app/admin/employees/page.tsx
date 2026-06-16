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
import { AppCard } from "@/components/shared/app-card";
import { appStyles } from "@/components/shared/design-tokens";
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
        return appStyles.badge.fulfilled;
    }

    return appStyles.badge.neutral;
};

const getEmploymentStatusBadgeClassName = (status: EmploymentStatus) => {
    if (status === "ACTIVE") {
        return appStyles.badge.fulfilled;
    }

    return appStyles.badge.neutral;
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
                        className={appStyles.button.primary}
                    >
                        <UserPlus className="mr-2 h-4 w-4" />
                        スタッフを追加
                    </LinkButton>
                }
            />

            <div className="space-y-6">
                {message ? (
                    <div className={appStyles.section.message}>
                        <SuccessMessage message={message} />
                    </div>
                ) : null}

                <AppCard className="overflow-hidden">
                    <CardHeader className="p-5 pb-3">
                        <div className="flex items-start gap-3">
                            <div className={appStyles.icon.circle}>
                                <UsersRound className="h-5 w-5" />
                            </div>

                            <div>
                                <CardTitle
                                    className={[
                                        appStyles.text.title,
                                        "text-xl",
                                    ].join(" ")}
                                >
                                    スタッフ一覧
                                </CardTitle>
                                <p className={["mt-1", appStyles.text.muted].join(" ")}>
                                    登録スタッフの権限、時給、在籍状況を確認します。
                                </p>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="p-5 pt-2">
                        <div className={appStyles.table.wrapper}>
                            <Table>
                                <TableHeader>
                                    <TableRow className={appStyles.table.headerRow}>
                                        <TableHead className={appStyles.table.head}>
                                            名前
                                        </TableHead>

                                        <TableHead className={appStyles.table.head}>
                                            メールアドレス
                                        </TableHead>

                                        <TableHead className={appStyles.table.head}>
                                            権限
                                        </TableHead>

                                        <TableHead
                                            className={[
                                                appStyles.table.head,
                                                "text-right",
                                            ].join(" ")}
                                        >
                                            時給
                                        </TableHead>

                                        <TableHead className={appStyles.table.head}>
                                            勤め始めた年月
                                        </TableHead>

                                        <TableHead className={appStyles.table.head}>
                                            在籍状況
                                        </TableHead>

                                        <TableHead
                                            className={[
                                                appStyles.table.head,
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
                                            className={appStyles.table.row}
                                        >
                                            <TableCell>
                                                <p
                                                    className={[
                                                        appStyles.text.title,
                                                        "text-base",
                                                    ].join(" ")}
                                                >
                                                    {employee.name}
                                                </p>
                                            </TableCell>

                                            <TableCell className={appStyles.table.cellMuted}>
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

                                            <TableCell
                                                className={[
                                                    "whitespace-nowrap text-right text-sm font-medium",
                                                    appStyles.textColor.default,
                                                ].join(" ")}
                                            >
                                                {formatYen(employee.hourlyWage)}
                                            </TableCell>

                                            <TableCell
                                                className={[
                                                    "whitespace-nowrap",
                                                    appStyles.table.cellMuted,
                                                ].join(" ")}
                                            >
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
                                                        className={appStyles.button.secondary}
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
                                                                className={appStyles.button.danger}
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
                                                className={appStyles.table.empty}
                                            >
                                                登録されているスタッフはいません。
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </AppCard>
            </div>
        </PageShell>
    );
};

export default AdminEmployeesPage;