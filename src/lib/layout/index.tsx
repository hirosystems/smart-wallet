import { Box } from '@chakra-ui/react';
import type { ReactNode } from 'react';

import Footer from './Footer';
import Header from './Header';
import NavBar from '../components/nav/NavBar';

type LayoutProps = {
  children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  return (
    <Box>
      <NavBar height={`50px`} />
      <Box margin="0 auto" maxWidth={800} transition="0.5s ease-out">
        <Box as="main" marginY={22}>
          {children}
        </Box>
        <Footer />
      </Box>
    </Box>
  );
};

export default Layout;
