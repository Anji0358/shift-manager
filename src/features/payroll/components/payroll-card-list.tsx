import { CalendarDays, Clock, Wallet } from "lucide-react";
import { formatDate } from "@/lib/format";

type PayrollRow = {
    id: string;
    workDate: Date;
    jobTitle: string;
    actualStartTime: string;
    actualEndTime: string;
    actualBreakMinutes: number;
    workingMinutes: number;
    hourlyWage: number;
    wageAmount: number;
    transportationFee: number;
    totalAmount: number;
};

type PayrollCardListProps = {
    rows: PayrollRow[];
};

const formatMinutesAsHour = (minutes: number) => {
    return `${Math.floor(minutes / 60)}時間${minutes % 60}分`;
};

export const PayrollCardList = ({ rows }: PayrollCardListProps) => {
    if (rows.length === 0) {
        return (
            <div className="rounded-xl border bg-white p-6 text-center text-sm text-slate-500">
                この月の承認済み就労報告はありません。
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {rows.map((row) => (
                <article
                    key={row.id}
                    className="rounded-xl border bg-white p-4 shadow-sm"
                >
                    <div>
                        <h2 className="font-semibold">{row.jobTitle}</h2>

                        <div className="mt-2 flex items-center gap-2 text-sm text-slate-600">
                            <CalendarDays className="h-4 w-4" />
                            <span>{formatDate(row.workDate)}</span>
                        </div>
                    </div>

                    <div className="mt-4 space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                            <span className="flex items-center gap-2 text-slate-500">
                                <Clock className="h-4 w-4" />
                                勤務時間
                            </span>
                            <span className="font-medium">
                                {row.actualStartTime} - {row.actualEndTime}
                            </span>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-slate-500">実働</span>
                            <span className="font-medium">
                                {formatMinutesAsHour(row.workingMinutes)}
                            </span>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-slate-500">時給</span>
                            <span className="font-medium">
                                ¥{row.hourlyWage.toLocaleString()}
                            </span>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-slate-500">給与</span>
                            <span className="font-medium">
                                ¥{row.wageAmount.toLocaleString()}
                            </span>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-slate-500">交通費</span>
                            <span className="font-medium">
                                ¥{row.transportationFee.toLocaleString()}
                            </span>
                        </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between rounded-lg bg-slate-50 p-3">
                        <span className="flex items-center gap-2 text-sm text-slate-500">
                            <Wallet className="h-4 w-4" />
                            合計
                        </span>

                        <span className="text-lg font-bold">
                            ¥{row.totalAmount.toLocaleString()}
                        </span>
                    </div>
                </article>
            ))}
        </div>
    );
};