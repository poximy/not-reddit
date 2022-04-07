import Link from 'next/link';
import { GetServerSideProps, NextPage } from 'next';

import { getCsrfToken } from 'next-auth/react';

import NavBar from '@components/body/NavBar';

interface Props {
	csrfToken: string;
}

const LogIn: NextPage<Props> = ({ csrfToken }) => {
	// Render a form that allows a user to authenticate
	return (
		<>
			<div className='flex flex-col items-center justify-center gap-4'>
				<NavBar />
				<form
					className='dark-body border-body flex max-w-min flex-col
					items-center gap-4 rounded p-4 text-reddit-text-dark
					dark:text-reddit-text-light '
					method='post'
					action='/api/auth/callback/credentials'
				>
					<input name='csrfToken' type='hidden' defaultValue={csrfToken} />

					<label className='flex max-w-min flex-col gap-2 font-medium'>
						Username
						<input
							className='border-body dark-body rounded px-2 py-1 focus:outline-none'
							name='username'
							type='text'
						/>
					</label>

					<label className='flex max-w-min flex-col gap-2 font-medium'>
						Password
						<input
							className='border-body dark-body rounded px-2 py-1 focus:outline-none'
							name='password'
							type='password'
						/>
					</label>

					<button
						className='transition-ease w-24 rounded-full border-2 border-reddit-blue
					p-2 hover:scale-105 dark:border-reddit-text-light'
						type='submit'
					>
						<p className='text-center font-bold text-reddit-blue dark:text-reddit-text-light'>
							Log In
						</p>
					</button>
					<Link href='/auth/signup'>
						<a>
							<p className='text-sm text-reddit-text-dark dark:text-reddit-text-light'>
								Create an account
							</p>
						</a>
					</Link>
				</form>
			</div>
		</>
	);
};

export const getServerSideProps: GetServerSideProps = async (context) => {
	return {
		props: {
			csrfToken: await getCsrfToken(context),
		},
	};
};

export default LogIn;
