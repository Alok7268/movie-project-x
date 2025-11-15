export default function Footer() {
  return (
    <footer className="py-12 px-6 border-t border-[#003566]/50 bg-gradient-to-b from-transparent to-[#000814]/50">
      <div className="max-w-7xl mx-auto text-center">
        <h3 className="text-2xl font-bold bg-gradient-to-r from-[#ffc300] to-[#ffd60a] bg-clip-text text-transparent mb-4">Movie Directory</h3>
        <p className="text-gray-400 text-sm">
          Powered by TMDB Dataset • Built with Next.js & Tailwind CSS
        </p>
      </div>
    </footer>
  );
}

