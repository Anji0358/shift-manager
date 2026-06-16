import type { ReactNode } from "react";
import { CalendarDays, Clock, Wallet } from "lucide-react";
import { formatDate, formatYen } from "@/lib/format";
import { AppCard } from "@/components/shared/app-card";
import { appStyles } from "@/components/shared/design-tokens";

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
            <AppCard className="p-6 text-center">
                <p className={appStyles.text.muted}>
                    この月の承認済み就労報告はありません。
                </p>
            </AppCard>
        );
    }

    return (
        <div className="space-y-4">
            {rows.map((row) => (
                <AppCard key={row.id} className="p-4">
                    <div>
                        <h2
                            className={[
                                appStyles.text.title,
                                "text-lg",
                            ].join(" ")}
                        >
                            {row.jobTitle}
                        </h2>

                        <div
                            className={[
                                "mt-2 flex items-center gap-2 text-sm",
                                appStyles.textColor.body,
                            ].join(" ")}
                        >
                            <CalendarDays
                                className={[
                                    "h-4 w-4",
                                    appStyles.icon.accent,
                                ].join(" ")}
                            />
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

                    <div
                        className={[
                            "mt-4 flex items-center justify-between",
                            appStyles.section.soft,
                        ].join(" ")}
                    >
                        <span
                            className={[
                                "flex items-center gap-2 text-sm",
                                appStyles.textColor.muted,
                            ].join(" ")}
                        >
                            <Wallet
                                className={[
                                    "h-4 w-4",
                                    appStyles.icon.accent,
                                ].join(" ")}
                            />
                            合計
                        </span>

                        <span
                            className={[
                                "text-lg font-semibold",
                                appStyles.textColor.default,
                            ].join(" ")}
                        >
                            {formatYen(row.totalAmount)}
                        </span>
                    </div>
                </AppCard>
            ))}
        </div>
    );
};

type InfoRowProps = {
    label: string;
    value: string;
    icon?: ReactNode;
};

const InfoRow = ({ label, value, icon }: InfoRowProps) => {
    return (
        <div
            className={[
                "flex items-center justify-between gap-4 border-b pb-2 last:border-b-0 last:pb-0",
                appStyles.border.soft,
            ].join(" ")}
        >
            <span
                className={[
                    "flex items-center gap-2",
                    appStyles.textColor.muted,
                ].join(" ")}
            >
                {icon ? (
                    <span className={appStyles.icon.accent}>{icon}</span>
                ) : null}
                {label}
            </span>

            <span
                className={[
                    "text-right font-medium",
                    appStyles.textColor.default,
                ].join(" ")}
            >
                {value}
            </span>
        </div>
    );
};