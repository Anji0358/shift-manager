import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

type GeneratedMessagePanelProps = {
    title?: string;
    description?: string;
    message: string;
    copied: boolean;
    placeholder?: string;
    onMessageChange: (value: string) => void;
    onCopy: () => void;
};

const resultTextareaClassName =
    "mt-4 min-h-80 w-full rounded-xl border bg-slate-50 p-4 text-sm leading-7 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

export const GeneratedMessagePanel = ({
    title = "生成結果",
    description = "必要に応じて編集してからコピーできます。",
    message,
    copied,
    placeholder = "ここに生成されたメッセージが表示されます。",
    onMessageChange,
    onCopy,
}: GeneratedMessagePanelProps) => {
    return (
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-3">
                <div>
                    <h3 className="font-semibold text-slate-900">{title}</h3>
                    <p className="mt-1 text-sm text-slate-500">
                        {description}
                    </p>
                </div>

                <Button
                    type="button"
                    variant="outline"
                    onClick={onCopy}
                    disabled={!message}
                >
                    <Copy className="mr-2 h-4 w-4" />
                    {copied ? "コピー済み" : "コピー"}
                </Button>
            </div>

            <textarea
                value={message}
                onChange={(event) => onMessageChange(event.target.value)}
                placeholder={placeholder}
                className={resultTextareaClassName}
            />
        </div>
    );
};