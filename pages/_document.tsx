import { NextPage } from 'next';
import { Html, Head, Main, NextScript } from 'next/document';

const Document: NextPage = () => {
	return (
		<Html lang='en'>
			<Head />
			<body className='m-4 bg-reddit-light-gray dark:bg-black'>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
};

export default Document;
