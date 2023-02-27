const uuid = require('uuid');
const Table = require('../table');

// ----------------------------------------------------------------------------------------
// Test - constructor

test.each([
  // Success case
  {
    input: {
      numOfSeat: 1,
    },
    expected: {
      table: new Table(1),
      error: null,
    },
  },
  // Error table without seat case
  {
    input: {
      numOfSeat: 0,
    },
    expected: {
      error: RangeError('table should have at least one seat'),
    },
  },
])('table constructor', ({ input, expected }) => {
  if (expected.error) {
    expect(() => new Table(input.numOfSeat)).toThrow(expected.error);
  } else {
    const tb = new Table(input.numOfSeat);

    expect(uuid.validate(tb.id)).toBeTruthy();
    expect(tb.numOfSeat).toBe(expected.table.numOfSeat);
    expect(tb.bookingID).toBe(expected.table.bookingID);
  }
});

// ----------------------------------------------------------------------------------------
// Test - book

test.each([
  // Success case
  {
    input: {
      table: new Table(1),
      bookingID: 'RS1A',
    },
    expected: {},
  },
  // Error empty booking ID case
  {
    input: {
      table: new Table(1),
      bookingID: '',
    },
    expected: {
      error: Error('booking ID should not be empty'),
    },
  },
])('table book', ({ input, expected }) => {
  if (expected.error) {
    expect(() => input.table.book(input.bookingID)).toThrow(expected.error);
  } else {
    const tb = input.table.book(input.bookingID);
    expect(input.table.bookingID).toBe(input.bookingID);
    expect(tb).toEqual(input.table);
  }
});

// ----------------------------------------------------------------------------------------
// Test - isAvailable

test.each([
  // Available case
  {
    input: {
      table: new Table(2),
    },
    expected: {
      available: true,
    },
  },
  // Unavailable case
  {
    input: {
      table: new Table(2).book('B1A'),
    },
    expected: {
      available: false,
    },
  },
])('table is available', ({ input, expected }) => {
  const available = input.table.isAvailable();
  expect(available).toBe(expected.available);
});

// ----------------------------------------------------------------------------------------
// Test - release

test.each([
  // Success case
  {
    input: {
      table: new Table(2).book('B1A'),
    },
    expected: {
      bookingID: null,
    },
  },
  // Error release available table case
  {
    input: {
      table: new Table(2),
    },
    expected: {
      error: Error('try to release available table'),
    },
  },
])('table release', ({ input, expected }) => {
  if (expected.error) {
    expect(() => input.table.release()).toThrow(expected.error);
  } else {
    input.table.release();

    expect(input.table.bookingID).toBe(expected.bookingID);
  }
});
