import { createJobTemplate } from "@/features/job-templates/actions";
import { SubmitButton } from "@/components/shared/submit-button";
import { LinkButton } from "@/components/shared/link-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

const NewJobTemplatePage = () => {
    return (
        <div className="space-y-6">
            <section className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold">テンプレート作成</h1>
                    <p className="mt-2 text-slate-600">
                        よく使う案件情報と勤務枠をテンプレートとして登録します。
                    </p>
                </div>

                <LinkButton href="/admin/job-templates" variant="outline">
                    一覧へ戻る
                </LinkButton>
            </section>

            <Card>
                <CardHeader>
                    <CardTitle>テンプレート情報</CardTitle>
                </CardHeader>

                <CardContent>
                    <form action={createJobTemplate} className="space-y-8">
                        <section className="space-y-4">
                            <h2 className="text-lg font-semibold">基本情報</h2>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="name">テンプレート名</Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        placeholder="例：ホテル宴会テンプレート"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="title">案件名</Label>
                                    <Input
                                        id="title"
                                        name="title"
                                        placeholder="例：ホテル宴会スタッフ"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="location">勤務場所</Label>
                                    <Input
                                        id="location"
                                        name="location"
                                        placeholder="例：横浜ベイホテル"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="meetingPlace">集合場所</Label>
                                    <Input
                                        id="meetingPlace"
                                        name="meetingPlace"
                                        placeholder="例：ホテル1階ロビー"
                                    />
                                </div>
                            </div>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-lg font-semibold">勤務枠</h2>

                            <div className="grid gap-4 md:grid-cols-4">
                                <div className="space-y-2">
                                    <Label htmlFor="slotName">勤務枠名</Label>
                                    <Input
                                        id="slotName"
                                        name="slotName"
                                        placeholder="例：通し勤務"
                                        defaultValue="基本勤務枠"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="startTime">開始時刻</Label>
                                    <Input
                                        id="startTime"
                                        name="startTime"
                                        type="time"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="endTime">終了時刻</Label>
                                    <Input
                                        id="endTime"
                                        name="endTime"
                                        type="time"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="requiredPeople">必要人数</Label>
                                    <Input
                                        id="requiredPeople"
                                        name="requiredPeople"
                                        type="number"
                                        min={1}
                                        step={1}
                                        placeholder="例：5"
                                        required
                                    />
                                </div>
                            </div>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-lg font-semibold">勤務条件</h2>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="breakMinutes">休憩時間（分）</Label>
                                    <Input
                                        id="breakMinutes"
                                        name="breakMinutes"
                                        type="number"
                                        min={0}
                                        defaultValue={0}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="transportationFee">交通費</Label>
                                    <Input
                                        id="transportationFee"
                                        name="transportationFee"
                                        type="number"
                                        min={0}
                                        defaultValue={0}
                                    />
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="dressCode">服装</Label>
                                    <Input
                                        id="dressCode"
                                        name="dressCode"
                                        placeholder="例：黒パンツ、白シャツなど"
                                    />
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="belongings">持ち物</Label>
                                    <Input
                                        id="belongings"
                                        name="belongings"
                                        placeholder="例：メモ帳、筆記用具など"
                                    />
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="note">備考</Label>
                                    <textarea
                                        id="note"
                                        name="note"
                                        rows={4}
                                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                        placeholder="案件作成時に引き継ぎたい注意事項"
                                    />
                                </div>

                                <label className="flex items-center gap-2 text-sm md:col-span-2">
                                    <input name="hasMeal" type="checkbox" />
                                    食事あり
                                </label>
                            </div>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-lg font-semibold">時給設定</h2>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="wageType">給与設定</Label>
                                    <select
                                        id="wageType"
                                        name="wageType"
                                        defaultValue="EMPLOYEE"
                                        className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                                    >
                                        <option value="EMPLOYEE">
                                            スタッフごとの時給を使う
                                        </option>
                                        <option value="JOB_FIXED">
                                            案件固定の時給を使う
                                        </option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="fixedHourlyWage">案件固定時給</Label>
                                    <Input
                                        id="fixedHourlyWage"
                                        name="fixedHourlyWage"
                                        type="number"
                                        min={0}
                                        placeholder="例：1300"
                                    />
                                    <p className="text-xs text-slate-500">
                                        スタッフごとの時給を使う場合は空欄で問題ありません。
                                    </p>
                                </div>
                            </div>
                        </section>

                        <div className="flex justify-end gap-3">
                            <LinkButton href="/admin/job-templates" variant="outline">
                                キャンセル
                            </LinkButton>

                            <SubmitButton pendingText="作成中...">
                                テンプレートを作成
                            </SubmitButton>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default NewJobTemplatePage;