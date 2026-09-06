import React from 'react';
import { cn } from '@/lib/utils';
import { Status } from './status';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  status?: 'neutral' | 'success' | 'warning' | 'error' | 'loading' | 'primary' | 'secondary' | 'accent' | 'info';
  statusPosition?: 'top-right' | 'bottom-right';
}

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function Card({ className, children, status, statusPosition = 'bottom-right', ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-lg border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900 relative',
        className
      )}
      {...props}
    >
      {children}
      {status && (
        <Status
          variant={status}
          size="lg"
          opacity={25}
          className={cn(
            'absolute bg-gray-400 dark:bg-gray-200',
            statusPosition === 'bottom-right' ? 'right-0 -bottom-2' : 'right-0 -top-2'
          )}
        />
      )}
    </div>
  );
}

export function CardHeader({ className, children, ...props }: CardHeaderProps) {
  return (
    <div
      className={cn('flex flex-col space-y-1.5 p-6', className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardContent({ className, children, ...props }: CardContentProps) {
  return (
    <div className={cn('p-6 pt-0', className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ className, children, ...props }: CardFooterProps) {
  return (
    <div
      className={cn('flex items-center p-6 pt-0', className)}
      {...props}
    >
      {children}
    </div>
  );
}
