import { Icon } from "@chakra-ui/react";

const DownCaretIcon = (props) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <Icon viewBox="0 0 12 7" fill="none" {...props}>
    <line
      y1="-0.6"
      x2="7.05414"
      y2="-0.6"
      transform="matrix(0.680451 0.732793 -0.680451 0.732793 0 1)"
      stroke="currentColor"
      strokeWidth="1.2"
    />
    <line
      y1="-0.6"
      x2="7.05414"
      y2="-0.6"
      transform="matrix(-0.680451 0.732793 0.680451 0.732793 12 1)"
      stroke="currentColor"
      strokeWidth="1.2"
    />
  </Icon>
);

export default DownCaretIcon;
