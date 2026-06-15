import { appStyles } from "@/components/shared/design-tokens";
import type { LineMessageEmployee } from "../../types";

type PersonalSummaryCardsProps = {
    selectedEmployee: LineMessageEmployee | undefined;
    unavailableCount: number;
    jobCount: number;
    slotCount: number;
    requestableSlotCount: number;
};

export const PersonalSummaryCards = ({
    selectedEmployee,
    unavailableCount,
    jobCount,
    slotCount,
    requestableSlotCount,
}: PersonalSummaryCardsProps) => {
    const summaryItems = [
        {
            label: "選択中のスタッフ",
            value: selectedEmployee?.name ?? "未選択",
        },
        {
            label: "登録NG件数",
            value: `${unavailableCount}件`,
        },
        {
            label: "対象月の案件数",
            value: `${jobCount}件`,
        },
        {
            label: "勤務枠数",
            value: `${slotCount}件`,
        },
        {
            label: "依頼可能枠",
            value: `${requestableSlotCount}件`,
        },
    ];

    return (
        <div
            className={[
                "mt-6 grid gap-3 md:grid-cols-5",
                appStyles.section.soft,
            ].join(" ")}
        >
            {summaryItems.map((item) => (
                <div key={item.label}>
                    <p
                        className={[
                            "text-xs font-medium",
                            appStyles.textColor.accent,
                        ].join(" ")}
                    >
                        {item.label}
                    </p>
                    <p
                        className={[
                            "mt-2 font-semibold",
                            appStyles.textColor.default,
                        ].join(" ")}
                    >
                        {item.value}
                    </p>
                </div>
            ))}
        </div>
    );
};