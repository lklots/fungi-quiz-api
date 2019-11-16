const _ = require('lodash');
const express = require('express');
const session = require('express-session');
const PgSession = require('connect-pg-simple')(session);

const graphqlHTTP = require('express-graphql');
const cors = require('cors');
const { makeExecutableSchema, addMockFunctionsToSchema } = require('graphql-tools');


const resolvers = require('./resolvers');
const { query, pool } = require('./db');

const schema = `
  type Query {
    getQuestion(questionId: ID!): Question
  }

  type Mutation {
    createQuiz(taxonIds: [ID]!): Quiz!
    createQuestion(taxonId: ID!): Question!
    makeGuess(questionId: ID!, taxonId: ID!): ID!
  }

  type Quiz {
    quizId: ID!
    questions: [Question]!
  }

  type Question {
    questionId: ID!
    photos: [Photos]!
    choices: [Choice]!
  }

  type Choice {
    taxonId: ID!
    name: String!
    commonName: String!
  }

  type Photos {
    url: String!
    origWidth: Int!
    origHeight: Int!
  }
`;


const MOCK_MODE = _.find(process.argv, (x) => x === '--mock');

const graphqlSchema = makeExecutableSchema({ typeDefs: schema });

const app = express();

app.use(session({
  store: new PgSession({
    pool: pool(),
  }),
  secret: 'mysecret', // process.env.FOO_COOKIE_SECRET,
  resave: false,
  cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 }, // 30 days
}));

app.use(cors());
if (!MOCK_MODE) {
  app.use('/graphql', graphqlHTTP({
    schema: graphqlSchema,
    rootValue: resolvers,
    graphiql: true,
  }));
} else {
  // eslint-disable-next-line global-require
  const mocks = require('./mock.js');
  addMockFunctionsToSchema({ schema: graphqlSchema, mocks });
  app.use('/graphql', graphqlHTTP({
    schema: graphqlSchema,
    graphiql: true,
  }));
}

app.listen(4000);
console.log('Running a GraphQL API server at localhost:4000/graphql');
