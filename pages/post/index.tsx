import NavBar from '@components/body/NavBar';
import PostForm from '@components/Post/PostForm';
import { NextPage } from 'next';
import Head from 'next/head';

const Post: NextPage = () => {
	return (
		<>
			<Head>
				<title>Create Post - Not Reddit</title>
			</Head>
			<div className='flex flex-col items-center gap-4'>
				<NavBar />
				<PostForm />
			</div>
		</>
	);
};

export default Post;
