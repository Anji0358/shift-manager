type PersonalMessageTextFieldsProps = {
    greeting: string;
    introText: string;
    closing: string;
    onGreetingChange: (value: string) => void;
    onIntroTextChange: (value: string) => void;
    onClosingChange: (value: string) => void;
};

const textareaClassName =
    "w-full rounded-xl border bg-white p-3 text-sm leading-6 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

export const PersonalMessageTextFields = ({
    greeting,
    introText,
    closing,
    onGreetingChange,
    onIntroTextChange,
    onClosingChange,
}: PersonalMessageTextFieldsProps) => {
    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                    冒頭の挨拶
                </label>
                <textarea
                    value={greeting}
                    onChange={(event) => onGreetingChange(event.target.value)}
                    className={`${textareaClassName} min-h-20`}
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                    案内文
                </label>
                <textarea
                    value={introText}
                    onChange={(event) => onIntroTextChange(event.target.value)}
                    className={`${textareaClassName} min-h-24`}
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                    最後の文言
                </label>
                <textarea
                    value={closing}
                    onChange={(event) => onClosingChange(event.target.value)}
                    className={`${textareaClassName} min-h-24`}
                />
            </div>
        </div>
    );
};