function() {
   // Construct liberal vote
  var liberal_number = 0;
  var conservative_number = 0;
  if (this.value.decisionDirection == 1) {
    conservative_number = 1;
    liberal_number = 0;  
  } else {
    liberal_number = 1;
    conservative_number = 0;  
  } 
  
  emit({year: this._id.year}, {conservative_votes: conservative_number, liberal_votes: liberal_number});
}
