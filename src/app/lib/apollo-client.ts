import { HttpLink } from "@apollo/client";
import {
  registerApolloClient,
  ApolloClient,
  InMemoryCache,
} from "@apollo/client-integration-nextjs";

export const { query } = registerApolloClient(() => {
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
      // uri: "https://rickandmortyapi.com/graphql",
      // need to have .env.local file with the API_URL, otherwise you can uncomment the above line and comment the below line
      uri: process.env.NEXT_PUBLIC_API_URL,
    }),
  });
});
