const uuid = require('uuid');

module.exports = class Booking {
  constructor() {
    this.id = uuid.v4();
    this.numOfBookedTables = 0;
    this.numOfRemainingTables = 0;
  }
};
