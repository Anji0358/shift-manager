import { Plus } from "lucide-react";
import { getJobTemplates } from "@/features/job-templates/queries";
import { deleteJobTemplate } from "@/features/job-templates/actions";
import { LinkButton } from "@/components/shared/link-button";
import { SubmitButton } from "@/components/shared/submit-button";
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

const getTemplateShiftSlotText = (
    shiftSlots: {
        name: string;
        startTime: string;
        endTime: string;
        requiredPeople: number;
    }[],
) => {
    if (shiftSlots.length === 0) {
        return "勤務枠未設定";
    }

    return shiftSlots
        .map((slot) => {
            return `${slot.name} ${slot.startTime} - ${slot.endTime} / ${slot.requiredPeople}人`;
        })
        .join("、");
};

const AdminJobTemplatesPage = async () => {
    const templates = await getJobTemplates();

    return (
        <div className="space-y-6">
            <section className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold">案件テンプレート</h1>
                    <p className="mt-2 text-slate-600">
                        よく使う案件情報と勤務枠をテンプレートとして管理します。
                    </p>
                </div>

                <LinkButton
                    href="/admin/job-templates/new"
                    pendingText="作成画面へ移動中..."
                >
                    <Plus className="mr-2 h-4 w-4" />
                    テンプレートを作成
                </LinkButton>
            </section>

            <Card>
                <CardHeader>
                    <CardTitle>テンプレート一覧</CardTitle>
                </CardHeader>

                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>テンプレート名</TableHead>
                                <TableHead>案件名</TableHead>
                                <TableHead>勤務場所</TableHead>
                                <TableHead>勤務枠</TableHead>
                                <TableHead>食事</TableHead>
                                <TableHead>交通費</TableHead>
                                <TableHead className="text-right">操作</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {templates.map((template) => (
                                <TableRow key={template.id}>
                                    <TableCell className="font-medium">
                                        {template.name}
                                    </TableCell>

                                    <TableCell>{template.title}</TableCell>

                                    <TableCell>{template.location}</TableCell>

                                    <TableCell className="max-w-xs text-sm text-slate-600">
                                        {getTemplateShiftSlotText(template.shiftSlots)}
                                    </TableCell>

                                    <TableCell>{template.hasMeal ? "あり" : "なし"}</TableCell>

                                    <TableCell>
                                        ¥{template.transportationFee.toLocaleString()}
                                    </TableCell>

                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <LinkButton
                                                href={`/admin/job-templates/${template.id}/edit`}
                                                size="sm"
                                                variant="outline"
                                                pendingText="編集画面へ移動中..."
                                            >
                                                編集
                                            </LinkButton>

                                            <form action={deleteJobTemplate}>
                                                <input
                                                    type="hidden"
                                                    name="templateId"
                                                    value={template.id}
                                                />

                                                <SubmitButton
                                                    size="sm"
                                                    variant="outline"
                                                    pendingText="削除中..."
                                                >
                                                    削除
                                                </SubmitButton>
                                            </form>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}

                            {templates.length === 0 && (
                                <TableRow>
                                    <TableCell
                                        colSpan={7}
                                        className="py-8 text-center text-slate-500"
                                    >
                                        案件テンプレートがまだありません。
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default AdminJobTemplatesPage;