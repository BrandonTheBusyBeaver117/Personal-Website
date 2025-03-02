'use client';

import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import AuthForm from '../components/authform';
import Error from '../components/error';

const Signup: React.FC = () => {
  // Initializing router
  const router = useRouter();

  // If not resolved, show the loading page, otherwise show the page
  return (
    <>
      <div className="w-full max-w-md rounded-lg bg-white p-8">
        <h2 className="mb-6 text-2xl font-bold text-gray-900">Sign Up</h2>
      </div>
    </>
  );
};

export default Signup;
