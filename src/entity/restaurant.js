const config = require('../environment/config');

module.exports = class Restaurant {
  constructor(tables) {
    if (tables.length < 1) throw RangeError('restaurant should have at least one table');

    this.tables = tables;
  }

  findAvailableTablesForGroup(numOfPeople) {
    const availables = [];
    let counter = 0;

    for (let i = 0; i < this.tables.length; i += 1) {
      if (counter >= numOfPeople) break;

      if (this.tables[i].isAvailable()) {
        availables.push(this.tables[i]);
        counter += config.numOfSeats;
      }
    }

    if (counter < numOfPeople) return [];

    return availables;
  }

  getNumOfRemainingTables() {
    return this.tables.filter((tb) => tb.isAvailable()).length;
  }

  findTablesByBookingID(bookingID) {
    return this.tables.filter((tb) => tb.bookingID === bookingID);
  }
};
