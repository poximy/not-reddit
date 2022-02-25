import Image from 'next/image';
import Link from 'next/link';
import { FC } from 'react';

const CreatePostButton: FC = () => {
	return (
		<Link href='/post'>
			<a className='transition-ease group flex items-center gap-2 rounded bg-sky-400 p-2 font-medium hover:scale-105'>
				Create Post
				<span>
					<Image src='/pencil.svg' alt='pencil icon' width={24} height={24} />
				</span>
			</a>
		</Link>
	);
};

export default CreatePostButton;
