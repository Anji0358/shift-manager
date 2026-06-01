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
                    <p className="text-sm font-medium text-slate-700">
                        依頼可能な勤務枠一覧
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                        選択中：{selectedSlotIds.length}件
                    </p>
                </div>
            </div>

            {slots.length === 0 ? (
                <p className="rounded-xl border bg-slate-50 p-4 text-sm text-slate-500">
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
                                    "flex cursor-pointer items-center gap-3 rounded-xl border p-3 text-sm transition",
                                    checked
                                        ? "border-blue-400 bg-blue-50 shadow-sm"
                                        : "bg-white hover:bg-slate-50",
                                ].join(" ")}
                            >
                                <input
                                    type="checkbox"
                                    checked={checked}
                                    onChange={() => onToggleSlot(slot.slotId)}
                                    className="h-4 w-4"
                                />

                                <div className="flex flex-1 items-center justify-between gap-3">
                                    <div>
                                        <p className="font-semibold text-slate-900">
                                            {`${formatDateWithDay(slot.workDate)} ${slot.title}`}
                                        </p>
                                        <p className="mt-1 text-sm text-slate-500">
                                            {slot.location}
                                        </p>
                                    </div>

                                    <p className="shrink-0 text-sm font-medium text-slate-500">
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