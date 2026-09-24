import Image from "next/image";
import { cn } from "@/lib/utils";

export interface AvatarProps {
  name: string;
  src?: string;
  size?: 32 | 40 | 48 | 64;
  square?: boolean;
}

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export function Avatar({ name, src, size = 40, square = false }: AvatarProps) {
  return (
    <span
      className={cn("ui-avatar", square ? "ui-avatar--square" : undefined)}
      style={{ width: size, height: size }}
      aria-label={name}
    >
      {src ? <Image src={src} alt="" width={size} height={size} unoptimized /> : getInitials(name)}
    </span>
  );
}
