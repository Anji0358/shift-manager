import { CalendarDays, Clock, Wallet } from "lucide-react";
import { formatDate, formatYen } from "@/lib/format";
import { BridalCard } from "@/components/shared/app-card";
import { bridalStyles } from "@/components/shared/design-tokens";

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
            <BridalCard className="p-6 text-center text-sm text-slate-500">
                この月の承認済み就労報告はありません。
            </BridalCard>
        );
    }

    return (
        <div className="space-y-4">
            {rows.map((row) => (
                <BridalCard key={row.id} className="p-4">
                    <div>
                        <h2
                            className={[
                                bridalStyles.text.title,
                                "text-lg",
                            ].join(" ")}
                        >
                            {row.jobTitle}
                        </h2>

                        <div className="mt-2 flex items-center gap-2 text-sm text-slate-600">
                            <CalendarDays className="h-4 w-4 text-[#b8872d]" />
                            <span>{formatDate(row.workDate)}</span>
                        </div>
                    </div>

                    <div className="mt-4 space-y-3 text-sm">
                        <InfoRow
                            label="勤務時間"
                            value={`${row.actualStartTime}〜${row.actualEndTime}`}
                            icon={<Clock className="h-4 w-4" />}
                        />

                        <InfoRow
                            label="実働"
                            value={formatMinutesAsHour(row.workingMinutes)}
                        />

                        <InfoRow
                            label="休憩"
                            value={`${row.actualBreakMinutes}分`}
                        />

                        <InfoRow
                            label="時給"
                            value={formatYen(row.hourlyWage)}
                        />

                        <InfoRow
                            label="給与"
                            value={formatYen(row.wageAmount)}
                        />

                        <InfoRow
                            label="交通費"
                            value={formatYen(row.transportationFee)}
                        />
                    </div>

                    <div className="mt-4 flex items-center justify-between rounded-2xl border border-[#f0e5d0] bg-[#fffdf8]/80 p-4">
                        <span className="flex items-center gap-2 text-sm text-slate-500">
                            <Wallet className="h-4 w-4 text-[#b8872d]" />
                            合計
                        </span>

                        <span className="text-lg font-semibold text-slate-900">
                            {formatYen(row.totalAmount)}
                        </span>
                    </div>
                </BridalCard>
            ))}
        </div>
    );
};

type InfoRowProps = {
    label: string;
    value: string;
    icon?: React.ReactNode;
};

const InfoRow = ({ label, value, icon }: InfoRowProps) => {
    return (
        <div className="flex items-center justify-between gap-4 border-b border-[#f0e5d0] pb-2 last:border-b-0 last:pb-0">
            <span className="flex items-center gap-2 text-slate-500">
                {icon ? <span className="text-[#b8872d]">{icon}</span> : null}
                {label}
            </span>

            <span className="text-right font-medium text-slate-900">
                {value}
            </span>
        </div>
    );
};