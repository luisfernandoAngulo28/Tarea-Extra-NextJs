"use client";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import Image from "next/image";

type DialogProps = {
  trigger: React.ReactNode;
  children: React.ReactNode;

  title?: string;
  description?: string;
  image?: string;

  footer?: React.ReactNode;

  size?: "sm" | "md" | "lg";

  // Control de estado externo de apertura y cierre
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export default function Dialog({
  trigger,
  children,
  title,
  description,
  image,
  footer,
  size = "md",
  open,
  onOpenChange,
}: DialogProps) {
  const sizes = {
    sm: "w-[92vw] max-w-[350px]",
    md: "w-[92vw] max-w-[500px]",
    lg: "w-[92vw] max-w-[700px]",
  };
  return (
    // Usamos el componente raíz de Radix Dialog para controlar el estado
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Trigger asChild>{trigger}</DialogPrimitive.Trigger>

      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-60 bg-black/40 backdrop-blur-sm" />
        <DialogPrimitive.Content
          className={`fixed z-61 top-1/2 left-1/2 max-h-[90vh] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-6 text-slate-900 shadow-2xl ${sizes[size]}`}
        >
          {image && (
            <div className="mb-4 overflow-hidden rounded">
              <Image
                src={image}
                alt={title || "Dialog Image"}
                className="h-48 w-full object-cover"
                height={300}
                width={500}
              />
            </div>
          )}
          {title && (
            <DialogPrimitive.Title className="mb-2 pr-8 text-xl font-bold text-slate-900">
              {title}
            </DialogPrimitive.Title>
          )}
          {description && (
            <DialogPrimitive.Description className="mb-4 pr-8 text-slate-600">
              {description}
            </DialogPrimitive.Description>
          )}
          <div>{children}</div>
          {footer && (
            <div className="mt-6 flex justify-end gap-3">{footer}</div>
          )}

          <DialogPrimitive.Close className="absolute right-4 top-4 text-slate-400 transition hover:text-slate-900">
            ✕
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
