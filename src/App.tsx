import { Search } from "lucide-react"

function App() {
  return (
    <div className="min-h-screen p-4 md:p-8 flex justify-center">

      <div className="w-full max-w-[1100px] flex flex-col gap-10">

        <header className="flex justify-between items-center">
          <div className="text-xl font-bold text-orange-400 flex items-center gap-2">
            <span>☀️ Weather Now</span>
          </div>

          <button className="bg-slate-800 px-4 py-2 rounded-full text-sm">
            ⚙️ Units ⌄
          </button>
        </header>

        <section className="flex flex-col items-center gap-6">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-center">
            How's the sky looking today?
          </h1>

          <div className="flex w-full max-w-md gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 text-slate-400" size={20} />
              <input
                type="text"
                placeholder="Search for a place..."
                className="w-full bg-slate-800 rounded-lg py-3 pl-10 pr-4 outline-none"
              />
              
            </div>

            <button className="bg-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
              Search
            </button>
          </div>
        </section>

        <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 flex flex-col gap-6">

            <div className="bg-blue-600 h-64 rounded-3xl p-6 flex items-end">
              <span className="font-bold text-2xl">Card Principal (Berlin, 20°)</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-800 h-32 rounded-2xl p-4">Feels Like</div>
              <div className="bg-slate-800 h-32 rounded-2xl p-4">Humidity</div>
              <div className="bg-slate-800 h-32 rounded-2xl p-4">Wind</div>
              <div className="bg-slate-800 h-32 rounded-2xl p-4">Precipitation</div>
            </div>

            <div className="bg-slate-800/50 p-4 rounded-3xl">
              <p className="mb-4 font-bold">Daily Forecast</p>
              <div className="grid grid-cols-3 md:grid-cols-7 gap-2">
                 <div className="bg-slate-800 h-32 rounded-2xl"></div>
                 <div className="bg-slate-800 h-32 rounded-2xl"></div>
                 <div className="bg-slate-800 h-32 rounded-2xl"></div>
                 <div className="bg-slate-800 h-32 rounded-2xl"></div>
                 <div className="bg-slate-800 h-32 rounded-2xl"></div>
                 <div className="bg-slate-800 h-32 rounded-2xl"></div>
                 <div className="bg-slate-800 h-32 rounded-2xl"></div>
              </div>
            </div>

          </div>

          <div className="bg-slate-800 rounded-3xl p-6 h-[600px]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-bold"> Hourly forecast</h2>
              <span className="bg-slate-700 px-3 py-1 rounded-full text-sm">Tuesday ⌄</span>
            </div>
            <p className="text-slate-400 text-center mt-20">Aqui vai a lista de horas (3 PM, 4 PM...)</p>
          </div>

        </main>
      </div>
    </div>
  );
}
export default App;
