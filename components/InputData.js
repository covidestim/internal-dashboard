import _ from 'lodash';
import {
  useLatestInputData,
  useInputData
} from '../src/data';
import {
  XYPlot,
  XAxis,
  YAxis,
  HorizontalGridLines,
  VerticalGridLines,
  LineSeries,
  VerticalBarSeries
} from 'react-vis';
import sma from 'sma';

function InputData(props) {

  const {data: dataInputs, error: errorDataInputs} =
    props.date ? useInputData(props.fips, props.date) : useLatestInputData(props.fips);

  const { metric } = props;

  const d = dataInputs ? dataInputs : [];

  const minDate = _.minBy(d, (d) => d.date);
  const maxDate = _.maxBy(d, (d) => d.date);

  const xRange = minDate ? [new Date(minDate.date).getTime(), new Date(maxDate.date).getTime()] : undefined;

  const color = metric === 'cases' ? 'grey' : 'black';

  var sma_7d = sma(
    _.map(d, (s) => s[metric]),
    7,
    n => n
  );

  sma_7d = [0,0,0,0,0,0].concat(sma_7d); // First 6 elements aren't part of sma

  const sma_zipped = _.zipWith(
    _.map(d, (d) => d.date),
    sma_7d,
    (date, avg) => {
      var d = {date: date};
      d[metric] = avg;
      return d;
    }
  );

  return (
    <XYPlot
      width={900}
      height={300}
      xDomain={xRange}
      getX={(d) => new Date(d.date)}
      getY={(d) => d[metric]}
      xType="time"
      style={{backgroundColor: 'white'}}
    >
      <HorizontalGridLines />
      <VerticalGridLines />
      <XAxis tickTotal={10} />
      <YAxis />
      <VerticalBarSeries data={d} color={color} opacity={1} />
      <LineSeries data={sma_zipped} color="blue" />
    </XYPlot>
  );
}

export { InputData };
