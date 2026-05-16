import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client/core'

// HTTP connection to the API
const httpLink = createHttpLink({
  // You should use an absolute URL here
  uri: 'https://patchyvideo.com/be/gql/graphql',
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
