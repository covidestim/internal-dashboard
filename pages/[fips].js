import React, { useEffect, useState } from 'react';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import ProTip from '../src/ProTip';
import Copyright from '../src/Copyright';
import { useRouter } from 'next/router';

import { ResultsVizZoomable } from '../components/ResultsViz';
import { InputData } from '../components/InputData';
import _ from 'lodash';
import {
  useAllRunResults,
  useLatestInputData,
  useLogs,
  useLogsDev,
  useWarnings,
  useWarningsDev
} from '../src/data';

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

function LogTable(props) {

  const classes = useStyles();

  const logsSorted  = _.sortBy(props.logs, (d) => d["run.date"]);
  const logsGrouped = groupByRunDate(logsSorted);
  const logRows     = _.map(logsGrouped, (d) => {
    const runDate = d[0]["run.date"];
    const attempts = d.length;
    const successfulIdx = _.findIndex(d, (run) => run.success);
    const success = successfulIdx > -1;
    const totalTime = Math.round(_.sumBy(d, (run) => run.time)/60);
    const successTime = success ? Math.round(d[successfulIdx].time/60) : "NA";
    const warnings = _.filter(
      props.warnings, (d) => (d["run.date"] == runDate)
    );

    return (
      <Row
        fips={props.fips}
        row={{runDate, attempts, success, totalTime, successTime, warnings}}
      />
    );
  })

  return (
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
          {_.reverse(logRows)}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function Row(props) {
  const { row, fips } = props;
  const [open, setOpen] = React.useState(false);
  const classes = useRowStyles();

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
            <Paper>
              <InputData date={row.runDate} fips={fips} metric={"cases"}/>
            </Paper>
            <Paper>
              <InputData date={row.runDate} fips={fips} metric={"deaths"}/>
            </Paper>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

function groupByRunDate(data) {
  return _.groupBy(data, (d) => d["run.date"])
}

export default function Index() {

  const router = useRouter();

  const fips = router.query.fips;

  const {data: dataLogs, error: errorDataLogs} = useLogs(fips);
  const {data: dataLogsDev, error: errorDataLogsDev} = useLogsDev(fips);
  const {data: dataWarnings, error: errorDataWarnings} = useWarnings(fips);
  const {data: dataWarningsDev, error: errorDataWarningsDev} = useWarningsDev(fips);

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
          <ResultsVizZoomable fips={fips} measure="Rt"/>
        </Paper>
      </Box>
      <Box my={4} margin={1}>
          <Typography variant="h6" component="h1" gutterBottom>
            Infection rate history
          </Typography>
        <Paper>
          <ResultsVizZoomable fips={fips} measure="infections"/>
        </Paper>
      </Box>
      <Box my={4} margin={1}>
          <Typography variant="h6" component="h1" gutterBottom>
            Cumulative incidence
          </Typography>
        <Paper>
          <ResultsVizZoomable fips={fips} measure="cum.incidence"/>
        </Paper>
      </Box>
      <Box my={4} margin={1}>
          <Typography variant="h6" component="h1" gutterBottom>
            # Symptomatic
          </Typography>
        <Paper>
          <ResultsVizZoomable fips={fips} measure="symptomatic"/>
        </Paper>
      </Box>
      <Box my={4} margin={1}>
          <Typography variant="h6" component="h1" gutterBottom>
            Fitted Cases
          </Typography>
        <Paper>
          <ResultsVizZoomable fips={fips} measure="cases.fitted"/>
        </Paper>
      </Box>
      <Box my={4} margin={1}>
          <Typography variant="h6" component="h1" gutterBottom>
            Case data history - Latest
          </Typography>
        <Paper>
          <InputData fips={fips} metric={"cases"}/>
        </Paper>
      </Box>
      <Box my={4} margin={1}>
          <Typography variant="h6" component="h1" gutterBottom>
            Death data - Latest
          </Typography>
        <Paper>
          <InputData fips={fips} metric={"deaths"}/>
        </Paper>
      </Box>
      <Box my={4} margin={1}>
        <Typography variant="h6" component="h1" gutterBottom>
          Experimental model runs
        </Typography>
      </Box>
      <LogTable fips={fips} logs={dataLogsDev} warnings={dataWarningsDev}/>
      <Box my={4} margin={1}>
        <Typography variant="h6" component="h1" gutterBottom>
          Production model runs
        </Typography>
      </Box>
      <LogTable fips={fips} logs={dataLogs} warnings={dataWarnings}/>
    </Container>
  );
}
