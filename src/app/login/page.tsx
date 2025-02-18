'use client';

import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { auth } from '@/app/firebase/config';

import { useAuthState, useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import AuthForm from '../components/authform';
import Error from '../components/error';
import Link from 'next/link';
import Loading from '../components/loading';

const Login: React.FC = () => {
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
    // Otherwise, the authentication has been resolved, and we should show the user the login page
    if (userAuth) {
      return router.push('/dashboard');
    } else {
      setResolved(true);
    }
  }, [userAuth, authLoading, router]);

  // Using the firebase hook to get a sign in user function with email and pw
  const [signInWithEmailAndPassword, user, loading, error] = useSignInWithEmailAndPassword(auth);

  // Getting email and password state to pass into the form
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Logging in when there's no errors and a user exists
  useEffect(() => {
    if (!error && user) {
      router.push('/dashboard');
      return;
    }
  }, [error, user, router]);

  // Handling form submit
  const handleSubmit = async (e: React.FormEvent, email: string, password: string) => {
    // Prevents clearing of form data on submit
    e.preventDefault();

    // Signing in user
    try {
      await signInWithEmailAndPassword(email, password);
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
          disabledSupplier={() => checkErrorDisabled('Firebase: Error (auth/invalid-credential).')}
          message="Either your email or password is incorrect. Need to make an account? Go to the "
        >
          <Link href="/signup" className="text-blue-400 underline">
            Sign Up page
          </Link>
        </Error>

        <h2 className="mb-6 text-2xl font-bold text-gray-900">Log In</h2>

        <AuthForm
          label="Log In"
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

export default Login;
