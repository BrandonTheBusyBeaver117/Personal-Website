import { useState } from 'react';
import { motion } from 'framer-motion';

// Sample event data with variable dates
const events = [
  { date: '2024-01-01', label: 'New Year' },
  { date: '2024-02-15', label: 'Event A' },
  { date: '2024-05-10', label: 'Event B' },
  { date: '2024-07-20', label: 'Event C' },
  { date: '2024-12-25', label: 'Christmas' },
];

// Function to calculate proportional spacing
const calculatePositions = (events: { date: string }[]) => {
  const timestamps = events.map((event) => new Date(event.date).getTime());
  const minTime = Math.min(...timestamps);
  const maxTime = Math.max(...timestamps);

  return timestamps.map((time) => ({
    left: ((time - minTime) / (maxTime - minTime)) * 100 + '%',
  }));
};

export default function Timeline() {
  const [selected, setSelected] = useState(events[0].date);
  const positions = calculatePositions(events);

  return (
    <div className="relative mx-auto w-3/5 max-w-4xl p-6">
      {/* Timeline Line -2px to offset height*/}
      <div className="absolute left-0 top-[calc(50%-2px)] z-0 h-[2px] w-full bg-gray-300" />

      {/* Events */}
      <div className="relative flex w-full">
        {events.map((event, index) => (
          <div
            key={event.date}
            className="absolute z-10 flex flex-col items-center"
            style={{ left: positions[index].left, transform: 'translateX(-50%)' }}
          >
            {/* Step (Clickable Dot, *sitting directly on the line*) */}
            <motion.div
              className={`flex h-[1rem] w-[1rem] cursor-pointer items-center justify-center rounded-full border-2 ${
                selected === event.date ? 'border-blue-400 bg-blue-400' : 'border-gray-400 bg-white'
              }`}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setSelected(event.date)}
            ></motion.div>

            {/* Date Label (Above Dots) */}
            <div className="mb-2 text-sm">{event.label}</div>
          </div>
        ))}
      </div>

      {/* Selected Event Display */}
      <div className="mt-8 text-center">
        <h2 className="text-xl font-bold">{events.find((e) => e.date === selected)?.label}</h2>
        <p className="text-gray-500">Date: {selected}</p>
      </div>
    </div>
  );
}
