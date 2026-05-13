import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const AdminNewEmployeePage = () => {
    return (
        <div className="space-y-6">
            <section>
                <h1 className="text-3xl font-bold">従業員追加</h1>
                <p className="mt-2 text-slate-600">
                    従業員の名前、メールアドレス、権限、時給、在籍状況を登録します。
                </p>
            </section>

            <Card>
                <CardHeader>
                    <CardTitle>従業員情報</CardTitle>
                </CardHeader>

                <CardContent>
                    <form className="space-y-6">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="name">名前</Label>
                                <Input id="name" name="name" placeholder="例：佐藤 花子" />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">メールアドレス</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="例：sato@example.com"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="role">権限</Label>
                                <Select name="role">
                                    <SelectTrigger id="role">
                                        <SelectValue placeholder="権限を選択" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ADMIN">管理者</SelectItem>
                                        <SelectItem value="STAFF">従業員</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="hourlyWage">時給</Label>
                                <Input
                                    id="hourlyWage"
                                    name="hourlyWage"
                                    type="number"
                                    placeholder="例：1400"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="startedWorkingAt">勤め始めた年月</Label>
                                <Input
                                    id="startedWorkingAt"
                                    name="startedWorkingAt"
                                    type="date"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="employmentStatus">在籍状況</Label>
                                <Select name="employmentStatus">
                                    <SelectTrigger id="employmentStatus">
                                        <SelectValue placeholder="在籍状況を選択" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ACTIVE">在籍中</SelectItem>
                                        <SelectItem value="INACTIVE">退職済み</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3">
                            <Button asChild variant="outline">
                                <Link href="/admin/employees">キャンセル</Link>
                            </Button>
                            <Button type="submit">登録する</Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default AdminNewEmployeePage;