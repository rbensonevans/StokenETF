import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import abi from '../abi/abi.json';
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const CONTRACT = { abi, address: '0x9541C99A261c34887768a5bAcd5b9Bd744671eE6' } as const;
