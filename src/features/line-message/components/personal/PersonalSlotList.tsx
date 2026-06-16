import { appStyles } from "@/components/shared/design-tokens";
import type { AvailablePersonalSlot } from "../../types";
import { formatDateWithDay } from "../../utils/date";

type PersonalSlotListProps = {
    slots: AvailablePersonalSlot[];
    selectedSlotIds: string[];
    onToggleSlot: (slotId: string) => void;
};

export const PersonalSlotList = ({
    slots,
    selectedSlotIds,
    onToggleSlot,
}: PersonalSlotListProps) => {
    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
                <div>
                    <p className={appStyles.form.label}>
                        依頼可能な勤務枠一覧
                    </p>
                    <p className={["mt-1", appStyles.text.muted].join(" ")}>
                        選択中：{selectedSlotIds.length}件
                    </p>
                </div>
            </div>

            {slots.length === 0 ? (
                <p
                    className={[
                        "border p-4 text-sm",
                        appStyles.radius.xl,
                        appStyles.border.soft,
                        appStyles.background.warmSoft,
                        appStyles.textColor.muted,
                    ].join(" ")}
                >
                    NGと被っていない勤務枠がありません。
                </p>
            ) : (
                <div className="max-h-[520px] space-y-2 overflow-y-auto pr-1">
                    {slots.map((slot) => {
                        const checked = selectedSlotIds.includes(slot.slotId);

                        return (
                            <label
                                key={slot.slotId}
                                className={[
                                    "flex cursor-pointer items-center gap-3 border p-3 text-sm transition",
                                    appStyles.radius.xl,
                                    checked
                                        ? [
                                            appStyles.border.accent,
                                            appStyles.background.warm,
                                            appStyles.shadow.nav,
                                        ].join(" ")
                                        : [
                                            appStyles.border.soft,
                                            appStyles.background.white,
                                            appStyles.tokens.color.background.hoverWarmSubtle,
                                        ].join(" "),
                                ].join(" ")}
                            >
                                <input
                                    type="checkbox"
                                    checked={checked}
                                    onChange={() => onToggleSlot(slot.slotId)}
                                    className={[
                                        "h-4 w-4 rounded accent-current",
                                        appStyles.textColor.accent,
                                    ].join(" ")}
                                />

                                <div className="flex flex-1 items-center justify-between gap-3">
                                    <div>
                                        <p
                                            className={[
                                                "font-semibold",
                                                appStyles.textColor.default,
                                            ].join(" ")}
                                        >
                                            {`${formatDateWithDay(slot.workDate)} ${slot.title}`}
                                        </p>
                                        <p
                                            className={[
                                                "mt-1 text-sm",
                                                appStyles.textColor.muted,
                                            ].join(" ")}
                                        >
                                            {slot.location}
                                        </p>
                                    </div>

                                    <p
                                        className={[
                                            "shrink-0 text-sm font-medium",
                                            appStyles.textColor.muted,
                                        ].join(" ")}
                                    >
                                        {slot.startTime}〜{slot.endTime}
                                    </p>
                                </div>
                            </label>
                        );
                    })}
                </div>
            )}
        </div>
    );
};