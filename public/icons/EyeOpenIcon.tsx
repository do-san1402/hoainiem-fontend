const EyeOpenIcon = ({ clss = "" }) => {
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
      <path d="M10 5c4.183 0 7.57 2.526 8.94 6a9.949 9.949 0 01-8.94 6c-4.183 0-7.57-2.526-8.94-6A9.949 9.949 0 0110 5zm0 8a2 2 0 100-4 2 2 0 000 4z" />
    </svg>
  );
};

export default EyeOpenIcon;
