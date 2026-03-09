"use client";

import { FormSubmitButton } from "@/components/form-submit-button";

export function DeleteEntryButton({ title }: { title: string }) {
  return (
    <FormSubmitButton
      label="Delete"
      pendingLabel="Deleting..."
      variant="destructive"
      onClick={(event) => {
        const confirmed = window.confirm(
          `Delete \"${title}\"? This action cannot be undone.`,
        );

        if (!confirmed) {
          event.preventDefault();
        }
      }}
    />
  );
}
