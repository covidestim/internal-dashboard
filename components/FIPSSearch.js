import * as React from 'react';
import _ from 'lodash';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import List from '@material-ui/core/List';
import Link from 'next/link';
import { csv } from 'd3-fetch';
import TextField from '@material-ui/core/TextField';

export default function FIPSSearch() {

  const [fipsDB, setFipsDB] = React.useState([]);
  const [fipsQuery, setFipsQuery] = React.useState("");
  const [fipsOnDisplay, setFipsOnDisplay] = React.useState([]);
  const [fipsSearchMatches, setFipsSearchMatches] = React.useState([]);

  React.useEffect(() => {
    const query = fipsQuery;

    let searchPred = (county) => {
      return _.startsWith(
        _.toLower(county.county),
        _.toLower(query)
      );
    };

    const results = _.filter(fipsDB, searchPred);

    setFipsSearchMatches(_.take(results, 8));
  }, [fipsQuery]);

  const handleFipsQueryChange = (event) => setFipsQuery(event.target.value);

  React.useEffect(() => {
    csv('https://covidestim.s3.us-east-2.amazonaws.com/fips.csv').then((d) => setFipsDB(d));
  }, []);

  return (
    <>
      <form noValidate autoComplete="off">
        <TextField id="fips-input" label="County Name" value={fipsQuery} onChange={handleFipsQueryChange}/>
      </form>
      <Divider />
      <List>
        {_.map(
          fipsSearchMatches,
          d => (
            <Link href={`/${d.fips}`}>
              <ListItem button>
                <ListItemText primary={`${d.county}, ${d.state}`}/>
              </ListItem>
            </Link>
          )
        )}
      </List>
    </>
  );
}
