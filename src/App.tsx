import { MusicPlayer } from './components/MusicPlayer';
import { SnakeGame } from './components/SnakeGame';

export default function App() {
  return (
    <div className="min-h-screen bg-black text-zinc-100 flex flex-col relative overflow-hidden selection:bg-cyan-500/30">
      
      {/* Background ambient neon glow effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
         {/* Cyber grid background */}
         <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px] opacity-20 [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_30%,transparent_100%)]"></div>
         
         <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-cyan-600/20 blur-[150px] rounded-full"></div>
         <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-fuchsia-600/20 blur-[120px] rounded-full"></div>
         <div className="absolute top-[40%] right-[30%] w-[20%] h-[30%] bg-blue-600/10 blur-[100px] rounded-full"></div>
      </div>

      <main className="flex-1 flex flex-col z-10 p-6 md:p-12 h-screen max-w-7xl mx-auto w-full">
         
         <header className="mb-12 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] flex items-center gap-3">
                 <span className="text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.6)]">Neon</span> 
                 <span className="text-fuchsia-500 drop-shadow-[0_0_15px_rgba(232,121,249,0.7)]">Ops</span>
              </h1>
              <p className="mt-2 text-zinc-400 font-mono text-sm tracking-widest uppercase">System Terminal // v1.0.4</p>
            </div>
         </header>

         <div className="flex-1 grid md:grid-cols-[1fr_auto] gap-12 items-center justify-center xl:gap-24">
            
            {/* Left side / Game Window */}
            <div className="flex justify-center flex-col items-center">
               <SnakeGame />
            </div>

            {/* Right Side / Sidebar Music Player */}
            <div className="flex flex-col justify-center w-full max-w-md">
               <div className="mb-4">
                  <div className="flex items-center gap-3 mb-2">
                     <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></div>
                     <span className="font-mono text-xs uppercase tracking-widest text-zinc-500">Audio Stream Active</span>
                  </div>
                  <h2 className="text-3xl font-bold tracking-tight text-white">Neural Net Mix</h2>
                  <p className="text-zinc-400">Algorithmic soundscapes for optimal focus.</p>
               </div>
               <MusicPlayer />
               
               <div className="mt-8 border text-zinc-400 border-zinc-800 bg-black/40 rounded-xl p-6 font-mono text-xs leading-relaxed hidden lg:block">
                  <p className="text-fuchsia-400 mb-2">&gt; SYS.INFO</p>
                  <p>Initializing cybernetic environment...</p>
                  <p className="opacity-70 mt-1">- Audio engine: SOUNDHELIX AI</p>
                  <p className="opacity-70">- Game logic: X-Y COORD_SYS</p>
                  <p className="opacity-70">- Render target: SVG_GRAPHICS</p>
                  <p className="text-cyan-400 mt-2 animate-pulse">&gt; READY FOR INPUT_</p>
               </div>
            </div>

         </div>

      </main>
    </div>
  );
}
