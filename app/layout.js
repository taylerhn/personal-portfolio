import './globals.css';
import Header from '../components/header';
import Footer from '../components/footer';
import ScrollWalker from '../components/ScrollWalker';

export const metadata = {
  title: 'Tayler Nguyen — EECS @ Berkeley',
  description:
    'I’m Tayler Nguyen, an EECS student at UC Berkeley. Here’s what I’ve built, what I’m learning, and a few photos along the way.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Header />
        {children}
        <Footer />
        <ScrollWalker />
      </body>
    </html>
  );
}
