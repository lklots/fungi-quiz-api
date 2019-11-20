const _ = require('lodash');
const express = require('express');
const session = require('express-session');
const PgSession = require('connect-pg-simple')(session);
const compression = require('compression');


const graphqlHTTP = require('express-graphql');
const cors = require('cors');
const { makeExecutableSchema, addMockFunctionsToSchema } = require('graphql-tools');


const resolvers = require('./resolvers');
const { pool } = require('./db');

const schema = `
  type Query {
    getQuestion(questionId: ID!): Question!
    getTaxonTree: [Taxon]!
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
    choices: [Taxon]!
  }

  type Taxon {
    taxonId: ID!
    name: String!
    commonName: String!
    photoUrl: String!
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
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 }, // 30 days
}));

app.use(cors());
app.use(compression());

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

app.listen(process.env.PORT, () => console.log(`Listening on ${process.env.PORT}`));
