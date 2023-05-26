import { useToast as useChakraToast } from "@chakra-ui/react";
import { useMemo } from "react";

// Wrapper for Chakra toast to set default options
export default function useToast() {
  const toast = useChakraToast({
    variant: "subtle",
    duration: 4500,
    isClosable: true,
    position: "bottom-left",
    containerStyle: {
      // @ts-ignore
      'button[aria-label="Close"]': {
        top: "auto",
      },
    },
  });

  return useMemo(() => toast, []); // eslint-disable-line react-hooks/exhaustive-deps
}
