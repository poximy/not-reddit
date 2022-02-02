import { Post } from '@prisma/client';
import Image from 'next/image';
import Link from 'next/link';
import { FC } from 'react';

const PostCard: FC<Post> = ({ id, title, text }) => {
	return (
		// TODO Add icon for comments and comment count
		<Link href={`/post/${id}`}>
			<a className='transition-ease group dark-theme shadow-box round-2 w-frac'>
				<div className='relative flex items-center justify-between'>
					<p className='w-fit text-lg line-clamp-1'>{title}</p>
					<Image
						src={'/external-link.svg'}
						alt='external link icon'
						width={24}
						height={24}
						className='transition-ease scale-0 group-hover:scale-100'
					/>
				</div>
				<p className='text-justify text-base line-clamp-6'>{text}</p>
			</a>
		</Link>
	);
};

export default PostCard;
