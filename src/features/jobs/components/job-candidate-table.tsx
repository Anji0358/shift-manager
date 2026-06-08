import { BridalCard } from "@/components/shared/bridal-card";
import { bridalStyles } from "@/components/shared/design-tokens";
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
                            候補スタッフ一覧
                        </CardTitle>
                        <p className="mt-1 text-sm text-slate-500">
                            現在登録されているスタッフ候補を確認します。
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
                                    勤め始めた年月
                                </TableHead>

                                <TableHead
                                    className={[
                                        bridalStyles.table.head,
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
                                    className={bridalStyles.table.row}
                                >
                                    <TableCell>
                                        <p
                                            className={[
                                                bridalStyles.text.title,
                                                "text-base",
                                            ].join(" ")}
                                        >
                                            {candidate.name}
                                        </p>
                                    </TableCell>

                                    <TableCell className="text-sm text-slate-600">
                                        {candidate.email}
                                    </TableCell>

                                    <TableCell className="whitespace-nowrap text-sm text-slate-600">
                                        {formatMonth(candidate.startedWorkingAt)}
                                    </TableCell>

                                    <TableCell className="whitespace-nowrap text-right text-sm font-medium text-slate-900">
                                        {formatYen(candidate.hourlyWage)}
                                    </TableCell>
                                </TableRow>
                            ))}

                            {candidates.length === 0 && (
                                <TableRow>
                                    <TableCell
                                        colSpan={4}
                                        className="py-10 text-center text-sm text-slate-500"
                                    >
                                        候補スタッフがいません。
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </BridalCard>
    );
};