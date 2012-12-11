function(key, values) {
  var result = {direction: -1} 
  values.forEach( function(val) {
    if (val.direction == 1 || val.direction === 2) {
      result.direction = val.direction;
    }
  })
  return result;
}
