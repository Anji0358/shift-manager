"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

type AdminErrorPageProps = {
    error: Error & {
        digest?: string;
    };
    reset: () => void;
};

const AdminErrorPage = ({ error, reset }: AdminErrorPageProps) => {
    return (
        <div className="flex min-h-[60vh] items-center justify-center">
            <Card className="w-full max-w-xl">
                <CardHeader>
                    <CardTitle>処理中にエラーが発生しました</CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                    <p className="text-sm text-slate-600">
                        入力内容や業務ルールを確認して、もう一度操作してください。
                    </p>

                    <div className="rounded-md bg-slate-100 p-3 text-sm text-slate-700">
                        {error.message}
                    </div>

                    <div className="flex justify-end gap-3">
                        <Button asChild variant="outline">
                            <Link href="/admin">管理者トップへ戻る</Link>
                        </Button>
                        <Button type="button" onClick={reset}>
                            再試行
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default AdminErrorPage;