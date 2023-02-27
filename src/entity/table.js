const uuid = require('uuid');

module.exports = class Table {
  constructor(numOfSeat) {
    if (numOfSeat < 1) throw RangeError('table should have at least one seat');

    this.id = uuid.v4();
    this.numOfSeat = numOfSeat;
    this.bookingID = null;
  }

  isAvailable() {
    return !this.bookingID;
  }

  book(bookingID) {
    if (bookingID.length < 1) throw Error('booking ID should not be empty');

    this.bookingID = bookingID;

    return this;
  }

  release() {
    if (this.bookingID == null) throw Error('try to release available table');

    this.bookingID = null;

    return this;
  }
};
