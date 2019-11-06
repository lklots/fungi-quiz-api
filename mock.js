const _ = require('lodash');
const { MockList } = require('graphql-tools');

module.exports = {
  Mutation: () => ({
    createQuiz: () => new MockList([1, 10]),
    makeGuess: (root, { questionId }) => _.last(_.split(questionId, '-')),
  }),
  Question: () => ({
    questionId: 'questionId-47347',
    photos: [{
      url: 'mushroom1.jpg',
      origWidth: 500,
      origHeight: 500,
    },
    {
      url: 'mushroom2.jpg',
      origWidth: 500,
      origHeight: 500,
    }],
    choices: [{
      taxonId: 47347,
      name: 'Chanterelleus Goldilocks',
      commonName: 'Golden Chanterelle',
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
  }),
  Choice: () => ({
    taxonId: () => 47347,
    name: () => 'Chanterelleus Goldilocks',
    commonName: () => 'Golden Chanterelle',
  }),
  Photos: () => ({
    origWidth: 500,
    origHeight: 500,
    url: 'mushroom.png',
  }),
};
