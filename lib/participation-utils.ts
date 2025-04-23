export function formatLamports(lamports: number, decimals: number = 2): string {
    const sol = lamports / 1e9;
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(sol);
  }
  
  export function formatPercentage(value: number, decimals: number = 2): string {
    return new Intl.NumberFormat('en-US', {
      style: 'percent',
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(value / 100);
  }
  
  export function formatTime(seconds: number): string {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    return [
      hrs > 0 ? `${hrs}h` : null,
      mins > 0 ? `${mins}m` : null,
      secs > 0 ? `${secs}s` : null,
    ].filter(Boolean).join(' ') || '0s';
  }
  
  export function shortAddress(address: string, chars = 4): string {
    return `${address.slice(0, chars)}...${address.slice(-chars)}`;
  }