// count the number of total votes on a poll and the number of votes for each option
const voteAmount = [
  {
    '$project': {
      'option': '$option'
    }
  }, {
    '$group': {
      '_id': '$option', 
      'count': {
        '$sum': 1
      }
    }
  }
];

module.exports = {
  voteAmount
};
