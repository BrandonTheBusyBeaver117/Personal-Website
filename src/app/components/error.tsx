export type ErrorProps = {
  disabledSupplier: () => boolean;
  message: string;
  children?: React.ReactNode;
};

// Creates an error popup
const Error: React.FC<ErrorProps> = ({ disabledSupplier, message, children }) => {
  // A function to supply whether the error is disabled or not
  // If true, the error will not show
  if (disabledSupplier()) return <></>;

  // Otherwise, display the error message that is to be displayed to the user
  // And render children
  return (
    <div className="mb-4 rounded bg-red-500 p-2 text-white">
      {message}
      {children}
    </div>
  );
};

export default Error;
