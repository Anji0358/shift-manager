import { CheckCircle2 } from "lucide-react";

type SuccessMessageProps = {
    message?: string;
};

const messageMap: Record<string, string> = {
    created: "登録が完了しました。",
    updated: "更新が完了しました。",
    deleted: "削除が完了しました。",
    canceled: "キャンセルが完了しました。",
    deactivated: "退職済みに変更しました。",
    assigned: "シフトを確定しました。",
};

export const SuccessMessage = ({ message }: SuccessMessageProps) => {
    if (!message) {
        return null;
    }

    const text = messageMap[message] ?? "処理が完了しました。";

    return (
        <div className="flex items-center gap-2 rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            <CheckCircle2 className="h-4 w-4" />
            <span>{text}</span>
        </div>
    );
};