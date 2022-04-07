import { FC, FormEvent } from 'react';
import { useState } from 'react';
import { useRouter } from 'next/router';

interface Props {
  postId: string;
}

const CommentForm: FC<Props> = ({ postId }) => {
  const [commentText, setCommentText] = useState<string>('');
  const [error, setError] = useState<string>('');

  const router = useRouter();

  const createComment = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (commentText === '') {
      setError('Cannot create empty comment');
      return;
    }
    const url = window.location.origin + '/api/comment';
    const body = JSON.stringify({ postId, text: commentText });
    setError('');
    setCommentText('');
    try {
      await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body,
      });
      router.reload();
    } catch (error) {
      setError('Cannot create comment :(');
    }
  };

  return (
    <>
      <form
        id='comment-section'
        onSubmit={createComment}
        className='border-body flex w-full rounded'
      >
        <textarea
          placeholder='What are your thoughts?'
          value={commentText}
          rows={1}
          cols={80}
          onChange={event => setCommentText(event.target.value)}
          className='border-box dark-body h-fit w-full rounded-l p-2 font-mono
					focus-visible:outline-none'
        />
        <input
          type='submit'
          value='Comment'
          className='transition-ease rounded-r bg-reddit-orange p-2 font-medium
					text-reddit-text-dark hover:scale-105'
        />
      </form>
      {error !== '' ? (
        <div className='flex justify-center'>
          <p className='max-w-fit rounded bg-reddit-orange p-2'>{error}</p>
        </div>
      ) : (
        ''
      )}
    </>
  );
};

export default CommentForm;
