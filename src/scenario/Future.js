function Future(name, behavior) {
  this.name = name;
  this.behavior = behavior;
  this.fulfilled = false;
  this.value = undefined;
}

Future.prototype = {
  fulfill: function(value) {
    this.fulfilled = true;
    this.value = value;
  }
};
