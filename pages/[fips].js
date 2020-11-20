import React, { useEffect, useState } from 'react';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import ProTip from '../src/ProTip';
import Link from '../src/Link';
import Copyright from '../src/Copyright';
import { useRouter } from 'next/router';

import PostgREST from 'postgrest-client';
import {
  XYPlot,
  XAxis,
  YAxis,
  HorizontalGridLines,
  VerticalGridLines,
  LineSeriesCanvas
} from 'react-vis';
import { ResultsViz } from '../components/ResultsViz';
import _ from 'lodash';
import { useAllRunResults, useInputData, useLogs, useWarnings } from '../src/data';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import CheckIcon from '@material-ui/icons/Check';
import ErrorIcon from '@material-ui/icons/Error';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

const useRowStyles = makeStyles({
  root: {
    '& > *': {
      borderBottom: 'unset',
    },
  },
});

function Row(props) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);
  const classes = useRowStyles();

  console.log("row:");
  console.log(row);

  return (
    <React.Fragment>
      <TableRow hover={true} className={classes.root}>
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.runDate}
        </TableCell>
        <TableCell align="right">{row.attempts}</TableCell>
        <TableCell align="right">{row.success ? <CheckIcon/> : <ErrorIcon/>}</TableCell>
        <TableCell align="right">{row.totalTime}</TableCell>
        <TableCell align="right">{row.successTime}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Typography variant="h6" gutterBottom component="div">
                RStan warning messages
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Warning message</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.warnings.map((warning) => (
                    <TableRow key={warning.warnings}>
                      <TableCell component="th" scope="row">
                        {warning.warnings}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export default function Index() {

  const classes = useStyles();
  const router = useRouter();

  const fips = router.query.fips;

  const {data: dataResults, error: errorDataResults} = useAllRunResults(fips);
  const {data: dataInputs, error: errorDataInputs} = useInputData(fips, '2020-11-01');
  const {data: dataLogs, error: errorDataLogs} = useLogs(fips);
  const {data: dataWarnings, error: errorDataWarnings} = useWarnings(fips);

  console.log("dataWarnings:");
  console.log(dataWarnings);

  function groupByRunDate(data) {
    return _.groupBy(data, (d) => d["run.date"])
  }

  const resultsGrouped = dataResults ? groupByRunDate(dataResults) : [];
  const inputsGrouped = dataInputs ? groupByRunDate(dataInputs) : [];
  const logsGrouped = dataLogs ? groupByRunDate(dataLogs) : [];

  return (
    <Container maxWidth="md">
      <Box my={4} margin={1}>
        <Typography variant="h4" component="h1" gutterBottom>
          Run history for FIPS [{fips}]
        </Typography>
      </Box>
      <Box my={4} margin={1}>
          <Typography variant="h6" component="h1" gutterBottom>
            R<sub>t</sub> history
          </Typography>
        <Paper>
          <ResultsViz data={resultsGrouped} measure="Rt"/>
        </Paper>
      </Box>
      <Box my={4} margin={1}>
          <Typography variant="h6" component="h1" gutterBottom>
            Infection rate history
          </Typography>
        <Paper>
          <ResultsViz data={resultsGrouped} measure="infections"/>
        </Paper>
      </Box>
      <Box my={4} margin={1}>
          <Typography variant="h6" component="h1" gutterBottom>
            Case data history
          </Typography>
        <Paper>
          <XYPlot
            width={900}
            height={300}
            getX={(d) => new Date(d.date)}
            getY={(d) => d.cases}
            xType="time"
            style={{backgroundColor: 'white'}}
          >
            <HorizontalGridLines />
            <VerticalGridLines />
            <XAxis />
            <YAxis />
            {_.map(
              inputsGrouped,
              (v, k) => (
                <LineSeriesCanvas data={v} key={k} color="black" opacity={0.1} />
              )
            )}
          </XYPlot>
        </Paper>
      </Box>
      <Box my={4} margin={1}>
        <Typography variant="h6" component="h1" gutterBottom>
          All model runs
        </Typography>
        <TableContainer className={classes.table} component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell/>
                <TableCell>Run date</TableCell>
                <TableCell align="right">Attempts</TableCell>
                <TableCell align="right">Success?</TableCell>
                <TableCell align="right">Total time&nbsp;(min)</TableCell>
                <TableCell align="right">Success time&nbsp;(min)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {_.reverse(_.map(groupByRunDate(dataLogs), (d) => {
                const runDate = d[0]["run.date"];
                const attempts = d.length;
                const successfulIdx = _.findIndex(d, (run) => run.success);
                const success = successfulIdx > -1;
                const totalTime = Math.round(_.sumBy(d, (run) => run.time)/60);
                const successTime = success ? Math.round(d[successfulIdx].time/60) : "NA";
                const warnings = _.filter(
                  dataWarnings, (d) => (d["run.date"] == runDate)
                );

                return (
                  <Row row={{runDate, attempts, success, totalTime, successTime, warnings}}/>
                );
              }))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
        {/*<Typography variant="h4" component="h1" gutterBottom>
          Next.js example
        </Typography>*/}
    </Container>
  );
}
