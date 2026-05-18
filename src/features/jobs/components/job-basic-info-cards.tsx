import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { GoogleMapsLink } from "@/components/shared/google-maps-link";
import { formatDate, formatYen } from "@/lib/format";
import { wageTypeLabel } from "@/features/jobs/labels";
import type { JobDetail } from "@/features/jobs/types";

type JobBasicInfoCardsProps = {
    job: JobDetail;
};

export const JobBasicInfoCards = ({ job }: JobBasicInfoCardsProps) => {
    return (
        <section className="grid gap-4 md:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>案件基本情報</CardTitle>
                </CardHeader>

                <CardContent className="space-y-3 text-sm">
                    <InfoRow label="日付" value={formatDate(job.workDate)} />

                    <div className="space-y-2">
                        <InfoRow label="場所" value={job.location} />

                        <div className="flex justify-end">
                            <GoogleMapsLink query={job.location} />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <InfoRow label="集合場所" value={job.meetingPlace || "未設定"} />

                        {job.meetingPlace && (
                            <div className="flex justify-end">
                                <GoogleMapsLink query={`${job.location} ${job.meetingPlace}`} />
                            </div>
                        )}
                    </div>

                    <InfoRow label="勤務時間" value={`${job.startTime}〜${job.endTime}`} />
                    <InfoRow label="休憩時間" value={`${job.breakMinutes}分`} />
                    <InfoRow label="食事" value={job.hasMeal ? "あり" : "なし"} />
                    <InfoRow label="交通費" value={formatYen(job.transportationFee)} />
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>勤務条件・時給設定</CardTitle>
                </CardHeader>

                <CardContent className="space-y-3 text-sm">
                    <div className="flex justify-between gap-4">
                        <span className="text-slate-500">時給タイプ</span>
                        <Badge variant="secondary">{wageTypeLabel[job.wageType]}</Badge>
                    </div>

                    <InfoRow
                        label="案件一律時給"
                        value={
                            job.fixedHourlyWage !== null
                                ? formatYen(job.fixedHourlyWage)
                                : "未設定"
                        }
                    />

                    <InfoRow label="服装" value={job.dressCode || "未設定"} />
                    <InfoRow label="持ち物" value={job.belongings || "未設定"} />

                    <div className="space-y-1">
                        <span className="text-slate-500">備考</span>
                        <p className="whitespace-pre-wrap font-medium">
                            {job.note || "未設定"}
                        </p>
                    </div>
                </CardContent>
            </Card>
        </section>
    );
};

type InfoRowProps = {
    label: string;
    value: string;
};

const InfoRow = ({ label, value }: InfoRowProps) => {
    return (
        <div className="flex justify-between gap-4">
            <span className="text-slate-500">{label}</span>
            <span className="font-medium">{value}</span>
        </div>
    );
};