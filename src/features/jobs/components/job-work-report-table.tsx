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
import { workReportStatusLabel } from "@/features/jobs/labels";
import type { JobDetail } from "@/features/jobs/types";
import { formatDate, formatYen } from "@/lib/format";

type WorkReportWithEmployee = JobDetail["workReports"][number];

type JobWorkReportTableProps = {
    reports: WorkReportWithEmployee[];
};

export const JobWorkReportTable = ({ reports }: JobWorkReportTableProps) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>就労報告一覧</CardTitle>
            </CardHeader>

            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>氏名</TableHead>
                            <TableHead>ステータス</TableHead>
                            <TableHead>実働時間</TableHead>
                            <TableHead>休憩</TableHead>
                            <TableHead>交通費</TableHead>
                            <TableHead>食事</TableHead>
                            <TableHead>提出日時</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {reports.map((report) => (
                            <TableRow key={report.id}>
                                <TableCell className="font-medium">
                                    {report.employee.name}
                                </TableCell>
                                <TableCell>
                                    <Badge variant="secondary">
                                        {workReportStatusLabel[report.status]}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    {report.actualStartTime}〜{report.actualEndTime}
                                </TableCell>
                                <TableCell>{report.actualBreakMinutes}分</TableCell>
                                <TableCell>{formatYen(report.transportationFee)}</TableCell>
                                <TableCell>{report.hasMeal ? "あり" : "なし"}</TableCell>
                                <TableCell>{formatDate(report.createdAt)}</TableCell>
                            </TableRow>
                        ))}

                        {reports.length === 0 && (
                            <TableRow>
                                <TableCell
                                    colSpan={7}
                                    className="py-8 text-center text-slate-500"
                                >
                                    就労報告はまだありません。
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
};