export default function Header() {
  return (
    <header className="text-center py-8 md:py-12">
      <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-bitcoin via-gold to-bitcoin bg-clip-text text-transparent">
        Bitcoin vs Gold
      </h1>
      <p className="text-textSecondary text-lg md:text-xl">
        Market Capitalization Comparison
      </p>
    </header>
  );
}
