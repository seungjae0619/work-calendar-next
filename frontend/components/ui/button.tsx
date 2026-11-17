"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-semibold transition-[background-color,transform,opacity] duration-150 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-5 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-[3px] focus-visible:ring-primary/30",
  {
    variants: {
      variant: {
        default: "bg-primary text-white hover:bg-primary-pressed",
        secondary: "bg-primary-weak text-primary hover:brightness-95",
        weak: "bg-surface-muted text-body hover:bg-surface-pressed",
        ghost: "bg-transparent text-sub hover:bg-surface-muted",
        outline:
          "border border-line bg-surface text-body hover:bg-surface-muted",
      },
      size: {
        default: "h-12 px-5 rounded-xl text-[16px]",
        sm: "h-8 px-3 rounded-lg text-[13px]",
        lg: "h-14 px-6 rounded-2xl text-[17px]",
        icon: "size-9 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
