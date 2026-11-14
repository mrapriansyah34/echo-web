import { useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { useReducedMotion } from 'motion/react'

import { cx } from '../lib/cx'

// Decorative flock, built from the swallow silhouettes supplied by the client.
// Each section carries its own flock: the birds cross once when that section
// scrolls into view and then stop, restarting only after the section leaves the
// viewport and comes back. Nothing loops while someone is reading.
const FLIGHT_MS = 15000

type Bird = {
  pose: number
  beat?: number
  size: number
  top: string
  path: 1 | 2 | 3 | 4
  bank: 1 | 2 | 3 | 4
  duration: number
  delay: number
  tilt?: number
}

const FLOCK: Bird[] = [
  { pose: 0, size: 92, top: '9%', path: 1, bank: 1, duration: 12, delay: 0.1, tilt: 2 },
  { pose: 4, beat: 5, size: 68, top: '24%', path: 3, bank: 3, duration: 11, delay: 0.7, tilt: -2 },
  { pose: 1, beat: 2, size: 56, top: '38%', path: 2, bank: 2, duration: 10, delay: 1.2 },
  { pose: 5, size: 62, top: '55%', path: 4, bank: 4, duration: 9.5, delay: 0.4, tilt: 3 },
  { pose: 3, beat: 1, size: 44, top: '17%', path: 2, bank: 2, duration: 10.5, delay: 1.6 },
  { pose: 2, beat: 1, size: 48, top: '63%', path: 3, bank: 3, duration: 11.5, delay: 1.9 },
]

export function FlyingSwallows({
  className,
  variant = 'quiet',
}: {
  className?: string
  /** `hero` runs the full flock over the opening section; `quiet` is the lighter page-wide pass. */
  variant?: 'hero' | 'quiet'
}) {
  const reduceMotion = useReducedMotion()
  const flock = variant === 'hero' ? FLOCK : FLOCK.slice(0, 4)
  const rootRef = useRef<HTMLDivElement>(null)
  const [flying, setFlying] = useState(false)
  const [runId, setRunId] = useState(0)

  useEffect(() => {
    if (reduceMotion) return
    const el = rootRef.current
    if (!el) return

    let inView = false
    let stopTimer: number | undefined

    const stop = () => {
      window.clearTimeout(stopTimer)
      setFlying(false)
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting && entry.intersectionRatio >= 0.15
        if (visible === inView) return
        inView = visible

        if (!visible) {
          stop()
          return
        }

        // Re-key so the flock restarts from off-screen, then clear it once the
        // last bird has left so the page never shows a looping flight.
        start()
      },
      { threshold: [0, 0.15] },
    )

    observer.observe(el)

    // A visitor lands at the top of the page, so start the first pass straight
    // away. The observer still owns replays when the hero is left and revisited.
    const start = () => {
      setRunId((id) => id + 1)
      setFlying(true)
      window.clearTimeout(stopTimer)
      stopTimer = window.setTimeout(() => setFlying(false), FLIGHT_MS)
    }

    const rect = el.getBoundingClientRect()
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      inView = true
      start()
    }

    return () => {
      observer.disconnect()
      window.clearTimeout(stopTimer)
    }
  }, [reduceMotion])

  return (
    <div
      ref={rootRef}
      aria-hidden
      className={cx(
        'pointer-events-none absolute inset-0 overflow-hidden',
        variant === 'quiet' && 'flock-quiet',
        className,
      )}
    >
      {flying &&
        flock.map((bird, index) => (
          <div
            key={`${runId}-${index}`}
            className="bird"
            style={
              {
                '--y': bird.top,
                '--s': `${bird.size}px`,
                '--dur': `${bird.duration}s`,
                '--delay': `${bird.delay}s`,
              } as CSSProperties
            }
          >
            <div className={cx('bird-track', `bird-path-${bird.path}`)}>
              <div className={cx('bird-bank', `bird-bank-${bird.bank}`)}>
                <div className="bird-body" style={bird.tilt ? { transform: `rotate(${bird.tilt}deg)` } : undefined}>
                  <img
                    src={`/images/swallow-${bird.pose}.png`}
                    alt=""
                    width={220}
                    height={220}
                    draggable={false}
                    className="bird-pose"
                  />
                  {bird.beat !== undefined && (
                    <img
                      src={`/images/swallow-${bird.beat}.png`}
                      alt=""
                      width={220}
                      height={220}
                      draggable={false}
                      className="bird-pose bird-beat"
                      style={{ animationDuration: `${0.34 + (index % 3) * 0.06}s` }}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
    </div>
  )
}
