'use client';

import Link from 'next/link';

import { useState } from 'react';

import DeckGL, { GeoJsonLayer, PickingInfo, FlyToInterpolator, MapViewState } from 'deck.gl';
import Map from 'react-map-gl/mapbox';
import { GeoJSON } from 'geojson';

import COLLEGE_DATA from './college_decisions.json';

import { FormControlLabel, FormGroup, Switch } from '@mui/material';
import Timeline from './timeline';

import Loading from '../components/loading';

export type College = {
  College: string; // College name
  Ranking: number; // Numeric ranking
  'Decision Date': string; // Date in string format (can be converted to Date if needed)
  Prediction: 'ACCEPTED' | 'Rejected lol' | 'Waitlisted' | 'Awaiting...'; // Prediction type
  Decision: 'ACCEPTED' | 'Rejected lol' | 'Waitlisted' | 'Awaiting...'; // Actual decision (optional if undecided)
  OfficialName: string;
  Alias: string;
  Address: string;
  City: string;
  State: string;
  Population: number;
  County: string;
  Latitude: number;
  Longitude: number;
};

type CollegeGeoJSON = {
  properties: {
    collegeData: College;
  };
};

const colleges = COLLEGE_DATA as College[];

type CursorState = {
  isDragging: boolean;
  isHovering: boolean;
};

const Colleges: React.FC = () => {
  const [isDeckRendered, setIsDeckRendered] = useState(false);
  const [shouldZoom, setShouldZoom] = useState(true);
  const [startAtMostRecent, setStartAtMostRecent] = useState(false);

  // const [parsedDecisions, setParsedDecisions] = useState<CollegeDecision[]>(
  //   COLLEGE_DECISIONS as CollegeDecision[],
  // );

  // console.log(parsedDecisions);

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

  const displayCollegeCard = (college: College) => {
    flyToCollege(college.Longitude, college.Latitude);
  };

  const getCursor = (state: CursorState) => {
    if (state.isDragging) return 'grabbing';

    return state.isHovering ? 'pointer' : 'default';
  };

  const customTransitionEasing = (x: number) => {
    return -(Math.cos(Math.PI * x) - 1) / 2;
  };

  const interpolator = new FlyToInterpolator({ speed: 3 / 4 });

  const flyToCollege = (longitude: number, latitude: number) => {
    setViewState({
      longitude: longitude,
      latitude: latitude,
      zoom: 10,
      transitionInterpolator: interpolator,
      transitionDuration: 'auto',
      transitionEasing: customTransitionEasing,
    });
  };

  const resetCamera = () => {
    setViewState({
      ...initialViewState,
      transitionInterpolator: interpolator,
      transitionDuration: 'auto',
      transitionEasing: customTransitionEasing,
    });
  };

  const getColor = (college: College): [number, number, number, number] => {
    switch (college.Decision) {
      case 'ACCEPTED':
        return [145, 230, 150, 255];
      case 'Rejected lol':
        return [255, 145, 125, 255];
      case 'Waitlisted':
        return [255, 229, 160, 255];
      case 'Awaiting...':
      default:
        return [192, 225, 255, 255];
    }
  };

  const collegeGeo: GeoJSON = {
    type: 'FeatureCollection',
    features: colleges.map((college) => {
      return {
        type: 'Feature',
        id: college.Ranking,
        properties: {
          collegeData: college,
        },
        geometry: {
          type: 'Point',
          coordinates: [college.Longitude, college.Latitude],
        },
      };
    }),
  };

  const layers = [
    new GeoJsonLayer({
      id: 'colleges',
      data: collegeGeo,

      // Styles
      filled: true,
      pointRadiusMinPixels: 5,
      pointRadiusMaxPixels: 25,
      pointRadiusScale: 750,

      getFillColor: (collegeGeoParam: CollegeGeoJSON) =>
        getColor(collegeGeoParam.properties.collegeData),
      pickable: true,
      autoHighlight: true,
      onClick: (collegeInfo: PickingInfo) => {
        console.log(collegeInfo);
        const college = collegeInfo?.object.properties.collegeData;
        console.log(college);

        if (!college) {
          console.log(college);
          return;
        }
        displayCollegeCard(college);
      },
    }),
  ];

  return (
    <>
      <Loading isLoadingFinished={isDeckRendered} />

      <div className="fixed left-0 top-0 h-screen w-screen">
        <DeckGL
          initialViewState={viewState}
          controller={true}
          layers={layers}
          getCursor={getCursor}
          onLoad={() => setIsDeckRendered(true)}
        >
          <Map mapStyle={MAP_STYLE} mapboxAccessToken={MAPBOX_KEY} />
        </DeckGL>
      </div>

      <Timeline
        colleges={colleges}
        startAtMostRecent={startAtMostRecent}
        displayCollegeCard={displayCollegeCard}
      />

      <div className="fixed bottom-0 right-0 z-10 flex h-1/5 w-1/5 flex-col items-center justify-evenly rounded-lg bg-gray-100 bg-opacity-25">
        {/* We need smth else for the "what date do u want to get updated on" */}
        <FormGroup>
          <FormControlLabel
            control={
              <Switch
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setShouldZoom(event.target.checked);
                }}
                defaultChecked
              />
            }
            label="Zoom to most recent school?"
          />
          <FormControlLabel
            control={
              <Switch
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setStartAtMostRecent(event.target.checked);
                }}
                defaultChecked
              />
            }
            label="Zoom to most recent school?"
          />
        </FormGroup>

        <div></div>
        <button
          className="z-10 rounded-full bg-slate-100 bg-opacity-100 px-[0.75rem] py-[0.25rem] transition duration-300 ease-in-out hover:bg-sky-200"
          onClick={resetCamera}
        >
          Reset
        </button>
        <Link
          className="z-10 rounded-full bg-slate-100 bg-opacity-100 px-[0.75rem] py-[0.25rem] transition duration-300 ease-in-out hover:bg-sky-200"
          href="/"
        >
          Home
        </Link>
      </div>

      <div></div>
    </>
  );
};

export default Colleges;
