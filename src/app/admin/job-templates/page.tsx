import Link from "next/link";
import { Plus } from "lucide-react";
import { getJobTemplates } from "@/features/job-templates/queries";
import { deleteJobTemplate } from "@/features/job-templates/actions";
import { SubmitButton } from "@/components/shared/submit-button";
import { Button } from "@/components/ui/button";
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

const AdminJobTemplatesPage = async () => {
    const templates = await getJobTemplates();

    return (
        <div className="space-y-6">
            <section className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold">案件テンプレート</h1>
                    <p className="mt-2 text-slate-600">
                        よく使う案件情報をテンプレートとして管理します。
                    </p>
                </div>

                <Button asChild>
                    <Link href="/admin/job-templates/new">
                        <Plus className="mr-2 h-4 w-4" />
                        テンプレートを作成
                    </Link>
                </Button>
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
                                <TableHead>時間</TableHead>
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
                                    <TableCell>
                                        {template.startTime} - {template.endTime}
                                    </TableCell>
                                    <TableCell>{template.hasMeal ? "あり" : "なし"}</TableCell>
                                    <TableCell>
                                        ¥{template.transportationFee.toLocaleString()}
                                    </TableCell>
                                    <TableCell className="text-right">
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