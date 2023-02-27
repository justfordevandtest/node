const Booking = require('../entity/booking');

module.exports = class CustomerUsecase {
  constructor(restaurantRepo) {
    this.restaurantRepo = restaurantRepo;
  }

  async reserveTables(numOfPeople) {
    const restaurant = await this.restaurantRepo.findOne();

    const booking = new Booking();

    const tables = restaurant.findAvailableTablesForGroup(numOfPeople);
    if (tables.length < 1) throw Error('not enough table');

    tables.forEach((tb) => tb.book(booking.id));

    booking.numOfBookedTables = tables.length;
    booking.numOfRemainingTables = restaurant.getNumOfRemainingTables();

    return booking;
  }
};
