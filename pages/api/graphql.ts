// @ts-ignore
import typeDefs from '../../src/middleware/graphql/schema/index';

import {send} from 'micro';
// @ts-ignore
import resolvers from '../../src/middleware/graphql/resolvers';
// @ts-ignore
import {ApolloServer} from 'apollo-server-micro';
// import database from '../../middleware/database/';

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  async context({req, res}) {
    return {req, res};
  },
});

export const config = {
  api: {
    bodyParser: false,
  },
};
export default async (req, res) => {
  // await apolloServer.start();
  const handler = await apolloServer.createHandler({path: '/api/graphql/'});
  req.method === 'OPTIONS'
    ? await send(res, 200, 'ok')
    : await handler(req, res);
};
