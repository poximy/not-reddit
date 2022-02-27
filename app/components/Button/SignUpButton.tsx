import Link from 'next/link';
import { FC } from 'react';

const SignUpButton: FC = () => {
	return (
		<Link href='/auth/signup'>
			<a className='transition-ease shadow-box w-20 rounded bg-blue-400 p-2 hover:scale-105'>
				<p className='text-center'>Sign Up</p>
			</a>
		</Link>
	);
};

export default SignUpButton;
