import { Box, Text } from "@chakra-ui/react";
import { FC } from "react";

interface HiroPlatformLogoProps {
  height: number;
}
const HiroPlatformLogo: FC<HiroPlatformLogoProps> = ({ height }) => (
  <Box h={`${height}px`} minW="165px">
    <Text>Hiro Smart Wallet </Text>
    {/* <img
      src="/images/favicon.png"
      alt="Hiro Smart Wallet"
      style={{ maxHeight: "100%" }}
    /> */}
  </Box>
);

export default HiroPlatformLogo;
