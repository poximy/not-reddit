import { FC, FormEvent, useState } from 'react';
import { useRouter } from 'next/router';

const PostForm: FC = () => {
	const router = useRouter();

	const [title, setTitle] = useState<string>('');
	const [text, setText] = useState<string>('');
	const [error, setError] = useState<string>('');

	const createPost = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const url = window.location.origin + '/api/post';
		const body = JSON.stringify({ title, text });
		setTitle('');
		setText('');
		try {
			const res = await fetch(url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body,
			});
			await router.push(res.url);
		} catch (error) {
			setError('Cannot create post :(');
		}
	};

	const displayError =
		error === '' ? (
			''
		) : (
			<p className='round-2 w-max bg-red-500 font-medium'>
				Error Cannot Create Post
			</p>
		);

	return (
		<>
			{displayError}
			<form onSubmit={createPost} className='flex flex-col gap-2'>
				<input
					className='shadow-box dark-theme round-2 w-full font-mono text-xl
					focus-visible:outline-none'
					type='text'
					placeholder='Title'
					value={title}
					required={true}
					onChange={(e) => {
						setTitle(e.target.value);
					}}
				/>
				<textarea
					className='border-box dark-theme shadow-box round-2 w-full font-mono
					text-lg focus-visible:outline-none'
					placeholder='Text (optional)'
					value={text}
					rows={10}
					cols={80}
					onChange={(e) => {
						setText(e.target.value);
					}}
				/>
				<input
					className='shadow-box transition-ease round-2 bg-blue-400
					font-medium hover:scale-105'
					type='submit'
					value='Post'
				/>
			</form>
		</>
	);
};

export default PostForm;
