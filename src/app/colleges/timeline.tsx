import { useState } from 'react';
import { motion } from 'framer-motion';
import { CollegeDecision } from './page';

const intervalDays = 14;

const calculateMinMaxTimes = (decisions: CollegeDecision[]) => {
  const timestamps = decisions.map((decision) => new Date(decision['Decision Date']).getTime());

  // console.log(timestamps);
  const minTime = Math.min(...timestamps);
  const maxTime = Math.max(...timestamps);

  let minDate = new Date(minTime);

  // Generic far away date
  let closestMin = new Date(1962, 3, 14);

  for (
    let i = 1;
    i < new Date(minDate.getFullYear(), minDate.getMonth(), 0).getDate();
    i += intervalDays
  ) {
    const prevDiff = minDate.getTime() - closestMin.getTime();

    const currentDate = new Date(minDate.getFullYear(), minDate.getMonth(), i);

    const currentDiff = minDate.getTime() - currentDate.getTime();

    // console.log('Prev Diff:');
    // console.log(prevDiff);
    // console.log('-----');
    // console.log('Current Date:');
    // console.log(currentDate);
    // console.log('-----');
    // console.log('Current Diff:');
    // console.log(currentDiff);

    if (currentDiff < 0) {
      break;
    }

    if (Math.abs(currentDiff) < Math.abs(prevDiff)) {
      closestMin = currentDate;
    }
  }
  minDate = closestMin;

  let maxDate = new Date(maxTime);

  const maxDateConstraint = new Date(maxDate);
  // maxDateConstraint.setDate(maxDateConstraint.getDate() + intervalDays);

  const counter = new Date(minDate);

  while (counter < maxDateConstraint) {
    counter.setDate(counter.getDate() + intervalDays);
  }

  maxDate = counter;

  return [minDate.getTime(), maxDate.getTime()];
};

const calculateMinMaxDecisions = (decisions: CollegeDecision[]) => {
  const timestamps = decisions.map((decision) => new Date(decision['Decision Date']).getTime());

  const minTime = Math.min(...timestamps);
  const maxTime = Math.max(...timestamps);

  const earliestDecision = decisions.find((decision) => {
    // console.log('inspected');
    // console.log(new Date(decision['Decision Date']).getTime());
    // console.log('pono');
    // console.log(minTime);

    return new Date(decision['Decision Date']).getTime() == minTime;
  });

  const latestDecision = decisions.find((decision) => {
    // console.log('inspected');
    // console.log(new Date(decision['Decision Date']).getTime());
    // console.log('pono');
    // console.log(maxTime);

    return new Date(decision['Decision Date']).getTime() == maxTime;
  });

  return [earliestDecision, latestDecision];
};

const getValidDecisions = (decisions: CollegeDecision[]): CollegeDecision[] => {
  return decisions.filter((decisions) => {
    if (!(decisions.Decision === 'Awaiting...')) {
      console.log(decisions.College);
    }

    return !(decisions.Decision === 'Awaiting...');
  });
};

// Function to calculate proportional spacing
const calculatePositions = (decisions: CollegeDecision[]) => {
  const [minTime, maxTime] = calculateMinMaxTimes(decisions);

  const positionMap = new Map<string, string>();

  for (const decision of decisions) {
    const time = new Date(decision['Decision Date']).getTime();
    positionMap.set(decision.College, ((time - minTime) / (maxTime - minTime)) * 100 + '%');
  }

  return positionMap;
};

const calculateLabelPositions = (decisions: CollegeDecision[]): string[][] => {
  // We assume the interval is correct, bc we calculated it for the same interval
  const [minTime, maxTime] = calculateMinMaxTimes(decisions);

  const minDate = new Date(minTime);
  const maxDate = new Date(maxTime);

  let currentLabelDate = new Date(minDate);

  const labelDates = [];

  // const maxLabelConstraint = new Date(maxDate);
  // maxLabelConstraint.setDate(maxLabelConstraint.getDate() + intervalDays);
  while (currentLabelDate <= maxDate) {
    labelDates.push(new Date(currentLabelDate));

    // prevLabelDate = new Date(currentLabelDate);
    currentLabelDate.setDate(currentLabelDate.getDate() + intervalDays);
    // if (prevLabelDate.getMonth() != currentLabelDate.getMonth()) {
    //   currentLabelDate.setDate(1);
    // }
  }

  const positions = [];

  for (const labelDate of labelDates) {
    // console.log(labelDate);
    positions.push([
      labelDate.getMonth() + 1 + '/' + labelDate.getDate() + '/' + labelDate.getFullYear(),
      ((labelDate.getTime() - minTime) / (maxTime - minTime)) * 100 + '%',
    ]);
  }

  // console.log(positions);

  return positions;
};

type TimelineProps = {
  decisions: CollegeDecision[];
  startAtMostRecent: boolean;
};

const Timeline: React.FC<TimelineProps> = ({ decisions, startAtMostRecent }) => {
  const validDecisions = getValidDecisions(decisions);

  const positions = calculatePositions(validDecisions);

  const [earliestDecision, latestDecision] = calculateMinMaxDecisions(validDecisions);

  const [selected, setSelected] = useState(startAtMostRecent ? latestDecision : earliestDecision);
  console.log(selected);

  const dateLabelPositions = calculateLabelPositions(validDecisions);

  return (
    <div className="absolute bottom-[0.5rem] left-[6rem] mx-auto w-3/5 p-6">
      <div className="relative z-0 h-[2px] w-full bg-gray-300" />

      {/* Events */}
      <div className="relative flex w-full">
        {validDecisions.map((decision) => {
          return (
            <div
              key={decision.College}
              className="absolute z-10 flex flex-col items-center"
              // Subtrack one px bc half of line height or bc of border?
              style={{
                left: positions.get(decision.College),
                transform: 'translate(-50%, calc(-50% - 1px))',
              }}
            >
              {/* Step (Clickable Dot, *sitting directly on the line*) */}
              <motion.div
                className={`flex h-[1rem] w-[1rem] cursor-pointer items-center justify-center rounded-full border-2 ${
                  selected?.College === decision.College
                    ? 'border-blue-400 bg-blue-400'
                    : 'border-gray-400 bg-white'
                }`}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSelected(decision)}
              ></motion.div>

              {/* Date Label (Above Dots)
              <div className="mb-2 text-sm">{decision['Decision Date']}</div> */}
            </div>
          );
        })}
      </div>

      <div className="relative w-full">
        {dateLabelPositions.map(([label, position]) => {
          return (
            <div
              key={label}
              className="pointer-events-none absolute z-10 flex-col items-center text-white"
              style={{ left: position, transform: 'translateX(-50%)' }}
              //style={{ left: position }}
            >
              <p className="text-center">|</p>
              {label}
            </div>
          );
        })}
      </div>

      {/* Selected Event Display */}
      <div className="relative mt-8 text-center">
        {/* <h2 className="text-xl font-bold">{events.find((e) => e.date === selected)?.label}</h2> */}
        <p className="translate-y-[70%] text-gray-500">Date: {selected?.['Decision Date']}</p>
      </div>
    </div>
  );
};

export default Timeline;
