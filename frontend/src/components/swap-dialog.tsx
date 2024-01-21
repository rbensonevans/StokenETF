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
import { Label } from './ui/label';

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
  const [open, setOpen] = useState(false);

  const handleClose = useCallback(() => {
    setValue(0);
    setOpen(!open);
  }, [open]);

  const buy = useCallback(() => {
    writeContract(
      {
        ...CONTRACT,
        functionName: 'buyETFToken',
        args: [token, BigInt(value ** 18), address],
      },
      {
        onSettled: () => {
          setIsWaiting(false);
          handleClose();
        },
      }
    );
  }, [address, handleClose, token, value, writeContract]);

  const sell = useCallback(() => {
    writeContract(
      {
        ...CONTRACT,
        functionName: 'sellETFToken',
        args: [token, BigInt(value ** 18), address],
      },
      {
        onSettled: () => {
          setIsWaiting(false);
          handleClose();
        },
      }
    );
  }, [address, handleClose, token, value, writeContract]);

  const commit = useCallback(() => {
    setIsWaiting(true);
    if (position === 'Buy') {
      buy();
    }
    if (position === 'Sell') {
      sell();
    }
  }, [buy, position, sell]);

  const label1 = position === 'Buy' ? 'You Receive' : 'You Pay';
  const label2 = position === 'Buy' ? 'You Pay' : 'You Receive';

  const description =
    position === 'Buy'
      ? 'Buy ETF tokens with GHO to buy into the fund'
      : 'Sell ETF tokens for GHO to exit the fund';
  return (
    <Dialog onOpenChange={handleClose} open={open}>
      <DialogTrigger>
        <Button disabled={isWaiting}>{!isWaiting ? position : 'Please Wait...'}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{`${position} ${token}`}</DialogTitle>
          <DialogDescription>{description} </DialogDescription>
        </DialogHeader>
        <div className='mt-4 grid grid-flow-row gap-3'>
          <Label>{label1}</Label>
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
          <Label>{label2}</Label>
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
      </DialogContent>
    </Dialog>
  );
};
