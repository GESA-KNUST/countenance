'use client';
import { Suspense } from 'react';
import BlogContent from './BlogContent';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BlogContent />
    </Suspense>
  );
}
