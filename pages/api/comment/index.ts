import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

interface CommentBody {
	postId: string;
	text: string;
}

const validateReq = (body: any) => {
	if ('postId' in body && 'text' in body) {
		if (typeof body.postId == 'string' && typeof body.text == 'string') {
			return {
				postId: body.postId as string,
				text: body.text as string,
			};
		}
		throw Error('Field types are not correct');
	}
	throw Error('Missing body fields');
};

const createComment = async ({ postId, text }: CommentBody, userId: string) => {
	const prisma = new PrismaClient();
	return await prisma.comment.create({
		data: {
			userId,
			text,
			postId,
		},
	});
};

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const session = await getSession({ req });
	if (session) {
		if (req.method === 'POST') {
			try {
				const body = validateReq(req.body);
				const comment = await createComment(body, session.user.id);

				res.status(200).json(comment);
				return
			} catch (error) {
				res.status(403).json({ error: error as string });
				return
			}
		}
	}
	res.status(404).json({ error: 'Not Authenticated' });
}
