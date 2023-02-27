const uuid = require('uuid');
const Booking = require('../booking');

// ----------------------------------------------------------------------------------------
// Test - constructor

test('booking constructor', () => {
  const bk = new Booking();

  expect(uuid.validate(bk.id)).toBeTruthy();
});
