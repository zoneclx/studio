'use client';

import { Suspense } from 'react';
import WebBuilder from '@/components/web-builder';
import CreatePageContent from '@/components/create-page-content';

function CreatePageWithSuspense() {
  return (
    <Suspense fallback={<WebBuilder />}>
      <CreatePageContent />
    </Suspense>
  );
}

export default CreatePageWithSuspense;
