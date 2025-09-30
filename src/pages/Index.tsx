import { useCallback, useState } from "react";
import { CardStackDemo } from "@/components/ui/demo";

const Index = () => {
  const [progress, setProgress] = useState({ current: 1, total: 6 });
  const pct = progress.total > 0 ? Math.min(100, Math.max(0, (progress.current / progress.total) * 100)) : 0;
  const handleProgress = useCallback((current: number, total: number) => {
    setProgress({ current: current + 1, total });
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
      <div className="w-full max-w-xl">
        <div className="h-1 w-full bg-muted rounded">
          <div className="h-1 bg-brand rounded transition-[width] duration-500 ease-out" style={{ width: `${pct}%` }} />
        </div>
        <div className="mt-6 p-6 rounded-lg border bg-card">
          <CardStackDemo onProgress={handleProgress} />
          <div className="mt-6 text-xs text-muted-foreground flex flex-col items-center gap-3">
            <div className="flex items-center gap-2">
              <img src="/HIPPA.png" alt="HIPAA Compliant" className="h-10" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
