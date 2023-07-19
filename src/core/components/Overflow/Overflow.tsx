import clsx from "clsx";
import { use, useLayoutEffect, useRef, useState } from "react";

type OverflowProps = {
  fromColor?: string;
} & React.HTMLAttributes<HTMLDivElement>;

const Overflow = (props: OverflowProps) => {
  const { children, className, fromColor = "from-white", ...delegated } = props;

  const containerRef = useRef<HTMLDivElement>(null);
  const childrenRef = useRef<HTMLDivElement>(null);
  const [overflowY, setOverflowY] = useState<"top" | "bottom" | "both" | null>(
    null
  );

  useLayoutEffect(() => {
    if (!childrenRef.current || !containerRef.current) {
      return;
    }

    if (childrenRef.current.offsetHeight <= containerRef.current.offsetHeight) {
      setOverflowY(null);
    } else if (containerRef.current.scrollTop === 0) {
      setOverflowY("bottom");
      console.log("height > container height");
    } else if (
      containerRef.current.scrollTop === containerRef.current.scrollHeight
    ) {
    }
  }, [childrenRef, containerRef]);

  return (
    <div
      {...delegated}
      ref={containerRef}
      className={clsx("relative overflow-y-auto", className)}
    >
      <div ref={childrenRef}>
        <div
          className={clsx(
            "pointer-events-none sticky top-0 -mt-6 h-6 w-full bg-gradient-to-b to-transparent",
            fromColor
          )}
        ></div>
        {children}
        <div
          className={clsx(
            "pointer-events-none sticky bottom-0 -mt-4 h-6 w-full bg-gradient-to-t to-transparent",
            fromColor
          )}
        ></div>
      </div>
    </div>
  );
};

export default Overflow;
