import { Box, Flex, Stack, Text } from '@chakra-ui/react';
import { FiInfo } from 'react-icons/fi';

interface AssetCaptionProps {
  caption: string;
  isUnanchored?: boolean;
}
export function AssetCaption({ caption, isUnanchored }: AssetCaptionProps) {
  return (
    <Flex flexDirection="row">
      <Caption lineHeight="1.5">{caption}</Caption>{' '}
      {isUnanchored ? (
        <>
          <Caption ml={1}> • Microblock </Caption>
          <Stack isInline>
            <a
              href="https://docs.stacks.co/understand-stacks/microblocks"
              target="_blank"
            >
              <Box
                _hover={{ cursor: 'pointer' }}
                size="12px"
                // color={color('text-caption')}
                as={FiInfo}
                ml={1}
              />
            </a>
          </Stack>
        </>
      ) : (
        ''
      )}
    </Flex>
  );
}

export const Caption = ({ ...props }) => (
  <Text
    letterSpacing="-0.01em"
    // css={captionStyles(variant)}
    // color={color('text-caption')}
    display="block"
    {...props}
  />
);
