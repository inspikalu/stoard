// Helper function to calculate uptime from epochCredits
export const calculateUptime = (epochCredits: number[][]): number => {
  if (epochCredits.length < 2) return 100;

  // This is a simplified calculation - in a real app, you'd want a more accurate formula
  // based on the actual meaning of the epochCredits data
  const latestEpoch = epochCredits[epochCredits.length - 1];
  const previousEpoch = epochCredits[epochCredits.length - 2];

  if (previousEpoch[1] === 0) return 100;

  const uptimePercentage =
    ((latestEpoch[1] - latestEpoch[2]) /
      (previousEpoch[1] - previousEpoch[2])) *
    100;
  return Math.min(Math.max(uptimePercentage, 0), 100);
};