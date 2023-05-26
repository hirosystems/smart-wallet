interface HiroCoinIconProps {
  circleFill?: string | undefined;
  circleShadowFill?: string;
  hiroIconFill?: string;
}

const HiroCoinIcon = ({
  circleFill,
  circleShadowFill,
  hiroIconFill,
}: HiroCoinIconProps) => (
  <svg
    height="100%"
    width="100%"
    viewBox="0 0 102 109"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      cx="51"
      cy="57.0898"
      r="50.5"
      fill={circleFill ?? "#141312"}
      stroke="#141312"
    />
    <circle
      cx="51"
      cy="51"
      r="50.25"
      fill={circleShadowFill ?? "#383432"}
      stroke="#181717"
      strokeWidth="1.5"
    />
    <path
      d="M57.6034 57.0027L65.2032 68.5076H59.5259L50.6044 54.9901L41.6829 68.5076H36.0356L43.6354 57.0328H32.7314V52.6772H68.5075V57.0027H57.6034Z"
      fill={hiroIconFill ?? "#181717"}
    />
    <path
      d="M68.5075 44.0861V48.4417V48.4717H32.7314V44.0861H43.4251L35.9155 32.7314H41.5928L50.6044 46.4291L59.646 32.7314H65.3234L57.8137 44.0861H68.5075Z"
      fill={hiroIconFill ?? "#181717"}
    />
  </svg>
);

export default HiroCoinIcon;
