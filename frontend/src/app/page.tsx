import { EtfTable } from '@/components/etf-table';
import { Card, CardTitle } from '@/components/ui/card';

export default function Home() {
  return (
    <main className='flex min-h-screen flex-col items-center justify-between px-24 relative pt-20'>
      <div className='absolute bg-slate-700 h-[200px] left-0 top-0 w-full -z-10'>&nbsp;</div>
      <div className='grid grid-flow-row grid-cols-1 gap-4'>
        <div className='text-gray-400 px-4'>
          <h2>Net Worth</h2>
          <p>0.00</p>
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
