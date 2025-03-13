'use client';

import Link from 'next/link';

import { useEffect, useState } from 'react';

import DeckGL, {
  GeoJsonLayer,
  PickingInfo,
  FlyToInterpolator,
  MapViewState,
  WebMercatorViewport,
} from 'deck.gl';
import Map from 'react-map-gl/mapbox';
import { GeoJSON } from 'geojson';

import COLLEGE_DATA from './college_decisions.json';

import { FormControlLabel, FormGroup, Switch } from '@mui/material';
import Timeline from './timeline';

import Loading from '../components/loading';
import CollegeCard from './collegecard';

export type College = {
  College: string; // College name
  Ranking: number; // Numeric ranking
  'Decision Date': string; // Date in string format (can be converted to Date if needed)
  Prediction: 'ACCEPTED' | 'Rejected lol' | 'Waitlisted' | 'Awaiting...'; // Prediction type
  Decision: 'ACCEPTED' | 'Rejected lol' | 'Waitlisted' | 'Awaiting...'; // Actual decision (optional if undecided)
  'Waitlist Date': string;
  OfficialName: string;
  Alias: string;
  Address: string;
  City: string;
  State: string;
  Population: number;
  County: string;
  Latitude: number;
  Longitude: number;
  CardPlacement: 'left' | 'right';
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
  const [isLeftAligned, setLeftAligned] = useState(true);

  const [selectedCollege, setSelectedCollege] = useState<College | null>(null);

  useEffect(() => {
    if (!selectedCollege) {
      return;
    }
    flyToCollege(selectedCollege);
  }, [selectedCollege]);

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
    setLeftAligned(college.CardPlacement == 'left');
  };

  const getCursor = (state: CursorState) => {
    if (state.isDragging) return 'grabbing';

    return state.isHovering ? 'pointer' : 'default';
  };

  const customTransitionEasing = (x: number) => {
    return -(Math.cos(Math.PI * x) - 1) / 2;
  };

  // Function to shift longitude
  const getTranslatedLongitude = (
    longitude: number,
    latitude: number,
    zoom: number,
    isLeft: boolean,
  ) => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    const viewport = new WebMercatorViewport({ longitude, latitude, zoom, width, height });

    // Basically, move the center over to the right if the card is on the left
    // I believe this is spacing from the right
    const position = isLeft ? 0.3 : 0.7;

    // Convert the left screen percentage to a world position
    const worldCoordsLeft = viewport.unproject([position * width, height / 2]);

    console.log(worldCoordsLeft);

    return worldCoordsLeft[0]; // New longitude
  };

  const interpolator = new FlyToInterpolator({ speed: 3 / 4 });

  const flyToCollege = (college: College) => {
    const zoom = 10;
    const shiftedLongitude = getTranslatedLongitude(
      college.Longitude,
      college.Latitude,
      zoom,
      college.CardPlacement == 'left',
    );

    setViewState({
      longitude: shiftedLongitude,
      latitude: college.Latitude,
      zoom: zoom,
      transitionInterpolator: interpolator,
      transitionDuration: 'auto',
      transitionEasing: customTransitionEasing,
      onTransitionEnd: () => displayCollegeCard(college),
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
        setSelectedCollege(college);
        // flyToCollege(college);
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
        setSelectedMapCollege={setSelectedCollege}
        shouldZoom={shouldZoom}
      />

      <CollegeCard
        isLeftAligned={selectedCollege ? selectedCollege.CardPlacement == 'left' : true}
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
