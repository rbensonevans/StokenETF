'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useAccount } from 'wagmi';
import { SwapDialog } from './swap-dialog';
import { Button } from './ui/button';

const ButtonGroup = () => {
  const { isConnected } = useAccount();
  if (!isConnected) {
    return (
      <TableCell className='flex flex-row gap-2 items-center justify-center'>
        <Button disabled>Connect Wallet First</Button>
      </TableCell>
    );
  }
  return (
    <TableCell className='flex flex-row gap-2 items-center justify-center'>
      <SwapDialog position='Buy' token='DeFi ETF' />
      <Button>Sell</Button>
      <Button>More Info</Button>
    </TableCell>
  );
};

export function EtfTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Fund</TableHead>
          <TableHead>NAV</TableHead>
          <TableHead>YTD return</TableHead>
          <TableHead>1Y return</TableHead>
          <TableHead>Fund class currency</TableHead>
          <TableHead>1 year sharpe ratio</TableHead>
          <TableHead>Fund size (USD/Million)</TableHead>
          <TableHead>risk level</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>
            Fidelity Funds - China Consumer Fund (Class A-HKD-Accumulation) U62456
          </TableCell>
          <TableCell>11.76</TableCell>
          <TableCell className='text-red-600'>-6.15%</TableCell>
          <TableCell className='text-red-600'>-29.54%</TableCell>
          <TableCell>HKD</TableCell>
          <TableCell>-0.787</TableCell>
          <TableCell>3,441.50</TableCell>
          <TableCell>5</TableCell>
          <ButtonGroup />
        </TableRow>

        <TableRow>
          <TableCell>
            Fidelity Funds - China Consumer Fund (Class A-USD-Accumulation) U62455
          </TableCell>
          <TableCell>12.74</TableCell>
          <TableCell className='text-red-600'>-6.25%</TableCell>
          <TableCell className='text-red-600'>-29.61%</TableCell>
          <TableCell>USD</TableCell>
          <TableCell>-0.784</TableCell>
          <TableCell>3,441.50</TableCell>
          <TableCell>5</TableCell>
          <ButtonGroup />
        </TableRow>
        <TableRow>
          <TableCell>BlackRock Asian Tiger Bond Fund (Class A2) U61122</TableCell>
          <TableCell>38.51</TableCell>
          <TableCell className='text-green-600'>+0.34%</TableCell>
          <TableCell className='text-green-600'>+3.52%</TableCell>
          <TableCell>USD</TableCell>
          <TableCell>0.085</TableCell>
          <TableCell>2,389.42</TableCell>
          <TableCell>2</TableCell>
          <ButtonGroup />
        </TableRow>
        <TableRow>
          <TableCell>JPM JAPAN EQUITY (A-USDH-ACC) U63335</TableCell>
          <TableCell>274.38</TableCell>
          <TableCell className='text-green-600'>+6.39%</TableCell>
          <TableCell className='text-green-600'>+36.66%</TableCell>
          <TableCell>USD</TableCell>
          <TableCell>1.863</TableCell>
          <TableCell>2,136.33</TableCell>
          <TableCell>3</TableCell>
          <ButtonGroup />
        </TableRow>
        <TableRow>
          <TableCell>HSBC GIF - Indian Equity (CLASS AD -HKD) U62464</TableCell>
          <TableCell>16.09</TableCell>
          <TableCell className='text-green-600'>+3.18%</TableCell>
          <TableCell className='text-green-600'>+22.67%</TableCell>
          <TableCell>HKD</TableCell>
          <TableCell>1.267</TableCell>
          <TableCell>1,333.77</TableCell>
          <TableCell>5</TableCell>
          <ButtonGroup />
        </TableRow>
        <TableRow>
          <TableCell>HSBC Indian Equity Fund (Class AD) U40088</TableCell>
          <TableCell>284.356</TableCell>
          <TableCell className='text-green-600'>+3.00%</TableCell>
          <TableCell className='text-green-600'>+22.45%</TableCell>
          <TableCell>USD</TableCell>
          <TableCell>1.268</TableCell>
          <TableCell>1,333.77</TableCell>
          <TableCell>5</TableCell>
          <ButtonGroup />
        </TableRow>
      </TableBody>
    </Table>
  );
}
