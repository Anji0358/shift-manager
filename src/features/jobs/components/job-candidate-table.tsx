import { AppCard } from "@/components/shared/bridal-card";
import { appStyles } from "@/components/shared/design-tokens";
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
import type { StaffCandidate } from "@/features/jobs/types";
import { formatMonth, formatYen } from "@/lib/format";
import { UsersRound } from "lucide-react";

type JobCandidateTableProps = {
    candidates: StaffCandidate[];
};

export const JobCandidateTable = ({ candidates }: JobCandidateTableProps) => {
    return (
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
                            候補スタッフ一覧
                        </CardTitle>
                        <p className={["mt-1", appStyles.text.muted].join(" ")}>
                            現在登録されているスタッフ候補を確認します。
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
                                    勤め始めた年月
                                </TableHead>

                                <TableHead
                                    className={[
                                        appStyles.table.head,
                                        "text-right",
                                    ].join(" ")}
                                >
                                    時給
                                </TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {candidates.map((candidate) => (
                                <TableRow
                                    key={candidate.id}
                                    className={appStyles.table.row}
                                >
                                    <TableCell>
                                        <p
                                            className={[
                                                appStyles.text.title,
                                                "text-base",
                                            ].join(" ")}
                                        >
                                            {candidate.name}
                                        </p>
                                    </TableCell>

                                    <TableCell className={appStyles.table.cellMuted}>
                                        {candidate.email}
                                    </TableCell>

                                    <TableCell
                                        className={[
                                            "whitespace-nowrap",
                                            appStyles.table.cellMuted,
                                        ].join(" ")}
                                    >
                                        {formatMonth(candidate.startedWorkingAt)}
                                    </TableCell>

                                    <TableCell
                                        className={[
                                            "whitespace-nowrap text-right text-sm font-medium",
                                            appStyles.textColor.default,
                                        ].join(" ")}
                                    >
                                        {formatYen(candidate.hourlyWage)}
                                    </TableCell>
                                </TableRow>
                            ))}

                            {candidates.length === 0 && (
                                <TableRow>
                                    <TableCell
                                        colSpan={4}
                                        className={appStyles.table.empty}
                                    >
                                        候補スタッフがいません。
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </AppCard>
    );
};