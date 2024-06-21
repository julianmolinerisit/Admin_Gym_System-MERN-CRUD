// ButtonLink.jsx
import { Link } from "react-router-dom";

export const ButtonLink = ({ to, children }) => (
  <Link to={to} className="px-4 py-1  bg-blue-500 hover:bg-blue-700 text-white font-bold rounded my-2 disabled:bg-blue-300 mr-1">
    {children}
  </Link>
);
