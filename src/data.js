import useSWR from 'swr';
import fetcher from './fetcher';

function useAllRunResults(fips) {
  const shouldFetch = fips && fips.length === 5;

  return useSWR(
    shouldFetch ? ['/all_runs', fips] : null,
    (endpoint, fips) => fetcher(endpoint, {fips: fips}),
    { refreshInterval: 0 }
  );
}

function useInputData(fips, runDate) {
  const shouldFetch = runDate && fips && fips.length === 5;

  return useSWR(
    shouldFetch ? ['/inputs', fips, runDate] : null,
    (endpoint, fips, date) => fetcher(endpoint, { fips, "run.date": runDate }),
    { refreshInterval: 0 }
  );
}

function useLogs(fips) {
  const shouldFetch = fips && fips.length === 5;

  return useSWR(
    shouldFetch ? ['/logs', fips] : null,
    (endpoint, fips) => fetcher(endpoint, { fips }),
    { refreshInterval: 0 }
  );
}

function useWarnings(fips) {
  const shouldFetch = fips && fips.length === 5;

  return useSWR(
    shouldFetch ? ['/warnings', fips] : null,
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

export {
  useAllRunResults,
  useInputData,
  useLogs,
  useWarnings,
  useFailedRuns
};
