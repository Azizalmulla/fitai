'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { generateMockFitnessData } from '../dashboard/page';

export default function WorkoutSchedulePage() {
  const [plan, setPlan] = useState<any[]>([]);
  const [activeDay, setActiveDay] = useState(0);
  const [activeExercise, setActiveExercise] = useState(-1);

  useEffect(() => {
    const stored = localStorage.getItem('fitnessData');
    const data = stored ? JSON.parse(stored) : generateMockFitnessData();
    const wp = data.workoutPlan || [];
    const sundayIdx = wp.findIndex((d: any) => d.day === 'Sunday');
    if (sundayIdx > 0) {
      const sunday = wp.splice(sundayIdx, 1)[0];
      wp.unshift(sunday);
    }
    setPlan(wp);
  }, []);

  const toggleCompleted = (dayIdx: number, exIdx: number) => {
    setPlan(prev => {
      const newPlan = [...prev];
      newPlan[dayIdx].exercises[exIdx].completed = !newPlan[dayIdx].exercises[exIdx].completed;
      const storedData = JSON.parse(localStorage.getItem('fitnessData') || '{}');
      localStorage.setItem('fitnessData', JSON.stringify({ ...storedData, workoutPlan: newPlan }));
      return newPlan;
    });
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="flex justify-between items-center mb-6">
        <Link href="/dashboard" className="text-sm text-white/70 hover:text-white">
          &larr; Dashboard
        </Link>
        <h1 className="text-2xl font-bold">Weekly Training Schedule</h1>
        <div />
      </div>
      <section className="bg-zinc-900/40 backdrop-blur-md rounded-3xl p-7 border border-zinc-700/25 shadow-lg">
        {/* Days tabs */}
        <div className="px-4 pt-4 pb-3 border-b border-white/5">
          <div className="flex overflow-x-auto gap-1.5 no-scrollbar">
            {plan.map((day, idx) => (
              <button
                key={idx}
                onClick={() => { setActiveDay(idx); setActiveExercise(-1); }}
                className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                  activeDay === idx
                    ? 'bg-zinc-800 text-white shadow-md border border-white/5'
                    : 'bg-zinc-900/50 text-white/70 hover:bg-zinc-800/80 hover:text-white/90 border border-white/10'
                }`}
              >
                {day.day.slice(0, 3)}
              </button>
            ))}
          </div>
        </div>
        {/* Workout details */}
        <div className="p-5">
          <div className="flex justify-between items-center mb-5">
            <div>
              <h3 className="text-lg font-medium text-white/90">{plan[activeDay]?.focus}</h3>
              <p className="text-xs text-white/50 mt-1">{plan[activeDay]?.day}</p>
            </div>
            {plan[activeDay]?.completed && (
              <div className="flex items-center gap-1.5 bg-emerald-500/20 text-emerald-400 px-3 py-1.5 rounded-full text-xs font-medium">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12L10 17L20 7" stroke="currentColor" strokeWidth="2" />
                </svg>
                Completed
              </div>
            )}
          </div>
          <div className="space-y-4">
            {plan[activeDay]?.exercises.map((ex: any, exIdx: number) => {
              const isOpen = activeExercise === exIdx;
              return (
                <div
                  key={exIdx}
                  className={`relative bg-zinc-900/60 backdrop-blur-md rounded-xl border ${
                    ex.completed ? 'border-emerald-500/30 shadow-sm' : 'border-white/5 shadow-md'
                  } overflow-hidden transition-all hover:border-white/10`}
                >
                  <div
                    className="flex justify-between items-center p-4 cursor-pointer"
                    onClick={() => setActiveExercise(isOpen ? -1 : exIdx)}
                  >
                    <div className="flex items-center gap-3">
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleCompleted(activeDay, exIdx); }}
                        className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all ${
                          ex.completed
                            ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                            : 'border-white/20 text-white/40 hover:border-white/40'
                        }`}
                      >
                        {ex.completed && (
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                            <path d="M5 12L10 17L20 7" stroke="currentColor" strokeWidth="2" />
                          </svg>
                        )}
                      </button>
                      <span className="font-semibold text-base truncate max-w-[240px] md:max-w-[340px]">{ex.name}</span>
                      <span className="text-sm text-white/50 ml-auto">{ex.sets}×{ex.reps}</span>
                    </div>
                    <svg
                      className={`w-4 h-4 text-white/50 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                      viewBox="0 0 24 24" fill="none"
                    >
                      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                  </div>
                  {isOpen && (
                    <div className="p-4 pt-0 border-t border-zinc-800/40">
                      <div className="bg-zinc-800/50 rounded-xl p-4 mb-3 shadow-inner">
                        <div className="grid grid-cols-4 gap-2 mb-2 text-xs text-white/60">
                          <div>Set</div>
                          <div className="text-center">Weight</div>
                          <div className="text-center">Reps</div>
                          <div className="text-center">RIR</div>
                        </div>
                        {Array.from({ length: ex.sets }).map((_, setIdx) => (
                          <div key={setIdx} className="grid grid-cols-4 gap-2 mb-2 text-sm text-white/80">
                            <div>{setIdx + 1}</div>
                            <div className="text-center">{ex.weight || '-'}</div>
                            <div className="text-center">{ex.reps}</div>
                            <div className="text-center">{ex.rir || '-'}</div>
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-between items-center">
                        <button className="bg-emerald-500/20 text-emerald-400 px-3 py-1.5 rounded-full text-xs font-medium">
                          Video Guide
                        </button>
                        <button className="bg-emerald-500/20 text-emerald-400 px-3 py-1.5 rounded-full text-xs font-medium">
                          Log Performance
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
