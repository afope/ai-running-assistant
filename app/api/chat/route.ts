import { streamText, UIMessage, convertToModelMessages, tool } from 'ai';
import { anthropic } from "@ai-sdk/anthropic";
import { z } from 'zod';

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: anthropic("claude-sonnet-4-5"),
    system: `You are a knowledgeable running coach assistant. You help runners with pace calculations, training plans, and workout suggestions. When users ask about running-related topics, use your tools to provide accurate calculations.`,
    messages: await convertToModelMessages(messages),
    tools: {
      calculatePace: tool({
        description: 'Calculate running pace for a given distance and time',
        inputSchema: z.object({
          distance: z.number().describe('Distance in kilometers'),
          hours: z.number().optional().default(0).describe('Hours (optional)'),
          minutes: z.number().describe('Minutes'),
          seconds: z.number().optional().default(0).describe('Seconds (optional)'),
        }),
        execute: async ({ distance, hours = 0, minutes, seconds = 0 }) => {
          const totalMinutes = hours * 60 + minutes + seconds / 60;
          const pacePerKm = totalMinutes / distance;
          const paceMinutes = Math.floor(pacePerKm);
          const paceSeconds = Math.round((pacePerKm - paceMinutes) * 60);
          
          return {
            pacePerKm: `${paceMinutes}:${paceSeconds.toString().padStart(2, '0')}`,
            totalTime: `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`,
            distance,
          };
        },
      }),
      
      suggestTrainingZones: tool({
        description: 'Calculate pace training zones based on threshold pace',
        inputSchema: z.object({
          thresholdPace: z.string().describe('Threshold pace in min:sec per km format (e.g., "4:30")'),
        }),
        execute: async ({ thresholdPace }) => {
          // Parse threshold pace (format: "4:30")
          const [minutes, seconds] = thresholdPace.split(':').map(Number);
          const thresholdSeconds = minutes * 60 + seconds;
          
          // Helper function to convert seconds back to min:sec format
          const formatPace = (totalSeconds: number): string => {
            const mins = Math.floor(totalSeconds / 60);
            const secs = Math.round(totalSeconds % 60);
            return `${mins}:${secs.toString().padStart(2, '0')}`;
          };
          
          // Format with ranges for each zone
          const formatZoneRange = (slower: number, faster: number): string => {
            return `${formatPace(slower)} - ${formatPace(faster)} /km`;
          };
          
          return {
            zone1: formatZoneRange(thresholdSeconds * 1.25, thresholdSeconds * 1.16), // Easy: 125-116%
            zone2: formatZoneRange(thresholdSeconds * 1.15, thresholdSeconds * 1.07), // Aerobic: 115-107%
            zone3: formatZoneRange(thresholdSeconds * 1.06, thresholdSeconds * 1.01), // Tempo: 106-101%
            zone4: formatZoneRange(thresholdSeconds, thresholdSeconds * 0.96), // Threshold: 100-96%
            zone5: formatZoneRange(thresholdSeconds * 0.95, thresholdSeconds * 0.90), // VO2: 95-90%
            thresholdPace: `${thresholdPace} /km`,
          };
        },
      }),
      
      predictRaceTime: tool({
        description: 'Predict race times for other distances based on a recent race result',
        inputSchema: z.object({
          raceDistance: z.number().describe('Recent race distance in kilometers'),
          raceTimeMinutes: z.number().describe('Race time in total minutes'),
        }),
        execute: async ({ raceDistance, raceTimeMinutes }) => {
          // Using Riegel formula: T2 = T1 * (D2/D1)^1.06
          const predictTime = (targetDistance: number) => {
            const predictedMinutes = raceTimeMinutes * Math.pow(targetDistance / raceDistance, 1.06);
            const hours = Math.floor(predictedMinutes / 60);
            const mins = Math.floor(predictedMinutes % 60);
            const secs = Math.round((predictedMinutes % 1) * 60);
            
            if (hours > 0) {
              return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
            }
            return `${mins}:${secs.toString().padStart(2, '0')}`;
          };
          
          return {
            baseRace: `${raceDistance}km in ${Math.floor(raceTimeMinutes)}:${Math.round((raceTimeMinutes % 1) * 60).toString().padStart(2, '0')}`,
            predictions: {
              '5K': predictTime(5),
              '10K': predictTime(10),
              'Half Marathon': predictTime(21.1),
              'Marathon': predictTime(42.2),
            },
          };
        },
      }),
    },
  });

  return result.toUIMessageStreamResponse();
}