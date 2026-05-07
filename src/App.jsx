import { useState, useEffect, useRef } from 'react'
import './App.css'

function App() {

  const hoverItem = () => {
    const audio = new Audio('/public/sound/hoveritem.mp3');
    audio.volume = 0.3;
    audio.play()
  }

  const zoomInApp = () => {
    const audio = new Audio('/public/sound/zoom-in-app.mp3');
    audio.volume = 0.3;
    audio.play();
  }

  const zoomOutApp = () => {
    const audio = new Audio('/public/sound/zoom-out-app.mp3');
    audio.volume = 0.3;
    audio.play();
  }

  const hoverBtnMenuApp = () => {
    const audio = new Audio('/public/sound/hover-menu-app-btn.mp3');
    audio.volume = 0.3;
    audio.play();
  }

  const clickedStartBtn = () => {
    const audio = new Audio('/public/sound/start-app-sound.mp3');
    audio.volume = 0.3;
    audio.play();
  }

  const playConfirm = () => {
    const audio = new Audio('/public/sound/safety&healthsound.mp3');
    audio.volume = 0.7;
    audio.play()
  }

  
  const [, setIsHovered] = useState(false);
  const handleMouseEnter = () => {
    hoverItem()
    setIsHovered(true)
  }
  
  const handleMouseLeave = () => {
    setIsHovered(false)
  }
  
  const [isDisabled, setIsDisabled] = useState(false);
  const disableAppBtns = () => {
    setIsDisabled(true)
  }
  
  const [isStarting, setIsStarting] = useState(false);
  const [clickedStart, setClickedStart] = useState(false);
  const handleStartClick = () => {
    disableAppBtns()
    setClickedStart(true)
    clickedStartBtn()
    
    
    
    setTimeout(() => {
      setClickedStart(false)
    }, 60)
    
    setTimeout(() => {
      setIsStarting(true)
      fadeOutMusic(800)
    }, 2000)
  }

const audioRef = useRef(null);
const fadeAnimationRef = useRef(null);

const playWiiMenuMusic = () => {
  const audio = new Audio('/public/sound/Wii Menu Music.mp3');
  audio.volume = 0.3;
  audio.loop = true;
  audio.play();
  audioRef.current = audio;
};

const fadeOutMusic = (duration = 1000) => {
  if (!audioRef.current) return;
  
  // Cancela qualquer fade anterior
  if (fadeAnimationRef.current) {
    cancelAnimationFrame(fadeAnimationRef.current);
  }
  
  const audio = audioRef.current;
  const startVolume = audio.volume;
  const startTime = performance.now();
  
  const fade = (currentTime) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1); // 0 a 1
    const newVolume = startVolume * (1 - progress);
    
    audio.volume = newVolume;
    
    if (progress < 1) {
      // Continua o fade
      fadeAnimationRef.current = requestAnimationFrame(fade);
    } else {
      // Fade completo
      audio.volume = 0;
      if (!audio.loop) {
        audio.pause();
        audio.currentTime = 0;
      }
      fadeAnimationRef.current = null;
    }
  };
  
  fadeAnimationRef.current = requestAnimationFrame(fade);
};

  const [isZoomed, setIsZoomed] = useState(null);
  const [cardPosition, setCardPosition] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [isAnimating, setIsAnimating] = useState(false);
  const cardRefs = useRef([]);

  const handleEnterApp = (index) => {
    hoverItem();
    playConfirm();
    zoomInApp();

    setTimeout(() => {
      const rect = cardRefs.current[index].getBoundingClientRect();
      setCardPosition({
        x: rect.left,
        y: rect.top,
        width: rect.width,
        height: rect.height,
      });

      setIsZoomed(index);

      setTimeout(() => {
        setIsAnimating(true);
      }, 10);

    }, 100)
  }

  const handleCloseZoom = () => {
    zoomOutApp();
    setIsAnimating(false);
    setTimeout(() => {
      setIsZoomed(null);
    }, 700);
  }

  const [time, setTime] = useState("");
  const [period, setPeriod] = useState("");
  const [dayWeek, setDayWeek] = useState("");
  const [date, setDate] = useState("");
  const [month, setMonth] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();

      let hours = now.getHours();
      const minutes = String(now.getMinutes()).padStart(2, "0");

      const currentPeriod = hours >= 12 ? "PM" : "AM";

      hours = hours % 12 || 12;
      hours = String(hours).padStart(2);

      setTime(`${hours}:${minutes}`);
      setPeriod(currentPeriod);
    };

    const updateDate = () => {
      const today = new Date();
      const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      let currentDayWeek = today.getDay();
      let currentDate = String(today.getDate());
      let currentMonth = String(today.getMonth() + 1);
      setDayWeek(`${daysOfWeek[currentDayWeek]}`);
      setMonth(`${currentMonth}`);
      setDate(`${currentDate}`);
    }
  
    updateTime();
    updateDate();

    const timer = setInterval(updateTime, 1000);

    return () => clearInterval(timer);
  }, []);

  const [showWarning, setShowWarning] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const userReaded = useRef(false);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.code === "Space" && !userReaded.current) {
          userReaded.current = true
          playConfirm();
          setTimeout(() => {
            setFadeOut(true)
            setTimeout(() => {
              setShowWarning(false);
              playWiiMenuMusic();
            }, 2000)
          }, 2000)
        }
      }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <>
      {showWarning && (
        <div id="warning-screen" className={`w-screen min-h-screen bg-black select-none flex flex-col justify-center items-center gap-9 transition-opacity duration-400 ease-out ${fadeOut ? 'opacity-0' : 'opacity-100'} cursor-none`}>
          <h1 className="text-white flex flex-row justify-center items-center text-3xl font-bold ">
            <svg className="fill-current" xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" class="bi bi-exclamation-triangle-fill" viewBox="0 0 16 16">
              <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5m.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
            </svg>
            WARNING-HEALTH AND SAFETY
          </h1>
          <p className="text-white flex flex-row justify-center items-center text-2xl font-semibold wrap-break-word w-lg my-5">
            BEFORE PLAYING, READ YOUR OPERATIONS<br />MANUAL FOR IMPORTANT INFORMATION<br />ABOUT YOUR HEALTH AND SAFETY.
          </p>
          <p className="text-white flex flex-col justify-center items-center text-lg font-semibold wrap-break-word w-lg">
            also online at<br />
            <a className="cursor-none">www.nintendo.com/healthsafety/</a>
          </p>
          <h2 className={`text-white flex flex-row justify-center items-center text-2xl font-semibold mb-5 ${fadeOut ? 'animate-none' : 'animate-pulse'}`}>Press SPACE to continue.</h2>
        </div>
      )}
      
      {!showWarning && (
        <div className={`w-screen min-h-screen bg-gray-300 wii-cursor select-none transition-opacity duration-300 fade-in`}>
          <div className="w-screen min-h-screen bg-[repeating-linear-gradient(0deg,_#fff,_#fff_1px,_transparent_1px,_transparent_5px)]">
            <section className="flex justify-center wii-cursor">
              <div className="grid grid-cols-4 gap-2 mt-10 cards-container">
                {[...Array(12)].map((_, i) => (
                  <div
                    key={i}
                    ref={el => cardRefs.current[i] = el}
                    onClick={() => handleEnterApp(i)}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    className="w-[280px] h-[150px] bg-white border-[3px] border-gray-400 rounded-3xl hover:border-blue-400 hover:shadow-[0_0_10px_rgba(59,130,246,0.7)] transition-all duration-300"
                  >
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-gray-300 font-semibold text-3xl">Wii {i + 1}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
            
            <section>
              <div className="flex justify-center items-end wii-cursor">
                <h1 className="text-8xl clock font-bold tracking-widest">{time}</h1>
                <p className="text-4xl font-semibold tracking-wider mx-5">{period}</p>
              </div>
            </section>
            
            <section>
              <div className="bg-gray-300 border-t-3 border-blue-400 h-screen flex justify-between inset-shadow-sm wii-cursor">
                <div className="bg-gray-300 border-4 border-gray-400 rounded-full w-sm h-40 p-5 flex justify-end -translate-x-50 text-center translate-y-6">
                  <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} className="rounded-full bg-gray-300 border-4 border-blue-400 w-30 h-30 flex justify-center items-center font-semibold text-4xl shadow-2xl -translate-x-6 hover:border-blue-400 hover:shadow-[0_0_10px_rgba(59,130,246,0.7)] transition-all duration-300 hover:scale-110">Wii</div>
                </div>
                <h1 className="text-gray-500 font-semibold text-5xl mt-2">{dayWeek} {month}/{date}</h1>
                <div className="bg-gray-300 border-4 border-gray-400 rounded-full w-sm h-40 p-5 flex justify-start translate-x-50 text-center translate-y-6">
                  <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} className="rounded-full bg-gray-300 border-4 border-blue-400 w-30 h-30 flex justify-center items-center font-semibold text-5xl shadow-2xl translate-x-6 hover:border-blue-400 hover:shadow-[0_0_10px_rgba(59,130,246,0.7)] transition-all duration-300 hover:scale-110">
                    <svg className="fill-current" xmlns="http://www.w3.org/2000/svg" width="70" height="70" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414zM0 4.697v7.104l5.803-3.558zM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586zm3.436-.586L16 11.801V4.697z" />
                    </svg>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      )}

      {/* Card em Zoom - Cópia que aparece quando clica */}
      {isZoomed !== null && (
        <>
          {/* Overlay de fundo */}
          <div 
            className={`wii-cursor select-none fixed inset-0 bg-black transition-all duration-1000 ease-out`} style={{ 
              zIndex: 999,
              opacity: isAnimating ? 1 : 0,
            }}
          />
          
          {/* Card clonado com animação */}
          <div
            className={`fixed bg-gray-200  overflow-hidden wii-cursor select-none mx-5 transition-all transition-border ${
    isAnimating ? 'duration-700 ease-in-out border-black' : 'duration-500 ease-out border-gray-400'
  }`}
            style={{
              top: isAnimating ? 0 : cardPosition.y,
              left: isAnimating ? 0 : cardPosition.x,
              width: isAnimating ? '100vw' : cardPosition.width,
              height: isAnimating ? '100vh' : cardPosition.height,
              borderRadius: isAnimating ? '100px 100px 140px 140px / 120px 120px 160px 160px' : '24px',
              borderWidth: isAnimating ? '7px' : '3px',
              zIndex: 1000
            }}
            onClick={(e) => e.stopPropagation()}
          >
            
  

            {/* Conteúdo do card */}
<div className="w-full h-full flex flex-col">
  {/* Conteúdo principal - centralizado e ocupando o espaço disponível */}
  <div className="flex-1 flex items-center justify-center">
    <div className="text-center">
      <span className="text-gray-500 font-semibold text-3xl">
        Wii {isZoomed + 1}
      </span>
      
      {/* Conteúdo extra que aparece no zoom */}
      {isAnimating && (
        <div className="mt-8 p-8 animate-fade-in">
          <h2 className="text-4xl font-bold mb-4 text-gray-800">
            Wii Channel {isZoomed + 1}
          </h2>
          <p className="text-gray-600 text-xl">
            Conteúdo do canal {isZoomed + 1}
          </p>
        </div>
      )}
    </div>
  </div>
  
  {/* Botões fixos na parte inferior */}
  {isAnimating && (
  <div className="wii-cursor w-full border-t-4 border-blue-400 bg-[repeating-linear-gradient(0deg,_#fff,_#fff_1px,_transparent_1px,_transparent_5px)] min-h-[200px]">
    <div className="flex justify-center gap-14 items-center w-full h-full">
      <button 
        onClick={handleCloseZoom}
        className="wii-cursor min-w-sm min-h-[100px] bg-gray-300 text-gray-700 rounded-full transition-all font-semibold text-4xl hover:scale-110 border-2 border-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.7)] transition-all duration-150"
        onMouseEnter={hoverBtnMenuApp}
        disabled={isDisabled}
      >
        Wii Menu
      </button>
      <button 
        className={`${clickedStart ? 'duration-50 bg-white text-white hover:scale-100 border-white ease-out' : 'duration-150 bg-gray-300 text-gray-600 border-blue-400 hover:scale-110 ease-out'} wii-cursor min-w-sm min-h-[100px]  rounded-full transition-all font-semibold text-4xl border-2 shadow-[0_0_10px_rgba(59,130,246,0.7)] transition-all `}
        onMouseEnter={hoverBtnMenuApp}
        onClick={handleStartClick}
        disabled={isDisabled}
      >
        Start
      </button>
    </div>
  </div>
)}
</div>
          </div>
        </>
      )}

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>

      {isStarting && (
        <div 
          className="fixed inset-0 bg-black cursor-none"
          style={{ 
            zIndex: 10000,
            animation: 'fadeIn 0.3s ease-out forwards'
          }}
        />
      )}
    </>
  )
}

export default App