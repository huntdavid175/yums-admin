import { useEffect, useState } from "react";

export function LiveClock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  return (
    <div className="text-right">
      <div className="text-xs md:text-sm font-medium">
        {now.toLocaleTimeString()}
      </div>
      <div className="text-xs text-gray-500 hidden md:block">
        {now.toLocaleDateString()}
      </div>
    </div>
  );
}
