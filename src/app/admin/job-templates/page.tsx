import {
    FilePlus2,
    PenLine,
    Trash2,
    ClipboardList,
} from "lucide-react";
import { getJobTemplates } from "@/features/job-templates/queries";
import { deleteJobTemplate } from "@/features/job-templates/actions";
import { LinkButton } from "@/components/shared/link-button";
import { SubmitButton } from "@/components/shared/submit-button";
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
import { PageShell } from "@/components/shared/page-shell";
import { PageHeader } from "@/components/shared/page-header";
import { BridalCard } from "@/components/shared/bridal-card";
import { bridalStyles } from "@/components/shared/design-tokens";
import { formatYen } from "@/lib/format";

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
            return `${slot.name} ${slot.startTime}〜${slot.endTime} / ${slot.requiredPeople}人`;
        })
        .join("、");
};

const AdminJobTemplatesPage = async () => {
    const templates = await getJobTemplates();

    return (
        <PageShell>
            <PageHeader
                title="案件テンプレート"
                description="よく使う案件情報と勤務枠をテンプレートとして管理します。"
                action={
                    <LinkButton
                        href="/admin/job-templates/new"
                        pendingText="作成画面へ移動中..."
                        className={bridalStyles.button.primary}
                    >
                        <FilePlus2 className="mr-2 h-4 w-4" />
                        テンプレートを作成
                    </LinkButton>
                }
            />

            <BridalCard className="overflow-hidden">
                <CardHeader className="p-5 pb-3">
                    <div className="flex items-start gap-3">
                        <div className={bridalStyles.icon.circle}>
                            <ClipboardList className="h-5 w-5" />
                        </div>

                        <div>
                            <CardTitle
                                className={[
                                    bridalStyles.text.title,
                                    "text-xl",
                                ].join(" ")}
                            >
                                テンプレート一覧
                            </CardTitle>
                            <p className="mt-1 text-sm text-slate-500">
                                案件名、勤務場所、勤務枠、食事、交通費を確認します。
                            </p>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="p-5 pt-2">
                    <div className={bridalStyles.table.wrapper}>
                        <Table>
                            <TableHeader>
                                <TableRow className={bridalStyles.table.headerRow}>
                                    <TableHead className={bridalStyles.table.head}>
                                        テンプレート名
                                    </TableHead>

                                    <TableHead className={bridalStyles.table.head}>
                                        案件名
                                    </TableHead>

                                    <TableHead className={bridalStyles.table.head}>
                                        勤務場所
                                    </TableHead>

                                    <TableHead className={bridalStyles.table.head}>
                                        勤務枠
                                    </TableHead>

                                    <TableHead className={bridalStyles.table.head}>
                                        食事
                                    </TableHead>

                                    <TableHead className={bridalStyles.table.head}>
                                        交通費
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
                                {templates.map((template) => (
                                    <TableRow
                                        key={template.id}
                                        className={bridalStyles.table.row}
                                    >
                                        <TableCell>
                                            <p
                                                className={[
                                                    bridalStyles.text.title,
                                                    "text-base",
                                                ].join(" ")}
                                            >
                                                {template.name}
                                            </p>
                                        </TableCell>

                                        <TableCell className="text-sm text-slate-600">
                                            {template.title}
                                        </TableCell>

                                        <TableCell className="text-sm text-slate-600">
                                            {template.location}
                                        </TableCell>

                                        <TableCell className="max-w-xs text-sm leading-6 text-slate-600">
                                            {getTemplateShiftSlotText(
                                                template.shiftSlots,
                                            )}
                                        </TableCell>

                                        <TableCell className="whitespace-nowrap text-sm text-slate-600">
                                            {template.hasMeal ? "あり" : "なし"}
                                        </TableCell>

                                        <TableCell className="whitespace-nowrap text-sm font-medium text-slate-900">
                                            {formatYen(template.transportationFee)}
                                        </TableCell>

                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <LinkButton
                                                    href={`/admin/job-templates/${template.id}/edit`}
                                                    size="sm"
                                                    variant="outline"
                                                    pendingText="編集画面へ移動中..."
                                                    className={bridalStyles.button.secondary}
                                                >
                                                    <PenLine className="mr-2 h-4 w-4" />
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
                                                        className={bridalStyles.button.danger}
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4" />
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
                                            className="py-10 text-center text-sm text-slate-500"
                                        >
                                            案件テンプレートがまだありません。
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </BridalCard>
        </PageShell>
    );
};

export default AdminJobTemplatesPage;