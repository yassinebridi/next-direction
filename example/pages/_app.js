import { DirModeProvider } from 'next-direction';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <DirModeProvider>
      <Component {...pageProps} />
    </DirModeProvider>
  );
}

export default MyApp;
