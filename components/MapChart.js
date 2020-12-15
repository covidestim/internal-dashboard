import React, { useState, useEffect } from "react";
import { ComposableMap, ZoomableGroup, Geographies, Geography } from "react-simple-maps";
import { scaleOrdinal } from "d3-scale";
import { schemePaired } from "d3-scale-chromatic";
import { csv } from "d3-fetch";
import { useRouter } from "next/router";

const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/counties-10m.json";
const tractsURL = "https://covidestim.s3.us-east-2.amazonaws.com/test-tracts-by-reason.csv";

const colorScale = scaleOrdinal(schemePaired);

const MapChart = () => {
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

  return (
    <>
      <ComposableMap projection="geoAlbersUsa">
        <ZoomableGroup zoom={1}>
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map(geo => {
                const cur = data.find(s => s.fips === geo.id);

                const svgEl =
                  <Geography
                    geography={geo}
                    key={geo.rsmKey}
                    fill={colorScale(cur ? cur.top_reason : undefined)}
                    stroke={cur ? "#4a4a4a" : undefined}
                    strokeWidth={cur ? 1 : undefined}
                    onClick={(e) => router.push(`/${geo.id}`)}
                    cursor='pointer'
                  />

                return svgEl;
              })
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>
    </>
  );
};

export default MapChart;

