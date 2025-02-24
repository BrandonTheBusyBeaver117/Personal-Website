'use client';

import Image from 'next/image';
import Link from 'next/link';

import { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';
import Loading from './components/loading';

const Home: React.FC = () => {
  // Initializing router
  const router = useRouter();

  return (
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
