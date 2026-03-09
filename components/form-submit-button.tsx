"use client";

import { useFormStatus } from "react-dom";

import { Button } from "@/components/ui/button";

export function FormSubmitButton({
  label,
  pendingLabel,
  variant,
  size,
  onClick,
}: {
  label: string;
  pendingLabel?: string;
  variant?: "default" | "secondary" | "ghost" | "destructive";
  size?: "default" | "sm" | "lg";
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      variant={variant}
      size={size}
      disabled={pending}
      aria-busy={pending}
      onClick={onClick}
    >
      {pending ? (pendingLabel ?? "Saving...") : label}
    </Button>
  );
}
