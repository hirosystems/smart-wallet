import { Icon } from "@chakra-ui/react";

const DraftIcon = (props) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <Icon viewBox="0 0 20 20" fill="none" {...props}>
    <rect width="20" height="20" rx="10" fill="#CFC9C2" />
    <path d="M14 6L6 14" stroke="#141312" />
  </Icon>
);

export default DraftIcon;
