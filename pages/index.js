import React, { useEffect, useState } from 'react';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import ProTip from '../src/ProTip';
import Link from '../src/Link';
import Copyright from '../src/Copyright';

import TextField from '@material-ui/core/TextField';
import PostgREST from 'postgrest-client';
import {
  XYPlot,
  XAxis,
  YAxis,
  HorizontalGridLines,
  VerticalGridLines,
  LineSeries
} from 'react-vis';
import _ from 'lodash';

export default function Index() {

  const [estimates, setEstimates] = useState({});
  const [inputs, setInputs] = useState({});
  const [fips, setFips] = useState("09009");

  var Api = new PostgREST("http://localhost:3020");

  async function fetchHistory(fips) {
    return await Api.get('/county_estimates')
      .select(`date, infections, "run.date", Rt`)
      .match({fips: fips})
      .order(['"run.date"', 'date'], [true, true])
  }

  async function fetchInputs(fips) {
    return await Api.get('/input_data')
      .select(`date, cases, deaths, "run.date"`)
      .match({fips: fips})
      .order(['"run.date"', 'date'], [true, true])
  }

  function groupByRunDate(data) {
    return _.groupBy(data, (d) => d["run.date"])
  }

  useEffect(() => {
    if (fips.length === 5)
      fetchHistory(fips).then((data) => {setEstimates(data)});
  }, [fips]);

  useEffect(() => {
    if (fips.length === 5)
      fetchInputs(fips).then((data) => {setInputs(data)});
  }, [fips]);

  const dataForChart = groupByRunDate(estimates);
  const inputsForChart = groupByRunDate(inputs);

  console.log("Data for chart:");
  console.log(dataForChart);

  const handleChange = (event) => {
    setFips(event.target.value);
  };

  return (
    <Container maxWidth="sm">
      <Box my={4}>
        <XYPlot
          width={600}
          height={300}
          getX={(d) => new Date(d.date)}
          getY={(d) => d.Rt}
          xType="time"
        >
          <HorizontalGridLines />
          <VerticalGridLines />
          <XAxis />
          <YAxis />
          {_.map(
            dataForChart,
            (v, k) => (
              <LineSeries data={v} key={k} color="black" opacity={0.1} />
            )
          )}
        </XYPlot>
        <XYPlot
          width={600}
          height={300}
          getX={(d) => new Date(d.date)}
          getY={(d) => d.infections}
          xType="time"
        >
          <HorizontalGridLines />
          <VerticalGridLines />
          <XAxis />
          <YAxis />
          {_.map(
            dataForChart,
            (v, k) => (
              <LineSeries data={v} key={k} color="black" opacity={0.1} />
            )
          )}
        </XYPlot>
        <XYPlot
          width={600}
          height={300}
          getX={(d) => new Date(d.date)}
          getY={(d) => d.cases}
          xType="time"
        >
          <HorizontalGridLines />
          <VerticalGridLines />
          <XAxis />
          <YAxis />
          {_.map(
            inputsForChart,
            (v, k) => (
              <LineSeries data={v} key={k} color="black" opacity={0.1} />
            )
          )}
        </XYPlot>
        <TextField value={fips} onChange={handleChange}/>
        <Typography variant="h4" component="h1" gutterBottom>
          Next.js example
        </Typography>
        <Link href="/about" color="secondary">
          Go to the about page
        </Link>
        <ProTip />
        <Copyright />
      </Box>
    </Container>
  );
}
