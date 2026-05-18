import Link from "next/link";
import { notFound } from "next/navigation";
import { getJobTemplateById } from "@/features/job-templates/queries";
import { Button } from "@/components/ui/button";
import { SubmitButton } from "@/components/shared/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { updateJobTemplate } from "@/features/job-templates/actions";

type EditJobTemplatePageProps = {
    params: Promise<{
        templateId: string;
    }>;
};

const EditJobTemplatePage = async ({ params }: EditJobTemplatePageProps) => {
    const { templateId } = await params;
    const template = await getJobTemplateById(templateId);

    if (!template) {
        notFound();
    }

    return (
        <div className="space-y-6">
            <section className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold">テンプレート編集</h1>
                    <p className="mt-2 text-slate-600">
                        登録済みの案件テンプレートを編集します。
                    </p>
                </div>

                <Button asChild variant="outline">
                    <Link href="/admin/job-templates">一覧へ戻る</Link>
                </Button>
            </section>

            <Card>
                <CardHeader>
                    <CardTitle>テンプレート情報</CardTitle>
                </CardHeader>

                <CardContent>
                    <form action={updateJobTemplate} className="space-y-6">
                        <input type="hidden" name="templateId" value={template.id} />

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="name">テンプレート名</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    defaultValue={template.name}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="title">案件名</Label>
                                <Input
                                    id="title"
                                    name="title"
                                    defaultValue={template.title}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="location">勤務場所</Label>
                                <Input
                                    id="location"
                                    name="location"
                                    defaultValue={template.location}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="meetingPlace">集合場所</Label>
                                <Input
                                    id="meetingPlace"
                                    name="meetingPlace"
                                    defaultValue={template.meetingPlace ?? ""}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="startTime">開始時刻</Label>
                                <Input
                                    id="startTime"
                                    name="startTime"
                                    type="time"
                                    defaultValue={template.startTime}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="endTime">終了時刻</Label>
                                <Input
                                    id="endTime"
                                    name="endTime"
                                    type="time"
                                    defaultValue={template.endTime}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="breakMinutes">休憩時間（分）</Label>
                                <Input
                                    id="breakMinutes"
                                    name="breakMinutes"
                                    type="number"
                                    min={0}
                                    defaultValue={template.breakMinutes}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="transportationFee">交通費</Label>
                                <Input
                                    id="transportationFee"
                                    name="transportationFee"
                                    type="number"
                                    min={0}
                                    defaultValue={template.transportationFee}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="wageType">給与設定</Label>
                                <select
                                    id="wageType"
                                    name="wageType"
                                    defaultValue={template.wageType}
                                    className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                                >
                                    <option value="EMPLOYEE">スタッフごとの時給を使う</option>
                                    <option value="JOB_FIXED">案件固定の時給を使う</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="fixedHourlyWage">案件固定時給</Label>
                                <Input
                                    id="fixedHourlyWage"
                                    name="fixedHourlyWage"
                                    type="number"
                                    min={0}
                                    defaultValue={template.fixedHourlyWage ?? ""}
                                />
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="dressCode">服装</Label>
                                <Input
                                    id="dressCode"
                                    name="dressCode"
                                    defaultValue={template.dressCode ?? ""}
                                />
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="belongings">持ち物</Label>
                                <Input
                                    id="belongings"
                                    name="belongings"
                                    defaultValue={template.belongings ?? ""}
                                />
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="note">備考</Label>
                                <textarea
                                    id="note"
                                    name="note"
                                    rows={4}
                                    defaultValue={template.note ?? ""}
                                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                />
                            </div>

                            <label className="flex items-center gap-2 text-sm md:col-span-2">
                                <input
                                    name="hasMeal"
                                    type="checkbox"
                                    defaultChecked={template.hasMeal}
                                />
                                食事あり
                            </label>
                        </div>

                        <SubmitButton pendingText="保存中...">
                            テンプレートを保存
                        </SubmitButton>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default EditJobTemplatePage;