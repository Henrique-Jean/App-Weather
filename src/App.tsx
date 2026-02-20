import { useState } from 'react';
import { 
  Search, Sun, Settings, ChevronDown, CloudRain, Cloud, CloudLightning, Wind, Snowflake
} from 'lucide-react';

// ==========================================
// TRADUTOR DE ÍCONES (Transforma o código da API no ícone certo)
// ==========================================
const getWeatherIcon = (code: number, size = 32, className = "") => {
  // 0 = Céu Limpo
  if (code === 0) return <Sun className={`text-yellow-400 fill-yellow-400 ${className}`} size={size} />;
  // 1, 2, 3 = Parcialmente Nublado / Nublado
  if (code >= 1 && code <= 3) return <Cloud className={`text-slate-300 fill-slate-300 ${className}`} size={size} />;
  // 51 até 67 = Chuvisco / Chuva
  if (code >= 51 && code <= 67) return <CloudRain className={`text-blue-400 ${className}`} size={size} />;
  // 71 até 77 = Neve
  if (code >= 71 && code <= 77) return <Snowflake className={`text-sky-200 ${className}`} size={size} />;
  // 95 até 99 = Tempestade
  if (code >= 95 && code <= 99) return <CloudLightning className={`text-yellow-400 ${className}`} size={size} />;
  
  return <Cloud className={`text-slate-300 ${className}`} size={size} />; // Padrão
};

function App() {
  const [cityInput, setCityInput] = useState('');
  const [weatherData, setWeatherData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cityInput.trim()) return;

    setLoading(true);
    setError(false);

    try {
      // 1. Pega as coordenadas
      const geoResponse = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${cityInput}&count=1&language=en&format=json`);
      const geoData = await geoResponse.json();

      if (!geoData.results) {
        setError(true);
        setLoading(false);
        return;
      }

      const { latitude, longitude, name, country } = geoData.results[0];

      // 2. Pega o clima (AGORA COM DIAS E HORAS!)
      const weatherResponse = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,wind_speed_10m,weather_code&hourly=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`);
      const weatherJson = await weatherResponse.json();

      // 3. Organiza os próximos 7 dias
      const daily = weatherJson.daily.time.map((time: string, i: number) => ({
        day: new Date(time).toLocaleDateString('en-US', { weekday: 'short' }), // "Mon", "Tue"...
        max: Math.round(weatherJson.daily.temperature_2m_max[i]),
        min: Math.round(weatherJson.daily.temperature_2m_min[i]),
        code: weatherJson.daily.weather_code[i]
      }));

      // 4. Organiza as próximas 7 horas a partir de AGORA
      const now = new Date();
      // Acha a hora atual na lista gigante da API
      const currentIndex = weatherJson.hourly.time.findIndex((t: string) => new Date(t) >= now);
      const startIdx = currentIndex !== -1 ? currentIndex : 0;
      
      const hourly = weatherJson.hourly.time.slice(startIdx, startIdx + 7).map((time: string, i: number) => ({
        time: new Date(time).toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }), // "3 PM"
        temp: Math.round(weatherJson.hourly.temperature_2m[startIdx + i]),
        code: weatherJson.hourly.weather_code[startIdx + i]
      }));

      // Salva tudo no estado
      setWeatherData({
        name,
        country,
        current: weatherJson.current,
        daily,
        hourly,
        // Pegando a data de hoje para o Card Principal
        todayDate: new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })
      });

    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 flex justify-center text-slate-200">
      <div className="w-full max-w-[1100px] flex flex-col gap-10">

        {/* HEADER */}
        <header className="flex justify-between items-center">
          <div className="text-xl font-bold flex items-center gap-3">
            <Sun className="text-orange-500 fill-orange-500" size={32} />
            <span className="text-white tracking-wide">Weather Now</span>
          </div>
          <button className="bg-[#1e293b] hover:bg-slate-700 transition px-5 py-2.5 rounded-full text-sm flex items-center gap-2 font-semibold text-white border border-slate-700">
            <Settings size={16} /> Units <ChevronDown size={16} />
          </button>
        </header>

        {/* BUSCA */}
        <section className="flex flex-col items-center gap-8">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-center text-white tracking-tight">
            How's the sky looking today?
          </h1>
          
          <form onSubmit={handleSearch} className="flex w-full max-w-lg gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-3.5 text-slate-400" size={20} />
              <input 
                type="text" 
                value={cityInput}
                onChange={(e) => setCityInput(e.target.value)}
                placeholder="Search for a place..." 
                className="w-full bg-[#1e293b] text-white rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:ring-2 focus:ring-blue-500 transition shadow-sm border border-slate-700"
              />
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="bg-[#4f46e5] px-8 py-3.5 rounded-2xl font-semibold hover:bg-indigo-600 transition text-white shadow-sm disabled:opacity-50"
            >
              {loading ? '...' : 'Search'}
            </button>
          </form>

          {error && <p className="text-red-400 font-medium bg-red-400/10 px-4 py-2 rounded-lg">City not found. Please try again!</p>}
        </section>

        {weatherData && (
          <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            <div className="lg:col-span-2 flex flex-col gap-8">
              
              {/* CARD PRINCIPAL */}
              <div className="bg-gradient-to-br from-[#3b82f6] to-[#1e40af] h-64 rounded-[2rem] p-8 flex flex-col justify-between relative overflow-hidden shadow-lg border border-blue-400/20">
                <div className="z-10">
                  <h2 className="text-3xl font-bold text-white mb-2">
                    {weatherData.name}, {weatherData.country}
                  </h2>
                  <p className="text-blue-100/80">{weatherData.todayDate}</p>
                </div>
                <div className="z-10 flex items-center justify-between w-full">
                   <div className="flex items-center gap-6">
                      {/* O Ícone agora é dinâmico! */}
                      {getWeatherIcon(weatherData.current.weather_code, 80, "drop-shadow-lg")}
                      <span className="text-7xl font-bold text-white tracking-tighter">
                        {Math.round(weatherData.current.temperature_2m)}°
                      </span>
                   </div>
                </div>
                <div className="absolute top-8 right-16 text-white/30"><Sun size={20} className="fill-white" /></div>
                <div className="absolute -bottom-10 -right-10 text-white/5"><Cloud size={200} className="fill-white" /></div>
              </div>

              {/* 4 QUADRADINHOS */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-[#1e293b] rounded-[1.5rem] p-5 flex flex-col justify-between h-36 border border-slate-700/50">
                  <span className="text-slate-400 text-sm font-medium">Feels Like</span>
                  <span className="text-4xl font-bold text-white">{Math.round(weatherData.current.apparent_temperature)}°</span>
                </div>
                <div className="bg-[#1e293b] rounded-[1.5rem] p-5 flex flex-col justify-between h-36 border border-slate-700/50">
                  <span className="text-slate-400 text-sm font-medium">Humidity</span>
                  <span className="text-4xl font-bold text-white">{weatherData.current.relative_humidity_2m}%</span>
                </div>
                <div className="bg-[#1e293b] rounded-[1.5rem] p-5 flex flex-col justify-between h-36 border border-slate-700/50">
                  <span className="text-slate-400 text-sm font-medium">Wind</span>
                  <span className="text-4xl font-bold text-white">{Math.round(weatherData.current.wind_speed_10m)} km/h</span>
                </div>
                <div className="bg-[#1e293b] rounded-[1.5rem] p-5 flex flex-col justify-between h-36 border border-slate-700/50">
                  <span className="text-slate-400 text-sm font-medium">Precipitation</span>
                  <span className="text-4xl font-bold text-white">{weatherData.current.precipitation} mm</span>
                </div>
              </div>

              {/* DAILY FORECAST (AGORA REAL!) */}
              <div className="mt-2">
                <p className="mb-4 font-bold text-lg text-white">Daily forecast</p>
                <div className="grid grid-cols-3 md:grid-cols-7 gap-3">
                  {weatherData.daily.map((dia: any, index: number) => (
                    <div key={index} className="bg-[#1e293b] rounded-3xl p-4 flex flex-col items-center justify-between h-40 border border-slate-700/50">
                      <span className="text-sm font-medium text-slate-300">{dia.day}</span>
                      {getWeatherIcon(dia.code, 32)}
                      <div className="text-sm flex gap-2">
                        <span className="font-bold text-white">{dia.max}°</span>
                        <span className="text-slate-400">{dia.min}°</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* HOURLY FORECAST (AGORA REAL!) */}
            <div className="bg-[#1e293b] rounded-[2rem] p-6 h-fit border border-slate-700/50">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-bold text-white">Hourly forecast</h2>
              </div>
              <div className="flex flex-col gap-2">
                 {weatherData.hourly.map((hora: any, index: number) => (
                   <div key={index} className="flex justify-between items-center p-3.5 hover:bg-slate-700/30 rounded-2xl transition cursor-pointer">
                      <div className="flex items-center gap-4 w-1/2">
                         {getWeatherIcon(hora.code, 24)}
                         <span className="font-semibold text-slate-300">{hora.time}</span>
                      </div>
                      <span className="font-bold text-xl text-white">{hora.temp}°</span>
                   </div>
                 ))}
              </div>
            </div>

          </main>
        )}

      </div>
    </div>
  );
}

export default App;