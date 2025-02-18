// Creates a spinning loading screen
const Loading: React.FC = () => {
  return (
    <div className="flex h-4/5 w-2/5 flex-col items-center justify-center bg-gray-100">
      <h2 className="mb-6 text-sm font-bold text-gray-700">Loading...</h2>
      <div className="loader mb-4 h-12 w-12 rounded-full border-4 border-t-4 border-gray-200 ease-linear"></div>
    </div>
  );
};

export default Loading;
