import { NextPage } from 'next';
import { Html, Head, Main, NextScript } from 'next/document';

const Document: NextPage = () => {
	return (
		<Html>
			<Head />
			<body className='m-4 bg-zinc-200 dark:bg-neutral-900'>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
};

export default Document;
