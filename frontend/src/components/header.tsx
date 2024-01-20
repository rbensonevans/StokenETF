import Link from 'next/link';
import { WalletPopover } from './wallet-popover';

export function Header() {
  return (
    <div className='flex items-center justify-between px-4 py-2 bg-white dark:bg-gray-900'>
      <Link className='flex items-center' href='#'>
        <MountainIcon className='h-6 w-6' />
        <span className='ml-2 text-lg font-semibold text-gray-700 dark:text-gray-200'>Logo</span>
      </Link>
      <nav className='hidden md:flex space-x-10 text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-gray-100'>
        <Link href='/'>Home</Link>
        <Link href='#'>About</Link>
        <Link href='/portfolio'>Portfolio</Link>
        <Link href='#'>Contact</Link>
      </nav>
      <WalletPopover />
    </div>
  );
}

function MountainIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <path d='m8 3 4 8 5-5 5 15H2L8 3z' />
    </svg>
  );
}
