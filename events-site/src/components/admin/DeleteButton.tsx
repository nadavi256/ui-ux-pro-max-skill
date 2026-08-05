"use client";

export function DeleteButton({ confirmMessage, label = "מחיקה" }: { confirmMessage: string; label?: string }) {
  return (
    <button
      type="submit"
      className="text-red-400 hover:underline cursor-pointer"
      onClick={(e) => {
        if (!confirm(confirmMessage)) e.preventDefault();
      }}
    >
      {label}
    </button>
  );
}
