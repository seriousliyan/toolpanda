import { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Bell, BellOff } from 'lucide-react';

type Mode = 'focus' | 'break';

const RADIUS = 90;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function fmt(seconds: number): string {
  return `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
}

export default function PomodoroTimer() {
  const [focusMins, setFocusMins] = useState(25);
  const [breakMins, setBreakMins] = useState(5);
  const [mode, setMode] = useState<Mode>('focus');
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [sessions, setSessions] = useState(0);
  const [notifPerm, setNotifPerm] = useState<NotificationPermission | 'unsupported'>('unsupported');

  useEffect(() => {
    if ('Notification' in window) setNotifPerm(Notification.permission);
  }, []);

  // Countdown tick
  useEffect(() => {
    if (!isRunning || timeLeft <= 0) return;
    const id = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(id);
  }, [isRunning, timeLeft]);

  // Timer completion
  useEffect(() => {
    if (timeLeft !== 0 || !isRunning) return;
    setIsRunning(false);
    const next: Mode = mode === 'focus' ? 'break' : 'focus';
    const nextDuration = next === 'focus' ? focusMins * 60 : breakMins * 60;
    if (mode === 'focus') setSessions((s) => s + 1);
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(mode === 'focus' ? '🎉 Focus session done!' : '⏰ Break over!', {
        body: mode === 'focus' ? `Take a ${breakMins}-minute break.` : 'Time to focus!',
      });
    }
    setMode(next);
    setTimeLeft(nextDuration);
  }, [timeLeft, isRunning, mode, focusMins, breakMins]);

  // Update browser tab title while running
  useEffect(() => {
    const prev = document.title;
    return () => { document.title = prev; };
  }, []);

  useEffect(() => {
    if (isRunning) {
      document.title = `${fmt(timeLeft)} ${mode === 'focus' ? '🎯' : '☕'} — ToolPanda`;
    }
  }, [isRunning, timeLeft, mode]);

  const switchMode = (m: Mode) => {
    setIsRunning(false);
    setMode(m);
    setTimeLeft(m === 'focus' ? focusMins * 60 : breakMins * 60);
  };

  const reset = () => {
    setIsRunning(false);
    setTimeLeft(mode === 'focus' ? focusMins * 60 : breakMins * 60);
  };

  const requestNotif = async () => {
    if (!('Notification' in window)) return;
    const p = await Notification.requestPermission();
    setNotifPerm(p);
  };

  const total = mode === 'focus' ? focusMins * 60 : breakMins * 60;
  const progress = total > 0 ? timeLeft / total : 1;
  const dash = CIRCUMFERENCE * (1 - progress);
  const isFocus = mode === 'focus';
  const accent = isFocus ? '#3b82f6' : '#10b981';

  return (
    <div className="space-y-6 max-w-sm mx-auto">

      {/* Mode tabs */}
      <div className="flex gap-2 justify-center">
        {(['focus', 'break'] as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => switchMode(m)}
            className={[
              'px-5 py-2 rounded-full text-sm font-medium transition-colors',
              mode === m
                ? m === 'focus'
                  ? 'bg-blue-500 text-white'
                  : 'bg-emerald-500 text-white'
                : 'bg-gray-100 dark:bg-slate-800 text-[var(--color-muted)] hover:text-gray-700 dark:hover:text-slate-300',
            ].join(' ')}
          >
            {m === 'focus' ? '🎯 Focus' : '☕ Break'}
          </button>
        ))}
      </div>

      {/* Timer ring */}
      <div className="flex justify-center">
        <div className="relative w-[220px] h-[220px]">
          <svg width="220" height="220" className="-rotate-90" style={{ display: 'block' }}>
            <circle cx="110" cy="110" r={RADIUS}
              fill="none" stroke="var(--color-border)" strokeWidth="8" />
            <circle cx="110" cy="110" r={RADIUS}
              fill="none" stroke={accent} strokeWidth="8" strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={dash}
              style={{ transition: 'stroke-dashoffset 0.8s linear, stroke 0.3s' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-5xl font-mono font-semibold tabular-nums text-gray-900 dark:text-slate-100 leading-none">
              {fmt(timeLeft)}
            </span>
            <span className="text-xs text-[var(--color-muted)] mt-2 uppercase tracking-widest">
              {mode}
            </span>
            {sessions > 0 && (
              <span className="text-xs text-[var(--color-muted)] mt-1">
                {sessions} {sessions === 1 ? 'session' : 'sessions'} done
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={reset}
          title="Reset"
          className="p-3 rounded-full text-[var(--color-muted)] hover:text-gray-800 dark:hover:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-800 transition"
        >
          <RotateCcw className="w-5 h-5" />
        </button>

        <button
          onClick={() => setIsRunning((r) => !r)}
          className={[
            'flex items-center gap-2 px-8 py-3 rounded-full font-medium text-sm text-white transition-colors shadow-sm',
            isFocus ? 'bg-blue-500 hover:bg-blue-600' : 'bg-emerald-500 hover:bg-emerald-600',
          ].join(' ')}
        >
          {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          {isRunning ? 'Pause' : 'Start'}
        </button>

        <button
          onClick={requestNotif}
          disabled={notifPerm !== 'default'}
          title={
            notifPerm === 'unsupported' ? 'Notifications not supported in this browser'
            : notifPerm === 'granted' ? 'Browser notifications enabled'
            : notifPerm === 'denied' ? 'Notifications blocked — allow in browser settings'
            : 'Enable browser notifications'
          }
          className={[
            'p-3 rounded-full transition',
            notifPerm === 'granted'
              ? 'text-yellow-500 cursor-default'
              : notifPerm === 'denied' || notifPerm === 'unsupported'
                ? 'text-gray-300 dark:text-slate-600 cursor-default'
                : 'text-[var(--color-muted)] hover:text-gray-800 dark:hover:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-800',
          ].join(' ')}
        >
          {notifPerm === 'granted' ? <Bell className="w-5 h-5" /> : <BellOff className="w-5 h-5" />}
        </button>
      </div>

      {/* Duration settings */}
      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[var(--color-border)]">
        {[
          {
            label: 'Focus (min)', value: focusMins, max: 120,
            set: (v: number) => { setFocusMins(v); if (!isRunning && mode === 'focus') setTimeLeft(v * 60); },
          },
          {
            label: 'Break (min)', value: breakMins, max: 60,
            set: (v: number) => { setBreakMins(v); if (!isRunning && mode === 'break') setTimeLeft(v * 60); },
          },
        ].map(({ label, value, max, set }) => (
          <div key={label}>
            <label className="block text-xs font-medium text-[var(--color-muted)] mb-1.5">{label}</label>
            <input
              type="number" min={1} max={max} value={value}
              onChange={(e) => set(Math.max(1, Math.min(max, Number(e.target.value))))}
              className="w-full px-3 py-2 text-sm border border-[var(--color-border)] rounded-lg outline-none focus:ring-2 focus:ring-[var(--color-accent)] text-center font-mono"
            />
          </div>
        ))}
      </div>

    </div>
  );
}
