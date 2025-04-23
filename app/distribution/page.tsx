import { StakeConcentrationDashboard } from "@/components/app/stake-concentration-dashboard";
import { TopValidators } from "@/components/app/top-validators";
import { ValidatorChartStakeWeight } from "@/components/app/validator-chart-stake-weight";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";

function Page() {
  return (
    <div className="w-full grid gap-4">
      <Card>
        <CardContent>
          <StakeConcentrationDashboard />
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="text-2xl font-bold">Solana Validator Stake Distribution</CardHeader>
        <CardContent>
          <ValidatorChartStakeWeight />
        </CardContent>
      </Card>
      <Card>
        <CardHeader >
            <CardTitle className="text-2xl font-bold">Top Validators</CardTitle>
        </CardHeader>
        <CardContent>
          <TopValidators />
        </CardContent>
      </Card>
    </div>
  );
}

export default Page;
