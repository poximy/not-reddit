import { FC } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';

const AuthButtons: FC = () => {
	const { data: session } = useSession();
	if (session) {
		return (
			<>
				<button
					className='shadow-bOx transition-ease w-20 rounded bg-red-400 p-2
					text-center hover:scale-105'
					onClick={() => signOut()}
				>
					Sign out
				</button>
			</>
		);
	}
	return (
		<button
			className='transition-ease shadow-box w-20 rounded bg-green-400 p-2
			hover:scale-105'
			onClick={() => signIn()}
		>
			<p className='text-center'>Log In</p>
		</button>
	);
};

export default AuthButtons;
