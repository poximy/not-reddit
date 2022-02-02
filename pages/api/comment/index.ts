import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

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

const createComment = async ({ postId, text }: CommentBody) => {
	const prisma = new PrismaClient();
	const comment = await prisma.comment.create({
		data: {
			text,
			postId,
		},
	});
	return comment;
};

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method === 'POST') {
		try {
			const body = validateReq(req.body);
			const comment = await createComment(body);
			res.status(200).json(comment);
		} catch (error) {
			res.status(403).json({ error: error as string });
		}
	}
}
