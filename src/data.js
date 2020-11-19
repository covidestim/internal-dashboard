import useSWR from 'swr';
import fetcher from './fetcher';

function useAllRunResults(fips) {
  const shouldFetch = fips.length === 5;

  return useSWR(
    shouldFetch ? ['/all_runs', fips] : null,
    (endpoint, fips) => fetcher(endpoint, {fips: fips}),
    { refreshInterval: 0 }
  );
}

function useInputData(fips, date) {
  const shouldFetch = fips.length === 5;

  return useSWR(
    shouldFetch ? ['/input_data', fips, date] : null,
    (endpoint, fips, date) => fetcher(endpoint, { fips, date }),
    { refreshInterval: 0 }
  );
}

export { useAllRunResults, useInputData };
