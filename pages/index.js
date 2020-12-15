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

import MapChart from '../components/MapChart';

export default function Index() {


  return (
    <Container maxWidth="lg">
      <Box my={4}>
        <div>
          <MapChart/>
        </div>
      </Box>
    </Container>
  );
}
