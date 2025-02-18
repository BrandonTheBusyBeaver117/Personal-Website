'use client';

import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { auth } from '@/app/firebase/config';

import { useAuthState, useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { setPersistence, browserLocalPersistence } from 'firebase/auth';
import AuthForm from '../components/authform';
import Error from '../components/error';
import Link from 'next/link';
import Loading from '../components/loading';

const Signup: React.FC = () => {
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

  // Using the firebase hook to get a create user function with email and pw
  const [createUserWithEmailAndPassword, user, loading, error] =
    useCreateUserWithEmailAndPassword(auth);

  // Getting email and password state to pass into the form
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const login = async () => {
      try {
        // When logging in, make sure they're remembered
        await setPersistence(auth, browserLocalPersistence);

        // Redirect them to dashboard
        router.push('/dashboard');
      } catch {
        console.log('something went really wrong');
      }
    };

    // If there's a user and nothing has gone wrong, log in
    if (!error && user) {
      login();

      return;
    }
  }, [error, user, router]);

  // Handles submits
  const handleSubmit = async (e: React.FormEvent, email: string, password: string) => {
    // Prevents clearing of form data on submit
    e.preventDefault();

    // Trying to create user
    try {
      await createUserWithEmailAndPassword(email, password);
    } catch (error) {
      console.log(error);
      return;
    }
  };

  // The error popup should be disabled if the message doesn't match
  const checkErrorDisabled = (errorValue: string) => {
    return error?.message !== errorValue;
  };

  // If not resolved, show the loading page, otherwise show the page
  return !resolved ? (
    <Loading />
  ) : (
    <>
      <div className="w-full max-w-md rounded-lg bg-white p-8">
        <Error
          disabledSupplier={() => checkErrorDisabled('Firebase: Error (auth/invalid-email).')}
          message="Please enter a valid email"
        />
        <Error
          disabledSupplier={() =>
            checkErrorDisabled('Firebase: Error (auth/email-already-in-use).')
          }
          message="Email is already in use, please navigate to the"
        >
          <Link href="/Login" className="text-blue-400 underline">
            {' '}
            Login page
          </Link>
        </Error>
        <Error
          disabledSupplier={() =>
            checkErrorDisabled(
              'Firebase: Password should be at least 6 characters (auth/weak-password).',
            )
          }
          message="Choose a stronger password, with more than 6 characters"
        />

        <h2 className="mb-6 text-2xl font-bold text-gray-900">Sign Up</h2>

        <AuthForm
          label="Sign Up"
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          handleSubmit={handleSubmit}
        />
      </div>
    </>
  );
};

export default Signup;
