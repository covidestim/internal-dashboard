import React, { useState, useEffect } from "react";
import { ComposableMap, ZoomableGroup, Geographies, Geography } from "react-simple-maps";
import { scaleOrdinal } from "d3-scale";
import { schemePaired } from "d3-scale-chromatic";
import { csv } from "d3-fetch";
import { useRouter } from "next/router";

const geoCountiesUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/counties-10m.json";
const geoStatesUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";
const tractsURL = "https://covidestim.s3.us-east-2.amazonaws.com/test-tracts-by-reason.csv";

const colorScale = scaleOrdinal(schemePaired);

const MapChart = (props) => {
  const [data, setData] = useState([]);
  const router = useRouter();

  useEffect(() => {
    // https://www.bls.gov/lau/
    csv(tractsURL).then(counties => {
      console.log("We got it!");
      console.log(counties);
      setData(counties);
    });
  }, []);

  const geoUrl = props.geo === 'county' ? geoCountiesUrl : geoStatesUrl;

  return (
    <>
      <ComposableMap projection="geoAlbersUsa">
        <ZoomableGroup zoom={1}>
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map(geo => {
                const cur = data.find(s => s.fips === geo.id);

                if (props.geo == 'county')
                  return (
                    <Geography
                      geography={geo}
                      key={geo.rsmKey}
                      fill={colorScale(cur ? cur.top_reason : undefined)}
                      stroke={cur ? "#4a4a4a" : undefined}
                      strokeWidth={cur ? 1 : 0.2}
                      onClick={(e) => router.push(`/${geo.id}`)}
                      cursor='pointer'
                    />
                  );
                else
                  return (
                    <Geography
                      geography={geo}
                      key={geo.rsmKey}
                      strokeWidth={1}
                      onClick={(e) => router.push(`/${geo.properties.name}`)}
                      cursor='pointer'
                    />
                  );
              })
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>
    </>
  );
};

export default MapChart;

