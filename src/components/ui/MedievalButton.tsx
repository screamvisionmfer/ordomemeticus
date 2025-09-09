
// src/components/ui/MedievalButton.tsx
import React from "react";

type Variant = "gilded" | "wax" | "parchment" | "rune";
type Size = "sm" | "md" | "lg";

export interface MedievalButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  as?: "button" | "a";
  href?: string;
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  disabled?: boolean;
  className?: string;
}

function cx(...parts: Array<string | false | undefined>) {
  return parts.filter(Boolean).join(" ");
}

const base = "btn-medieval";
const sizeMap: Record<Size, string> = {
  sm: "is-sm",
  md: "is-md",
  lg: "is-lg",
};

export const MedievalButton: React.FC<MedievalButtonProps> = ({
  as = "button",
  href,
  variant = "gilded",
  size = "md",
  fullWidth,
  className,
  children,
  disabled,
  ...rest
}) => {
  const cls = cx(
    base,
    `is-${variant}`,
    sizeMap[size],
    fullWidth ? "is-full" : "",
    className
  );

  if (as === "a") {
    return (
      <a
        href={disabled ? undefined : href}
        aria-disabled={disabled ? "true" : undefined}
        className={cls}
        {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      disabled={disabled}
      className={cls}
      {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {children}
    </button>
  );
};

export default MedievalButton;
