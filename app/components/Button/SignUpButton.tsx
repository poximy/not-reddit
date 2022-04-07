import { FC } from 'react';
import { useRouter } from 'next/router';

const SignUpButton: FC = () => {
  const router = useRouter();

  return (
    <button
      className='transition-ease shadow-box w-24 rounded-full bg-reddit-blue
      hover:scale-105 dark:bg-reddit-text-light'
      onClick={() => router.push('/auth/signup')}
    >
      <p className='p-1 text-center font-bold text-reddit-text-light dark:text-reddit-body-dark'>
        Sign Up
      </p>
    </button>
  );
};

export default SignUpButton;
