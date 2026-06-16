import { appStyles } from "@/components/shared/design-tokens";

type PersonalMessageTextFieldsProps = {
    greeting: string;
    introText: string;
    closing: string;
    onGreetingChange: (value: string) => void;
    onIntroTextChange: (value: string) => void;
    onClosingChange: (value: string) => void;
};

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
            <TextAreaField
                id="greeting"
                label="冒頭の挨拶"
                value={greeting}
                minHeightClassName="min-h-20"
                onChange={onGreetingChange}
            />

            <TextAreaField
                id="introText"
                label="案内文"
                value={introText}
                minHeightClassName="min-h-24"
                onChange={onIntroTextChange}
            />

            <TextAreaField
                id="closing"
                label="最後の文言"
                value={closing}
                minHeightClassName="min-h-24"
                onChange={onClosingChange}
            />
        </div>
    );
};

type TextAreaFieldProps = {
    id: string;
    label: string;
    value: string;
    minHeightClassName: string;
    onChange: (value: string) => void;
};

const TextAreaField = ({
    id,
    label,
    value,
    minHeightClassName,
    onChange,
}: TextAreaFieldProps) => {
    return (
        <div className="space-y-2">
            <label htmlFor={id} className={appStyles.form.label}>
                {label}
            </label>

            <textarea
                id={id}
                value={value}
                onChange={(event) => onChange(event.target.value)}
                className={[
                    appStyles.form.textarea,
                    "w-full p-3 text-sm leading-6 outline-none transition",
                    minHeightClassName,
                ].join(" ")}
            />
        </div>
    );
};