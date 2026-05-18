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
import type { StaffCandidate } from "@/features/jobs/types";
import { formatMonth, formatYen } from "@/lib/format";

type JobCandidateTableProps = {
    candidates: StaffCandidate[];
};

export const JobCandidateTable = ({ candidates }: JobCandidateTableProps) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>候補スタッフ一覧</CardTitle>
            </CardHeader>

            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>名前</TableHead>
                            <TableHead>メールアドレス</TableHead>
                            <TableHead>勤め始めた年月</TableHead>
                            <TableHead className="text-right">時給</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {candidates.map((candidate) => (
                            <TableRow key={candidate.id}>
                                <TableCell className="font-medium">
                                    {candidate.name}
                                </TableCell>
                                <TableCell>{candidate.email}</TableCell>
                                <TableCell>{formatMonth(candidate.startedWorkingAt)}</TableCell>
                                <TableCell className="text-right">
                                    {formatYen(candidate.hourlyWage)}
                                </TableCell>
                            </TableRow>
                        ))}

                        {candidates.length === 0 && (
                            <TableRow>
                                <TableCell
                                    colSpan={4}
                                    className="py-8 text-center text-slate-500"
                                >
                                    候補スタッフがいません。
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
};