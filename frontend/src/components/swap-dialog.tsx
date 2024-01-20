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
  return (
    <Dialog>
      <DialogTrigger>
        <Button>{position}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{`${position} ${token}`}</DialogTitle>
          <DialogDescription>
            <div className='mt-4'>
              <div className='mt-4'>
                <div className='flex items-center justify-between'>
                  <Input className='w-full' placeholder='0.00' type='number' />
                </div>
                <div className='flex justify-between items-center text-sm text-gray-500 mt-1'>
                  <span>$0</span>
                  <span>
                    Balance 0 <button className='text-blue-500 hover:text-blue-600'>MAX</button>
                  </span>
                </div>
              </div>
              <div>
                <div className='flex items-center justify-between'>
                  <Input className='w-full' placeholder='0' type='number' />
                  <div className='flex items-center'></div>
                </div>
                <div className='flex justify-between items-center text-sm text-gray-500 mt-1'>
                  <span>$0</span>
                </div>
              </div>
              <div className='mt-6'>
                <Button className='w-full'>{position}</Button>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
