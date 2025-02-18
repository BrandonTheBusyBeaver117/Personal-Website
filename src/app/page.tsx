'use client';

import Image from 'next/image';
import Link from 'next/link';

import { useEffect, useState } from 'react';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useRouter } from 'next/navigation';
import { auth } from './firebase/config';
import Loading from './components/loading';

const Home: React.FC = () => {
  // Initializing router
  const router = useRouter();

  // Initializing variables to track if user is authenticated
  const [userAuth, authLoading] = useAuthState(auth);
  const [resolved, setResolved] = useState<boolean>(false);

  // Use Effect to check when authentication changes
  useEffect(() => {
    // If authentication hasn't finished, exit
    if (authLoading) return;

    // If the user is authenticated, redirect them to the dashboard
    // Otherwise, the authentication has been resolved, and we should show the user the signup page
    if (userAuth) {
      return router.push('/dashboard');
    } else {
      setResolved(true);
    }
  }, [userAuth, authLoading, router]);

  // Getting user from authstate
  const [user] = useAuthState(auth);

  // Logging in when there's no errors and a user exists
  useEffect(() => {
    if (user) {
      return router.push('/dashboard');
    }
  }, [user, router]);

  // If not resolved, show the loading page, otherwise show the page
  return !resolved ? (
    <Loading />
  ) : (
    <>
      <div className="flex min-h-72 w-full max-w-xl flex-col items-center justify-evenly rounded-lg bg-white px-8">
        <h1 className="text-center">
          NRG is an innovative website helping you track your most important tasks
        </h1>
        <h1 className="text-center">
          Get started with the most amazing website in the world today!
        </h1>
        <h1 className="text-center">Login or sign up below</h1>
      </div>

      <div className="flex h-12 w-1/5 justify-between">
        <Link
          className="flex basis-1/3 items-center justify-center rounded-full bg-slate-100 transition duration-300 ease-in-out hover:-translate-y-1 hover:bg-sky-200"
          href="/login"
        >
          <div>Log in</div>
        </Link>

        <Link
          className="flex basis-1/3 items-center justify-center rounded-full bg-slate-100 transition duration-300 ease-in-out hover:-translate-y-1 hover:bg-sky-200"
          href="/signup"
        >
          <div>Sign up</div>
        </Link>
      </div>
    </>
  );
};

export default Home;
