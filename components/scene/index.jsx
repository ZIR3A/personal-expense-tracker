'use client';

import dynamic from 'next/dynamic';

export const Scene = dynamic(() => import('./Scene'), {
  ssr: false,
  loading: () => <div className="fixed inset-0 -z-10 bg-background" />
});

export default Scene;