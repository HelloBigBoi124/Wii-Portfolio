import { useState, useEffect, useRef } from 'react'
import './App.css'
import appJson from './apps.json'

function App() {

  const hoverItem = () => {
    const audio = new Audio('/sound/hover-menu-app-btn.mp3');
    audio.volume = 0.3;
    audio.play()
  }

  const zoomInApp = () => {
    const audio = new Audio('/sound/zoom-in-app.mp3');
    audio.volume = 0.3;
    audio.play();
  }

  const zoomOutApp = () => {
    const audio = new Audio('/sound/zoom-out-app.mp3');
    audio.volume = 0.3;
    audio.play();
  }

  const tooltipSound = () => {
    const audio = new Audio('/sound/hoveritem.mp3');
    audio.volume = 0.3;
    audio.play();
  }

  const clickedConfirmBtn = () => {
    const audio = new Audio('/sound/confirm-app-sound.mp3');
    audio.volume = 0.3;
    audio.play();
  }

  const playConfirm = () => {
    const audio = new Audio('/sound/safety&healthsound.mp3');
    audio.volume = 0.7;
    audio.play()
  }

  const playWiiMenuMusic = () => {
    const audio = new Audio('/sound/Wii Menu Music.mp3');
    audio.volume = 0.7;
    audio.loop = true;
    audio.play();
    audioRef.current = audio;

  };

  const appObjects = appJson

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

  const [showAppToolTip, setShowAppToolTip] = useState(null);

  const [, setIsHovered] = useState(false);
  const handleMouseEnter = (index) => {
    hoverItem()
    tooltipSound()
    setIsHovered(true)
    showToolTip(index)
  }

  const [timeoutId, setTimeoutId] = useState(null);

  const showToolTip = (index) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }

    if (index !== null) {
      const id = setTimeout(() => {
        setShowAppToolTip(index);
        setTimeoutId(null);
      }, 300);
      setTimeoutId(id);
    } else {
      setShowAppToolTip(index);
    }
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    showToolTip(null)
  }

  const appAudioRef = useRef(null);
  const audioRef = useRef(null);
  const fadeAnimationRef = useRef(null);

  const playAppMenuAudio = (index) => {
    // Reseta estado de fade
    setIsAppAudioFading(false);

    if (appAudioRef.current) {
      appAudioRef.current.pause();
      appAudioRef.current.currentTime = 0;
    }

    const audioPath = appObjects[index]?.appmenuaudio;
    if (!audioPath || audioPath === "") {
      console.log("Nenhum áudio configurado para este app");
      return;
    }

    const audio = new Audio(audioPath);
    audio.volume = 0;
    audio.loop = true;

    audio.play().catch(error => {
      console.error("Erro ao reproduzir áudio do app:", error);
    });

    appAudioRef.current = audio;

    // Delay para garantir que o áudio começou a tocar
    setTimeout(() => {
      fadeInAppAudio(500, 0.8); // Volume máximo 0.8 para evitar distorção
    }, 50);
  };

  const [isZoomed, setIsZoomed] = useState(null);
  const [cardPosition, setCardPosition] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [isAnimating, setIsAnimating] = useState(false);
  const cardRefs = useRef([]);

  const handleEnterApp = (index) => {
    hoverItem();
    playConfirm();
    zoomInApp();

    // Faz fade out da música do Wii
    fadeOutWiiMusic(500);

    // Delay para o fade out e depois toca áudio do app
    setTimeout(() => {
      playAppMenuAudio(index);
    }, 500);

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

    }, 100);
  };

  const handleCloseZoom = async () => {
    zoomOutApp();
    setIsAnimating(false);

    // Faz fade out do áudio do app
    await fadeOutAppAudio(500);

    // Para o áudio do app completamente
    if (appAudioRef.current) {
      appAudioRef.current.pause();
      appAudioRef.current.currentTime = 0;
      appAudioRef.current = null;
    }

    // Faz fade in da música do Wii Menu
    fadeInWiiMusic(500, 0.7);

    setTimeout(() => {
      setIsZoomed(null);
    }, 700);
  };

  const [isDisabled, setIsDisabled] = useState(false);
  const disableAppBtns = () => {
    setIsDisabled(true)
  }

  const [clickedEnvelopeBtn, setClickedEnvelopeBtn] = useState(false);

  const handleEnvelopeBtn = () => {
    setClickedEnvelopeBtn(true);
    setTimeout(() => {
      setClickedEnvelopeBtn(false)
    }, 60)
  }

  const [openedEnvelope, setOpenedEnvelope] = useState(false);

  const handleOpenEnvelope = () => {
    setTimeout(() => {
      !openedEnvelope ? setOpenedEnvelope(true) : setOpenedEnvelope(false)
    }, 200)
      
  }

  const [isStarting, setIsStarting] = useState(false);
  const [clickedStart, setClickedStart] = useState(false);
  const handleStartClick = (index) => {
    disableAppBtns();
    setClickedStart(true);
    clickedConfirmBtn();

    setTimeout(() => {
      setClickedStart(false);
    }, 60);

    setTimeout(() => {
      setIsStarting(true);

      // Faz fade out da música antes de redirecionar
      if (audioRef.current) {
        fadeOutWiiMusic(800);
      }

      const targetUrl = appObjects[index].url;
      if (targetUrl) {
        setTimeout(() => {
          console.log("Redirecionando agora...");
          window.location.href = targetUrl;
        }, 3000);
      } else {
        console.log("App não encontrado, reiniciando...");
        window.location.reload();
      }

    }, 2000);
  };

  const [envelopeMenu, setEnvelopeMenu] = useState(false);
  const [isEnvelopeAnimating, setIsEnvelopeAnimating] = useState(false)
  const [envelopeContent, setEnvelopeContent] = useState(null); 
  const [showEnvelope, setShowEnvelope] = useState(false);                                                    

  const changeToEnvelopeMenu = () => {
  if (!envelopeMenu) {
    // PRIMEIRO: anima os apps para cima
    setIsEnvelopeAnimating(true);
    
    // DEPOIS: mostra o envelope (após a animação dos apps)
    setTimeout(() => {
      setEnvelopeMenu(true);
      
      setTimeout(() => {
        setShowEnvelope(true);
      }, 50);
    }, 600); // 700ms = duração da transição dos apps
  } else {
    // PRIMEIRO: esconde o envelope
    setShowEnvelope(false);
    
    // DEPOIS: remove o envelope
    setTimeout(() => {
      setEnvelopeMenu(false);
      
      // FINALMENTE: traz os apps de volta
      setTimeout(() => {
        setIsEnvelopeAnimating(false);
      }, 50);
    }, 300);
  }
}


  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isFadingIn, setIsFadingIn] = useState(false);
  const [isAppAudioFading, setIsAppAudioFading] = useState(false);

  // Função para fade out da música do Wii
  // Função para fade out da música do Wii com Promise
  // Função para fade out da música do Wii com Promise e proteções
  const fadeOutWiiMusic = (duration = 1000) => {
    return new Promise((resolve) => {
      // Evita múltiplos fades simultâneos
      if (isFadingOut) {
        resolve();
        return;
      }

      if (!audioRef.current) {
        resolve();
        return;
      }

      // Cancela fade in se estiver ocorrendo
      if (fadeAnimationRef.current) {
        cancelAnimationFrame(fadeAnimationRef.current);
        setIsFadingIn(false);
      }

      setIsFadingOut(true);

      const audio = audioRef.current;
      const startVolume = Math.min(Math.max(audio.volume, 0), 1); // Garante volume entre 0 e 1
      const startTime = performance.now();

      const fade = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        let newVolume = startVolume * (1 - progress);

        // Garante que o volume fique entre 0 e 1
        newVolume = Math.min(Math.max(newVolume, 0), 1);
        audio.volume = newVolume;

        if (progress < 1 && audio.volume > 0) {
          fadeAnimationRef.current = requestAnimationFrame(fade);
        } else {
          audio.volume = 0;
          audio.pause();
          fadeAnimationRef.current = null;
          setIsFadingOut(false);
          resolve();
        }
      };

      fadeAnimationRef.current = requestAnimationFrame(fade);
    });
  };

  // Função para fade in da música do Wii com Promise e proteções
  const fadeInWiiMusic = (duration = 1000, targetVolume = 0.7) => {
    return new Promise((resolve) => {
      // Evita múltiplos fades simultâneos
      if (isFadingIn) {
        resolve();
        return;
      }

      if (!audioRef.current) {
        resolve();
        return;
      }

      // Cancela fade out se estiver ocorrendo
      if (fadeAnimationRef.current) {
        cancelAnimationFrame(fadeAnimationRef.current);
        setIsFadingOut(false);
      }

      setIsFadingIn(true);

      const audio = audioRef.current;
      const startVolume = Math.min(Math.max(audio.volume, 0), 1);
      const startTime = performance.now();

      // Garante que a música está tocando
      if (audio.paused) {
        audio.volume = 0;
        audio.play().catch(err => console.warn("Erro ao retomar música:", err));
      }

      const fade = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        let newVolume = startVolume + (targetVolume - startVolume) * progress;

        // Garante que o volume fique entre 0 e 1
        newVolume = Math.min(Math.max(newVolume, 0), targetVolume);
        audio.volume = newVolume;

        if (progress < 1 && audio.volume < targetVolume) {
          fadeAnimationRef.current = requestAnimationFrame(fade);
        } else {
          audio.volume = targetVolume;
          fadeAnimationRef.current = null;
          setIsFadingIn(false);
          resolve();
        }
      };

      fadeAnimationRef.current = requestAnimationFrame(fade);
    });
  };

  // Função para fade out do áudio do app
  const fadeOutAppAudio = (duration = 500) => {
    return new Promise((resolve) => {
      if (isAppAudioFading || !appAudioRef.current) {
        resolve();
        return;
      }

      setIsAppAudioFading(true);

      const audio = appAudioRef.current;
      const startVolume = Math.min(Math.max(audio.volume, 0), 1);
      const startTime = performance.now();

      const fade = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        let newVolume = startVolume * (1 - progress);

        // Garante volume entre 0 e 1
        newVolume = Math.min(Math.max(newVolume, 0), 1);
        audio.volume = newVolume;

        if (progress < 1 && audio.volume > 0) {
          requestAnimationFrame(fade);
        } else {
          audio.volume = 0;
          audio.pause();
          audio.currentTime = 0;
          setIsAppAudioFading(false);
          resolve();
        }
      };

      requestAnimationFrame(fade);
    });
  };

  // Função para fade in do áudio do app
  const fadeInAppAudio = (duration = 500, targetVolume = 1) => {
    return new Promise((resolve) => {
      if (isAppAudioFading || !appAudioRef.current) {
        resolve();
        return;
      }

      setIsAppAudioFading(true);

      const audio = appAudioRef.current;
      const startVolume = Math.min(Math.max(audio.volume, 0), 1);
      const startTime = performance.now();

      if (audio.paused) {
        audio.volume = 0;
        audio.play().catch(err => console.warn("Erro ao tocar áudio do app:", err));
      }

      const fade = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        let newVolume = startVolume + (targetVolume - startVolume) * progress;

        // Garante volume entre 0 e targetVolume
        newVolume = Math.min(Math.max(newVolume, 0), targetVolume);
        audio.volume = newVolume;

        if (progress < 1 && audio.volume < targetVolume) {
          requestAnimationFrame(fade);
        } else {
          audio.volume = targetVolume;
          setIsAppAudioFading(false);
          resolve();
        }
      };

      requestAnimationFrame(fade);
    });
  };

  useEffect(() => {
    return () => {
      // Limpa todas as animações ao desmontar o componente
      if (fadeAnimationRef.current) {
        cancelAnimationFrame(fadeAnimationRef.current);
      }
    };
  }, []);
  return (
    <>
      {showWarning && (
        <div id="warning-screen" className={`w-screen min-h-screen bg-black select-none flex flex-col justify-center items-center gap-9 transition-opacity duration-400 ease-out ${fadeOut ? 'opacity-0' : 'opacity-100'} cursor-none`}>
          <h1 className="text-white flex flex-row justify-center items-center text-3xl font-bold ">
            <svg className="fill-current" xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" class="bi bi-exclamation-triangle-fill" viewBox="0 0 16 16">
              <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5m.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2" />
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
          <div className={` w-screen min-h-screen`}>
            <div className={`${!envelopeMenu ? 'relative z-10' : 'relative z-0'} ${isEnvelopeAnimating ? '-translate-y-full' : 'translate-y-0'} border-b-3 border-blue-400 transition-all duration-600 bg-[repeating-linear-gradient(0deg,_#fff,_#fff_1px,_transparent_1px,_transparent_5px)]`}>
            <section className={`flex justify-center wii-cursor`}>
              <div className="grid grid-cols-4 gap-2 mt-10 cards-container">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="wrapper relative">
                    <div
                      style={{
                        backgroundImage: `url(${appObjects[i].gifappbox})`
                      }}
                      ref={el => cardRefs.current[i] = el}
                      onClick={() => handleEnterApp(i)}
                      onMouseEnter={() => handleMouseEnter(i)}
                      onMouseLeave={() => handleMouseLeave(i)}
                      className="w-[280px] h-[150px] bg-white border-[3px] border-gray-400 rounded-3xl hover:border-blue-400 hover:shadow-[0_0_10px_rgba(59,130,246,0.7)] transition-all duration-300"
                    >
                      {appObjects[i]?.gifappbox && (
                        <img
                          src={appObjects[i].gifappbox}
                          alt={`App ${i + 1}`}
                          className="w-full h-full object-cover rounded-3xl"
                        />
                      )}



                    </div>
                    {(
                      <div
                        className={`${showAppToolTip === i
                          ? 'opacity-100 scale-110 translate-y-0 z-10'
                          : 'opacity-0 scale-100 pointer-events-none z-0'
                          } transition-all absolute  left-1/2 transform -translate-x-1/2 top-[160px] w-[280px] min-h-[50px] flex justify-center items-center bg-white border-2 border-gray-400 py-1 px-3 rounded-full text-2xl font-semibold`}

                      >
                        <span className="text-gray-500">{appObjects[i].appboxname}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            <section>
              <div className={`flex justify-center items-end wii-cursor`}>
                <h1 className="text-8xl clock font-bold tracking-widest">{time}</h1>
                <p className="text-4xl font-semibold tracking-wider mx-5">{period}</p>
              </div>
            </section>
                </div>

            {envelopeMenu && (
              <div className="fixed inset-0 z-50 w-screen h-135 bg-gray-300 flex justify-center  transition-all duration-500">
                <img 
                  onClick={() => handleOpenEnvelope()}
                  className={`
                  ${showEnvelope ? 'animate-[bounce_0.5s_ease-out] hover:scale-110 scale-100' : 'scale-0'} 
                  object-cover fixed bg-white rounded-xs w-[200px] h-[135px] top-[calc(50vh-75px)] shadow-2xl transform transition-all duration-200`}
                  src="/src/assets/wiimessageboardassets/envelopecenter.png">
                </img>
                <div className={`fixed ${openedEnvelope ? 'h-screen w-[300px] z-100 border-2 border-white' : 'h-0 w-0 z-0'} transition-all duration-300 ease-in-out   bg-gray-300`}>
                  
                </div>
              </div>
            )}
            
            <section>
              <div className={`${isEnvelopeAnimating ? 'inset-shadow-none' : 'inset-shadow-sm'} transition-all bg-gray-300 h-screen flex justify-between  wii-cursor`}>
                <div className={`
                  ${openedEnvelope ? '-translate-x-150' : '-translate-x-50'}
                  ${isEnvelopeAnimating  ? '-rotate-180 -translate-x-50' : 'rotate-0 -translate-x-80'} 
                  inset-shadow-sm w-lg transition-all duration-350 bg-gray-300 border-4 border-gray-400 rounded-full  h-40 p-5 flex justify-between text-center translate-y-6`}>
                  <div className={`flex grid-row gap-2 translate-x-6 translate-y-[37px]`}>
                    <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} className={` rotate-180 ease-in-out rounded-full bg-gray-200 border-4 border-blue-400 w-30 h-30 flex justify-center items-center  text-4xl shadow-2xl   hover:border-blue-400 hover:shadow-[0_0_10px_rgba(59,130,246,0.7)] transition-all duration-300 hover:scale-110`}>
                      <img className={`rounded-sm size-17`} src="src/assets/calendarbtn.png" alt="calendar-button"></img>
                    </div>
                    <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} className={` rotate-180 ease-in-out rounded-full bg-gray-200 border-4 border-blue-400 w-30 h-30 flex justify-center items-center  text-4xl shadow-2xl   hover:border-blue-400 hover:shadow-[0_0_10px_rgba(59,130,246,0.7)] transition-all duration-300 hover:scale-110`}>
                      <img className={`rounded-sm size-15 h-20 -translate-y-1`} src="/src/assets/notepad.png" alt="calendar-button"></img>
                    </div>
                  </div>
                  <div onClick={() => {
                    clickedConfirmBtn()
                  }} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} className="text-gray-400 rounded-full bg-gray-200 border-4 border-blue-400 w-30 h-30 flex justify-center items-center font-semibold text-4xl shadow-2xl -translate-x-6 hover:border-blue-400 hover:shadow-[0_0_10px_rgba(59,130,246,0.7)] transition-all duration-300 hover:scale-110">Wii</div>
                </div>
                <div className={`
                  ${openedEnvelope ? '-translate-x-50' : '-translate-x-150'}
                  ${isEnvelopeAnimating && openedEnvelope ? '' : ''} 
                  absolute inset-shadow-sm w-lg transition-all duration-350 bg-gray-300 border-4 border-gray-400 rounded-full  h-40 p-5 flex justify-between text-center translate-y-6`}>
                  <div className={`flex justify-end -translate-x-6 w-full`}>
                    <div
                      onClick={() => {
                        handleOpenEnvelope()
                        clickedConfirmBtn()
                      }}
                      onMouseEnter={handleMouseEnter} 
                      onMouseLeave={handleMouseLeave} 
                      className={`text-gray-600 font-semibold ease-in-out rounded-full bg-gray-200 border-4 border-blue-400 w-50 h-30 flex justify-center items-center  text-4xl shadow-2xl   hover:border-blue-400 hover:shadow-[0_0_10px_rgba(59,130,246,0.7)] transition-all duration-300 hover:scale-110`}>
                      Back
                    </div>
                  </div>
                  
                </div>
                <h1 className="text-gray-500 font-semibold text-5xl mt-2 -translate-x-15">{dayWeek} {month}/{date}</h1>
                <div className={`${openedEnvelope ? 'translate-x-150' : 'translate-x-50 '} transition-all duration-350 translate-y-6`}>
                  <div className={`
                    
                    ${isEnvelopeAnimating ? 'rotate-180' : 'rotate-0'} 
                    inset-shadow-sm transition-all duration-500 bg-gray-300 border-4 border-gray-400 rounded-full w-sm h-40 p-5 flex justify-between text-center`}>
                    <div
  onClick={() => {
    changeToEnvelopeMenu();
    clickedConfirmBtn();
    handleEnvelopeBtn();
  }}
  onMouseEnter={handleMouseEnter}
  onMouseLeave={handleMouseLeave}
  style={{
    transition: clickedEnvelopeBtn ? 'none' : 'all 100ms',
  }}
  className={`
  ${clickedEnvelopeBtn ? 'bg-white text-white border-white scale-90': 'bg-gray-200 border-blue-400 scale-100 hover:scale-110' } 
  transition-border rounded-full border-4 w-30 h-30 flex justify-center items-center font-semibold text-5xl shadow-2xl translate-x-6  hover:shadow-[0_0_10px_rgba(59,130,246,0.7)] `}
>
                      <svg className="fill-current" xmlns="http://www.w3.org/2000/svg" width="70" height="70" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414zM0 4.697v7.104l5.803-3.558zM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586zm3.436-.586L16 11.801V4.697z" />
                      </svg>
                    </div>
                    <div onClick={() => {
                        changeToEnvelopeMenu()
                        clickedConfirmBtn()
                        handleEnvelopeBtn();
                      }} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} 
                      style={{
                        transition: clickedEnvelopeBtn ? 'none' : 'all 100ms',
                      }}
                      className={`${clickedEnvelopeBtn ? 'bg-white text-white border-white scale-90': 'bg-gray-200 border-blue-400 scale-100 hover:scale-110'} transition-border rotate-180 ease-in-out rounded-full border-4 w-30 h-30 flex justify-center items-center  text-4xl shadow-2xl -translate-x-6 translate-y-[37px] hover:shadow-[0_0_10px_rgba(59,130,246,0.7)]`}>
                      <span className={`${clickedEnvelopeBtn ? 'bg-white text-white': 'bg-gray-400 text-gray-300'}   rounded-xl font-semibold !py-2 !px-3`}>Wii</span>
                    </div>
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
            className={`fixed bg-gray-200  overflow-hidden wii-cursor select-none mx-5 transition-all transition-border ${isAnimating ? 'duration-700 ease-in-out border-black' : 'duration-500 ease-out border-gray-400'
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
              {/* Área da imagem - vai preencher TODO espaço disponível */}
              <div className="flex-1 relative min-h-0">
                <img
                  src={appObjects[isZoomed]?.gifappmenu}
                  alt={`App ${isZoomed + 1}`}
                  className="absolute inset-0 w-full h-full object-cover rounded-t-3xl"
                />
              </div>

              {/* Botões fixos na parte inferior */}
              {isAnimating && (
                <div className="flex-shrink-0 wii-cursor w-full border-t-4 border-blue-400 bg-[repeating-linear-gradient(0deg,_#fff,_#fff_1px,_transparent_1px,_transparent_5px)] min-h-[200px]">
                  <div className="flex justify-center gap-14 items-center w-full h-full">
                    <button
                      onClick={handleCloseZoom}
                      className="wii-cursor min-w-sm min-h-[100px] bg-gray-300 text-gray-700 rounded-full transition-all font-semibold text-4xl hover:scale-110 border-2 border-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.7)] transition-all duration-150"
                      onMouseEnter={tooltipSound}
                      disabled={isDisabled}
                    >
                      Wii Menu
                    </button>
                    <button
                      className={`${clickedStart ? 'duration-50 bg-white text-white hover:scale-100 border-white ease-out' : 'duration-150 bg-gray-300 text-gray-600 border-blue-400 hover:scale-110 ease-out'} wii-cursor min-w-sm min-h-[100px]  rounded-full transition-all font-semibold text-4xl border-2 shadow-[0_0_10px_rgba(59,130,246,0.7)] transition-all `}
                      onMouseEnter={tooltipSound}
                      onClick={() => handleStartClick(isZoomed)}
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