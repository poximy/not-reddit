import { FC } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

import AuthButtons from '@components/Button/AuthButton';
import SignUpButton from '@components/Button/SignUpButton';
import CreatePostButton from '@components/Button/CreatePostButton';

const NavBar: FC = () => {
	const { data: session } = useSession();
	return (
		<div
			className='border-body dark-body flex w-full flex-wrap items-center
			justify-around gap-2 rounded p-2 sm:justify-between'
		>
			<Link href='/'>
				<a className='min-w-fit cursor-pointer'>
					<p className='text-center text-2xl font-bold'>Not-Reddit</p>
				</a>
			</Link>
			<div className='flex flex-nowrap justify-around gap-4'>
				{session ? (
					<>
						<CreatePostButton />
						<AuthButtons />
					</>
				) : (
					<>
						<AuthButtons />
						<SignUpButton />
					</>
				)}
			</div>
		</div>
	);
};

export default NavBar;
