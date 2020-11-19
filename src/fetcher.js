import PostgREST from 'postgrest-client';

export default async function fetcher(endpoint, params) {
  console.log("Called2!");

  const api_url = 'http://localhost:3020';
  const Api = new PostgREST(api_url);

  return await Api.get(endpoint).match(params);
}

