import prisma from '@lib/prisma';
import { Post } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

const validateReq = (body: any) => {
	if ('title' in body && 'text' in body) {
		if (typeof body.title == 'string' && typeof body.text === 'string') {
			return body as Post;
		}
		throw Error('Field types are not correct');
	}
	throw Error('Missing body fields');
};

const createPost = async ({ title, text }: Post) => {
	return await prisma.post.create({
		data: {
			title,
			text,
		},
	});
};

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method === 'POST') {
		try {
			const body = validateReq(req.body);
			const post = await createPost(body);

			res.redirect(301, `/post/${post.id}`);
		} catch (error) {
			res.status(403).json({ error: error as string });
		}
	}
}
