import CreatePostButton from '@components/Button/CreatePostButton';
import PostCard from '@components/Post/PostCard';
import prisma from '@lib/prisma';
import { Post } from '@prisma/client';
import { NextPage } from 'next';

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
		<div className='flex flex-col items-center gap-2'>
			<CreatePostButton />
			{posts === null ? (
				<p className='round-2 shadow-box mt-4 bg-red-500'>no posts available</p>
			) : (
				<>
					{posts.map((post) => (
						<PostCard key={post.id} {...post} />
					))}
				</>
			)}
		</div>
	);
};

export default Home;
