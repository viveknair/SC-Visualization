function() {
  // Construct liberal vote
  var liberal_number = 0;
  var conservative_number = 0;
  if (this.direction == 1) {
    conservative_number = 1;
    liberal_number = 0;  
  } else {
    liberal_number = 1;
    conservative_number = 0;  
  }

  emit({justiceName: this.justiceName, date: this.term}, {liberal_votes: liberal_number, conservative_votes: conservative_number});
}
