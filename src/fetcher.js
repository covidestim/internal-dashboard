import PostgREST from 'postgrest-client';

export default async function fetcher(endpoint, params) {
  console.log(`GETting ${endpoint}`);

  const api_url = 'http://localhost:3010';
  const Api = new PostgREST(api_url);

  if (params)
    return await Api.get(endpoint).match(params);

  return await Api.get(endpoint);
}

