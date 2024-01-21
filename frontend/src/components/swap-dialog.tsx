import { CONTRACT } from '@/lib/utils';
import { useCallback, useState } from 'react';
import { useAccount, useReadContract, useWriteContract } from 'wagmi';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Input } from './ui/input';

export const SwapDialog = ({ position, token }: { position: 'Buy' | 'Sell'; token: string }) => {
  const { writeContract } = useWriteContract();
  const { address } = useAccount();
  const { data = BigInt(0), error } = useReadContract({
    ...CONTRACT,
    functionName: 'oracleGetETFPrice',
    args: [token],
  }) as { data: bigint; error: Error };

  console.log(data, error?.message);

  const [value, setValue] = useState(0);
  const [isWaiting, setIsWaiting] = useState(false);

  const buy = useCallback(() => {
    writeContract(
      {
        ...CONTRACT,
        functionName: 'buyETFToken',
        args: [token, BigInt(value), address],
      },
      {
        onSettled: () => {
          setIsWaiting(false);
        },
      }
    );
  }, [address, token, value, writeContract]);

  const sell = useCallback(() => {
    writeContract(
      {
        ...CONTRACT,
        functionName: 'sellETFToken',
        args: [token, BigInt(value), address],
      },
      {
        onSettled: () => {
          setIsWaiting(false);
        },
      }
    );
  }, [address, token, value, writeContract]);

  const commit = useCallback(() => {
    setIsWaiting(true);
    if (position === 'Buy') {
      buy();
    }
    if (position === 'Sell') {
      sell();
    }
  }, [buy, position, sell]);

  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setValue(0);
    setOpen(!open);
  };
  return (
    <Dialog onOpenChange={handleClose} open={open}>
      <DialogTrigger>
        <Button disabled={isWaiting}>{!isWaiting ? position : 'Please Wait...'}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{`${position} ${token}`}</DialogTitle>
          <DialogDescription>
            <div className='mt-4 grid grid-flow-row gap-4'>
              <div className='grid grid-cols-3 justify-items-end items-center mr-4'>
                <Input
                  className='w-full col-span-2'
                  placeholder='0.00'
                  type='number'
                  value={value}
                  onChange={(e) => setValue(Number(e.target.value))}
                />
                <span>DFGF</span>
              </div>

              <div className='grid grid-cols-3 justify-items-end items-center mr-4'>
                <Input
                  className='w-full col-span-2'
                  placeholder='0'
                  type='number'
                  value={Number((BigInt(2 * value) * data) / BigInt(10 ** 15))}
                />
                <span>GHO</span>
              </div>

              <div className='mt-6'>
                <Button className='w-full' onClick={() => commit()} disabled={isWaiting}>
                  {!isWaiting ? position : 'Please Wait...'}
                </Button>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
