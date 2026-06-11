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
import { ConfirmSubmitButton } from "@/components/shared/confirm-submit-button";
import { LinkButton } from "@/components/shared/link-button";
import { SuccessMessage } from "@/components/shared/success-message";
import { PageShell } from "@/components/shared/page-shell";
import { PageHeader } from "@/components/shared/page-header";
import { BridalCard } from "@/components/shared/bridal-card";
import { bridalStyles } from "@/components/shared/design-tokens";
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
import {
    CalendarX2,
    Plus,
    Trash2,
} from "lucide-react";

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
        <PageShell>
            <PageHeader
                title="NGの日時"
                description="登録した内容は、管理者がスタッフを割り振るときの候補者判定に使われます。授業・予定・試験などでNGの日時を管理できます。"
                action={
                    <LinkButton
                        href="/staff/unavailable-times/new"
                        className={bridalStyles.button.primary}
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        NGの日時を追加
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
                                <CalendarX2 className="h-5 w-5" />
                            </div>

                            <div>
                                <CardTitle
                                    className={[
                                        bridalStyles.text.title,
                                        "text-xl",
                                    ].join(" ")}
                                >
                                    登録済みのNGの日時
                                </CardTitle>
                                <p className="mt-1 text-sm text-slate-500">
                                    自分が勤務できない日時や毎週固定の予定を確認・削除できます。
                                </p>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="p-5 pt-2">
                        <div className="hidden md:block">
                            <div className={bridalStyles.table.wrapper}>
                                <Table>
                                    <TableHeader>
                                        <TableRow className={bridalStyles.table.headerRow}>
                                            <TableHead className={bridalStyles.table.head}>
                                                種類
                                            </TableHead>

                                            <TableHead className={bridalStyles.table.head}>
                                                日付
                                            </TableHead>

                                            <TableHead className={bridalStyles.table.head}>
                                                曜日
                                            </TableHead>

                                            <TableHead className={bridalStyles.table.head}>
                                                時間
                                            </TableHead>

                                            <TableHead className={bridalStyles.table.head}>
                                                理由・メモ
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
                                        {myUnavailableTimes.map((unavailableTime) => (
                                            <TableRow
                                                key={unavailableTime.id}
                                                className={bridalStyles.table.row}
                                            >
                                                <TableCell>
                                                    <Badge className={bridalStyles.badge.neutral}>
                                                        {
                                                            unavailableTypeLabel[
                                                            unavailableTime.type
                                                            ]
                                                        }
                                                    </Badge>
                                                </TableCell>

                                                <TableCell className="whitespace-nowrap text-sm text-slate-600">
                                                    {getUnavailableDateText(unavailableTime)}
                                                </TableCell>

                                                <TableCell className="whitespace-nowrap text-sm text-slate-600">
                                                    {getUnavailableDayOfWeekText(
                                                        unavailableTime,
                                                    )}
                                                </TableCell>

                                                <TableCell className="whitespace-nowrap text-sm text-slate-600">
                                                    {getUnavailableTimeText(unavailableTime)}
                                                </TableCell>

                                                <TableCell>
                                                    <p className="max-w-sm text-sm leading-6 text-slate-600">
                                                        {unavailableTime.reason || "-"}
                                                    </p>
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
                                                            className={bridalStyles.button.danger}
                                                            message="このNGの日時を削除します。よろしいですか？"
                                                        >
                                                            <Trash2 className="mr-2 h-4 w-4" />
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
                                                    className="py-10 text-center text-sm text-slate-500"
                                                >
                                                    NGの日時はまだ登録されていません。
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>

                        <div className="md:hidden">
                            <UnavailableTimeCardList
                                unavailableTimes={myUnavailableTimes}
                            />
                        </div>
                    </CardContent>
                </BridalCard>
            </div>
        </PageShell>
    );
};

export default StaffUnavailableTimesPage;