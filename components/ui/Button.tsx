"use client";

import Link from "next/link";

type ButtonVariant = "primary" | "secondary" | "ghost";

interface ButtonProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  href?: string;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-white hover:bg-[#8A1519]",
  secondary:
    "bg-white text-primary border-[1.5px] border-primary hover:bg-primary-light",
  ghost:
    "bg-bg text-[#444444] border border-border hover:border-[#9F9E9E]",
};

export default function Button({
  children,
  variant = "primary",
  href,
  onClick,
  className = "",
  type = "button",
  disabled = false,
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-lg px-6 py-3 text-[15px] font-medium transition-all duration-200 cursor-pointer md:text-base disabled:opacity-60 disabled:cursor-not-allowed";
  const classes = `${base} ${variantStyles[variant]} ${className}`;

  if (href) {
    if (disabled) {
      return <span className={classes} aria-disabled="true">{children}</span>;
    }
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={classes} disabled={disabled}>
      {children}
    </button>
  );
}
