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
                    <h1 className="text-3xl font-bold">勤務不可情報</h1>
                    <p className="mt-2 text-slate-600">
                        一日NG、時間指定NG、毎週固定NG、一時的な予定NGを確認します。
                    </p>
                </div>

                <div className="space-y-3 md:text-right">
                    <SuccessMessage message={message} />

                    <div className="flex flex-col gap-3 sm:flex-row md:justify-end">
                        <Button asChild variant="outline">
                            <Link href="/staff/unavailable-times/weekly">
                                毎週固定NGを登録
                            </Link>
                        </Button>

                        <Button asChild>
                            <Link href="/staff/unavailable-times/new">
                                勤務不可を追加
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>

            <Card>
                <CardHeader>
                    <CardTitle>登録済みの勤務不可情報</CardTitle>
                </CardHeader>

                <CardContent>
                    <div className="hidden md:block">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>種別</TableHead>
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

                                        <TableCell>{unavailableTime.reason}</TableCell>

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
                                                    message="この勤務不可情報を削除します。よろしいですか？"
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
                                            勤務不可情報はまだ登録されていません。
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