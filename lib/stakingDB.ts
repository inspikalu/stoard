import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'app/data', 'staking-data.json');

// Initialize database file
function initDb() {
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, '[]');
  }
}

// Read all staking data
export function getStakingData() {
  initDb();
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
}

// Add new staking record
export function addStakingRecord(record: {
  total_staked: number;
  epoch: number;
  circulating_supply?: number;
  non_circulating_supply?: number;
}) {
  const data = getStakingData();
  data.push({
    timestamp: new Date().toISOString(),
    ...record
  });
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  return data;
}