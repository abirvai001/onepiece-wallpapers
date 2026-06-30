import { XContactLink } from "@/components/XContactLink";

type AdPlaceholderProps = {
  variant?: "banner" | "sidebar" | "inline";
};

export function AdPlaceholder({ variant = "banner" }: AdPlaceholderProps) {
  const sizeClass =
    variant === "sidebar"
      ? "min-h-[250px]"
      : variant === "inline"
        ? "min-h-[120px]"
        : "min-h-[90px]";

  return (
    <div className={`ad-placeholder ${sizeClass} flex flex-col items-center justify-center`}>
      <p className="text-xs font-semibold uppercase tracking-widest text-parchment/40">
        Advertisement Space
      </p>
      <p className="mt-1 text-sm text-parchment/50">
        Sponsor this spot — contact <XContactLink className="text-gold" />
      </p>
    </div>
  );
}