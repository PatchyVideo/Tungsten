import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client/core'

// HTTP connection to the API
const httpLink = createHttpLink({
  // In dev, requests go through the Vite dev-server proxy (server.proxy in
  // vite.config.ts) to stay same-origin;
  uri: import.meta.env.DEV ? '/be/gql/graphql' : 'https://patchyvideo.com/be/gql/graphql',
  credentials: 'include',
})

// Cache implementation
const cache = new InMemoryCache()

// Create the apollo client
export const apolloClient = new ApolloClient({
  link: httpLink,
  // connectToDevTools: true,
  devtools: {
    enabled: true,
  },
  cache,
})
