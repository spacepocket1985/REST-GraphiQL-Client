export const Spinner = (): JSX.Element => {
  return (
    <svg
      data-testid="spinner"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid"
      width="150"
      height="150"
      style={{
        shapeRendering: 'auto',
        display: 'block',
        margin: 'auto',
        background: 'rgb(255, 255, 255)',
      }}
    >
      <g>
        <g>
          <path
            d="M50 15A35 35 0 1 0 74.74873734152916 25.251262658470843"
            fill="none"
            stroke="#1976d2"
            strokeWidth="7"
          ></path>
          <path d="M49 3L49 27L61 15L49 3" fill="#1976d2"></path>
          <animateTransform
            attributeName="transform"
            type="rotate"
            repeatCount="indefinite"
            dur="1s"
            values="0 50 50;360 50 50"
            keyTimes="0;1"
          ></animateTransform>
        </g>
        <g></g>
      </g>
    </svg>
  );
};
