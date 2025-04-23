import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StakeQueuesProps {
  data?: {
    activation: number;
    deactivation: number;
  };
}

export default function StakeQueues({ data }: StakeQueuesProps) {
  if (!data) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Stake Activation Queues</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Activations</p>
                <p className="text-2xl font-bold">{data.activation}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Deactivations</p>
                <p className="text-2xl font-bold">{data.deactivation}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}