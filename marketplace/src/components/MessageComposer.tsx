"use client";

import { Send } from "lucide-react";
import { useActionState, useEffect, useRef } from "react";
import { sendMessageAction } from "@/lib/actions/message-actions";

export function MessageComposer({ conversationId }: { conversationId: string }) {
  const [state, action, pending] = useActionState(sendMessageAction.bind(null, conversationId), {});
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!pending && !state.error) formRef.current?.reset();
  }, [pending, state]);

  return (
    <form ref={formRef} action={action} className="flex items-end gap-2">
      <label htmlFor="message" className="sr-only">
        הודעה
      </label>
      <textarea
        id="message"
        name="body"
        rows={1}
        required
        maxLength={2000}
        placeholder="כתבו הודעה…"
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            e.currentTarget.form?.requestSubmit();
          }
        }}
        className="max-h-32 min-h-12 flex-1 resize-none rounded-xl border border-border bg-card px-4 py-3 text-base focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
      />
      <button
        type="submit"
        disabled={pending}
        aria-label="שליחה"
        className="grid size-12 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground transition-colors duration-200 hover:bg-primary-hover disabled:opacity-60"
      >
        {/* Send icon points left in RTL */}
        <Send className="size-5 -scale-x-100" aria-hidden />
      </button>
      {state.error && (
        <p role="alert" className="sr-only">
          {state.error}
        </p>
      )}
    </form>
  );
}
