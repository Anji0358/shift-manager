import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { getUnavailableTimesByEmployeeId } from "@/features/unavailable-times/queries";
import { formatDate } from "@/lib/format";
import { deleteUnavailableTime } from "@/features/unavailable-times/actions";
import { SuccessMessage } from "@/components/shared/success-message";
import { ConfirmSubmitButton } from "@/components/shared/confirm-submit-button";
import { getCurrentEmployeeId } from "@/lib/auth/current-user";
import { UnavailableTimeCardList } from "@/features/unavailable-times/components/unavailable-time-card-list";
import {
    dayOfWeekLabel,
    unavailableTypeLabel,
} from "@/features/unavailable-times/labels";

type StaffUnavailableTimesPageProps = {
    searchParams: Promise<{
        message?: string;
    }>;
};

const StaffUnavailableTimesPage = async ({
    searchParams,
}: StaffUnavailableTimesPageProps) => {
    const { message } = await searchParams;
    const currentEmployeeId = await getCurrentEmployeeId();
    const myUnavailableTimes =
        await getUnavailableTimesByEmployeeId(currentEmployeeId);

    return (
        <div className="space-y-6">
            <section className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold">勤務できない日時</h1>
                    <p className="mt-2 text-slate-600">
                        登録した内容は、管理者がスタッフを割り振るときの候補者判定に使われます。
                        授業・予定・試験などで勤務できない日時を管理できます。
                    </p>
                </div>

                <div className="space-y-3 md:text-right">
                    <SuccessMessage message={message} />

                    <div className="flex flex-col gap-3 sm:flex-row md:justify-end">
                        <Button asChild>
                            <Link href="/staff/unavailable-times/new">
                                勤務できない日時を追加
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>

            <Card>
                <CardHeader>
                    <CardTitle>登録済みの勤務できない日時</CardTitle>
                </CardHeader>

                <CardContent>
                    <div className="hidden md:block">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>種類</TableHead>
                                    <TableHead>日付</TableHead>
                                    <TableHead>曜日</TableHead>
                                    <TableHead>時間</TableHead>
                                    <TableHead>理由</TableHead>
                                    <TableHead className="text-right">操作</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {myUnavailableTimes.map((unavailableTime) => (
                                    <TableRow key={unavailableTime.id}>
                                        <TableCell>
                                            <Badge variant="secondary">
                                                {unavailableTypeLabel[unavailableTime.type]}
                                            </Badge>
                                        </TableCell>

                                        <TableCell>
                                            {unavailableTime.date
                                                ? formatDate(unavailableTime.date)
                                                : "-"}
                                        </TableCell>

                                        <TableCell>
                                            {unavailableTime.dayOfWeek
                                                ? dayOfWeekLabel[unavailableTime.dayOfWeek]
                                                : "-"}
                                        </TableCell>

                                        <TableCell>
                                            {unavailableTime.startTime && unavailableTime.endTime
                                                ? `${unavailableTime.startTime}〜${unavailableTime.endTime}`
                                                : "終日"}
                                        </TableCell>

                                        <TableCell>
                                            {unavailableTime.reason || "-"}
                                        </TableCell>

                                        <TableCell className="text-right">
                                            <form action={deleteUnavailableTime}>
                                                <input
                                                    type="hidden"
                                                    name="unavailableTimeId"
                                                    value={unavailableTime.id}
                                                />
                                                <ConfirmSubmitButton
                                                    size="sm"
                                                    variant="outline"
                                                    message="この勤務できない日時を削除します。よろしいですか？"
                                                >
                                                    削除
                                                </ConfirmSubmitButton>
                                            </form>
                                        </TableCell>
                                    </TableRow>
                                ))}

                                {myUnavailableTimes.length === 0 && (
                                    <TableRow>
                                        <TableCell
                                            colSpan={6}
                                            className="py-8 text-center text-slate-500"
                                        >
                                            勤務できない日時はまだ登録されていません。
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    <div className="md:hidden">
                        <UnavailableTimeCardList
                            unavailableTimes={myUnavailableTimes}
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default StaffUnavailableTimesPage;