import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";

export function SearchBar({ initial = "" }: { initial?: string }) {
  const [term, setTerm] = useState(initial);
  const navigate = useNavigate();

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    const q = term.trim();
    if (!q) {
      return;
    }
    navigate(`/search?q=${encodeURIComponent(q)}`);
  }

  return (
    <form className="search-form" onSubmit={onSubmit} role="search">
      <input
        aria-label="Search products"
        placeholder="Search products"
        value={term}
        onChange={(event) => setTerm(event.target.value)}
      />
      <button type="submit">Search</button>
    </form>
  );
}
