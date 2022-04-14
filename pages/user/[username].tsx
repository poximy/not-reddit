import prisma from '@lib/prisma';
import NavBar from '@components/body/NavBar';

import Link from 'next/link';
import Head from 'next/head';

import { memo, useState } from 'react';
import { GetServerSideProps, NextPage } from 'next';

import { ParsedUrlQuery } from 'node:querystring';

const validateUrlParams = function (params: ParsedUrlQuery | undefined) {
  if (params !== undefined) {
    if ('username' in params) {
      return params.username as string;
    }
  }
  return null;
};

const findUser = async function (username: string) {
  try {
    return await prisma.user.findUnique({
      where: {
        username,
      },
      select: {
        id: true,
        username: true,
        posts: {
          select: {
            id: true,
            title: true,
            text: true,
          },
          take: -16,
        },
        comments: {
          select: {
            postId: true,
            text: true,
          },
          take: -16,
        },
      },
    });
  } catch (error) {
    return null;
  }
};

const Posts = memo<{ posts: posts }>(function Posts({ posts }) {
  console.log('posts');
  return (
    <>
      {posts.map(({ id, title, text }) => (
        <Link href={`/post/${id}`} key={id}>
          <a className='w-frac border-body bg-reddit-body-light p-2 dark:bg-reddit-body-dark'>
            <p className='w-fit text-lg font-bold line-clamp-1'>{title}</p>
            <p className='text-justify line-clamp-6'>{text}</p>
          </a>
        </Link>
      ))}
    </>
  );
});

const Comments = memo<{ comments: comments }>(function Comments({ comments }) {
  console.log('comments');
  return (
    <>
      {comments.map(({ text, postId }) => (
        <Link href={`/post/${postId}`} key={postId}>
          <a className='w-frac border-body bg-reddit-body-light dark:bg-reddit-body-dark'>
            <p className='p-2 line-clamp-3'>{text}</p>
          </a>
        </Link>
      ))}
    </>
  );
});

interface User {
  user: {
    id: string;
    username: string;
    posts: posts;
    comments: comments;
  } | null;
}

type posts = { id: string; title: string; text: string }[];
type comments = { text: string; postId: string }[];

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const username = validateUrlParams(params);
  if (username == null) {
    return {
      props: {
        username,
      },
    };
  }
  const user = await findUser(username);
  return {
    props: {
      user,
    },
  };
};

const Username: NextPage<User> = ({ user }) => {
  // TODO Make comments and post deletable if user account is theirs
  const [choice, setChoice] = useState<'posts' | 'comments'>('posts');

  if (user === null) {
    return (
      <>
        <Head>
          <title>User Not Found - Not Reddit</title>
        </Head>
        <NavBar />
        <p>Error user not found</p>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>username u/{user.username} - Not Reddit</title>
      </Head>
      <NavBar />
      <div
        className='mt-4 flex w-full flex-col items-center gap-4 text-reddit-text-dark
        dark:text-reddit-text-light'
      >
        <p className='m-2 text-2xl font-bold'>u/{user.username}</p>
        <div
          className='flex flex-row justify-center gap-4 text-lg
          text-reddit-blue dark:text-reddit-text-light'
        >
          <button
            className={`border-b-2 border-reddit-blue p-2 dark:border-reddit-text-light ${
              choice === 'posts' ? '' : 'border-none'
            }`}
            onClick={() => setChoice('posts')}
          >
            POSTS
          </button>
          <button
            className={`border-b-2 border-reddit-blue p-2 dark:border-reddit-text-light ${
              choice === 'comments' ? '' : 'border-none'
            }`}
            onClick={() => setChoice('comments')}
          >
            COMMENTS
          </button>
        </div>
        {choice === 'posts' ? (
          <Posts posts={user.posts} />
        ) : (
          <Comments comments={user.comments} />
        )}
      </div>
    </>
  );
};

export default Username;
