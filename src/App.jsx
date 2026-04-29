import { useState, useEffect, useRef } from 'react'
import './App.css'

function App() {

  const hoverItem = () => {
    const audio = new Audio('/src/sound/hoveritem.mp3');
    audio.volume = 0.3;
    audio.play()
  }

  const playConfirm = () => {
    const audio = new Audio('/src/sound/safety&healthsound.mp3');
    audio.volume = 0.7;
    audio.play()
  }

  const playWiiMenuMusic = () => {
    const audio = new Audio('/src/sound/Wii Menu Music.mp3');
    audio.volume = 0.3
    audio.loop = true
    audio.play();
  };

  const [setIsHovered] = useState(false);
  const handleMouseEnter = () => {
    hoverItem()
    setIsHovered(true)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
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
      const daysOfWeek = ["Sun", "Mon", "Thu", "Wed", "Tue", "Fri", "Sat"];
      let currentDayWeek = String(today.getDay());
      let currentDate = String(today.getDate());
      let currentMonth = String(today.getMonth());
      setDayWeek(`${daysOfWeek[currentDayWeek]}`);
      setMonth(`${currentMonth}`);
      setDate(`${currentDate}`);
    }
  
    updateTime(); // atualiza imediatamente
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

        } else {
          window.removeEventListener("keydown", handleKeyDown);
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
          <a href="www.nintendo.com/healthsafety/" className="">www.nintendo.com/healthsafety/</a>
        </p>
        <h2 className={`text-white flex flex-row justify-center items-center text-2xl font-semibold mb-5 ${fadeOut ? 'animate-none' : 'animate-pulse'}`}>Press SPACE to continue.</h2>
      </div>
      )}
      {!showWarning && (
      <div className={`w-screen min-h-screen bg-gray-300 wii-cursor select-none transition-opacity duration-300 fade-in`}>
        <div className="w-screen min-h-screen bg-[repeating-linear-gradient(0deg,_#fff,_#fff_1px,_transparent_1px,_transparent_5px)]">
          <section className="flex justify-center">
            <div className="grid grid-cols-4 gap-2 mt-10 cards-container">
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  id="item" onClick={playConfirm} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} className="w-[280px] h-[150px] bg-white border-[3px] border-gray-400 rounded-3xl hover:border-blue-400 hover:shadow-[0_0_10px_rgba(59,130,246,0.7)] transition-all duration-300"
                />
              ))}
            </div>
            
          </section>
          <section>
            <div className="flex justify-center items-end">
              <h1 className="text-8xl clock font-bold tracking-widest">{time}</h1>
              <p className="text-4xl font-semibold tracking-wider mx-5">{period}</p>
            </div>

          </section>
          <section>
            <div className="bg-gray-300 border-t-3 border-blue-400 h-screen flex justify-between inset-shadow-sm">
              <div className="bg-gray-300 border-4 border-gray-400 rounded-full w-sm h-40 p-5 flex justify-end -translate-x-50 text-center translate-y-6">
                <div id="item" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} className="rounded-full bg-gray-300 border-4 border-blue-400 w-30 h-30 flex justify-center items-center font-semibold text-4xl shadow-2xl -translate-x-6 hover:border-blue-400 hover:shadow-[0_0_10px_rgba(59,130,246,0.7)] transition-all duration-300 hover:scale-110">Wii</div>
              </div>
              <h1 className="text-gray-500 font-semibold text-5xl mt-2">{dayWeek} {month}/{date}</h1>
              <div className="bg-gray-300 border-4 border-gray-400 rounded-full w-sm h-40 p-5 flex justify-start translate-x-50 text-center translate-y-6">
                <div id="item" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} className="rounded-full bg-gray-300 border-4 border-blue-400 w-30 h-30 flex justify-center items-center font-semibold text-5xl shadow-2xl translate-x-6 hover:border-blue-400 hover:shadow-[0_0_10px_rgba(59,130,246,0.7)] transition-all duration-300 hover:scale-110">
                  <svg class="fill-current" xmlns="http://www.w3.org/2000/svg" width="70" height="70" fill="currentColor" class="bi bi-envelope-fill" viewBox="0 0 16 16">
                    <path d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414zM0 4.697v7.104l5.803-3.558zM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586zm3.436-.586L16 11.801V4.697z" />
                  </svg>
                </div>
              </div>
            </div>
          </section>
          <div className="w-screen">
  {/* <svg className="w-screen h-70" xmlns="http://www.w3.org/2000/svg">
  <rect className="w-screen h-70 fill-gray-300" x="0" y="10" fill="white" />
</svg> */}
{/* <svg
  viewBox="0 0 100 100"
  className="w-full h-[1500px]"
  xmlns="http://www.w3.org/2000/svg"
>
  <path
    className="fill-none stroke-black"
    d="M 0.209 80.637 L 18.15 80.687 C 18.15 80.687 21.098 80.637 24.397 82.986 C 27.696 85.335 29.244 85.785 29.244 85.785 C 29.244 85.785 31.393 86.784 36.341 86.485 C 41.289 86.186 52.283 86.934 53.832 86.585 C 55.381 86.236 66.875 86.385 66.875 86.385 C 66.875 86.385 69.524 86.684 73.472 84.336 C 77.42 81.988 75.021 81.987 81.668 80.637 C 88.315 79.287 96.611 80.488 99.409 80.438"
  />
</svg> */}

</div>
        </div>
      </div> )}
    </>
  )
}

export default App

