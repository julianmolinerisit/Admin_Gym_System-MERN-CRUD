// Button.jsx
export function Button({ onClick, children }) {
  return (
    <button
      className="px-4 py-1  bg-blue-500 hover:bg-blue-700 text-white font-bold rounded my-2 disabled:bg-blue-300 mr-1"
      onClick={onClick}
    >
      {children}
    </button>
  );
}
