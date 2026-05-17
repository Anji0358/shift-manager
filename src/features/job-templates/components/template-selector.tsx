"use client";

import { useRouter } from "next/navigation";
import type { JobTemplate } from "@prisma/client";

type TemplateSelectorProps = {
    templates: JobTemplate[];
    selectedTemplateId?: string;
};

export const TemplateSelector = ({
    templates,
    selectedTemplateId,
}: TemplateSelectorProps) => {
    const router = useRouter();

    return (
        <div className="space-y-2">
            <label htmlFor="templateId" className="text-sm font-medium">
                テンプレート
            </label>

            <select
                id="templateId"
                name="templateId"
                value={selectedTemplateId ?? ""}
                onChange={(event) => {
                    const value = event.target.value;

                    if (!value) {
                        router.push("/admin/jobs/new");
                        return;
                    }

                    router.push(`/admin/jobs/new?templateId=${value}`);
                }}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            >
                <option value="">テンプレートを使わない</option>
                {templates.map((template) => (
                    <option key={template.id} value={template.id}>
                        {template.name}
                    </option>
                ))}
            </select>

            <p className="text-xs text-slate-500">
                選択すると、案件作成フォームにテンプレート内容が反映されます。
            </p>
        </div>
    );
};