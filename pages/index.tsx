import type { NextPage } from 'next';
import { inter, maven } from '@/fonts'
import dynamic from 'next/dynamic';

const ReplicateFrontEnd = dynamic(() => import('./../components/ReplicateFrontEnd'), {
  ssr: false, // Disable server-side rendering for this component
});

const Home: NextPage = () => {
  return (
    <div className='z-10 h-full w-full flex justify-center items-center p-10'>
      <ReplicateFrontEnd />
    </div>
  );
};

export default Home;