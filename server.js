const express = require('express');
const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');

const schema = buildSchema(`
  type Query {
    question: Question
    guess(qid: ID!, taxonId: ID!): ID!
  }

  type Question {
    qid: ID!
    pic: String!
    choices: [Choice]!
  }

  type Choice {
    taxonId: ID!
    name: String!
    commonName: String!
  }
`);

// The root provides a resolver function for each API endpoint
const root = {
  question: () => {
    const q = {
      qid: 'testid',
      pic: 'https://static.inaturalist.org/photos/3235960/medium.jpg?1459121239',
      choices: [{
        taxonId: 47347,
        name: 'Cantharellus cibarius',
        commonName: 'Golden Chanterelle',
      },
      {
        taxonId: 67752,
        name: 'Omphalotus olivascens',
        commonName: 'Western American Jack-o\'-lantern Mushroom',
      }],
    };
    return q;
  },
  guess: (guess) => {
    console.log(`guess was ${guess.taxonId === '47347'}`);
    return 47347;
  },
};

const app = express();
app.use('/graphql', graphqlHTTP({
  schema,
  rootValue: root,
  graphiql: true,
}));
app.listen(4000);
console.log('Running a GraphQL API server at localhost:4000/graphql');
