import { FC } from 'react';
import Link from 'next/link';

import { Post } from '@prisma/client';

const PostCard: FC<Post> = ({ id, title, text }) => {
  return (
    <Link href={`/post/${id}`}>
      <a className='dark-body w-frac border-body cursor-pointer rounded p-2'>
        <p className='w-fit text-lg font-bold line-clamp-1'>{title}</p>
        <p className='text-justify line-clamp-6'>{text}</p>
      </a>
    </Link>
  );
};

export default PostCard;
