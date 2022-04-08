import prisma from '@lib/prisma';
import { Comment, Post } from '@prisma/client';

import { FC } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { GetServerSideProps, NextPage } from 'next';

import { ParsedUrlQuery } from 'node:querystring';

import NavBar from '@components/body/NavBar';
import CommentForm from '@components/Post/CommentForm';

interface User {
  User: { username: string };
}

type PostProp = (Post & User) | null;
type CommentProp = (Comment & User)[] | null;

interface Props {
  post: PostProp;
  comments: CommentProp;
}

const validateUrlQueryParams = function (params: ParsedUrlQuery | undefined) {
  if (params !== undefined) {
    if ('id' in params) {
      return params.id as string;
    }
  }
  return null;
};

const findPost = async function (id: string) {
  try {
    return await prisma.post.findUnique({
      where: {
        id,
      },
      include: {
        User: {
          select: {
            username: true,
          },
        },
      },
    });
  } catch (error) {
    return null;
  }
};

const findComments = async function (postId: string) {
  try {
    const comments = await prisma.comment.findMany({
      where: {
        postId,
      },
      take: -16,
      include: {
        User: {
          select: {
            username: true,
          },
        },
      },
    });
    return comments.reverse();
  } catch (error) {
    return null;
  }
};

interface PostTitleProps {
  title: string;
  text: string;
  username: string;
}

const PostTitleText: FC<PostTitleProps> = ({ title, text, username }) => {
  // Renders title and text for a given post
  return (
    <>
      <div className='dark-body border-body round-2 flex w-full flex-row items-center justify-between gap-2'>
        <p className='w-fit line-clamp-1'>{title}</p>
        <p className='text-reddit-text-dark/50 dark:text-reddit-text-light/50'>
          Posted By: {username}
        </p>
      </div>
      {text !== '' ? (
        <p className='dark-body round-2 border-body w-full'>{text}</p>
      ) : (
        ''
      )}
    </>
  );
};

const deleteComment = async function (commentId: string) {
  const url = window.location.origin + '/api/comment';
  const body = JSON.stringify({ commentId });
  await fetch(url, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body,
  });
};

interface CommentsProp {
  comments: CommentProp;
  userId: string | undefined;
}

const Comments: FC<CommentsProp> = function ({ comments, userId }) {
  // Renders all comments to a given post
  const router = useRouter();

  const deleteButtonHandler = async function (commentId: string) {
    await deleteComment(commentId);
    setTimeout(router.reload, 1000);
  };

  if (comments === null || comments.length === 0) {
    return (
      <p className='dark-body round-2 border-body text-center'>No Comments</p>
    );
  }

  return (
    <>
      {comments.map(comment => (
        <div key={comment.id} className='group relative'>
          <p
            className='absolute -top-6 p-2 px-2 text-xs text-white
						text-reddit-text-dark/50 dark:text-reddit-text-light/50'
          >
            u/{comment.User.username}
          </p>
          <p className='border-body dark-body round-2 w-full'>{comment.text}</p>
          {/* Delete button only renders if the current user created the comment*/}
          {userId && userId === comment.userId ? (
            <button
              onClick={() => deleteButtonHandler(comment.id)}
              className='absolute top-0 right-0 h-8 w-8 rounded-b rounded-tr
							bg-reddit-orange p-2 font-bold leading-none opacity-0 transition-opacity
							duration-300 group-hover:opacity-100 group-hover:duration-150'
            >
              X
            </button>
          ) : (
            ''
          )}
        </div>
      ))}
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const id = validateUrlQueryParams(params);
  if (id === null) {
    return {
      props: {
        post: null,
        comments: null,
      },
    };
  }
  const [post, comments] = await Promise.all([findPost(id), findComments(id)]);
  return {
    props: {
      post,
      comments,
    },
  };
};

const PostID: NextPage<Props> = ({ post, comments }) => {
  const session = useSession();

  if (post === null) {
    return (
      <>
        <Head>
          <title>Post not Found - Not Reddit</title>
        </Head>
        <div className='flex w-full flex-col items-center gap-4'>
          <NavBar />
          <p
            className='round-2 w-frac bg-reddit-orange text-center text-2xl
            font-bold text-white'
          >
            Error post was not found
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>{post.title} - Not Reddit</title>
      </Head>
      {/* Parent div so w-frac (child) can work correctly */}
      <div className='flex flex-col items-center gap-4'>
        <NavBar />
        <div className='w-frac flex flex-col gap-4'>
          <PostTitleText
            title={post.title}
            text={post.text}
            username={post.User.username}
          />
          <CommentForm postId={post.id} sessionData={session.data} />
          <Comments comments={comments} userId={session.data?.user.id} />
        </div>
      </div>
    </>
  );
};

export default PostID;
