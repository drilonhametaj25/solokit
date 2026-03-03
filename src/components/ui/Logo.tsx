import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
}

export function Logo({ className, showText = true, size = "md" }: LogoProps) {
  const sizes = {
    sm: { icon: 24, text: "text-lg" },
    md: { icon: 32, text: "text-xl" },
    lg: { icon: 40, text: "text-2xl" },
  };

  const { icon, text } = sizes[size];

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {/* Icon - Abstract "S" made of stacked layers representing a kit/stack */}
      <svg
        width={icon}
        height={icon}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        {/* Background circle */}
        <rect
          width="32"
          height="32"
          rx="8"
          className="fill-primary"
        />
        {/* Stacked layers representing "kit" */}
        <rect
          x="7"
          y="8"
          width="18"
          height="4"
          rx="1"
          className="fill-primary-foreground"
        />
        <rect
          x="7"
          y="14"
          width="14"
          height="4"
          rx="1"
          className="fill-primary-foreground opacity-80"
        />
        <rect
          x="7"
          y="20"
          width="10"
          height="4"
          rx="1"
          className="fill-primary-foreground opacity-60"
        />
      </svg>

      {showText && (
        <span className={cn("font-heading font-bold text-foreground", text)}>
          SoloKit
        </span>
      )}
    </div>
  );
}

// Icon-only version for favicon/small spaces
export function LogoIcon({ className, size = 32 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect
        width="32"
        height="32"
        rx="8"
        className="fill-primary"
      />
      <rect
        x="7"
        y="8"
        width="18"
        height="4"
        rx="1"
        className="fill-primary-foreground"
      />
      <rect
        x="7"
        y="14"
        width="14"
        height="4"
        rx="1"
        className="fill-primary-foreground opacity-80"
      />
      <rect
        x="7"
        y="20"
        width="10"
        height="4"
        rx="1"
        className="fill-primary-foreground opacity-60"
      />
    </svg>
  );
}
