import Header from '../components/Header';

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-6xl mx-auto">
        {children}
      </main>
    </div>
  );
}
