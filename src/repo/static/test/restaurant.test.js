const RestaurantStaticRepo = require('../restaurant');

test.each([
  // ----------------------------------------------------------------------------------------
  // Success case
  {
    input: {
      restaurant: {
        tables: [
          {
            numOfSeat: 4,
            bookingID: null,
          },
          {
            numOfSeat: 4,
            bookingID: null,
          },
          {
            numOfSeat: 4,
            bookingID: null,
          },
        ],
      },
    },
    expected: {
      count: 1,
    },
  },
])('Create restaurant', async ({ input, expected }) => {
  const repo = new RestaurantStaticRepo();
  await repo.create(input.restaurant);

  const cnt = await repo.count();
  expect(cnt).toBe(expected.count);

  const rtr = await repo.findOne();
  expect(rtr).toBe(input.restaurant);
});
