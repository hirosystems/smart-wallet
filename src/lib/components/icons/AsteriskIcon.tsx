import { Icon } from "@chakra-ui/react";

const AsteriskIcon = (props) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <Icon viewBox="0 0 12 12" {...props}>
    <path
      d="M6 0V12"
      stroke="currentColor"
      strokeWidth="0.8"
      strokeMiterlimit="10"
    />
    <path
      d="M10.2418 1.758L1.75781 10.242"
      stroke="currentColor"
      strokeWidth="0.8"
      strokeMiterlimit="10"
    />
    <path
      d="M10.2418 10.242L1.75781 1.758"
      stroke="currentColor"
      strokeWidth="0.8"
      strokeMiterlimit="10"
    />
    <path
      d="M0 6H12"
      stroke="currentColor"
      strokeWidth="0.8"
      strokeMiterlimit="10"
    />
  </Icon>
);

export default AsteriskIcon;
