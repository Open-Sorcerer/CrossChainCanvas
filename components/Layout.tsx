import { inter, maven } from '@/fonts';
import { ConnectKitButton } from 'connectkit';
import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { ReactNode, Suspense } from 'react';
import { useAccount } from 'wagmi';

const Spline = dynamic(() => import("@splinetool/react-spline"), {
  ssr: false,
});

interface LayoutProps {
  children: ReactNode;
}

const Layout: NextPage<LayoutProps> = ({ children }) => {
  const { address } = useAccount();
  return (
    <div className='h-screen w-screen flex flex-col bg-glass-lite/30 relative'>
      <Head>
        <title>CrossChain Canvas</title>
      </Head>
      <div className='w-full flex flex-row justify-end items-center bg-gradient-to-b from-glass-lite to-glass-lite/50 shadow-lg shadow-blue-900 p-3'>
        <ConnectKitButton />
      </div>
      <div className='relative h-full w-full flex justify-center items-center'>
        <div className='absolute z-0 w-full h-full'>
          <Suspense fallback={<div className='flex justify-center items-center text-lg text-black'>3D Scene Loading...</div>}>
            <Spline scene="https://prod.spline.design/mb4C3Ms7Ph9dxtgP/scene.splinecode" />
          </Suspense>
        </div>
        {address && children}
      </div>
    </div>
  );
};

export default Layout;