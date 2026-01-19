import { createPortal } from "react-dom";

const portalRoot =
  typeof document !== "undefined" ? document.getElementById("portal") : null;

const Portal = ({ children }: { children: React.ReactNode }) => {
  if (!portalRoot) return null;
  return createPortal(children, portalRoot);
};

export default Portal;
