import {
  Box,
  Button,
  Stack,
} from "@chakra-ui/react";
import NextLink from "next/link";
import ConnectWallet from "../ConnectWallet";

const UserMenu = () => {
  return (
    <Stack
      spacing={[2, 2, 4, 4]}
      align="center"
      direction="row"
      justify="center"
    >
      <Box>
        <NextLink href="/send" legacyBehavior>
          <Button variant="linkLight" as="div" mr="2" cursor="pointer">
            Send
          </Button>
        </NextLink>
        <NextLink href="/rules" legacyBehavior>
          <Button variant="linkLight" as="div" mr="2" cursor="pointer">
            Rules
          </Button>
        </NextLink>
        <NextLink href="/add-signer" legacyBehavior>
          <Button variant="linkLight" as="div" mr="2" cursor="pointer">
            Add Signer
          </Button>
        </NextLink>
        <ConnectWallet />
      </Box>
    </Stack>
  );
};

export default UserMenu;
