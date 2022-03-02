import prisma from '@lib/prisma';
import { Post } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

const validateReq = (body: any) => {
	if ('title' in body && 'text' in body) {
		if (typeof body.title == 'string' && typeof body.text === 'string') {
			return body as Post;
		}
		throw Error('Field types are not correct');
	}
	throw Error('Missing body fields');
};

const createPost = async ({ title, text }: Post, userId: string) => {
	return await prisma.post.create({
		data: {
			userId,
			title,
			text,
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
				const post = await createPost(body, session.user.id);

				res.redirect(301, `/post/${post.id}`);
			} catch (error) {
				res.status(403).json({ error: error as string });
			}
		}
	}
	res.status(404).json({ error: 'Not Authenticated' });
}
