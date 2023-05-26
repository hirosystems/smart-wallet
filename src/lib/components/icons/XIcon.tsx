import { Icon } from "@chakra-ui/react";

const XIcon = (props) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <Icon viewBox="0 0 14 14" fill="none" {...props}>
    <path d="M1 1L5.5 5.5" stroke="currentColor" />
    <path d="M8.5 8.5L13 13" stroke="currentColor" />
    <path d="M13 1L0.999999 13" stroke="currentColor" />
  </Icon>
);

export default XIcon;
