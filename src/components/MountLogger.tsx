import { useMountLogger } from "../hooks/useMountLogger";

interface MountLoggerProps {
  scope: string;
}

export default function MountLogger({ scope }: MountLoggerProps) {
  useMountLogger(scope);
  return null;
}
