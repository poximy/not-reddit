import prisma from '@lib/prisma';
import { Comment, Post } from '@prisma/client';

import { FC } from 'react';
import Head from 'next/head';
import { GetServerSideProps, NextPage } from 'next';

import { ParsedUrlQuery } from 'node:querystring';

import NavBar from '@components/body/NavBar';
import CommentForm from '@components/Post/CommentForm';
interface Props {
	post: Post | null;
	comments: Comment[] | null;
}

const validateParams = (params: ParsedUrlQuery | undefined) => {
	if (params !== undefined) {
		if ('id' in params) {
			return params.id as string;
		}
	}
	return null;
};

const findPost = async (id: string) => {
	try {
		const post = await prisma.post.findUnique({
			where: {
				id,
			},
		});

		return post;
	} catch (error) {
		return null;
	}
};

const findComments = async (postId: string) => {
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

const PostTitleText: FC<{ title: string; text: string }> = ({
	title,
	text,
}) => {
	return (
		<>
			<p className='dark-body border-body round-2 w-full'>{title}</p>
			{text !== '' ? (
				<p className='dark-body round-2 border-body w-full'>{text}</p>
			) : (
				''
			)}
		</>
	);
};

const Comments: FC<{ comments: Comment[] | null }> = ({ comments }) => {
	return (
		<>
			{comments === null || comments.length === 0 ? (
				<p className='dark-body round-2 border-body text-center'>No Comments</p>
			) : (
				<>
					{comments.map((comment) => (
						<p
							key={comment.id}
							className='border-body dark-body round-2 w-full'
						>
							{comment.text}
						</p>
					))}
				</>
			)}
		</>
	);
};

const PostID: NextPage<Props> = ({ post, comments }) => {
	return (
		<>
			<Head>
				<title>
					{post !== null ? post.title : 'Post not found'} - Not Reddit
				</title>
			</Head>
			<div className='flex justify-center'>
				{/* Parrent div so w-frac can work correctly */}
				<div className='transition-ease w-frac flex flex-col gap-4'>
					<NavBar />
					{post === null ? (
						<p className='shadow-box round-2 bg-reddit-orange'>
							Error post was not found
						</p>
					) : (
						<>
							<PostTitleText title={post.title} text={post.text} />
							<CommentForm postId={post.id} />
							<Comments comments={comments} />
						</>
					)}
				</div>
			</div>
		</>
	);
};

export default PostID;
