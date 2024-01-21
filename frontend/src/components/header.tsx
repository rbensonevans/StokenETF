import Link from 'next/link';
import { WalletPopover } from './wallet-popover';

export function Header() {
  return (
    <div className='flex items-center justify-between px-4 py-2 bg-white dark:bg-gray-900'>
      <Link className='flex items-center' href='/'>
        <MountainIcon className='h-6 w-6' />
        <span className='ml-2 text-lg font-semibold text-gray-700 dark:text-gray-200'>
          Stoken ETF
        </span>
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
      xmlns='http://www.w3.org/2000/svg'
      fill='none'
      viewBox='0 0 24 24'
      strokeWidth={1.5}
      stroke='currentColor'
      className='w-8 h-8'
    >
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        d='M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941'
      />
    </svg>
  );
}
