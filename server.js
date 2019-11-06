const _ = require('lodash');
const delay = require('delay');
const axios = require('axios');
const express = require('express');
const graphqlHTTP = require('express-graphql');
const cors = require('cors');
const { buildSchema } = require('graphql');

const INAT_API = 'https://api.inaturalist.org/v1';

const schema = buildSchema(`
  type Query {
    getQuestion(qid: ID!): Question
  }

  type Mutation {
    createQuestion(taxonId: ID!): Question
    makeGuess(qid: ID!, taxonId: ID!): ID!
  }

  type Question {
    qid: ID!
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
`);

async function getQuestion({ qid }) {
  throw ('not implemented');
}

async function createQuestion({ taxonId }) {
  const observations = await axios({
    method: 'get',
    url: `${INAT_API}/observations`,
    params: {
      taxon_id: taxonId,
      photos: 'true',
      quality_grade: 'research',
      order: 'desc',
      order_by: 'created_at',
    },
  });

  // pick a random observation
  const obs = _.sample(observations.data.results.filter((x) => x.photos.length >= 2));
  const photos = obs.photos.map((photo) => ({
    url: photo.url.replace('square.jp', 'original.jp'),
    origWidth: photo.original_dimensions.width,
    origHeight: photo.original_dimensions.height,
  }));
  return {
    qid: 'testid',
    photos,
    choices: [{
      taxonId: obs.taxon.id,
      name: obs.taxon.name,
      commonName: obs.taxon.preferred_common_name,
    },
    {
      taxonId: 67752,
      name: 'Omphalotus olivascens',
      commonName: 'Western American Jack-o\'-lantern Mushroom',
    },
    {
      taxonId: 63538,
      name: 'Hygrophoropsis aurantiaca',
      commonName: 'False Chanterelle',
    }],
  };
}

async function makeGuess({ qid, taxonId }) {
  console.log(`guess was ${taxonId === '47347'}`);
  return 47347;
}

// The root provides a resolver function for each API endpoint
const root = {
  createQuestion,
  makeGuess,
};

const app = express();
app.use(cors());
app.use('/graphql', graphqlHTTP({
  schema,
  rootValue: root,
  graphiql: true,
}));
app.listen(4000);
console.log('Running a GraphQL API server at localhost:4000/graphql');
