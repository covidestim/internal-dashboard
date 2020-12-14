import {
  XYPlot,
  XAxis,
  YAxis,
  HorizontalGridLines,
  VerticalGridLines,
  LineSeriesCanvas,
  MarkSeriesCanvas,
  Highlight
} from 'react-vis';
import _ from 'lodash';
import { useAllRunResults, useAllRunResultsDev } from '../src/data';
import { format } from 'date-fns';

import { useState } from 'react';

function groupByRunDate(data) {
  return _.groupBy(data, (d) => d["run.date"])
}

export function ResultsVizZoomable (props) {
  const [lastDrawLocation, setLastDrawLocation] = useState(null);

  const { measure, fips }     = props;
  const { data, error }       = useAllRunResults(fips);
  const { data: dataDev, error: errorDev } = useAllRunResultsDev(fips);

  console.log(data);
  console.log(error);
  console.log(dataDev);
  console.log(errorDev);

  const resultsGrouped        = data    && groupByRunDate(data);
  const resultsGroupedDev     = dataDev && groupByRunDate(dataDev);

  return (
    <XYPlot
      xDomain={
        lastDrawLocation && [
          lastDrawLocation.left,
          lastDrawLocation.right
        ]
      }
      yDomain={
        lastDrawLocation && [
          lastDrawLocation.bottom,
          lastDrawLocation.top
        ]
      }
      width={850}
      height={300}
      getX={(d) => new Date(d.date)}
      getY={(d) => d[measure]}
      xType="time"
      style={{backgroundColor: 'white'}}
    >
      <HorizontalGridLines />

      <YAxis />
      <XAxis tickFormat={(d) => format(d, 'M/dd')}/>

      {_.map(
        resultsGrouped,
        (v, k) => (
          <LineSeriesCanvas data={v} key={k} color="black" opacity={0.1} />
        )
      )}

      <MarkSeriesCanvas
        data={_.map(resultsGrouped, (d) => _.maxBy(d, (day) => day.date))}
        color="red" size={1}
      />

      {_.map(
        resultsGroupedDev,
        (v, k) => (
          <LineSeriesCanvas data={v} key={k} color="turquoise" opacity={0.7} />
        )
      )}

      <MarkSeriesCanvas
        data={_.map(resultsGroupedDev, (d) => _.maxBy(d, (day) => day.date))}
        color="blue" size={1}
      />

      <Highlight
        onBrushEnd={area => setLastDrawLocation(area)}
        onDrag={area => {
          setLastDrawLocation({
            bottom: lastDrawLocation.bottom + (area.top - area.bottom),
            left: lastDrawLocation.left - (area.right - area.left),
            right: lastDrawLocation.right - (area.right - area.left),
            top: lastDrawLocation.top + (area.top - area.bottom)
          })
        }}
      />
    </XYPlot>
  );
}
