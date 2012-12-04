function (key, values) {
    var result = {conservative_votes: 0, liberal_votes: 0};
    values.forEach(function (val) {
      result.conservative_votes += val.conservative_votes;
      result.liberal_votes += val.liberal_votes;
    });
    return result;
} 
