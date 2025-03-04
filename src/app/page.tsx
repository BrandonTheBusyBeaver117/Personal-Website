'use client';

import Image from 'next/image';
import Link from 'next/link';

import { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';
import Loading from './components/loading';
import DeckGL, { GeoJsonLayer, PickingInfo, FlyToInterpolator, MapViewState } from 'deck.gl';

import Map from 'react-map-gl/mapbox';
import { GeoJSON } from 'geojson';

// import COLLEGE_DATA from './filtered_colleges.json';

type College = {
  properties: {
    NAME: string;
    ADDRESS: string;
    CITY: string;
    STATE: string;
    LATITUDE: number;
    LONGITUDE: number;
  };
};

type CursorState = {
  isDragging: boolean;
  isHovering: boolean;
};

const Home: React.FC = () => {
  return (
    <>
      <div className="flex min-h-72 w-full max-w-xl flex-col items-center justify-evenly rounded-lg bg-white px-8">
        <h1 className="text-center">Beaver dam</h1>
        <h1 className="text-center">A personal website for Brandon Nguyen</h1>
      </div>

      <div className="flex h-12 w-2/5 justify-evenly">
        <Link
          className="flex basis-1/3 items-center justify-center rounded-full bg-slate-100 transition duration-300 ease-in-out hover:-translate-y-1 hover:bg-sky-200"
          href="/colleges"
        >
          <div>College Tracker</div>
        </Link>
        {/* 
        <Link
          className="flex basis-1/3 items-center justify-center rounded-full bg-slate-100 transition duration-300 ease-in-out hover:-translate-y-1 hover:bg-sky-200"
          href="/signup"
        >
          <div>Sign up</div>
        </Link> */}
      </div>
    </>
  );
};

export default Home;
