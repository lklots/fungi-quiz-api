const _ = require('lodash');

function mockQuestion(taxonId) {
  const answer = taxonId || 47347;
  return {
    questionId: `questionId-${answer}`,
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
  };
}

module.exports = {
  Mutation: () => ({
    makeGuess: (_root, { questionId }) => _.last(_.split(questionId, '-')),
    createQuiz: (_root, { taxonIds }) => {
      return {
        questions: taxonIds.map(mockQuestion),
      };
    },
  }),
  Question: () => mockQuestion(),
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
