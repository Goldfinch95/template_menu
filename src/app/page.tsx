export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-black">
      {/* Header with background image */}
      <div className="relative h-48 rounded-b-3xl overflow-hidden bg-gray-900">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-60"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=400&fit=crop')",
          }}
        ></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-white text-4xl font-bold tracking-wider drop-shadow-lg">Restaurant</h1>
            <p className="text-white text-2xl font-light mt-1 drop-shadow-lg">Menu</p>
          </div>
        </div>
      </div>
    </div>
  );
}
