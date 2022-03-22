import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

interface PostBody {
	postId: string;
	text: string;
}

const validatePostReq = function (body: any): PostBody {
	if ('postId' in body && 'text' in body) {
		if (typeof body.postId === 'string' && typeof body.text === 'string') {
			return {
				postId: body.postId,
				text: body.text,
			};
		}
		throw Error('Field types are not correct');
	}
	throw Error('Missing body fields');
};

const createComment = async function (
	userId: string,
	{ postId, text }: PostBody
) {
	const prisma = new PrismaClient();
	return await prisma.comment.create({
		data: {
			userId,
			text,
			postId,
		},
	});
};

interface DeleteBody {
	commentId: string;
}

const validateDeleteReq = function (body: any): DeleteBody {
	if ('commentId' in body) {
		if (typeof body.commentId === 'string') {
			return {
				commentId: body.commentId,
			};
		}
		throw Error('Field type is not correct');
	}
	throw Error('Missing body field');
};

const deleteComment = async function (
	userId: string,
	{ commentId }: DeleteBody
) {
	const comment = await prisma.comment.findUnique({
		where: {
			id: commentId,
		},
		select: {
			id: true,
			userId: true,
			postId: true,
		},
	});
	if (comment !== null && comment.userId === userId) {
		await prisma.comment.delete({
			where: {
				id: commentId,
			},
		});
		return comment;
	}
	throw Error('Error deleting comment');
};

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const session = await getSession({ req });
	if (session) {
		switch (req.method) {
			case 'POST':
				try {
					const body = validatePostReq(req.body);
					const comment = await createComment(session.user.id, body);

					res.status(200).json(comment);
					return;
				} catch (error) {
					res.status(403).json({ error: error as string });
					return;
				}
			case 'DELETE':
				try {
					const body = validateDeleteReq(req.body);
					const comment = await deleteComment(session.user.id, body);

					res.status(200).json(comment);
					return;
				} catch (error) {
					res.status(403).json({ error: error as string });
				}
		}
	}
	res.status(404).json({ error: 'Not Authenticated' });
}
