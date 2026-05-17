import Link from "next/link";
import { createJob } from "@/features/jobs/actions";
import { getJobTemplates } from "@/features/job-templates/queries";
import { TemplateSelector } from "@/features/job-templates/components/template-selector";
import { SubmitButton } from "@/components/shared/submit-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

type NewJobPageProps = {
    searchParams: Promise<{
        templateId?: string;
    }>;
};

const NewJobPage = async ({ searchParams }: NewJobPageProps) => {
    const { templateId } = await searchParams;

    const templates = await getJobTemplates();

    const selectedTemplate = templateId
        ? templates.find((template) => template.id === templateId)
        : undefined;

    return (
        <div className="space-y-6">
            <section>
                <h1 className="text-3xl font-bold">案件追加</h1>
                <p className="mt-2 text-slate-600">
                    案件の基本情報、勤務条件、時給設定を登録します。
                </p>
            </section>

            <Card>
                <CardHeader>
                    <CardTitle>案件情報</CardTitle>
                </CardHeader>

                <CardContent>
                    <form action={createJob} className="space-y-8">
                        <TemplateSelector
                            templates={templates}
                            selectedTemplateId={templateId}
                        />

                        <section className="space-y-4">
                            <h2 className="text-lg font-semibold">基本情報</h2>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="title">案件名</Label>
                                    <Input
                                        id="title"
                                        name="title"
                                        placeholder="例：横浜ホテル宴会"
                                        defaultValue={selectedTemplate?.title ?? ""}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="workDate">日付</Label>
                                    <Input
                                        id="workDate"
                                        name="workDate"
                                        type="date"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="location">場所</Label>
                                    <Input
                                        id="location"
                                        name="location"
                                        placeholder="例：横浜ホテル"
                                        defaultValue={selectedTemplate?.location ?? ""}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="meetingPlace">集合場所</Label>
                                    <Input
                                        id="meetingPlace"
                                        name="meetingPlace"
                                        placeholder="例：横浜駅中央改札"
                                        defaultValue={selectedTemplate?.meetingPlace ?? ""}
                                        required
                                    />
                                </div>
                            </div>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-lg font-semibold">勤務条件</h2>

                            <div className="grid gap-4 md:grid-cols-3">
                                <div className="space-y-2">
                                    <Label htmlFor="startTime">勤務開始時間</Label>
                                    <Input
                                        id="startTime"
                                        name="startTime"
                                        type="time"
                                        defaultValue={selectedTemplate?.startTime ?? ""}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="endTime">勤務終了時間</Label>
                                    <Input
                                        id="endTime"
                                        name="endTime"
                                        type="time"
                                        defaultValue={selectedTemplate?.endTime ?? ""}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="breakMinutes">休憩時間</Label>
                                    <Input
                                        id="breakMinutes"
                                        name="breakMinutes"
                                        type="number"
                                        min={0}
                                        placeholder="例：30"
                                        defaultValue={selectedTemplate?.breakMinutes ?? 0}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="hasMeal">食事の有無</Label>
                                    <Select
                                        name="hasMeal"
                                        defaultValue={
                                            selectedTemplate?.hasMeal ? "true" : "false"
                                        }
                                    >
                                        <SelectTrigger id="hasMeal">
                                            <SelectValue placeholder="食事の有無を選択" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="true">あり</SelectItem>
                                            <SelectItem value="false">なし</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="transportationFee">交通費</Label>
                                    <Input
                                        id="transportationFee"
                                        name="transportationFee"
                                        type="number"
                                        min={0}
                                        placeholder="例：800"
                                        defaultValue={selectedTemplate?.transportationFee ?? 0}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="dressCode">服装</Label>
                                    <Input
                                        id="dressCode"
                                        name="dressCode"
                                        placeholder="例：黒スラックス・白シャツ"
                                        defaultValue={selectedTemplate?.dressCode ?? ""}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="belongings">持ち物</Label>
                                <Input
                                    id="belongings"
                                    name="belongings"
                                    placeholder="例：メモ帳、黒靴"
                                    defaultValue={selectedTemplate?.belongings ?? ""}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="note">備考</Label>
                                <Textarea
                                    id="note"
                                    name="note"
                                    placeholder="注意事項や補足情報を入力してください"
                                    defaultValue={selectedTemplate?.note ?? ""}
                                />
                            </div>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-lg font-semibold">時給設定</h2>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="wageType">時給タイプ</Label>
                                    <Select
                                        name="wageType"
                                        defaultValue={selectedTemplate?.wageType ?? "EMPLOYEE"}
                                    >
                                        <SelectTrigger id="wageType">
                                            <SelectValue placeholder="時給タイプを選択" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="EMPLOYEE">
                                                スタッフごとの時給を使う
                                            </SelectItem>
                                            <SelectItem value="JOB_FIXED">
                                                案件一律の時給を使う
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="fixedHourlyWage">案件一律時給</Label>
                                    <Input
                                        id="fixedHourlyWage"
                                        name="fixedHourlyWage"
                                        type="number"
                                        min={0}
                                        placeholder="例：1400"
                                        defaultValue={selectedTemplate?.fixedHourlyWage ?? ""}
                                    />
                                    <p className="text-xs text-slate-500">
                                        スタッフごとの時給を使う場合は空欄で問題ありません。
                                    </p>
                                </div>
                            </div>
                        </section>

                        <div className="flex justify-end gap-3">
                            <Button asChild variant="outline">
                                <Link href="/admin/jobs">キャンセル</Link>
                            </Button>

                            <SubmitButton pendingText="作成中...">
                                案件を作成
                            </SubmitButton>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default NewJobPage;