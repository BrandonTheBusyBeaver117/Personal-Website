'use client';

import Image from 'next/image';

type CollegeCardProps = {
  isLeftAligned: boolean;
};

const CollegeCard: React.FC<CollegeCardProps> = ({ isLeftAligned }) => {
  const margin = 1;

  const alignStyle = isLeftAligned
    ? {
        left: margin + 'vw',
      }
    : {
        right: margin + 'vw',
      };

  // isLeftAligned ? margin + 'vw' : 100 - margin + 'vw';
  // console.log(alignStyle);
  // If not resolved, show the loading page, otherwise show the dashboard
  return (
    <>
      <div
        className={`z-13 fixed top-[2vh] flex h-[80vh] w-[45vw] flex-col items-center justify-evenly rounded-3xl border-4 border-sky-600 bg-sky-200`}
        style={{ ...alignStyle, top: margin + 'vw' }}
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
      </div>
    </>
  );
};

export default CollegeCard;
