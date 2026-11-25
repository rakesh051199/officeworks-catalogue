import { Link, Outlet } from "react-router-dom";
import { SearchBar } from "./SearchBar";

export function Layout() {
  return (
    <div className="shell">
      <header className="site-header">
        <Link className="brand" to="/">
          Catalogue
        </Link>
        <SearchBar />
      </header>
      <Outlet />
    </div>
  );
}
