function (key, values) {
    var result = {liberal_votes: 0, conservative_votes: 0};
    values.forEach(function (val) {
      result.liberal_votes += val.liberal_votes;
      result.conservative_votes += val.conservative_votes;
    });
    return result;
}  
