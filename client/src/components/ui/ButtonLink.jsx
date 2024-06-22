// ButtonLink.jsx
import { Link } from "react-router-dom";

export const ButtonLink = ({ to, children }) => (
  <Link to={to} className="">
    {children}
  </Link>
);
