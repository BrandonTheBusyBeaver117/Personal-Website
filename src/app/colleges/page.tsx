'use client';

import Image from 'next/image';
import Link from 'next/link';

import { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';
import Loading from '../components/loading';
import DeckGL, { GeoJsonLayer, PickingInfo, FlyToInterpolator, MapViewState } from 'deck.gl';

import Map from 'react-map-gl/mapbox';
import { GeoJSON } from 'geojson';

import COLLEGE_DATA from './filtered_colleges.json';

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

const Colleges: React.FC = () => {
  // Initializing router
  const router = useRouter();

  const MAPBOX_KEY =
    'pk.eyJ1IjoicGFzc2FiZWF2ZXI5MDkiLCJhIjoiY203cHZkdGg0MG9zcDJqb3AzMjE5cGRlayJ9.nBKnKKs04SY1UOuMe1aY_g';
  const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json';

  const initialViewState: MapViewState = {
    latitude: 39.8283,
    longitude: -98.5795,
    zoom: 3.5,
    bearing: 0,
    pitch: 0,
  };

  const [viewState, setViewState] = useState<MapViewState>(initialViewState);

  const onClick = (collegeInfo: PickingInfo<College>) => {
    const college = collegeInfo.object?.properties;
    if (!college) return;
    console.log(college.NAME);
    flyToCollege(college.LONGITUDE, college.LATITUDE);
  };

  const getCursor = (state: CursorState) => {
    if (state.isDragging) return 'grabbing';

    return state.isHovering ? 'pointer' : 'default';
  };

  const flyToCollege = (longitude: number, latitude: number) => {
    setViewState({
      longitude: longitude,
      latitude: latitude,
      zoom: 10,
      transitionInterpolator: new FlyToInterpolator({ speed: 1 }),
      transitionDuration: 'auto',
      transitionEasing: (x) => {
        // Funny cubic easing
        return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
      },
    });
  };

  const resetCamera = () => {
    setViewState({
      ...initialViewState,
      transitionInterpolator: new FlyToInterpolator({ speed: 1 }),
      transitionDuration: 'auto',
      transitionEasing: (x) => {
        // Funny cubic easing
        return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
      },
    });
  };

  const layers = [
    new GeoJsonLayer({
      id: 'colleges',
      data: COLLEGE_DATA as GeoJSON,
      // Styles
      filled: true,
      pointRadiusMinPixels: 5,
      pointRadiusMaxPixels: 25,
      pointRadiusScale: 750,
      // getPointRadius: (f: any) => {
      //   console.log(f);
      //   return 5;
      // },
      getFillColor: [86, 144, 58, 250],
      pickable: true,
      autoHighlight: true,
      onClick: (collegeInfo: PickingInfo<College>) => onClick(collegeInfo),
    }),
  ];

  return (
    <>
      <Loading />
      <DeckGL initialViewState={viewState} controller={true} layers={layers} getCursor={getCursor}>
        <Map mapStyle={MAP_STYLE} mapboxAccessToken={MAPBOX_KEY} />
      </DeckGL>
      <button
        className="z-10 rounded-full bg-slate-100 px-[0.75rem] py-[0.25rem] transition duration-300 ease-in-out hover:bg-sky-200"
        onClick={resetCamera}
      >
        Reset
      </button>
    </>
  );
};

export default Colleges;
