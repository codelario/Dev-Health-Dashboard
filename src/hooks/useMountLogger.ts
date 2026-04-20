import { useEffect } from "react";

export function useMountLogger(scope: string): void {
  useEffect(() => {
    console.log(`[mount] ${scope} mounted`);

    // Cleanup runs when the component is removed.
    // This mirrors class-component unmount behavior.
    return () => {
      console.log(`[unmount] ${scope} unmounted`);
    };
  }, [scope]);
}
