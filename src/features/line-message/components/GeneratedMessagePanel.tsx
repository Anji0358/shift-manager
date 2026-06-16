import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppCard } from "@/components/shared/bridal-card";
import { appStyles } from "@/components/shared/design-tokens";

type GeneratedMessagePanelProps = {
    title?: string;
    description?: string;
    message: string;
    copied: boolean;
    placeholder?: string;
    onMessageChange: (value: string) => void;
    onCopy: () => void;
};

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
        <AppCard className="p-6">
            <div className="flex items-center justify-between gap-3">
                <div>
                    <h3
                        className={[
                            appStyles.text.title,
                            "font-semibold",
                        ].join(" ")}
                    >
                        {title}
                    </h3>
                    <p className={["mt-1", appStyles.text.muted].join(" ")}>
                        {description}
                    </p>
                </div>

                <Button
                    type="button"
                    variant="outline"
                    onClick={onCopy}
                    disabled={!message}
                    className={appStyles.button.secondary}
                >
                    <Copy className="mr-2 h-4 w-4" />
                    {copied ? "コピー済み" : "コピー"}
                </Button>
            </div>

            <textarea
                value={message}
                onChange={(event) => onMessageChange(event.target.value)}
                placeholder={placeholder}
                className={[
                    appStyles.form.textarea,
                    "mt-5 min-h-[320px] w-full p-4 font-mono text-sm leading-7 outline-none transition",
                ].join(" ")}
            />
        </AppCard>
    );
};