// Temporary type declaration until @types/react-dom is installed
declare module 'react-dom' {
  import type { ReactNode } from 'react';

  export function createPortal(
    children: ReactNode,
    container: Element | DocumentFragment,
    key?: string | null,
  ): ReactNode;
}
