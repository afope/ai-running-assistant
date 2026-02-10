import { zodSchema } from 'ai';
import { z } from 'zod';

// Define parameter schemas separately to avoid circular type references
const calculatePaceParams = z.object({
  distance: z.number().describe('Distance in kilometers'),
  hours: z.number().optional().default(0),
  minutes: z.number(),
  seconds: z.number().optional().default(0),
});

const suggestTrainingZonesParams = z.object({
  thresholdPace: z
    .string()
    .describe('Threshold pace in min:sec per km format (e.g., "4:30")'),
});

export const runningTools = {
    calculatePace: {
      description: 'Calculate running pace for a given distance and time',
      parameters: zodSchema(calculatePaceParams),
      execute: async ({ distance, hours = 0, minutes, seconds = 0 }: z.infer<
        typeof calculatePaceParams
      >) => {
        const totalMinutes = hours * 60 + minutes + seconds / 60;
        const pacePerKm = totalMinutes / distance;
        const paceMinutes = Math.floor(pacePerKm);
        const paceSeconds = Math.round((pacePerKm - paceMinutes) * 60);
        
        return {
          pacePerKm: `${paceMinutes}:${paceSeconds.toString().padStart(2, '0')}`,
          totalTime: `${hours}:${minutes}:${seconds}`,
          distance,
        };
      },
    },
    
    suggestTrainingZones: {
      description: 'Calculate heart rate or pace training zones based on threshold values',
      parameters: zodSchema(suggestTrainingZonesParams),
      execute: async ({ thresholdPace }: z.infer<
        typeof suggestTrainingZonesParams
      >) => {
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
    },
  };