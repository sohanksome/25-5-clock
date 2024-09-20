import { useEffect, useState } from 'react'
import './App.css'

function App() {

  const [sessionLength, setSessionLength] = useState(25);
  const [breakLength, setBreakLength] = useState(5);
  const [start, setStart] = useState(false);
  const [time, setTime] = useState(25 * 60);
  const [isSession, setIsSession] = useState(true);
  
  const handleButton = (event) =>{
    const value = event.target.value;
    let newTime;
    if(!start){
      switch (value) {
        case 'break-decrease':

          setBreakLength(prev => Math.max(1, prev - 1));
          break;
        
        case 'break-increase':
          setBreakLength(prev => Math.min(60, prev + 1));
          break;
  
        case 'session-increase':
          newTime = Math.min(60, sessionLength + 1);
          setSessionLength(newTime);
          setTime(newTime * 60);
          break;
  
        case 'session-decrease':
          newTime = Math.max(1, sessionLength - 1);
          setSessionLength(newTime);
          setTime(newTime * 60);
          break;
  
        default:
          break;
      }
    }else{
      return;
    }
  }

  const timeControl = (event) => {
    const value = event.target.value;
    const BeepSound = document.getElementById('beep');
    switch (value) {
      case 'start-stop':
        setStart(prev => !prev);
        break;

      case 'reset':
        setTime(25 * 60);
        setBreakLength(5);
        setSessionLength(25);
        setStart(false);
        setIsSession(true);
        BeepSound.pause();
        BeepSound.currentTime = 0;
        break;

      default:
        break;
    }
  }

  const convertTime = (time) => {
    const min = Math.floor(time / 60);
    const sec = time % 60;
    return `${min === 60 ? '60' : (min < 10 ? '0' + min : min)}:${sec < 10 ? '0' + sec : sec}`;
  }

  useEffect(() => {
    let interval = null;
    if(start){
      const BeepSound = document.getElementById('beep');
      interval = setInterval(() => {
        setTime(prevTime => {
          if(prevTime <= 0){
            BeepSound.play();
            
            if(isSession){
              setIsSession(false);
              return breakLength * 60;
            }else{
              setIsSession(true);
              return sessionLength * 60;
            }
         }
         return prevTime - 1;
        });
      }, 1000);
    }else if(!start && time !== 0){
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [start, time, isSession]);

  

  return (
    <>
      <h1 id='title'>25+5clock</h1>   
      <div id='title-container'>
        <div id='subcontainer-1' className='subcontainer'>
          <p id='break-label'>Break Length</p>
          <div id='button-container-1' className='button-container'>
            <button id='break-decrement' value='break-decrease' onClick={handleButton} disabled={start}>down</button>
            <p id='break-length'>{breakLength}</p>
            <button id='break-increment' value='break-increase' onClick={handleButton} disabled={start}>up</button>
          </div>
        </div>
        <div id='subcontainer-2' className='subcontainer'>
          <p id='session-label'>Session Length</p>
          <div id='button-container-2' className='button-container'>
            <button id='session-decrement' value='session-decrease' onClick={handleButton} disabled={start}>down</button>
            <p id='session-length'>{sessionLength}</p>
            <button id='session-increment' value='session-increase' onClick={handleButton} disabled={start}>up</button>
          </div>
        </div>
      </div>
      <div id='session'>
        <h2 id='timer-label'>{isSession ? 'Session' : 'Break'}</h2>
        <h1 id='time-left'>{convertTime(time)}</h1>
      </div>
      <div id='time-control'>
        <button id='start_stop' value='start-stop' onClick={timeControl}>start/stop</button>
        <button id='reset' value='reset' onClick={timeControl}>reset</button>
        <audio id="beep" src="https://cdn.freecodecamp.org/testable-projects-fcc/audio/BeepSound.wav"></audio> 
      </div>
    </>
  )
}

export default App
