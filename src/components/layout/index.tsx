import { Outlet } from "react-router-dom";

export function Layout() {
  return (
    <div className="flex-1">
      <Outlet />
    </div>
  );
}
