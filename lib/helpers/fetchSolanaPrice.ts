// lib/helpers/fetchSolanaPrice.ts
export async function fetchSolanaPrice() {
    try {
      const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd&include_24hr_change=true');
      const data = await response.json();
      return {
        price: data.solana.usd,
        change24h: data.solana.usd_24h_change
      };
    } catch (error) {
      console.error("Error fetching SOL price:", error);
      throw error;
    }
  }