import { useState, useEffect, useRef, useCallback } from 'react'
import './assets/css/style.min.css'

function App() {
  const [elapsedTime, setElapsedTime] = useState(0)
  const [run, setRun] = useState(false)
  const [lastPause, setLastPause] = useState([])
  const [startTime, setStartTime] = useState(null)
  const animationFrameRef = useRef(null)

  const zeroPad = useCallback((value, length = 2) => {
    return value.toString().padStart(length, '0')
  }, [])

  const handleToggleClick = useCallback(() => {
    if (!run) {
      setRun(true)
      setStartTime(performance.now() - elapsedTime)
    } else {
      setRun(false)
      setLastPause(prev => [
        `${zeroPad(Math.floor(elapsedTime / 60000))}:${zeroPad(Math.floor((elapsedTime % 60000) / 1000))}:${zeroPad(Math.floor(elapsedTime % 1000), 3)}`,
        ...prev,
      ])
    }
  }, [run, elapsedTime, zeroPad])

  const handleResetClick = useCallback(() => {
    setElapsedTime(0)
    setLastPause([])
    setRun(false)
    setStartTime(null)
  }, [])

  const updateTimer = useCallback((currentTime) => {
    if (startTime !== null) {
      const newElapsedTime = currentTime - startTime
      setElapsedTime(newElapsedTime)
    }
    animationFrameRef.current = requestAnimationFrame(updateTimer)
  }, [startTime])

  useEffect(() => {
    if (run) {
      animationFrameRef.current = requestAnimationFrame(updateTimer)
    } else {
      cancelAnimationFrame(animationFrameRef.current)
    }
    return () => cancelAnimationFrame(animationFrameRef.current)
  }, [run, updateTimer])

  const totalMinutes = Math.floor(elapsedTime / 60000)
  const totalSeconds = Math.floor((elapsedTime % 60000) / 1000)
  const totalMillis = Math.floor(elapsedTime % 1000)

  return (
    <div className="wrapper">
      <header>
        <h1>Chronomètre</h1>
      </header>
      <div className="display">
        <div className="numbers">
          <span className="mins">
            {zeroPad(totalMinutes)}:
          </span>
          <span className="secs">
            {zeroPad(totalSeconds)}:
          </span>
          <span className="millis">{zeroPad(totalMillis, 3)}</span>
        </div>
      </div>
      <div className="actions">
        <button type="button" onClick={handleToggleClick}>
          {run ? 'STOP' : 'START'}
        </button>
        <button type="button" onClick={handleResetClick}>RESET</button>
        {lastPause.map((item, index) => (
          <p key={index} className="dernierePause">
            <span>{lastPause.length - index}</span>
            <span>{item}</span>
          </p>
        ))}
      </div>
    </div>
  )
}

export default App
