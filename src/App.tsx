import { useState, useEffect, useRef, useCallback } from 'react'
import './assets/css/style.min.css'

function App() {
  const [elapsedTime, setElapsedTime] = useState<number>(0)
  const [run, setRun] = useState<boolean>(false)
  const [lastPauses, setLastPauses] = useState<{ time: string; delta: string | null }[]>([])
  const [startTime, setStartTime] = useState<number | null>(null)
  const [lastElapsedTime, setLastElapsedTime] = useState<number | null>(null)
  const animationFrameRef = useRef<number | null>(null)

  const zeroPad = (value: number, length = 2): string =>
    value.toString().padStart(length, '0')

  const formatTime = (ms: number): string => {
    return `${zeroPad(Math.floor(ms / 60000))}:${zeroPad(Math.floor((ms % 60000) / 1000))}:${zeroPad(Math.floor(ms % 1000), 3)}`
  }

  const handleToggleClick = useCallback(() => {
    if (!run) {
      setRun(true)
      setStartTime(performance.now() - elapsedTime)
    } else {
      const currentTime = performance.now()
      const newElapsedTime = startTime !== null ? currentTime - startTime : 0
      setElapsedTime(newElapsedTime)

      const delta = lastElapsedTime !== null ? newElapsedTime - lastElapsedTime : null
      const deltaStr = delta !== null ? formatTime(delta) : null

      setLastPauses((prev) => [
        { time: formatTime(newElapsedTime), delta: deltaStr },
        ...prev,
      ])
      setLastElapsedTime(newElapsedTime)
      setRun(false)
    }
  }, [run, elapsedTime, startTime, lastElapsedTime])

  const handleResetClick = useCallback(() => {
    setElapsedTime(0)
    setLastPauses([])
    setRun(false)
    setStartTime(null)
    setLastElapsedTime(null)
  }, [])

  const updateTimer = useCallback(
    (currentTime: number) => {
      if (startTime !== null) {
        const newElapsedTime = currentTime - startTime
        setElapsedTime(newElapsedTime)
      }
      animationFrameRef.current = requestAnimationFrame(updateTimer)
    },
    [startTime]
  )

  useEffect(() => {
    if (run) {
      animationFrameRef.current = requestAnimationFrame(updateTimer)
    } else if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current)
    }
    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
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
          <span className="mins">{zeroPad(totalMinutes)}:</span>
          <span className="secs">{zeroPad(totalSeconds)}:</span>
          <span className="millis">{zeroPad(totalMillis, 3)}</span>
        </div>
      </div>
      <div className="actions">
        <button type="button" onClick={handleToggleClick}>
          {run ? 'STOP' : 'START'}
        </button>
        <button type="button" onClick={handleResetClick}>RESET</button>
        {lastPauses.map((item, index) => (
          <p key={index} className="lastPause">
            <span>{lastPauses.length - index}</span>
            <span>{item.time}</span>
            {item.delta && <span> Δ {item.delta}</span>}
          </p>
        ))}
      </div>
    </div>
  )
}

export default App
