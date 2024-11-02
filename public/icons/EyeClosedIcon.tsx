const EyeClosedIcon = ({ clss = "" }) => {
  return (
    <svg
      aria-hidden="true"
      width="20"
      height="20"
      fill="currentColor"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
      className={`${clss}`}
    >
      <path d="M10 4a8 8 0 017.062 4 8.002 8.002 0 01-14.124 0A8 8 0 0110 4zm0 8a4 4 0 100-8 4 4 0 000 8zm-1-5h2v1h-2V7z" />
    </svg>
  );
};

export default EyeClosedIcon;
