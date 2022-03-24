import prisma from '@lib/prisma';
import { Comment, Post } from '@prisma/client';

import { FC } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { GetServerSideProps, NextPage } from 'next';

import { ParsedUrlQuery } from 'node:querystring';

import NavBar from '@components/body/NavBar';
import CommentForm from '@components/Post/CommentForm';

interface Props {
	post: (Post & { User: { username: string } }) | null;
	comments: Comment[] | null;
}

const validateParams = function (params: ParsedUrlQuery | undefined) {
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
		});
		return comments.reverse();
	} catch (error) {
		return null;
	}
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
	const id = validateParams(params);
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

const PostTitle: FC<{ title: string; text: string; username: string }> = ({
	title,
	text,
	username,
}) => {
	return (
		<>
			<div className='flex flex-row gap-2 justify-between items-center dark-body border-body round-2 w-full'>
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

const Comments: FC<{
	comments: Comment[] | null;
	userId: string | undefined;
}> = function ({ comments, userId }) {
	const router = useRouter();

	const deleteButtonHandler = function (commentId: string) {
		deleteComment(commentId);
		setTimeout(router.reload, 1000);
	};

	return (
		<>
			{comments === null || comments.length === 0 ? (
				<p className='dark-body round-2 border-body text-center'>No Comments</p>
			) : (
				<>
					{comments.map((comment) => (
						<div key={comment.id} className='group relative'>
							<p className='border-body dark-body round-2 w-full'>
								{comment.text}
							</p>
							{userId && userId === comment.userId ? (
								<button
									onClick={() => deleteButtonHandler(comment.id)}
									className='absolute top-0 right-0 h-8 w-8 rounded-b rounded-tr
									bg-reddit-orange p-2 font-bold leading-none opacity-0
									group-hover:opacity-100'
								>
									X
								</button>
							) : (
								''
							)}
						</div>
					))}
				</>
			)}
		</>
	);
};

const PostID: NextPage<Props> = ({ post, comments }) => {
	const session = useSession();
	return (
		<>
			<Head>
				<title>
					{post !== null ? post.title : 'Post not found'} - Not Reddit
				</title>
			</Head>
			<div className='flex flex-col items-center gap-4'>
				{/* Parent div so w-frac can work correctly */}
				<NavBar />
				<div className='transition-ease w-frac flex flex-col gap-4'>
					{post === null ? (
						<p className='shadow-box round-2 bg-reddit-orange'>
							Error post was not found
						</p>
					) : (
						<>
							<PostTitle
								title={post.title}
								text={post.text}
								username={post.User.username}
							/>
							{/* Renders Form only if a user is signed in */}
							{session.data === null ? (
								<div className='dark-body'>
									<Link href='/auth/login'>
										<a>
											<p
												className='p-2 text-center text-reddit-text-dark
												dark:text-reddit-text-light'
											>
												Log In To Comment
											</p>
										</a>
									</Link>
								</div>
							) : (
								<CommentForm postId={post.id} />
							)}
							<Comments comments={comments} userId={session.data?.user.id} />
						</>
					)}
				</div>
			</div>
		</>
	);
};

export default PostID;
