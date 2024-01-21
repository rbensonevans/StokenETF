'use client';

import { EtfTable } from '@/components/etf-table';
import { Card, CardTitle } from '@/components/ui/card';
import { erc20Abi } from 'viem';
import { useAccount, useReadContracts } from 'wagmi';

function formatNumber(num: bigint, decimals = 18) {
  // format a number from wei to ether
  const units = 10 ** decimals;
  return num / BigInt(units);
}

export default function Home() {
  const { address } = useAccount();
  const { data } = useReadContracts({
    allowFailure: false,
    contracts: [
      {
        address: '0xc4bF5CbDaBE595361438F8c6a187bDc330539c60',
        abi: erc20Abi,
        functionName: 'balanceOf',
        args: [address ?? '0x'],
      },
      {
        address: '0xc4bF5CbDaBE595361438F8c6a187bDc330539c60',
        abi: erc20Abi,
        functionName: 'decimals',
        args: [],
      },
      {
        address: '0xE2423Fddd5eA596073ACA59d2bf809E8531c71c2',
        abi: erc20Abi,
        functionName: 'balanceOf',
        args: [address ?? '0x'],
      },
    ],
  });

  return (
    <main className='flex min-h-screen flex-col items-center justify-between px-24 relative pt-20'>
      <div className='absolute bg-slate-700 h-[200px] left-0 top-0 w-full -z-10'>&nbsp;</div>
      <div className='grid grid-flow-row grid-cols-1 gap-4'>
        <div className='text-gray-400 px-4'>
          <h2>Net Worth</h2>
          <p>
            {data?.[0]
              ? Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
                  formatNumber(data[0], data[1])
                )
              : '--.--'}
          </p>
        </div>
        <Card className='p-4 flex flex-col gap-4'>
          <CardTitle className='text-2xl text-gray-700 font-medium'>Available ETF</CardTitle>
          <div>
            <EtfTable />
          </div>
        </Card>
      </div>
    </main>
  );
}
