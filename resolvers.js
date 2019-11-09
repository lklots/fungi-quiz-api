const _ = require('lodash');
const axios = require('axios');

const INAT_API = 'https://api.inaturalist.org/v1';

function makeQuestion(obs, choices) {
  const photos = obs.photos.map((photo) => ({
    url: photo.url.replace('square.jp', 'medium.jp'),
    origWidth: photo.original_dimensions.width,
    origHeight: photo.original_dimensions.height,
  }));
  return {
    questionId: obs.id,
    photos,
    choices,
  };
}

async function createQuiz({ taxonIds }) {
  const observations = await axios({
    method: 'get',
    url: `${INAT_API}/observations`,
    params: {
      taxon_id: taxonIds,
      photos: 'true',
      quality_grade: 'research',
      order: 'desc',
      order_by: 'created_at',
    },
  });
  const obsWithPhotos = observations.data.results.filter((x) => x.photos.length >= 2);
  const groupByTaxonId = _.groupBy(obsWithPhotos, (x) => x.taxon.id);
  const choices = _.reduce(groupByTaxonId, (obj, v) => ({
    ...obj,
    [v[0].taxon.id]: {
      taxonId: v[0].taxon.id,
      name: v[0].taxon.name,
      commonName: v[0].taxon.preferred_common_name,
    },
  }), {});
  const picks = _.flatten(_.map(groupByTaxonId, (v) => _.sampleSize(v, _.random(3, 5))));
  return {
    quizId: 'quizId',
    questions: picks.map((p) => makeQuestion(p, _.values(choices))),
  };
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
    questionId: 'testid',
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

async function makeGuess({ questionId, taxonId }) {
  console.log(`guess was ${taxonId === '47347'}`);
  return 47347;
}

module.exports = {
  createQuiz,
  createQuestion,
  makeGuess,
};
