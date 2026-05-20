import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getJobById } from "@/features/jobs/queries";
import { createJobShiftSlot } from "@/features/job-shift-slots/actions";

type AdminNewJobSlotPageProps = {
    params: Promise<{
        jobId: string;
    }>;
};

const AdminNewJobSlotPage = async ({ params }: AdminNewJobSlotPageProps) => {
    const { jobId } = await params;

    const job = await getJobById(jobId);

    if (!job) {
        notFound();
    }

    return (
        <div className="space-y-6">
            <section className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold">勤務枠追加</h1>
                    <p className="mt-2 text-slate-600">
                        「{job.title}」に勤務枠を追加します。
                    </p>
                </div>

                <div className="flex flex-wrap gap-3">
                    <Button asChild variant="outline">
                        <Link href={`/admin/jobs/${job.id}/assignments`}>
                            スタッフ割り振りへ戻る
                        </Link>
                    </Button>

                    <Button asChild variant="outline">
                        <Link href={`/admin/jobs/${job.id}`}>
                            案件詳細へ戻る
                        </Link>
                    </Button>
                </div>
            </section>

            <Card>
                <CardHeader>
                    <CardTitle>勤務枠情報</CardTitle>
                </CardHeader>

                <CardContent>
                    <form action={createJobShiftSlot} className="space-y-6">
                        <input type="hidden" name="jobId" value={job.id} />

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="name">勤務枠名</Label>
                                <Input id="name" name="name" placeholder="例：本番" required />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="requiredPeople">必要人数</Label>
                                <Input
                                    id="requiredPeople"
                                    name="requiredPeople"
                                    type="number"
                                    placeholder="例：8"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="startTime">開始時間</Label>
                                <Input id="startTime" name="startTime" type="time" required />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="endTime">終了時間</Label>
                                <Input id="endTime" name="endTime" type="time" required />
                            </div>
                        </div>

                        <div className="flex justify-end gap-3">
                            <Button asChild variant="outline">
                                <Link href={`/admin/jobs/${job.id}/assignments`}>
                                    キャンセル
                                </Link>
                            </Button>
                            <Button type="submit">追加する</Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default AdminNewJobSlotPage;