import NavBar from '@components/body/NavBar';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { FormEvent, useState } from 'react';

const SignUp: NextPage = () => {
	const router = useRouter();

	const [password, setPassword] = useState<string>('');
	const [username, setUsername] = useState<string>('');

	const [error, setError] = useState('');

	const createUser = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const signUpUrl = window.location.origin + '/api/auth/signup';
		const body = JSON.stringify({ password, username });

		try {
			const res = await fetch(signUpUrl, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body,
			});

			if (!res.ok) {
				setError('Name already in use');
			} else {
				setError('');
				router.push(res.url);
			}
		} catch (error) {
			setError('error');
		}
	};

	return (
		<div className='flex flex-col items-center gap-4'>
			<NavBar />
			<form
				className='dark-body border-body flex max-w-fit flex-col gap-4 rounded bg-white p-4'
				onSubmit={createUser}
			>
				{/* Verifies if no error is present */}
				{error === '' ? (
					''
				) : (
					<p className='rounded bg-reddit-orange p-2 text-black'>{error}</p>
				)}
				<input
					className='border-body dark-body rounded px-2 py-1 focus:outline-none'
					type='text'
					placeholder='username'
					value={username}
					onChange={(e) => setUsername(e.target.value)}
				/>
				<input
					className='border-body dark-body rounded px-2 py-1 focus:outline-none'
					type='password'
					placeholder='password'
					value={password}
					onChange={(e) => setPassword(e.target.value)}
				/>
				<input
					className='transition-ease rounded-full bg-reddit-blue p-2 font-bold
				text-reddit-text-light hover:scale-[1.025] dark:bg-reddit-body-light
				dark:text-reddit-text-dark'
					type='submit'
					value='Sign Up'
				/>
			</form>
		</div>
	);
};

export default SignUp;
