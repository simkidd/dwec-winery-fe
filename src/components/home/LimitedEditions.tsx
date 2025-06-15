const LimitedEditions = () => (
  <div className="py-16 bg-gradient-to-r from-amber-900 to-amber-700 text-white">
    <div className="container mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-serif font-bold mb-2">
          Limited Edition Wines
        </h2>
        <p className="text-xl">Rare vintages and exclusive releases</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* These would be your limited edition products */}
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="bg-white bg-opacity-10 p-6 rounded-lg backdrop-blur-sm border border-white border-opacity-20"
          >
            <div className="aspect-square bg-gray-300 bg-opacity-20 mb-4 rounded"></div>
            <h3 className="text-2xl font-serif mb-2">
              Reserve Vintage {2020 + i}
            </h3>
            <p className="text-amber-200 mb-4">
              Only {50 - i * 10} bottles remaining
            </p>
            <p className="mb-4">
              Aged {5 + i} years in French oak barrels with notes of blackberry
              and spice
            </p>
            <button className="bg-white text-amber-900 px-6 py-2 rounded hover:bg-gray-100 transition">
              Reserve Now
            </button>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default LimitedEditions;
