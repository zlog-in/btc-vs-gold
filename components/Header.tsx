import Image from "next/image";

export default function Header() {
  return (
    <header className="text-center py-8 md:py-12">
      <div className="mb-4 flex items-center justify-center gap-4 md:gap-6">
        <Image
          src="/bitcoin.png"
          alt="Bitcoin"
          width={80}
          height={80}
          className="w-16 h-16 md:w-20 md:h-20"
        />
        <span className="text-4xl md:text-5xl">🆚</span>
        <Image
          src="/gold-bars.png"
          alt="Gold"
          width={80}
          height={80}
          className="w-16 h-16 md:w-20 md:h-20"
        />
      </div>
      <h1 className="text-4xl md:text-6xl font-bold mb-3 bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-500 bg-clip-text text-transparent">
        Bitcoin vs Gold
      </h1>
      <p className="text-gray-300 text-lg md:text-xl font-medium">
        💰 Market Capitalization Comparison 📊
      </p>
      <p className="text-gray-400 text-sm md:text-base mt-2">
        Real-time data • Updated daily ⚡
      </p>
    </header>
  );
}
