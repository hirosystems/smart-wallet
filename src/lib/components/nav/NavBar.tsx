import { Badge, Button, Flex, Link } from "@chakra-ui/react";
import NextLink from "next/link";
import { FC, useState } from "react";
import HiroPlatformLogo from "../HiroPlatformLogo";
import UserMenu from "./UserMenu";

const Logo: FC<{ openBetaModal: () => void }> = ({ openBetaModal }) => (
  <Flex align="center" gap="3">
    <NextLink href="/" passHref legacyBehavior>
      <Link display="flex" alignItems="center" href="/">
        <HiroPlatformLogo height={14} />
      </Link>
    </NextLink>
    <Button variant="unstyled" display="flex" onClick={openBetaModal}>
      <Badge variant="outline" colorScheme="sky">
        Beta
      </Badge>
    </Button>
  </Flex>
);

const NavBar: FC<{ height: any }> = ({ height }) => {
  const [isBetaInfoModalOpen, setIsBetaInfoModalOpen] = useState(false);
  return (
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      h={height}
      px={6}
      minWidth="800px"
    >
      <Logo
        openBetaModal={() => {
          setIsBetaInfoModalOpen(true);
        }}
      />
      <UserMenu />
      <BetaInfoModal
        isOpen={isBetaInfoModalOpen}
        onClose={() => {
          setIsBetaInfoModalOpen(false);
        }}
      />
    </Flex>
  );
};

export default NavBar;
