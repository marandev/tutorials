import React, { useState, useEffect } from 'react';
import ReactMapGL, { Marker } from 'react-map-gl';

import { listLogEntries } from './API';

const App = () => {
  const [logEntries, setLogEntries] = useState([])
  const [viewport, setViewport] = useState({
    width: '100vh',
    height: '100vw',
    latitude: 37.7577,
    longitude: -122.4376,
    zoom: 3
  });

  useEffect(() => {
    (async () => {
      const logEntries = await listLogEntries();
      setLogEntries(logEntries);
    })();
  }, []);

  return (
    <ReactMapGL
      {...viewport}
      mapStyle="mapbox://styles/maran1989/ck7deusjo0bu31iobezyw7yay"
      mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
      onViewportChange={setViewport}
    >
      {
        logEntries.map(entry => (
          <Marker 
            latitude={entry.latitude} 
            longitude={entry.longitude}
            offsetLeft={-12}
            offsetTop={-24}
          >
            <div>
              <img className="marker" src="https://i.imgur.com/y0G5YTX.png" alt="marker" />
            </div>
          </Marker>
        ))
      }
    </ReactMapGL>
  )
}

export default App;