'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useAccount, useConnect, useDisconnect } from 'wagmi';

export function WalletPopover() {
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { address, isConnected } = useAccount();

  const buttonText = address ? address.slice(0, 6) + '...' + address.slice(-4) : 'Connect Wallet';

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          onClick={() => connect({ connector: connectors[0] })}
          className='flex flex-row md:inline-flex items-center justify-center px-4 py-2 border border-gray-200 border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 dark:border-gray-800 gap-3'
        >
          <p>{buttonText}</p>
          {isConnected ? <ChevronDownIcon className='ml-2 h-4 w-4' /> : null}
        </Button>
      </PopoverTrigger>
      {isConnected ? (
        <PopoverContent className='w-80'>
          <div className='grid gap-2'>
            <Label>Address</Label>
            <Input value={address} disabled />
            <Button onClick={() => disconnect()}>Disconnect</Button>
          </div>
        </PopoverContent>
      ) : null}
    </Popover>
  );
}

function ChevronDownIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      fill='none'
      viewBox='0 0 24 24'
      strokeWidth={1.5}
      stroke='currentColor'
      className='w-4 h-4'
    >
      <path strokeLinecap='round' strokeLinejoin='round' d='m19.5 8.25-7.5 7.5-7.5-7.5' />
    </svg>
  );
}
