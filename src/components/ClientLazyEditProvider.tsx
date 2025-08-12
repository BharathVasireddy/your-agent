"use client";

import dynamic from 'next/dynamic';

// Client-only dynamic import to avoid SSR instantiation
const ClientLazyEditProvider = dynamic(() => import('./LazyEditProvider'), { ssr: false });

export default ClientLazyEditProvider;


