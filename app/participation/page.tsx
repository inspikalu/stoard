"use client"
import React from "react";
import ActiveStakeChart from "@/components/app/active-stake-chart";
import EpochProgress from "@/components/app/epoch-progress";
import VoteMetrics from "@/components/app/vote-metrics";
import StakeQueues from "@/components/app/stake-queues";
import { useParticipationData } from "@/hooks/useParticipationData";

function Page() {
  const { data } = useParticipationData();

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <EpochProgress data={data?.epochInfo} />
      <ActiveStakeChart />
      <VoteMetrics data={data?.voteMetrics}/>
      <StakeQueues data={data?.stakeQueues} />
    </div>
  );
}

export default Page;