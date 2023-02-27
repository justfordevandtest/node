const Restaurant = require('../entity/restaurant');
const Table = require('../entity/table');
const config = require('../environment/config');

module.exports = class StaffUsecase {
  constructor(restaurantRepo) {
    this.restaurantRepo = restaurantRepo;
  }

  async initAllTables(numOfTables) {
    if (numOfTables < 1) throw RangeError('restaurant must have at least one table');

    const cnt = await this.restaurantRepo.count();
    if (cnt > 0) throw Error('already initialized');

    const tables = [];
    for (let i = 0; i < numOfTables; i += 1) {
      tables.push(new Table(config.numOfSeats));
    }

    const rtr = new Restaurant(tables);

    return this.restaurantRepo.create(rtr);
  }

  async cancelReservation(bookingID) {
    if (bookingID.length < 1) throw RangeError('empty booking ID');

    const restaurant = await this.restaurantRepo.findOne();

    const tables = restaurant.findTablesByBookingID(bookingID);
    if (tables.length < 1) throw Error('bookingID not found');

    tables.forEach((tb) => tb.release());

    return {
      numOfBookedTables: tables.length,
      numOfRemainingTables: restaurant.getNumOfRemainingTables(),
    };
  }
};
