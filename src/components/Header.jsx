import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-orange-500 text-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity cursor-pointer">
          <span className="text-2xl">🍛</span>
          <h1 className="text-2xl font-bold">Food Bliss</h1>
        </Link>
        <div className="text-sm font-semibold">
          Order Fresh & Tasty Food
        </div>
      </div>
    </header>
  );
}
