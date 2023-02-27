const Restaurant = require('../restaurant');
const Table = require('../table');
const config = require('../../environment/config');

// ----------------------------------------------------------------------------------------
// Test - constructor

test.each([
  // Success case
  {
    input: {
      tables: [
        new Table(config.numOfSeats),
        new Table(config.numOfSeats),
        new Table(config.numOfSeats),
      ],
    },
    expected: {
      restaurant: {
        tables: [
          new Table(config.numOfSeats),
          new Table(config.numOfSeats),
          new Table(config.numOfSeats),
        ],
      },
      error: null,
    },
  },
  // Error restaurant without table case
  {
    input: {
      tables: [],
    },
    expected: {
      error: RangeError('restaurant should have at least one table'),
    },
  },
])('Restaurant constructor', ({ input, expected }) => {
  if (expected.error) {
    expect(() => new Restaurant(input.tables)).toThrow(expected.error);
  } else {
    const rtr = new Restaurant(input.tables);
    expect(rtr.tables).toHaveLength(expected.restaurant.tables.length);
  }
});

// ----------------------------------------------------------------------------------------
// Test - findAvailableTablesForGroup

test.each([
  {
    input: {
      tables: [
        new Table(config.numOfSeats),
        new Table(config.numOfSeats),
        new Table(config.numOfSeats),
      ],
      numOfPeople: 5,
    },
    expected: {
      numOfTables: 3,
    },
  },
  {
    input: {
      tables: [
        new Table(config.numOfSeats),
        new Table(config.numOfSeats),
        new Table(config.numOfSeats),
      ],
      numOfPeople: 2,
    },
    expected: {
      numOfTables: 1,
    },
  },
  {
    input: {
      tables: [
        new Table(config.numOfSeats),
        new Table(config.numOfSeats),
        new Table(config.numOfSeats),
      ],
      numOfPeople: 7,
    },
    expected: {
      numOfTables: 0,
    },
  },
  {
    input: {
      tables: [
        new Table(config.numOfSeats),
        new Table(config.numOfSeats),
        new Table(config.numOfSeats),
      ],
      numOfPeople: 6,
    },
    expected: {
      numOfTables: 3,
    },
  },
  {
    input: {
      tables: [
        new Table(config.numOfSeats),
        new Table(config.numOfSeats),
        new Table(config.numOfSeats),
      ],
      numOfPeople: 0,
    },
    expected: {
      numOfTables: 0,
    },
  },
  {
    input: {
      tables: [
        new Table(config.numOfSeats).book('B1A'),
        new Table(config.numOfSeats),
        new Table(config.numOfSeats),
      ],
      numOfPeople: 3,
    },
    expected: {
      numOfTables: 2,
    },
  },
  {
    input: {
      tables: [
        new Table(config.numOfSeats).book('B1A'),
        new Table(config.numOfSeats).book('B1B'),
        new Table(config.numOfSeats),
      ],
      numOfPeople: 3,
    },
    expected: {
      numOfTables: 0,
    },
  },
  {
    input: {
      tables: [
        new Table(config.numOfSeats).book('B1A'),
        new Table(config.numOfSeats).book('B1B'),
        new Table(config.numOfSeats).book('B1C'),
      ],
      numOfPeople: 3,
    },
    expected: {
      numOfTables: 0,
    },
  },
])('Find available tables for a group of people', ({ input, expected }) => {
  const rtr = new Restaurant(input.tables);

  const availables = rtr.findAvailableTablesForGroup(input.numOfPeople);

  expect(availables).toHaveLength(expected.numOfTables);
});

// ----------------------------------------------------------------------------------------
// Test - getNumOfRemainingTables

test.each([
  {
    input: {
      tables: [
        new Table(config.numOfSeats).book('B1A'),
        new Table(config.numOfSeats),
        new Table(config.numOfSeats),
      ],
    },
    expected: {
      numOfRemainingTables: 2,
    },
  },
  {
    input: {
      tables: [
        new Table(config.numOfSeats).book('B1A'),
        new Table(config.numOfSeats).book('B1B'),
        new Table(config.numOfSeats).book('B1C'),
      ],
    },
    expected: {
      numOfRemainingTables: 0,
    },
  },
])('Find number of remaining tables', ({ input, expected }) => {
  const rtr = new Restaurant(input.tables);

  const numOfRemainingTables = rtr.getNumOfRemainingTables();

  expect(numOfRemainingTables).toBe(expected.numOfRemainingTables);
});

// ----------------------------------------------------------------------------------------
// Test - findTablesByBookingID

test.each([
  {
    input: {
      tables: [
        new Table(config.numOfSeats).book('B1A'),
        new Table(config.numOfSeats),
        new Table(config.numOfSeats),
      ],
      bookingID: 'B1A',
    },
    expected: {
      numOfBookedTables: 1,
    },
  },
  {
    input: {
      tables: [
        new Table(config.numOfSeats).book('B1A'),
        new Table(config.numOfSeats).book('B1B'),
        new Table(config.numOfSeats).book('B1B'),
      ],
      bookingID: 'B1B',
    },
    expected: {
      numOfBookedTables: 2,
    },
  },
  {
    input: {
      tables: [
        new Table(config.numOfSeats),
        new Table(config.numOfSeats),
        new Table(config.numOfSeats),
      ],
      bookingID: 'B1A',
    },
    expected: {
      numOfBookedTables: 0,
    },
  },
])('Find tables by booking ID', ({ input, expected }) => {
  const rtr = new Restaurant(input.tables);

  const bookedTables = rtr.findTablesByBookingID(input.bookingID);

  expect(bookedTables).toHaveLength(expected.numOfBookedTables);
});
