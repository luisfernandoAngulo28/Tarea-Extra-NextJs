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
    sm: "w-[350px]",
    md: "w-[500px]",
    lg: "w-[700px]",
  };
  return (
    // Usamos el componente raíz de Radix Dialog para controlar el estado
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Trigger asChild>{trigger}</DialogPrimitive.Trigger>

      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-60 bg-black/40 backdrop-blur-sm" />
        <DialogPrimitive.Content
          className={`fixed z-61 bg-white p-6 rounded-xl shadow-xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${sizes[size]}`}
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
            <DialogPrimitive.Title className="text-xl font-bold mb-2">
              {title}
            </DialogPrimitive.Title>
          )}
          {description && (
            <DialogPrimitive.Description className="text-gray-600 mb-4">
              {description}
            </DialogPrimitive.Description>
          )}
          <div>{children}</div>
          {footer && (
            <div className="mt-6 flex justify-end gap-3">{footer}</div>
          )}

          <DialogPrimitive.Close className="absolute top-4 right-4 text-gray-400 hover:text-black">
            ✕
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
