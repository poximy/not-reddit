import { FC, FormEvent, useState } from 'react';
import { useRouter } from 'next/router';

// Renders a form for creating a post
const PostForm: FC = () => {
  const router = useRouter();

  const [title, setTitle] = useState<string>('');
  const [text, setText] = useState<string>('');
  const [error, setError] = useState<string>('');

  const createPost = async function (event: FormEvent<HTMLFormElement>) {
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

  return (
    <>
      {error === '' ? (
        ''
      ) : (
        <p className='round-2 w-max bg-reddit-orange font-medium text-reddit-text-dark'>
          Error Cannot Create Post
        </p>
      )}
      <form onSubmit={createPost} className='flex flex-col gap-4'>
        <input
          className='shadow-box dark-body round-2 border-body w-full font-mono
					text-xl focus-visible:outline-none'
          type='text'
          placeholder='Title'
          value={title}
          required={true}
          onChange={e => {
            setTitle(e.target.value);
          }}
        />
        <textarea
          className='border-box dark-body border-body shadow-box round-2 w-full
					font-mono text-lg focus-visible:outline-none'
          placeholder='Text (optional)'
          value={text}
          rows={10}
          cols={80}
          onChange={e => {
            setText(e.target.value);
          }}
        />
        <input
          className='transition-ease rounded-full border-2 border-reddit-orange
					p-2 text-lg font-bold text-reddit-orange hover:scale-[1.025]
					dark:border-reddit-light-gray dark:text-reddit-text-light'
          type='submit'
          value='Post'
        />
      </form>
    </>
  );
};

export default PostForm;
