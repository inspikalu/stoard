# Solana Staking Dashboard

A modern, real-time dashboard for monitoring and analyzing the health of Solana's staking ecosystem. Built with Next.js, TypeScript, and React Query, this dashboard provides clear insights into stake distribution, validator performance, and network participation.

## Features

- Real-time tracking of total staked SOL
- Comprehensive validator statistics
- Interactive stake distribution visualization
- Epoch information and slot time tracking
- Responsive design with dark/light mode support
- Rate-limited API calls with exponential backoff
- Efficient data caching and state management

## Tech Stack

- **Framework**: Next.js 15.3.1
- **Language**: TypeScript
- **State Management**: React Query
- **UI Components**: Radix UI
- **Styling**: Tailwind CSS
- **Data Visualization**: Recharts, D3
- **Blockchain**: Solana Web3.js
- **API**: Helius RPC (primary), Solana Beach API (limited usage for validator metadata only)

## Data Sources

The dashboard primarily uses Helius RPC for real-time blockchain data. Solana Beach API is used sparingly for fetching validator metadata (names, images, websites) to enhance the user experience. All core staking data and network metrics are fetched directly from the Solana blockchain through Helius RPC.

## Prerequisites

- Node.js 18.x or higher
- pnpm (recommended) or npm
- Helius API key
- Solana Beach API key (optional, for enhanced validator metadata)

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/solana-staking-dashboard.git
   cd solana-staking-dashboard
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Add your Helius API key to the `.env` file:
   ```
   HELIUS_API_KEY=your_api_key_here
   ```

5. Start the development server:
   ```bash
   pnpm dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

- `HELIUS_API_KEY`: Your Helius API key
- `CRON_SECRET`: Secret for cron job authentication
- `HELIUS_RATE_LIMIT_RPS`: Rate limit requests per second (default: 30)
- `HELIUS_RATE_LIMIT_BURST`: Rate limit burst size (default: 100)
- `SOLANA_BEACH_API_KEY`: Your Solana Beach API key

## Available Scripts

- `pnpm dev`: Start development server with Turbopack
- `pnpm build`: Build for production
- `pnpm start`: Start production server
- `pnpm lint`: Run ESLint

## Project Structure

```
├── app/                 # Next.js app directory
│   ├── api/            # API routes
│   ├── components/     # Page components
│   └── lib/           # Utility functions
├── components/         # Shared components
├── hooks/             # Custom React hooks
├── lib/               # Core functionality
├── public/            # Static assets
└── types/             # TypeScript type definitions
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Solana Web3.js](https://solana-labs.github.io/solana-web3.js/)
- [Helius RPC](https://docs.helius.xyz/)
- [Next.js](https://nextjs.org/)
- [React Query](https://tanstack.com/query/latest)
