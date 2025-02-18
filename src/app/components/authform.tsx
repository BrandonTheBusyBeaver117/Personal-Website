'use client';

import React from 'react';

type AuthFormProps = {
  label: string;
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  handleSubmit: (event: React.FormEvent, email: string, password: string) => void;
};

// A form that just handles email and password input
const AuthForm: React.FC<AuthFormProps> = ({
  label,
  email,
  setEmail,
  password,
  setPassword,
  handleSubmit,
}) => {
  return (
    <form onSubmit={(event) => handleSubmit(event, email, password)}>
      <div className="mb-4">
        <label className="mb-2 block text-sm font-bold text-gray-700" htmlFor="email">
          Email
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none"
        />
      </div>
      <div className="mb-6">
        <label className="mb-2 block text-sm font-bold text-gray-700" htmlFor="password">
          Password
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none"
        />
      </div>
      <button
        type="submit"
        className="w-full rounded-lg bg-indigo-500 px-4 py-2 text-white hover:bg-indigo-600 focus:bg-indigo-700 focus:outline-none"
      >
        {label}
      </button>
    </form>
  );
};

export default AuthForm;
