import { SITE_CONFIG } from "@/lib/categories";

type XContactLinkProps = {
  className?: string;
  showAt?: boolean;
};

export function XContactLink({ className = "", showAt = true }: XContactLinkProps) {
  return (
    <a
      href={SITE_CONFIG.xUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`transition hover:text-gold hover:underline ${className}`}
    >
      {showAt ? SITE_CONFIG.xHandle : "abirphotomail"}
    </a>
  );
}