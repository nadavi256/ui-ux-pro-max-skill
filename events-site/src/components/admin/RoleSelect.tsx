"use client";

export function RoleSelect({ defaultValue }: { defaultValue: string }) {
  return (
    <select
      name="role"
      defaultValue={defaultValue}
      onChange={(e) => e.currentTarget.form?.requestSubmit()}
      className="cursor-pointer rounded-lg border border-border bg-background px-2 py-1.5 text-sm text-foreground focus:border-primary focus:outline-none"
    >
      <option value="VIEWER">צפייה בלבד</option>
      <option value="EDITOR">עורך תוכן</option>
      <option value="SUPER_ADMIN">מנהל-על</option>
    </select>
  );
}
