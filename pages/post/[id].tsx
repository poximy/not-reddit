import CommentForm from '@components/Post/CommentForm';
import prisma from '@lib/prisma';
import { Comment, Post } from '@prisma/client';
import { GetServerSideProps, NextPage } from 'next';
import { ParsedUrlQuery } from 'node:querystring';

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

const PostID: NextPage<Props> = ({ post, comments }) => {
	return (
		<div className='flex justify-center'>
			<div className='transition-ease w-frac flex flex-col gap-2'>
				{post === null ? (
					<p>Error post was not found</p>
				) : (
					<>
						<p className='shadow-box dark-theme round-2 w-full'>{post.title}</p>
						{post.text !== '' ? (
							<p className='shadow-box dark-theme round-2 w-full'>
								{post.text}
							</p>
						) : (
							''
						)}
						<br />
						{/* Comment Section */}
						<CommentForm postId={post.id} />
						{comments === null || comments.length === 0 ? (
							<p className='shadow-box dark-theme round-2 text-center'>
								No Comments
							</p>
						) : (
							<>
								{comments.map((comment) => (
									<p
										key={comment.id}
										className='shadow-box dark-theme round-2 w-full'
									>
										{comment.text}
									</p>
								))}
							</>
						)}
					</>
				)}
			</div>
		</div>
	);
};

export default PostID;
