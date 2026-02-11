'use client';

import { useChat } from '@ai-sdk/react';
import { useState } from 'react';
import { MarkdownText } from './components/MarkdownText';

export default function Chat() {
  const [input, setInput] = useState('');
  const { messages, sendMessage } = useChat();
  
  // Check if waiting for response (last message is from user)
  const lastMessage = messages[messages.length - 1];
  const isLoading = lastMessage?.role === 'user';
  
  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/95 dark:bg-black/95 backdrop-blur-sm border-b border-black/10 dark:border-white/10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex flex-col gap-0.5">
              <div className="h-0.5 w-8 bg-black dark:bg-white"></div>
              <div className="h-0.5 w-8 bg-black dark:bg-white"></div>
              <div className="h-0.5 w-8 bg-black dark:bg-white"></div>
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-adi)' }}>adi</h1>
              <p className="text-xs text-black/60 dark:text-white/60 uppercase tracking-wider" style={{ fontFamily: 'var(--font-adi)' }}>Running Assistant</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Chat Area */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        {messages.length === 0 && (
          <div className="text-center py-20">
            <div className="mb-8">
              <div className="inline-flex flex-col gap-0.5 mb-6">
                <div className="h-1 w-16 bg-black dark:bg-white"></div>
                <div className="h-1 w-16 bg-black dark:bg-white"></div>
                <div className="h-1 w-16 bg-black dark:bg-white"></div>
              </div>
            </div>
            <h2 className="text-4xl font-bold mb-4 tracking-tight" style={{ fontFamily: 'var(--font-adi)' }}>ready to have the best <span className="line-through">fun</span> run of your life?</h2>
            <p className="text-black/60 dark:text-white/60 text-base mb-8 max-w-md mx-auto" style={{ fontFamily: 'var(--font-adi)' }}>
              built to make you faster, better, stronger
            </p>
            
            <div className="max-w-2xl mx-auto grid grid-cols-2 gap-3 mt-12">
              <button
                onClick={() => {
                  setInput("i want to run my first marathon in 6 months");
                  setTimeout(() => {
                    sendMessage({ text: "i want to run my first marathon in 6 months" });
                    setInput('');
                  }, 100);
                }}
                className="text-left px-6 py-4 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 rounded-lg border border-black/10 dark:border-white/10 transition-colors text-base"
                style={{ fontFamily: 'var(--font-adi)' }}
              >
                i want to run my first marathon in 6 months
              </button>
              
              <button
                onClick={() => {
                  setInput("how do i get faster at 5k?");
                  setTimeout(() => {
                    sendMessage({ text: "how do i get faster at 5k?" });
                    setInput('');
                  }, 100);
                }}
                className="text-left px-6 py-4 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 rounded-lg border border-black/10 dark:border-white/10 transition-colors text-base"
                style={{ fontFamily: 'var(--font-adi)' }}
              >
                how do i get faster at 5k?
              </button>
              
              <button
                onClick={() => {
                  setInput("i keep getting shin splints, what should i do?");
                  setTimeout(() => {
                    sendMessage({ text: "i keep getting shin splints, what should i do?" });
                    setInput('');
                  }, 100);
                }}
                className="text-left px-6 py-4 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 rounded-lg border border-black/10 dark:border-white/10 transition-colors text-base"
                style={{ fontFamily: 'var(--font-adi)' }}
              >
                i keep getting shin splints, what should i do?
              </button>
              
              <button
                onClick={() => {
                  setInput("what's a good beginner running plan?");
                  setTimeout(() => {
                    sendMessage({ text: "what's a good beginner running plan?" });
                    setInput('');
                  }, 100);
                }}
                className="text-left px-6 py-4 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 rounded-lg border border-black/10 dark:border-white/10 transition-colors text-base"
                style={{ fontFamily: 'var(--font-adi)' }}
              >
                what&apos;s a good beginner running plan?
              </button>
            </div>
          </div>
        )}

        <div className="space-y-6 mb-32">
      {messages.map(message => (
            <div 
              key={message.id} 
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[85%] ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
          {message.parts.map((part, i) => {
            switch (part.type) {
              case 'text':
                      if (message.role === 'user') {
                        return (
                          <>
                            <div 
                              key={`${message.id}-${i}`} 
                              className="inline-block px-4 py-3 rounded-lg bg-black text-white dark:bg-white dark:text-black"
                            >
                              {part.text}
                            </div>
                            {isLoading && message.id === lastMessage?.id && (
                              <div className="flex justify-start mt-4">
                                <div className="flex items-center gap-0.5">
                                  <div 
                                    className="w-0.5 h-4 bg-black dark:bg-white transform -skew-x-12"
                                    style={{
                                      animation: 'blink 1s ease-in-out infinite',
                                      animationDelay: '0ms'
                                    }}
                                  ></div>
                                  <div 
                                    className="w-0.5 h-4 bg-black dark:bg-white transform -skew-x-12"
                                    style={{
                                      animation: 'blink 1s ease-in-out infinite',
                                      animationDelay: '200ms'
                                    }}
                                  ></div>
                                  <div 
                                    className="w-0.5 h-4 bg-black dark:bg-white transform -skew-x-12"
                                    style={{
                                      animation: 'blink 1s ease-in-out infinite',
                                      animationDelay: '400ms'
                                    }}
                                  ></div>
                                </div>
                              </div>
                            )}
                          </>
                        );
                      } else {
                        return (
                          <div 
                            key={`${message.id}-${i}`} 
                            className="bg-black/5 dark:bg-white/5 text-black dark:text-white px-6 py-4 rounded-lg my-2 max-w-full"
                          >
                            <MarkdownText text={part.text} />
                          </div>
                        );
                      }
                    
                    case 'tool-result': {
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      const toolPart = part as any;

                      if (toolPart.state === 'result' && toolPart.output) {
                        // Pace Calculator
                        if (toolPart.toolName === 'calculatePace') {
                          const result = toolPart.output as {
                            pacePerKm: string;
                            totalTime: string;
                            distance: number;
                          };
                          return (
                            <div key={`${message.id}-${i}`} className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 p-6 rounded-lg my-2">
                              <div className="flex items-center gap-2 mb-4">
                                <div className="flex flex-col gap-0.5">
                                  <div className="h-0.5 w-4 bg-black dark:bg-white"></div>
                                  <div className="h-0.5 w-4 bg-black dark:bg-white"></div>
                                  <div className="h-0.5 w-4 bg-black dark:bg-white"></div>
                                </div>
                                <h3 className="font-bold text-sm uppercase tracking-wider" style={{ fontFamily: 'var(--font-adi)' }}>Pace Calculator</h3>
                              </div>
                              <div className="space-y-3">
                                <div className="border-t border-black/10 dark:border-white/10 pt-3">
                                  <p className="text-xs uppercase tracking-wider text-black/60 dark:text-white/60 mb-1" style={{ fontFamily: 'var(--font-adi)' }}>Pace</p>
                                  <p className="text-2xl font-bold" style={{ fontFamily: 'var(--font-adi)' }}>{result.pacePerKm} /km</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4 border-t border-black/10 dark:border-white/10 pt-3">
                                  <div>
                                    <p className="text-xs uppercase tracking-wider text-black/60 dark:text-white/60 mb-1" style={{ fontFamily: 'var(--font-adi)' }}>Time</p>
                                    <p className="text-lg" style={{ fontFamily: 'var(--font-adi)' }}>{result.totalTime}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs uppercase tracking-wider text-black/60 dark:text-white/60 mb-1" style={{ fontFamily: 'var(--font-adi)' }}>Distance</p>
                                    <p className="text-lg" style={{ fontFamily: 'var(--font-adi)' }}>{result.distance} km</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        }
                        
                        // Training Zones
                        if (toolPart.toolName === 'suggestTrainingZones') {
                          const result = toolPart.output as {
                            zone1: string;
                            zone2: string;
                            zone3: string;
                            zone4: string;
                            zone5: string;
                            thresholdPace: string;
                          };
                  return (
                            <div key={`${message.id}-${i}`} className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 p-6 rounded-lg my-2">
                              <div className="flex items-center gap-2 mb-4">
                                <div className="flex flex-col gap-0.5">
                                  <div className="h-0.5 w-4 bg-black dark:bg-white"></div>
                                  <div className="h-0.5 w-4 bg-black dark:bg-white"></div>
                                  <div className="h-0.5 w-4 bg-black dark:bg-white"></div>
                                </div>
                                <div>
                                  <h3 className="font-bold text-sm uppercase tracking-wider" style={{ fontFamily: 'var(--font-adi)' }}>Training Zones</h3>
                                  <p className="text-xs text-black/60 dark:text-white/60 mt-0.5" style={{ fontFamily: 'var(--font-adi)' }}>Threshold: {result.thresholdPace}</p>
                                </div>
                              </div>
                              <div className="space-y-2 border-t border-black/10 dark:border-white/10 pt-4">
                                {[
                                  { label: 'Zone 1', subtitle: 'Easy/Recovery', value: result.zone1 },
                                  { label: 'Zone 2', subtitle: 'Aerobic Endurance', value: result.zone2 },
                                  { label: 'Zone 3', subtitle: 'Tempo', value: result.zone3 },
                                  { label: 'Zone 4', subtitle: 'Threshold', value: result.zone4 },
                                  { label: 'Zone 5', subtitle: 'VO2 Max', value: result.zone5 },
                                ].map((zone, idx) => (
                                  <div key={idx} className="flex items-center justify-between py-2 border-b border-black/5 dark:border-white/5 last:border-0">
                                    <div>
                                      <p className="text-xs font-semibold uppercase tracking-wider" style={{ fontFamily: 'var(--font-adi)' }}>{zone.label}</p>
                                      <p className="text-xs text-black/50 dark:text-white/50" style={{ fontFamily: 'var(--font-adi)' }}>{zone.subtitle}</p>
                                    </div>
                                    <p className="font-mono text-sm font-bold" style={{ fontFamily: 'var(--font-adi)' }}>{zone.value}</p>
                                  </div>
                                ))}
                              </div>
                    </div>
                  );
                }
                
                        // Race Time Predictions
                        if (toolPart.toolName === 'predictRaceTime') {
                          const result = toolPart.output as {
                            baseRace: string;
                            predictions: {
                              '5K': string;
                              '10K': string;
                              'Half Marathon': string;
                              'Marathon': string;
                            };
                          };
                  return (
                            <div key={`${message.id}-${i}`} className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 p-6 rounded-lg my-2">
                              <div className="flex items-center gap-2 mb-4">
                                <div className="flex flex-col gap-0.5">
                                  <div className="h-0.5 w-4 bg-black dark:bg-white"></div>
                                  <div className="h-0.5 w-4 bg-black dark:bg-white"></div>
                                  <div className="h-0.5 w-4 bg-black dark:bg-white"></div>
                                </div>
                                <div>
                                  <h3 className="font-bold text-sm uppercase tracking-wider" style={{ fontFamily: 'var(--font-adi)' }}>Race Predictions</h3>
                                  <p className="text-xs text-black/60 dark:text-white/60 mt-0.5" style={{ fontFamily: 'var(--font-adi)' }}>Based on: {result.baseRace}</p>
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-3 border-t border-black/10 dark:border-white/10 pt-4">
                                {Object.entries(result.predictions).map(([race, time]) => (
                                  <div key={race} className="text-center py-3 border border-black/10 dark:border-white/10 rounded">
                                    <p className="text-xs uppercase tracking-wider text-black/60 dark:text-white/60 mb-1" style={{ fontFamily: 'var(--font-adi)' }}>{race}</p>
                                    <p className="text-xl font-bold font-mono" style={{ fontFamily: 'var(--font-adi)' }}>{time}</p>
                                  </div>
                                ))}
                      </div>
                    </div>
                  );
                }
                
                        // Fallback
                return (
                          <div key={`${message.id}-${i}`} className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 p-4 rounded-lg">
                            <pre className="text-xs font-mono overflow-x-auto">
                              {JSON.stringify(toolPart.output, null, 2)}
                  </pre>
                          </div>
                        );
                      }
                      
                      // Loading state
                      if (toolPart.state === 'call') {
                        return (
                          <div key={`${message.id}-${i}`} className="text-black/40 dark:text-white/40 italic text-sm">
                            Calculating...
                          </div>
                        );
                      }
                      
                      // Error state
                      if (toolPart.state === 'error') {
                        return (
                          <div key={`${message.id}-${i}`} className="bg-black/5 dark:bg-white/5 border border-black/20 dark:border-white/20 p-3 rounded text-sm">
                            Error: {toolPart.errorText}
                          </div>
                        );
                      }
                      
                      return null;
                    }
              
              default:
                return null;
            }
          })}
              </div>
        </div>
      ))}
        </div>
      </main>

      {/* Input Area */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-black/95 backdrop-blur-sm border-t border-black/10 dark:border-white/10">
        <div className="flex justify-center px-6 py-4">
      <form
        onSubmit={e => {
          e.preventDefault();
              if (input.trim()) {
          sendMessage({ text: input });
          setInput('');
              }
        }}
            className="flex items-center gap-3 w-full max-w-2xl"
      >
            <div className="flex-1 relative">
        <input
                className="w-full bg-black/5 dark:bg-white/5 border border-black/20 dark:border-white/20 rounded-lg px-4 py-3 text-base focus:outline-none focus:border-black dark:focus:border-white transition-colors"
          value={input}
                placeholder="ask about pace, zones, or predictions"
          onChange={e => setInput(e.currentTarget.value)}
        />
            </div>
            <button
              type="submit"
              className="bg-black text-white dark:bg-white dark:text-black px-6 py-3 rounded-lg font-medium text-base uppercase tracking-wider hover:opacity-80 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ fontWeight: 500, fontFamily: 'var(--font-adi)' }}
              disabled={!input.trim()}
            >
              Send
            </button>
      </form>
        </div>
      </footer>
    </div>
  );
}
