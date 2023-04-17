const axios = require('axios');
const {host} = require('./constants');

function makeGetRequest(uri) {
  return axios.get(host + uri)
    .then((response) => {
      if (response.status === 404) {
        indexOutOfBounds = true;
        return Promise.reject(new Error(errorString));
      }
      return response.data;
    })
    .catch((error) => {
      console.error(error);
      return Promise.reject(error);
    });
}

function fetchHashUsingBlockHeight(blockNumber) {
  const uri = '/block-height/' + blockNumber;
  return makeGetRequest(uri)
    .then((blockHeightBody) => {
      return String(blockHeightBody);
    })
    .catch((error) => {
      console.error(error);
      return Promise.reject(error);
    });
}

function fetchTransactionListUsingHash(txHash, index) {
  let offset = '';
  if (index !== 0) {
    offset = '/' + String(index * 25);
  }

  const uri = '/block/' + txHash + '/txs' + offset;
  return makeGetRequest(uri)
    .then((response) => {
      return [response, null];
    })
    .catch((error) => {
      console.error(error);
      return [{}, error];
    });
}

function sortAndPrintTop10(dipMapCount) {
  const ss = [];
  for (const [k, v] of Object.entries(dipMapCount)) {
    ss.push({ key: k, value: v });
  }

  ss.sort((a, b) => b.value - a.value);

  let count = 0;
  console.log("Task 3 complete");
  for (const kv of ss) {
    if (count > 10) {
      break;
    }
    console.log(kv.key, kv.value);
    count += 1;
  }
}

module.exports = {
  fetchHashUsingBlockHeight,
  fetchTransactionListUsingHash,
  sortAndPrintTop10
}