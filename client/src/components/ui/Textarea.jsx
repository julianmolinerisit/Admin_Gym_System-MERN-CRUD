import { forwardRef } from "react";

export const Textarea = forwardRef((props, ref, rows = 2) => (
  <textarea
    {...props}
    ref={ref}
    className="w-full bg-gray-800 text-white px-4 py-2 rounded-md border border-gray-600 focus:outline-none focus:border-blue-500"
    rows={rows}
  />
));
