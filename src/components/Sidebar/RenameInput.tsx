import { useRef } from "react";
import { stripExtension } from "@/config/fileConfig";

interface RenameInputProps {
  paddingLeft: number;
  defaultValue: string;
  onFinish: (value: string) => void;
  onCancel: () => void;
}

export const RenameInput = ({ paddingLeft, defaultValue, onFinish, onCancel }: RenameInputProps) => {
  const cancelledRef = useRef(false);

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (cancelledRef.current) {
      cancelledRef.current = false;
      onCancel();
      return;
    }
    onFinish(e.currentTarget.value.trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") e.currentTarget.blur();
    if (e.key === "Escape") {
      cancelledRef.current = true;
      e.currentTarget.blur();
    }
  };

  return (
    <input
      autoFocus
      type="text"
      className="w-full rounded bg-base-100 px-2 py-1 text-sm text-base-content ring-1 ring-primary outline-none"
      style={{ paddingLeft }}
      defaultValue={stripExtension(defaultValue)}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
    />
  );
};
