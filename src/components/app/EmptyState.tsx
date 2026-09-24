import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props { icon: LucideIcon; title: string; body: string; action?: { label: string; onClick: () => void } }

export function EmptyState({ icon: Icon, title, body, action }: Props) {
  return (
    <div className="flex flex-col items-center rounded-3xl border border-dashed border-border px-6 py-12 text-center">
      <span className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
        <Icon className="size-6" aria-hidden />
      </span>
      <h2 className="font-semibold">{title}</h2>
      <p className="mt-1 max-w-xs text-sm text-muted-foreground">{body}</p>
      {action && <Button className="mt-6 h-11 rounded-2xl px-6" onClick={action.onClick}>{action.label}</Button>}
    </div>
  );
}
