'use client';
import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const CRYPTOS = [
  { id: 'bitcoin', name: 'Bitcoin' },
  { id: 'ethereum', name: 'Ethereum' },
  { id: 'ripple', name: 'XRP' },
  { id: 'cardano', name: 'ADA' },
  { id: 'stellar', name: 'XLM' },
  { id: 'pepe', name: 'PEPE' },
  { id: 'maga', name: 'TRUMP' },
  { id: 'sui', name: 'SUI' },
  { id: 'shiba-inu', name: 'SHIBA' }
];

export default function Dashboard() {
  const [cryptoId, setCryptoId] = useState('bitcoin');
  const [prices, setPrices] = useState<number[]>([]);
  const [labels, setLabels] = useState<string[]>([]);

  useEffect(() => {
    async function fetchData() {
      const res = await fetch(
        `https://api.coingecko.com/api/v3/coins/${cryptoId}/market_chart?vs_currency=usd&days=30`
      );
      const data = await res.json();
      const newPrices = data.prices.map((p: any) => p[1]);
      const newLabels = data.prices.map((p: any) =>
        new Date(p[0]).toLocaleDateString()
      );
      setPrices(newPrices);
      setLabels(newLabels);
    }

    fetchData();
  }, [cryptoId]);

  return (
    <div className='min-h-screen bg-black text-yellow-400 p-4'>
      <h1 className='text-3xl font-bold mb-6'>📊 Dashboard Cripto</h1>
      <div className='mb-4'>
        <label htmlFor='crypto'>Seleccionar Criptomoneda: </label>
        <select
          id='crypto'
          className='bg-zinc-800 text-yellow-400 p-2 rounded'
          value={cryptoId}
          onChange={(e) => setCryptoId(e.target.value)}
        >
          {CRYPTOS.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className='bg-zinc-900 p-4 rounded'>
        <Line
          data={{
            labels,
            datasets: [
              {
                label: 'Precio (USD)',
                data: prices,
                borderColor: '#fcd535',
                backgroundColor: 'rgba(252, 213, 53, 0.2)',
                tension: 0.3,
                pointRadius: 0
              }
            ]
          }}
          options={{
            responsive: true,
            plugins: {
              legend: {
                labels: { color: '#fcd535' }
              },
              tooltip: {
                backgroundColor: '#333',
                titleColor: '#fcd535',
                bodyColor: '#fff'
              }
            },
            scales: {
              x: { ticks: { color: '#fcd535' }, grid: { color: '#222' } },
              y: { ticks: { color: '#fcd535' }, grid: { color: '#222' } }
            }
          }}
        />
      </div>
    </div>
  );
}