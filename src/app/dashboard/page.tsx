'use client';

import Image from 'next/image';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/app/firebase/config';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { signOut } from 'firebase/auth';
import Loading from '../components/loading';

const Dashboard: React.FC = () => {
  // Initializing router
  const router = useRouter();

  // Initializing variables to track if user is authenticated
  const [userAuth, authLoading] = useAuthState(auth);
  const [resolved, setResolved] = useState<boolean>(false);

  // Use Effect to check when authentication changes
  useEffect(() => {
    // If authentication hasn't finished, exit
    if (authLoading) return;

    // If the user is not authenticated, redirect them to home
    // Otherwise, the authentication has been resolved, and we should show the user the dashboard
    if (!userAuth) {
      return router.push('/');
    } else {
      setResolved(true);
    }
  }, [userAuth, authLoading, router]);

  // Too lazy to get the user's name or anything from the form
  // I'll just read them back their email
  const name = userAuth?.email;

  // If not resolved, show the loading page, otherwise show the dashboard
  return !resolved ? (
    <Loading />
  ) : (
    <>
      <button
        onClick={() => signOut(auth)}
        className="absolute right-4 top-4 rounded-lg border-2 border-fuchsia-700 bg-fuchsia-500 px-4 py-2 text-white transition duration-300 ease-in-out hover:bg-pink-500"
      >
        Sign Out
      </button>

      <div className="flex h-full w-1/2 flex-col items-center justify-evenly rounded-3xl border-4 border-sky-600 bg-sky-200">
        <div id="intro wrapper" className="flex grow-[3] basis-0 flex-col items-center text-2xl">
          <h1 className="m-5">Hello {name}!</h1>
          <h1>Welcome to your dashboard!</h1>
        </div>

        <h2 className="m-5">Chances of allowing Brandon to intern at LJL:</h2>
        <div className="text-1xl relative mb-6 flex w-3/4 grow-[5] basis-0 flex-col items-center">
          <Image
            className="relative"
            src="/upwardtrend.jpg"
            alt="chart"
            fill={true}
            style={{ objectFit: 'contain' }}
          />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
