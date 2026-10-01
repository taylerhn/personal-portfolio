import './globals.css';
import Header from '../components/header';
import Footer from '../components/footer';
import ScrollWalker from '../components/ScrollWalker';

export const metadata = {
  title: 'Tayler Nguyen — EECS @ Berkeley',
  description:
    'Personal portfolio of Tayler Hau Nguyen, software engineer and community leader studying EECS at UC Berkeley. Drawn in the margins of a lecture notebook.',
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
