'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Timer, Play, Pause, RotateCcw, SkipForward, Coffee, Brain, Minus,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

// ── Types ────────────────────────────────────────────────────
type TimerState = 'idle' | 'running' | 'paused' | 'break';

interface TimerPreset {
  label: string;
  minutes: number;
  type: 'focus' | 'shortBreak' | 'longBreak';
  icon: React.ElementType;
}

// ── Presets ───────────────────────────────────────────────────
const PRESETS: TimerPreset[] = [
  { label: '25m Focus', minutes: 25, type: 'focus', icon: Brain },
  { label: '5m Short Break', minutes: 5, type: 'shortBreak', icon: Coffee },
  { label: '15m Long Break', minutes: 15, type: 'longBreak', icon: Coffee },
];

const DEFAULT_TOTAL_SECONDS = 25 * 60;

// ── Web Audio Beep ────────────────────────────────────────────
function playBeep() {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 660;
    osc.type = 'sine';
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.8);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.8);
    // Second beep
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.frequency.value = 880;
    osc2.type = 'sine';
    gain2.gain.setValueAtTime(0.3, ctx.currentTime + 0.3);
    gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.1);
    osc2.start(ctx.currentTime + 0.3);
    osc2.stop(ctx.currentTime + 1.1);
  } catch {
    // Audio not supported
  }
}

// ── Progress Ring ────────────────────────────────────────────
function ProgressRing({
  progress,
  size = 180,
  strokeWidth = 8,
  state,
}: {
  progress: number;
  size?: number;
  strokeWidth?: number;
  state: TimerState;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - progress * circumference;
  const center = size / 2;

  const strokeColor =
    state === 'break'
      ? 'stroke-amber-500'
      : state === 'running'
        ? 'stroke-emerald-500'
        : state === 'paused'
          ? 'stroke-amber-500'
          : 'stroke-muted';

  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        strokeWidth={strokeWidth}
        className="stroke-muted/50"
      />
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        className={cn(strokeColor, 'transition-all duration-500')}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
      />
    </svg>
  );
}

// ── Format Time ──────────────────────────────────────────────
function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

// ── Main Component ──────────────────────────────────────────
export function PomodoroTimer() {
  const [isOpen, setIsOpen] = useState(false);
  const [timerState, setTimerState] = useState<TimerState>('idle');
  const [totalSeconds, setTotalSeconds] = useState(DEFAULT_TOTAL_SECONDS);
  const [remainingSeconds, setRemainingSeconds] = useState(DEFAULT_TOTAL_SECONDS);
  const [sessions, setSessions] = useState(0);
  const [currentTask, setCurrentTask] = useState('');
  const [activePreset, setActivePreset] = useState<string>('focus');

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const activePresetRef = useRef(activePreset);
  const timerStateRef = useRef(timerState);

  // Keep refs in sync
  useEffect(() => {
    activePresetRef.current = activePreset;
  }, [activePreset]);

  useEffect(() => {
    timerStateRef.current = timerState;
  }, [timerState]);

  const clearTimerInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Timer countdown
  useEffect(() => {
    if (timerState === 'running') {
      intervalRef.current = setInterval(() => {
        setRemainingSeconds((prev) => {
          if (prev <= 1) {
            clearTimerInterval();
            playBeep();

            // Use refs to get current values inside callback
            const currentPreset = activePresetRef.current;
            const currentState = timerStateRef.current;

            if (currentPreset === 'focus') {
              setSessions((s) => s + 1);
              toast.success('Focus session completed! Take a break.');
            } else {
              toast.success('Break is over! Time to focus.');
            }
            setTimerState('idle');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearTimerInterval();
    }

    return clearTimerInterval;
  }, [timerState, clearTimerInterval]);

  // Handlers
  const handleStart = useCallback(() => {
    if (remainingSeconds <= 0) return;
    setTimerState('running');
    setIsOpen(true);
  }, [remainingSeconds]);

  const handlePause = useCallback(() => {
    setTimerState('paused');
  }, []);

  const handleReset = useCallback(() => {
    clearTimerInterval();
    setTimerState('idle');
    setRemainingSeconds(totalSeconds);
  }, [clearTimerInterval, totalSeconds]);

  const handlePresetSelect = useCallback((preset: TimerPreset) => {
    clearTimerInterval();
    setTimerState('idle');
    setActivePreset(preset.type);
    setTotalSeconds(preset.minutes * 60);
    setRemainingSeconds(preset.minutes * 60);
    setIsOpen(true);
  }, [clearTimerInterval]);

  const handleSkipToBreak = useCallback(() => {
    clearTimerInterval();
    setSessions((s) => s + 1);
    const breakPreset = PRESETS[1]; // Short break
    setTimerState('idle');
    setActivePreset(breakPreset.type);
    setTotalSeconds(breakPreset.minutes * 60);
    setRemainingSeconds(breakPreset.minutes * 60);
    setIsOpen(true);
  }, [clearTimerInterval]);

  const togglePanel = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const progress = totalSeconds > 0 ? (totalSeconds - remainingSeconds) / totalSeconds : 0;

  // Badge text for floating button
  const badgeText = timerState !== 'idle' ? formatTime(remainingSeconds) : null;

  return (
    <>
      {/* Floating Button - always visible */}
      <button
        onClick={togglePanel}
        aria-label={isOpen ? 'Minimize timer' : 'Open Pomodoro timer'}
        className={cn(
          'fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-40',
          'flex items-center justify-center size-12 rounded-full shadow-lg',
          'bg-gradient-to-br from-emerald-500 to-emerald-700',
          'hover:from-emerald-600 hover:to-emerald-800',
          'dark:from-emerald-600 dark:to-emerald-900 dark:hover:from-emerald-500 dark:hover:to-emerald-800',
          'text-white transition-all duration-300',
          'hover:scale-110 active:scale-95',
          timerState === 'running' && 'ring-2 ring-emerald-400/50 ring-offset-2 ring-offset-background',
        )}
      >
        <Timer className="size-5" />
        {badgeText && (
          <span className="absolute -top-1 -right-1 flex items-center justify-center rounded-full bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 leading-none shadow-sm tabular-nums">
            {badgeText}
          </span>
        )}
      </button>

      {/* Timer Panel */}
      {isOpen && (
        <div
          className={cn(
            'fixed bottom-36 right-4 sm:bottom-20 sm:right-6 z-40',
            'w-[340px] sm:w-[360px]',
            'rounded-2xl border border-border bg-background shadow-2xl',
            'animate-in fade-in slide-in-from-bottom-4 zoom-in-95 duration-200',
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 pt-4 pb-2">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center size-8 rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400">
                <Timer className="size-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">Pomodoro Timer</h3>
                <p className="text-[11px] text-muted-foreground">
                  {sessions} session{sessions !== 1 ? 's' : ''} completed today
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="size-7 text-muted-foreground hover:text-foreground"
              onClick={togglePanel}
            >
              <Minus className="size-4" />
            </Button>
          </div>

          {/* Presets */}
          <div className="flex gap-2 px-4 pt-2 pb-3">
            {PRESETS.map((preset) => {
              const Icon = preset.icon;
              const isActive = activePreset === preset.type;
              return (
                <button
                  key={preset.type}
                  onClick={() => handlePresetSelect(preset)}
                  className={cn(
                    'flex-1 flex items-center justify-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-medium transition-all duration-200',
                    isActive
                      ? 'bg-emerald-500 text-white shadow-sm'
                      : 'bg-muted/80 text-muted-foreground hover:bg-muted hover:text-foreground',
                  )}
                >
                  <Icon className="size-3" />
                  {preset.label}
                </button>
              );
            })}
          </div>

          {/* Progress Ring & Time */}
          <div className="flex flex-col items-center py-3">
            <div className="relative">
              <ProgressRing
                progress={progress}
                state={timerState}
                size={180}
                strokeWidth={8}
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-extrabold tabular-nums tracking-tight text-foreground">
                  {formatTime(remainingSeconds)}
                </span>
                <span className="mt-1 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                  {timerState === 'running'
                    ? 'Focusing...'
                    : timerState === 'paused'
                      ? 'Paused'
                      : timerState === 'break'
                        ? 'On Break'
                        : 'Ready'}
                </span>
              </div>
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-center gap-3 px-4 pb-3">
            <Button
              variant="outline"
              size="icon"
              className="size-10 rounded-full"
              onClick={handleReset}
              disabled={timerState === 'idle'}
            >
              <RotateCcw className="size-4" />
            </Button>

            <Button
              size="lg"
              className={cn(
                'size-14 rounded-full text-white shadow-lg transition-all duration-200',
                timerState === 'running'
                  ? 'bg-gradient-to-br from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700'
                  : 'bg-gradient-to-br from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700',
              )}
              onClick={timerState === 'running' ? handlePause : handleStart}
              disabled={remainingSeconds <= 0 && timerState !== 'paused'}
            >
              {timerState === 'running' ? (
                <Pause className="size-6" />
              ) : (
                <Play className="size-6 ml-0.5" />
              )}
            </Button>

            <div className="size-10 flex items-center justify-center">
              {activePreset === 'focus' && timerState === 'running' ? (
                <Button
                  variant="outline"
                  size="icon"
                  className="size-10 rounded-full"
                  onClick={handleSkipToBreak}
                >
                  <SkipForward className="size-4" />
                </Button>
              ) : null}
            </div>
          </div>

          {/* Session Counter Dots */}
          {sessions > 0 && (
            <div className="flex items-center justify-center gap-1.5 px-4 pb-3">
              <div className="flex gap-1">
                {Array.from({ length: Math.min(sessions, 8) }).map((_, i) => (
                  <div
                    key={i}
                    className="size-2.5 rounded-full bg-emerald-500 shadow-sm"
                  />
                ))}
                {sessions > 8 && (
                  <Badge variant="secondary" className="text-[9px] px-1 py-0 h-4">
                    +{sessions - 8}
                  </Badge>
                )}
              </div>
              <span className="text-xs text-muted-foreground ml-1">
                {sessions} session{sessions !== 1 ? 's' : ''} completed
              </span>
            </div>
          )}

          {/* Current Task Input */}
          <div className="border-t border-border px-4 pt-3 pb-4">
            <Input
              placeholder="What are you working on?"
              value={currentTask}
              onChange={(e) => setCurrentTask(e.target.value)}
              className="text-sm h-9 bg-muted/50"
            />
          </div>
        </div>
      )}
    </>
  );
}
