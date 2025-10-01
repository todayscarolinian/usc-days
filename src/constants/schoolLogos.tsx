import Image from "next/image";

export const schoolLogos: Record<string, React.JSX.Element> = {
  Default: (
      <Image src="/tc-logo-red.png" width={24} height={24} className="inline mr-2" alt="Sport" />
  ),
};