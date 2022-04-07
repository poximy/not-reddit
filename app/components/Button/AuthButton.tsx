import { FC } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';

const AuthButtons: FC = () => {
  const { data: session } = useSession();
  if (session) {
    return (
      <>
        <button
          className='transition-ease shadow-box w-24 rounded-full bg-reddit-blue
					hover:scale-105 dark:bg-reddit-text-light'
          onClick={() => signOut()}
        >
          <p
            className='p-1 text-center font-bold text-reddit-text-light
						dark:text-reddit-body-dark'
          >
            Log Out
          </p>
        </button>
      </>
    );
  }
  return (
    <button
      className='shadow-box transition-ease shadow-box w-24 rounded-full border-2
      border-reddit-blue hover:scale-105 dark:border-reddit-text-light'
      onClick={() => signIn()}
    >
      <p className='p-1 text-center font-bold text-reddit-blue dark:text-reddit-text-light'>
        Log In
      </p>
    </button>
  );
};

export default AuthButtons;
