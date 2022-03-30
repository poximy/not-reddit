import prisma from '@lib/prisma';
import { Post } from '@prisma/client';

import Head from 'next/head';
import { NextPage } from 'next';

import NavBar from '@components/body/NavBar';
import PostCard from '@components/Post/PostCard';

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
	return (
		<>
			<Head>
				<title>Not Reddit</title>
			</Head>
			<div className='flex flex-col items-center gap-4'>
				<NavBar />
				{posts === null ? (
					<p className='round-2 shadow-box bg-reddit-orange'>
						no posts available
					</p>
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
