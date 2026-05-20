"use client";

import { LinkButton } from "@/components/shared/link-button";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

type StaffErrorPageProps = {
    error: Error & {
        digest?: string;
    };
    reset: () => void;
};

const StaffErrorPage = ({ error, reset }: StaffErrorPageProps) => {
    return (
        <div className="flex min-h-[60vh] items-center justify-center">
            <Card className="w-full max-w-xl">
                <CardHeader>
                    <CardTitle>処理中にエラーが発生しました</CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                    <p className="text-sm text-slate-600">
                        入力内容や勤務情報を確認して、もう一度操作してください。
                    </p>

                    <div className="rounded-md bg-slate-100 p-3 text-sm text-slate-700">
                        {error.message}
                    </div>

                    <div className="flex justify-end gap-3">
                        <LinkButton href="/staff" variant="outline">
                            スタッフトップへ戻る
                        </LinkButton>

                        <Button
                            type="button"
                            onClick={reset}
                            className="transition active:scale-95"
                        >
                            再試行
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default StaffErrorPage;