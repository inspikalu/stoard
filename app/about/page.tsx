import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";

function Page() {
  return (
    <div className="container mx-auto p-6 space-y-8">
      <h1 className="text-4xl font-bold mb-8">About Solana Staking Dashboard</h1>

      {/* Mission Section */}
      <Card>
        <CardHeader>
          <CardTitle>Mission</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg mb-4">
            The Solana Staking Dashboard is designed to provide comprehensive insights into the Solana network's staking ecosystem. Our mission is to:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Track and visualize total staked SOL across the network</li>
            <li>Monitor validator distribution and stake concentration</li>
            <li>Provide real-time insights into staking trends and patterns</li>
            <li>Help users make informed decisions about staking participation</li>
          </ul>
        </CardContent>
      </Card>

      {/* Design Decisions Section */}
      <Card>
        <CardHeader>
          <CardTitle>Design Decisions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Real-time Data Visualization</h3>
            <p>
              We've implemented interactive charts and graphs to make complex staking data easily digestible. The dashboard uses Recharts and D3 for responsive and interactive data visualization.
            </p>

            <h3 className="text-xl font-semibold">Responsive Architecture</h3>
            <p>
              Built with Next.js 15.3.1 and React, the dashboard is designed to be fast, responsive, and accessible across all devices. We use React Query for efficient data fetching and caching.
            </p>

            <h3 className="text-xl font-semibold">Error Handling & Fallbacks</h3>
            <p>
              The system implements robust error handling with fallback data to ensure continuous service even when external APIs are unavailable.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Data Sources Section */}
      <Card>
        <CardHeader>
          <CardTitle>Data Sources</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Primary Sources</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Helius RPC for real-time blockchain data</li>
              <li>Solana Beach API for validator metadata</li>
              <li>Upstash Redis for data persistence</li>
            </ul>

            <h3 className="text-xl font-semibold">Data Types</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Total staked SOL</li>
              <li>Validator distribution and performance</li>
              <li>Stake concentration metrics</li>
              <li>Historical staking trends</li>
              <li>Network participation data</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Update Strategy Section */}
      <Card>
        <CardHeader>
          <CardTitle>Update Strategy</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Data Refresh</h3>
            <p>
              The dashboard implements a sophisticated update strategy:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Real-time updates for critical metrics</li>
              <li>Smart caching with React Query</li>
              <li>Rate limiting with exponential backoff</li>
              <li>Fallback data for service interruptions</li>
            </ul>

            <h3 className="text-xl font-semibold">Performance Optimization</h3>
            <p>
              We use React Query for efficient data management with:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Stale-while-revalidate caching strategy</li>
              <li>Background data updates</li>
              <li>Optimistic updates for better UX</li>
              <li>Efficient data persistence with Upstash Redis</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Attribution Section */}
      <Card>
        <CardHeader>
          <CardTitle>Attribution & Links</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Powered By</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <a href="https://solana.com" target="_blank" rel="noopener noreferrer" className="flex items-center text-blue-600 hover:underline">
                  Solana Blockchain <ExternalLink className="ml-1 h-4 w-4" />
                </a>
              </li>
              <li>
                <a href="https://helius.xyz" target="_blank" rel="noopener noreferrer" className="flex items-center text-blue-600 hover:underline">
                  Helius API <ExternalLink className="ml-1 h-4 w-4" />
                </a>
              </li>
              <li>
                <a href="https://solanabeach.io" target="_blank" rel="noopener noreferrer" className="flex items-center text-blue-600 hover:underline">
                  Solana Beach <ExternalLink className="ml-1 h-4 w-4" />
                </a>
              </li>
              <li>
                <a href="https://upstash.com" target="_blank" rel="noopener noreferrer" className="flex items-center text-blue-600 hover:underline">
                  Upstash Redis <ExternalLink className="ml-1 h-4 w-4" />
                </a>
              </li>
            </ul>

            <h3 className="text-xl font-semibold">Technology Stack</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Next.js 15.3.1 for the frontend framework</li>
              <li>React Query for data fetching and caching</li>
              <li>Radix UI for accessible components</li>
              <li>Recharts and D3 for data visualization</li>
              <li>Tailwind CSS for styling</li>
              <li>Upstash Redis for data persistence</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Page;
