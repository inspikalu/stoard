import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface EpochProgressProps {
  data?: {
    epoch: number;
    progressPercentage: number;
    remainingTime: string;
  };
}

export default function EpochProgress({ data }: EpochProgressProps) {
  if (!data) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Epoch Progress</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Current Epoch:</span>
          <span className="font-medium">{data.epoch}</span>
        </div>
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium text-muted-foreground">Progress</span>
            <span className="text-sm font-medium">
              {data.progressPercentage.toFixed(2)}%
            </span>
          </div>
          <Progress value={data.progressPercentage} />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Estimated time remaining:</span>
          <span className="font-medium">{data.remainingTime}</span>
        </div>
      </CardContent>
    </Card>
  );
}