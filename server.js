const _ = require('lodash');
const axios = require('axios');
const express = require('express');
const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');

const INAT_API = 'https://api.inaturalist.org/v1';

const schema = buildSchema(`
  type Query {
    question(taxonId: ID!): Question
    guess(qid: ID!, taxonId: ID!): ID!
  }

  type Question {
    qid: ID!
    pics: [String]!
    choices: [Choice]!
  }

  type Choice {
    taxonId: ID!
    name: String!
    commonName: String!
  }
`);

async function question({ taxonId }) {
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
  const obs = _.sample(observations.data.results);
  const pics = obs.photos.map((photo) => photo.url.replace('square.jp', 'medium.jp'));
  return {
    qid: 'testid',
    pics,
    choices: [{
      taxonId: obs.taxon.id,
      name: obs.taxon.name,
      commonName: obs.taxon.preferred_common_name,
    },
    {
      taxonId: 67752,
      name: 'Omphalotus olivascens',
      commonName: 'Western American Jack-o\'-lantern Mushroom',
    }];
  };
}

async function guess({ taxonId }) {
  console.log(`guess was ${guess.taxonId === '47347'}`);
  return 47347;
}

// The root provides a resolver function for each API endpoint
const root = {
  question,
  guess,
};

const app = express();
app.use('/graphql', graphqlHTTP({
  schema,
  rootValue: root,
  graphiql: true,
}));
app.listen(4000);
console.log('Running a GraphQL API server at localhost:4000/graphql');
