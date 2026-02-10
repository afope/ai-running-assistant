'use client';

import { useChat } from '@ai-sdk/react';
import { useState } from 'react';

export default function Chat() {
  const [input, setInput] = useState('');
  const { messages, sendMessage } = useChat();
  
  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      {messages.map(message => (
        <div key={message.id} className="whitespace-pre-wrap mb-4">
          <strong>{message.role === 'user' ? 'User: ' : 'AI: '}</strong>
          {message.parts.map((part, i) => {
            switch (part.type) {
              case 'text':
                return <div key={`${message.id}-${i}`}>{part.text}</div>;
              
              case 'tool-result': {
                const toolPart = part as any;

                // Check if we have a completed tool call with output
                if (toolPart.state === 'result' && toolPart.output) {
                  // Pace Calculator
                  if (toolPart.toolName === 'calculatePace') {
                    const result = toolPart.output as {
                      pacePerKm: string;
                      totalTime: string;
                      distance: number;
                    };
                    return (
                      <div key={`${message.id}-${i}`} className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg my-2 border border-blue-200 dark:border-blue-800">
                        <h3 className="font-bold mb-2 text-blue-900 dark:text-blue-100">📊 Pace Calculator</h3>
                        <div className="space-y-1">
                          <p><strong>Pace:</strong> {result.pacePerKm} /km</p>
                          <p><strong>Total Time:</strong> {result.totalTime}</p>
                          <p><strong>Distance:</strong> {result.distance} km</p>
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
                      <div key={`${message.id}-${i}`} className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg my-2 border border-green-200 dark:border-green-800">
                        <h3 className="font-bold mb-2 text-green-900 dark:text-green-100">🎯 Training Zones</h3>
                        <p className="text-sm mb-3 text-green-700 dark:text-green-300">Based on threshold: {result.thresholdPace}</p>
                        <div className="space-y-2">
                          <div className="bg-white dark:bg-gray-800 p-2 rounded">
                            <p className="text-xs text-gray-600 dark:text-gray-400">Zone 1 - Easy/Recovery</p>
                            <p className="font-mono text-sm">{result.zone1}</p>
                          </div>
                          <div className="bg-white dark:bg-gray-800 p-2 rounded">
                            <p className="text-xs text-gray-600 dark:text-gray-400">Zone 2 - Aerobic Endurance</p>
                            <p className="font-mono text-sm">{result.zone2}</p>
                          </div>
                          <div className="bg-white dark:bg-gray-800 p-2 rounded">
                            <p className="text-xs text-gray-600 dark:text-gray-400">Zone 3 - Tempo</p>
                            <p className="font-mono text-sm">{result.zone3}</p>
                          </div>
                          <div className="bg-white dark:bg-gray-800 p-2 rounded">
                            <p className="text-xs text-gray-600 dark:text-gray-400">Zone 4 - Threshold</p>
                            <p className="font-mono text-sm">{result.zone4}</p>
                          </div>
                          <div className="bg-white dark:bg-gray-800 p-2 rounded">
                            <p className="text-xs text-gray-600 dark:text-gray-400">Zone 5 - VO2 Max</p>
                            <p className="font-mono text-sm">{result.zone5}</p>
                          </div>
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
                      <div key={`${message.id}-${i}`} className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg my-2 border border-purple-200 dark:border-purple-800">
                        <h3 className="font-bold mb-2 text-purple-900 dark:text-purple-100">🏃 Race Time Predictions</h3>
                        <p className="text-sm mb-3 text-purple-700 dark:text-purple-300">Based on: {result.baseRace}</p>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="bg-white dark:bg-gray-800 p-2 rounded">
                            <p className="text-xs text-gray-600 dark:text-gray-400">5K</p>
                            <p className="font-mono text-lg font-bold">{result.predictions['5K']}</p>
                          </div>
                          <div className="bg-white dark:bg-gray-800 p-2 rounded">
                            <p className="text-xs text-gray-600 dark:text-gray-400">10K</p>
                            <p className="font-mono text-lg font-bold">{result.predictions['10K']}</p>
                          </div>
                          <div className="bg-white dark:bg-gray-800 p-2 rounded">
                            <p className="text-xs text-gray-600 dark:text-gray-400">Half Marathon</p>
                            <p className="font-mono text-lg font-bold">{result.predictions['Half Marathon']}</p>
                          </div>
                          <div className="bg-white dark:bg-gray-800 p-2 rounded">
                            <p className="text-xs text-gray-600 dark:text-gray-400">Marathon</p>
                            <p className="font-mono text-lg font-bold">{result.predictions['Marathon']}</p>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  
                  // Fallback for any other tools
                  return (
                    <pre key={`${message.id}-${i}`} className="bg-gray-100 dark:bg-gray-800 p-2 rounded text-xs overflow-x-auto">
                      {JSON.stringify(toolPart.output, null, 2)}
                    </pre>
                  );
                }
                
                // Handle loading state
                if (toolPart.state === 'call') {
                  return (
                    <div key={`${message.id}-${i}`} className="text-gray-500 italic">
                      Calculating...
                    </div>
                  );
                }
                
                // Handle error state
                if (toolPart.state === 'error') {
                  return (
                    <div key={`${message.id}-${i}`} className="text-red-500 bg-red-50 dark:bg-red-900/20 p-2 rounded">
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
      ))}

      <form
        onSubmit={e => {
          e.preventDefault();
          sendMessage({ text: input });
          setInput('');
        }}
      >
        <input
          className="fixed dark:bg-zinc-900 bottom-0 w-full max-w-md p-2 mb-8 border border-zinc-300 dark:border-zinc-800 rounded shadow-xl"
          value={input}
          placeholder="Ask about running pace, zones, or race predictions..."
          onChange={e => setInput(e.currentTarget.value)}
        />
      </form>
    </div>
  );
}