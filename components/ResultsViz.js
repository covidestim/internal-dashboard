import {
  XYPlot,
  XAxis,
  YAxis,
  HorizontalGridLines,
  VerticalGridLines,
  LineSeriesCanvas
} from 'react-vis';
import _ from 'lodash';

export function ResultsViz(props) {

  const { data, measure } = props;

  return (
    <XYPlot
      width={900}
      height={300}
      getX={(d) => new Date(d.date)}
      getY={(d) => d[measure]}
      xType="time"
      style={{backgroundColor: 'white'}}
    >
      <HorizontalGridLines />
      <VerticalGridLines />
      <XAxis />
      <YAxis />
      {_.map(
        data,
        (v, k) => (
          <LineSeriesCanvas data={v} key={k} color="black" opacity={0.1} />
        )
      )}
    </XYPlot>
  );
}
