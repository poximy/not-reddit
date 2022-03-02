import { getCsrfToken } from 'next-auth/react';
import { GetServerSideProps, NextPage } from 'next';
import SignUpButton from '@components/Button/SignUpButton';

interface Props {
	csrfToken: string;
}

const LogIn: NextPage<Props> = ({ csrfToken }) => {
	return (
		<div className='flex flex-col items-center gap-2'>
			<SignUpButton />
			<form
				className='dark-theme shadow-box flex max-h-48 max-w-min flex-col items-center
				gap-2 rounded bg-zinc-800 p-2'
				method='post'
				action='/api/auth/callback/credentials'
			>
				<input name='csrfToken' type='hidden' defaultValue={csrfToken} />

				<label className='flex max-w-min flex-col'>
					Username
					<input
						className='shadow-box rounded px-2 py-1 text-black focus:outline-none'
						name='username'
						type='text'
					/>
				</label>

				<label className='flex max-w-min flex-col'>
					Password
					<input
						className='shadow-box rounded px-2 py-1 text-black focus:outline-none'
						name='password'
						type='password'
					/>
				</label>

				<button
					className='transition-ease shadow-box w-20 rounded bg-green-300 p-2 text-black hover:scale-105'
					type='submit'
				>
					<p className='text-center'>Log In</p>
				</button>
			</form>
		</div>
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
