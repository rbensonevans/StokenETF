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

const ButtonGroup = ({ token }: { token: string }) => {
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
      <SwapDialog position='Buy' token={token} />
      <SwapDialog position='Sell' token={token} />
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
          <TableHead>Fund currency</TableHead>
          <TableHead>1 year sharpe ratio</TableHead>
          <TableHead>Fund size (GHO/Million)</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>
            Decentralized Finance Growth Fund (DFGF) - Targeting high-potential DeFi platforms and
            protocols revolutionizing financial services.
          </TableCell>
          <TableCell>11.76</TableCell>
          <TableCell className='text-red-600'>-6.15%</TableCell>
          <TableCell className='text-red-600'>-29.54%</TableCell>
          <TableCell>GHO</TableCell>
          <TableCell>-0.787</TableCell>
          <TableCell>3,441.50</TableCell>
          <ButtonGroup token={'DFGF'} />
        </TableRow>

        <TableRow>
          <TableCell>
            Private Transaction Innovators ETF (PTIE) - Specializing in privacy-centric
            cryptocurrencies and technologies enhancing transaction anonymity.
          </TableCell>
          <TableCell>12.74</TableCell>
          <TableCell className='text-red-600'>-6.25%</TableCell>
          <TableCell className='text-red-600'>-29.61%</TableCell>
          <TableCell>GHO</TableCell>
          <TableCell>-0.784</TableCell>
          <TableCell>3,441.50</TableCell>
          <ButtonGroup token='PTIE' />
        </TableRow>
        <TableRow>
          <TableCell>
            Crypto Gaming and Entertainment ETF (CGEE) - Focusing on blockchain-based gaming
            platforms and entertainment tokens.
          </TableCell>
          <TableCell>38.51</TableCell>
          <TableCell className='text-green-600'>+0.34%</TableCell>
          <TableCell className='text-green-600'>+3.52%</TableCell>
          <TableCell>GHO</TableCell>
          <TableCell>0.085</TableCell>
          <TableCell>2,389.42</TableCell>
          <ButtonGroup token='CGEE' />
        </TableRow>
        <TableRow>
          <TableCell>
            Japanese Crypto Innovation Fund (JCIF) - Concentrating on leading Japanese
            cryptocurrency projects and their token assoicated with them.
          </TableCell>
          <TableCell>274.38</TableCell>
          <TableCell className='text-green-600'>+6.39%</TableCell>
          <TableCell className='text-green-600'>+36.66%</TableCell>
          <TableCell>GHO</TableCell>
          <TableCell>1.863</TableCell>
          <TableCell>2,136.33</TableCell>
          <ButtonGroup token='JCIF' />
        </TableRow>
        <TableRow>
          <TableCell>
            Digital Currency Diversification Fund (DCDF) - A diversified portfolio covering a wide
            range of digital currencies, from major players to emerging altcoins.
          </TableCell>
          <TableCell>16.09</TableCell>
          <TableCell className='text-green-600'>+3.18%</TableCell>
          <TableCell className='text-green-600'>+22.67%</TableCell>
          <TableCell>GHO</TableCell>
          <TableCell>1.267</TableCell>
          <TableCell>1,333.77</TableCell>
          <ButtonGroup token='DCDF' />
        </TableRow>
        <TableRow>
          <TableCell>
            Crypto Healthcare Revolution Fund (CHRF) - Blockchain projects that are set to transform
            the healthcare industry, from patient data management to drug traceability.
          </TableCell>
          <TableCell>284.356</TableCell>
          <TableCell className='text-green-600'>+3.00%</TableCell>
          <TableCell className='text-green-600'>+22.45%</TableCell>
          <TableCell>GHO</TableCell>
          <TableCell>1.268</TableCell>
          <TableCell>1,333.77</TableCell>
          <ButtonGroup token='CHRF' />
        </TableRow>
      </TableBody>
    </Table>
  );
}
