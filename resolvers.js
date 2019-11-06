const _ = require('lodash');
const axios = require('axios');

const INAT_API = 'https://api.inaturalist.org/v1';

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

  // pick a random observation
  const obs = _.sample(observations.data.results.filter((x) => x.photos.length >= 2));
  const photos = obs.photos.map((photo) => ({
    url: photo.url.replace('square.jp', 'original.jp'),
    origWidth: photo.original_dimensions.width,
    origHeight: photo.original_dimensions.height,
  }));
  return [{
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
  }];
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
