import prisma from '@lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

interface Body {
  username: string;
  password: string;
}

const validateReqBody = function (body: any) {
  if ('username' in body && 'password' in body) {
    if (typeof body.username == 'string' && typeof body.password === 'string') {
      return body as Body;
    }
    throw Error('Field types are not correct');
  }
  throw Error('Missing body fields');
};

const createUser = async function ({ username, password }: Body) {
  // Creates user if not already in the database
  const userExists = await prisma.user.findUnique({
    where: {
      username,
    },
  });

  if (userExists === null) {
    const user = await prisma.user.create({
      data: {
        username,
        password,
      },
      select: {
        id: true,
        username: true,
      },
    });
    return user;
  } else {
    throw Error('Username already exists');
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'POST') {
    try {
      const body = validateReqBody(req.body);
      await createUser(body);
      res.redirect(301, `/auth/login`);
    } catch (error) {
      res.status(403).json({ error: error as string });
    }
  }
}
