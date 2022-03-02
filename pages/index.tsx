import CreatePostButton from '@components/Button/CreatePostButton';
import PostCard from '@components/Post/PostCard';
import prisma from '@lib/prisma';
import { Post } from '@prisma/client';
import { NextPage } from 'next';
import Head from 'next/head';
import SignUpButton from '@components/Button/SignUpButton';

import { useSession } from 'next-auth/react';
import AuthButtons from '@components/Button/AuthButton';

interface Props {
	posts: Post[] | null;
}

export async function getServerSideProps() {
	try {
		const posts = await prisma.post.findMany({
			take: -16,
		});

		return {
			props: {
				posts: posts.length ? posts.reverse() : null,
			},
		};
	} catch (error) {
		return {
			props: {
				posts: null,
			},
		};
	}
}

const Home: NextPage<Props> = ({ posts }) => {
	const { data: session } = useSession();
	return (
		<>
			<Head>
				<title>Not Reddit</title>
			</Head>
			<div className='relative flex flex-col items-center gap-2'>
				<div className='flex gap-2 md:absolute md:top-0 md:right-0 md:flex-col'>
					{session ? (
						<>
							<CreatePostButton />
						</>
					) : (
						<>
							<AuthButtons />
							<SignUpButton />
						</>
					)}
				</div>
				{posts === null ? (
					<p className='round-2 shadow-box bg-red-500'>no posts available</p>
				) : (
					<>
						{posts.map((post) => (
							<PostCard key={post.id} {...post} />
						))}
					</>
				)}
			</div>
		</>
	);
};

export default Home;
