import PostForm from '@components/Post/PostForm';
import { NextPage } from 'next';

const Post: NextPage = () => {
	return (
		<div className='flex flex-col items-center gap-2'>
			<PostForm />
		</div>
	);
};

export default Post;
