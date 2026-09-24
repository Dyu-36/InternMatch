import { Avatar } from "./Avatar";

export interface CompanyLogoProps {
  companyName: string;
  src?: string;
  size?: 32 | 40 | 48 | 64;
}

export function CompanyLogo({ companyName, src, size = 40 }: CompanyLogoProps) {
  return <Avatar name={companyName} src={src} size={size} square />;
}
