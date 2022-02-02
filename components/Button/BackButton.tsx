import Link from 'next/link';
import { FC } from 'react';

const BackButton: FC = () => {
	return (
		<Link href='/'>
			<a
				className='invisible absolute max-w-min rounded
				bg-red-500 p-2 font-medium hover:scale-105 sm:visible'
			>
				Back
			</a>
		</Link>
	);
};

export default BackButton;
