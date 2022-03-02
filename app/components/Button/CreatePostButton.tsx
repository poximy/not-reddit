import { FC } from 'react';
import Link from 'next/link';

const CreatePostButton: FC = () => {
	return (
		<Link href='/post'>
			<a
				className='shadow-box transition-ease shadow-box w-24 rounded-full border-2
				border-reddit-blue hover:scale-105 dark:border-reddit-text-light'
			>
				<p
					className='p-1 text-center font-bold text-reddit-blue
					dark:text-reddit-text-light'
				>
					Post
				</p>
			</a>
		</Link>
	);
};

export default CreatePostButton;
