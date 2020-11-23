import React, { useEffect, useState } from 'react';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import ProTip from '../src/ProTip';
import Link from '../src/Link';
import Copyright from '../src/Copyright';
import { useRouter } from 'next/router';

import _ from 'lodash';
import { useFailedRuns } from '../src/data';

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
  const classes = useRowStyles();

  return (
    <Link href={`/${row.fips}`}>
      <TableRow hover={true} className={classes.root}>
        <TableCell component="th" scope="row">
          {row["run.date"]}
        </TableCell>
        <TableCell align="right">{row.fips}</TableCell>
      </TableRow>
    </Link>
  );
}

function groupByRunDate(data) {
  return _.groupBy(data, (d) => d["run.date"])
}

export default function Index() {

  const classes = useStyles();
  const router = useRouter();

  const {data, error} = useFailedRuns();

  return (
    <Container maxWidth="md">
      <Box my={4} margin={1}>
        <Typography variant="h6" component="h1" gutterBottom>
          All failed runs
        </Typography>
        {_.map(groupByRunDate(data), (runDateData, runDate) => (
          <TableContainer className={classes.table} component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Run date</TableCell>
                  <TableCell align="right">FIPS</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {_.map(runDateData, (d) => <Row row={d}/>)}
              </TableBody>
            </Table>
          </TableContainer>
        ))}
      </Box>
        {/*<Typography variant="h4" component="h1" gutterBottom>
          Next.js example
        </Typography>*/}
    </Container>
  );
}
