'use client';

import Image from 'next/image';
import { College } from './page';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

type CollegeCardProps = {
  selectedCollege: College | null;
  isCardVisible: boolean;
};

// Props should force update automatically right?
const CollegeCard: React.FC<CollegeCardProps> = ({ selectedCollege, isCardVisible }) => {
  if (!selectedCollege) {
    return <></>;
  }

  const margin = '1vw';

  // The selected college will be different from prev college
  // Once we select a college, we still want to remember the old one for positioning
  const [prevCollege, setPrevCollege] = useState(selectedCollege);

  const prevLeftPosition = useRef(false);

  useEffect(() => {
    if (isCardVisible) {
      setPrevCollege(selectedCollege);
    }
  }, [selectedCollege, isCardVisible]);

  useEffect(() => {
    if (!isCardVisible) {
      return;
    }
    prevLeftPosition.current = selectedCollege.CardPlacement == 'left';
  }, [isCardVisible]);

  const isLeft = selectedCollege.CardPlacement == 'left';

  const leftPosition = '-50vw';
  const rightPosition = '50vw';

  return (
    <AnimatePresence>
      {isCardVisible && (
        <motion.div
          // Basically, while during transition, we should defer to prev college
          style={{
            ...(prevCollege.CardPlacement == 'left'
              ? {
                  left: margin,
                }
              : {
                  right: margin,
                }),
            position: 'fixed',
            top: margin,
          }}
          initial={{ x: isLeft ? leftPosition : rightPosition, opacity: 0 }} // Start off-screen (left)
          animate={{ x: 0, opacity: 1 }} // Fly in to the center
          // Exist based on the prev college's position, not the one we just clicked
          exit={{
            x: prevCollege.CardPlacement == 'left' ? leftPosition : rightPosition,
            opacity: 0,
          }} // Fly out to the left
          transition={{ type: 'tween', duration: 0.6 }}
          className="z-13 fixed top-[2vh] flex h-[80vh] w-[45vw] flex-col items-center justify-evenly rounded-3xl border-4 border-sky-600 bg-sky-200"
        >
          <div id="intro wrapper" className="flex grow-[3] basis-0 flex-col items-center text-2xl">
            <h1 className="m-5">Hello!</h1>
            <h1>Welcome to your dashboard!</h1>
          </div>

          <h2 className="m-5">Chances of allowing Brandon to intern at LJL:</h2>
          <div className="text-1xl relative mb-6 flex w-3/4 grow-[5] basis-0 flex-col items-center">
            {/* <Image
            className="relative"
            src="/upwardtrend.jpg"
            alt="chart"
            fill={true}
            style={{ objectFit: 'contain' }}
          /> */}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CollegeCard;
