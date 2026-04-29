import { useState, useEffect, useCallback, useRef } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Music } from 'lucide-react';

const TRACKS = [
  {
    id: 1,
    title: 'Cyberpunk Matrix',
    artist: 'AI System Alpha',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    color: 'from-cyan-500 to-blue-500',
    neonColor: 'shadow-cyan-500/50',
  },
  {
    id: 2,
    title: 'Neon Drift Data',
    artist: 'AI System Beta',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    color: 'from-fuchsia-500 to-purple-500',
    neonColor: 'shadow-fuchsia-500/50',
  },
  {
    id: 3,
    title: 'Synthetic Dreams',
    artist: 'AI System Delta',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    color: 'from-emerald-500 to-green-500',
    neonColor: 'shadow-emerald-500/50',
  },
];

export function MusicPlayer() {
  const [currentTrackIdx, setCurrentTrackIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = TRACKS[currentTrackIdx];

  // Handle Play/Pause
  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play().catch(() => setIsPlaying(false));
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying, currentTrackIdx]);

  // Handle Mute
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  const toggleMute = () => setIsMuted(!isMuted);

  const skipForward = () => {
    setCurrentTrackIdx((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const skipBack = () => {
    setCurrentTrackIdx((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const handleEnded = () => skipForward();

  return (
    <div className={`p-6 rounded-2xl bg-zinc-900/80 backdrop-blur-md border border-zinc-800 shadow-[0_0_30px_rgba(0,0,0,0)] transition-all duration-700 hover:${currentTrack.neonColor}`}>
      <audio 
        ref={audioRef} 
        src={currentTrack.url} 
        onEnded={handleEnded}
      />
      
      <div className="flex items-center gap-6">
        {/* Album Art Placeholder */}
        <div className={`w-20 h-20 rounded-xl flex items-center justify-center bg-gradient-to-br ${currentTrack.color} shadow-lg ${isPlaying ? 'animate-pulse' : ''} ${currentTrack.neonColor} overflow-hidden relative`}>
           <div className="absolute inset-0 bg-white/10 mix-blend-overlay"></div>
           <Music className="w-8 h-8 text-white drop-shadow-md" />
        </div>

        {/* Track Info */}
        <div className="flex-1">
          <h3 className="text-xl font-bold text-white tracking-wider font-mono">
            {currentTrack.title}
          </h3>
          <p className="text-zinc-400 font-mono text-sm tracking-widest uppercase mt-1">
            {currentTrack.artist}
          </p>
          
          {/* Visualizer Bar */}
          <div className="h-1.5 w-full bg-zinc-800 rounded-full mt-4 overflow-hidden flex gap-1">
             <div className={`h-full w-1/3 bg-gradient-to-r ${currentTrack.color} ${isPlaying ? 'animate-[translate_2s_linear_infinite]' : ''}`} />
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4">
          <button 
            onClick={skipBack}
            className="p-3 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-zinc-600"
          >
            <SkipBack className="w-6 h-6" />
          </button>
          
          <button 
            onClick={togglePlay}
            className={`p-4 rounded-full bg-gradient-to-br ${currentTrack.color} text-white shadow-lg ${currentTrack.neonColor} hover:scale-105 transition-all focus:outline-none active:scale-95`}
          >
            {isPlaying ? <Pause className="w-7 h-7" fill="currentColor" /> : <Play className="w-7 h-7" fill="currentColor" className="ml-1" />}
          </button>

          <button 
            onClick={skipForward}
            className="p-3 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-zinc-600"
          >
            <SkipForward className="w-6 h-6" />
          </button>

          <div className="w-px h-8 bg-zinc-800 mx-2"></div>

          <button 
            onClick={toggleMute}
            className="p-3 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-zinc-600"
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  );
}
