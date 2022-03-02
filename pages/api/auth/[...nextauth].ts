import prisma from '@lib/prisma';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

const getUserCredentials = async (username: string) => {
	return await prisma.user.findUnique({
		where: {
			username,
		},
		select: {
			id: true,
			username: true,
			password: true,
		},
	});
};

export default NextAuth({
	providers: [
		CredentialsProvider({
			name: 'Credentials',
			credentials: {
				username: { label: 'Username', type: 'text', placeholder: 'username' },
				password: { label: 'Password', type: 'password' },
			},
			authorize: async (credentials) => {
				if (credentials !== undefined) {
					const user = await getUserCredentials(credentials.username);

					// TODO add encryption to password
					if (user !== null && credentials.password === user.password) {
						return {
							id: user.id,
							username: user.username,
						};
					}
				}
				return null;
			},
		}),
	],
	callbacks: {
		jwt: async ({ token, user }) => {
			if (user) {
				token.id = user.id;
				token.username = user.username as string;
			}
			return token;
		},
		session: ({ session, token }) => {
			if (token) {
				session.user.id = token.id as string;
				session.user.username = token.username as string;
			}
			return session;
		},
	},
	secret: process.env.NEXTAUTH_SECRET,
	jwt: {
		secret: process.env.NEXTAUTH_SECRET,
	},
	pages: {
		signIn: '/auth/login',
	},
});
