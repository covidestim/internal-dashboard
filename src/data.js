import useSWR from 'swr';
import fetcher from './fetcher';

const isCounty = (fips) => { return fips && new RegExp(/^[0-9]{5}$/).test(fips) }

function useAllRunResults(geo) {
  return useSWR(
    [isCounty(geo) ? '/all_runs' : '/all_state_runs', geo],
    isCounty(geo) ?
      (endpoint, fips)  => fetcher(endpoint, {fips: fips}) :
      (endpoint, state) => fetcher(endpoint, {state: state}),
    { refreshInterval: 0 }
  );
}

function useAllRunResultsDev(fips) {
  const shouldFetch = isCounty(fips);

  return useSWR(
    shouldFetch ? ['/all_runs_dev', fips] : null,
    (endpoint, fips) => fetcher(endpoint, {fips: fips}),
    { refreshInterval: 0 }
  );
}

function useLatestInputData(fips) {
  const shouldFetch = isCounty(fips);

  return useSWR(
    shouldFetch ? ['/latest_inputs', fips] : null,
    (endpoint, fips, date) => fetcher(endpoint, { fips }),
    { refreshInterval: 0 }
  );
}

function useInputData(fips, date) {
  const shouldFetch = isCounty(fips);

  return useSWR(
    shouldFetch ? ['/inputs', fips, date] : null,
    (endpoint, fips, date) => fetcher(endpoint, { fips, rundate: date }),
    { refreshInterval: 0 }
  );
}

function useLogs(fips) {
  const shouldFetch = isCounty(fips);

  return useSWR(
    shouldFetch ? ['/logs', fips] : null,
    (endpoint, fips) => fetcher(endpoint, { fips }),
    { refreshInterval: 0 }
  );
}

function useLogsDev(fips) {
  const shouldFetch = isCounty(fips);

  return useSWR(
    shouldFetch ? ['/logs_dev', fips] : null,
    (endpoint, fips) => fetcher(endpoint, { fips }),
    { refreshInterval: 0 }
  );
}

function useWarnings(fips) {
  const shouldFetch = isCounty(fips);

  return useSWR(
    shouldFetch ? ['/warnings', fips] : null,
    (endpoint, fips, date) => fetcher(endpoint, { fips }),
    { refreshInterval: 0 }
  );
}

function useWarningsDev(fips) {
  const shouldFetch = isCounty(fips);

  return useSWR(
    shouldFetch ? ['/warnings_dev', fips] : null,
    (endpoint, fips, date) => fetcher(endpoint, { fips }),
    { refreshInterval: 0 }
  );
}

function useFailedRuns() {
  return useSWR(
    ['/failed_runs'],
    fetcher,
    { refreshInterval: 0 }
  );
}

function useFailedRunsDev() {
  return useSWR(
    ['/failed_runs_dev'],
    fetcher,
    { refreshInterval: 0 }
  );
}

export {
  useAllRunResults,
  useAllRunResultsDev,
  useInputData,
  useLatestInputData,
  useLogs,
  useLogsDev,
  useWarnings,
  useWarningsDev,
  useFailedRuns,
  useFailedRunsDev
};
