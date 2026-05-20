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
import { ConfirmSubmitButton } from "@/components/shared/confirm-submit-button";
import { SuccessMessage } from "@/components/shared/success-message";
import { UnavailableTimeCardList } from "@/features/unavailable-times/components/unavailable-time-card-list";
import { deleteUnavailableTime } from "@/features/unavailable-times/actions";
import { getUnavailableTimesByEmployeeId } from "@/features/unavailable-times/queries";
import {
    dayOfWeekLabel,
    unavailableTypeLabel,
} from "@/features/unavailable-times/labels";
import { getCurrentEmployeeId } from "@/lib/auth/current-user";
import { formatDate } from "@/lib/format";
import type { UnavailableTime } from "@prisma/client";

type StaffUnavailableTimesPageProps = {
    searchParams: Promise<{
        message?: string;
    }>;
};

const getUnavailableDateText = (unavailableTime: UnavailableTime) => {
    if (unavailableTime.date) {
        return formatDate(unavailableTime.date);
    }

    return "-";
};

const getUnavailableDayOfWeekText = (unavailableTime: UnavailableTime) => {
    if (unavailableTime.dayOfWeek) {
        return dayOfWeekLabel[unavailableTime.dayOfWeek];
    }

    return "-";
};

const getUnavailableTimeText = (unavailableTime: UnavailableTime) => {
    if (unavailableTime.type === "FULL_DAY") {
        return "終日";
    }

    if (unavailableTime.startTime && unavailableTime.endTime) {
        return `${unavailableTime.startTime}〜${unavailableTime.endTime}`;
    }

    return "-";
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
                    <h1 className="text-3xl font-bold">NGの日時</h1>

                    <p className="mt-2 text-slate-600">
                        登録した内容は、管理者がスタッフを割り振るときの候補者判定に使われます。
                        授業・予定・試験などでNGの日時を管理できます。
                    </p>
                </div>

                <div className="space-y-3 md:text-right">
                    <SuccessMessage message={message} />

                    <div className="flex flex-col gap-3 sm:flex-row md:justify-end">
                        <Button asChild>
                            <Link href="/staff/unavailable-times/new">
                                NGの日時を追加
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>

            <Card>
                <CardHeader>
                    <CardTitle>登録済みのNGの日時</CardTitle>
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
                                    <TableHead>理由・メモ</TableHead>
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
                                            {getUnavailableDateText(unavailableTime)}
                                        </TableCell>

                                        <TableCell>
                                            {getUnavailableDayOfWeekText(unavailableTime)}
                                        </TableCell>

                                        <TableCell>
                                            {getUnavailableTimeText(unavailableTime)}
                                        </TableCell>

                                        <TableCell>{unavailableTime.reason || "-"}</TableCell>

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
                                                    message="このNGの日時を削除します。よろしいですか？"
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
                                            NGの日時はまだ登録されていません。
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    <div className="md:hidden">
                        <UnavailableTimeCardList unavailableTimes={myUnavailableTimes} />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default StaffUnavailableTimesPage;