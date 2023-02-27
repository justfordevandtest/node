jest.mock('../repo/restaurant');

const config = require('../../environment/config');
const Table = require('../../entity/table');
const Restaurant = require('../../entity/restaurant');
const RestaurantRepoInterface = require('../repo/restaurant');
const CustomerUsecase = require('../customer');

beforeEach(() => {
  RestaurantRepoInterface.mockClear();
});

test.each([
  {
    input: {
      numOfPeople: 2,
    },
    mock: {
      restaurantRepo: {
        findOne: {
          restaurant: new Restaurant([
            new Table(config.numOfSeats),
            new Table(config.numOfSeats),
            new Table(config.numOfSeats),
          ]),
        },
      },
    },
    expected: {
      numOfBookedTables: 1,
      numOfRemainingTables: 2,
    },
  },
  {
    input: {
      numOfPeople: 3,
    },
    mock: {
      restaurantRepo: {
        findOne: {
          restaurant: new Restaurant([
            new Table(config.numOfSeats),
            new Table(config.numOfSeats),
            new Table(config.numOfSeats),
          ]),
        },
      },
    },
    expected: {
      numOfBookedTables: 2,
      numOfRemainingTables: 1,
    },
  },
  {
    input: {
      numOfPeople: 6,
    },
    mock: {
      restaurantRepo: {
        findOne: {
          restaurant: new Restaurant([
            new Table(config.numOfSeats),
            new Table(config.numOfSeats),
            new Table(config.numOfSeats),
          ]),
        },
      },
    },
    expected: {
      numOfBookedTables: 3,
      numOfRemainingTables: 0,
    },
  },
  {
    input: {
      numOfPeople: 7,
    },
    mock: {
      restaurantRepo: {
        findOne: {
          restaurant: new Restaurant([
            new Table(config.numOfSeats),
            new Table(config.numOfSeats),
            new Table(config.numOfSeats),
          ]),
        },
      },
    },
    expected: {
      error: new Error('not enough table'),
    },
  },
])('Reserve table', async ({ input, mock, expected }) => {
  RestaurantRepoInterface.mockImplementation(() => ({
    findOne: async () => {
      if (mock.restaurantRepo.findOne.error) throw mock.restaurantRepo.findOne.error;

      return mock.restaurantRepo.findOne.restaurant;
    },
  }));

  const restaurantRepo = new RestaurantRepoInterface(null);
  const usecase = new CustomerUsecase(restaurantRepo);

  if (expected.error) {
    await expect(usecase.reserveTables(input.numOfPeople)).rejects.toThrow(expected.error);
  } else {
    const booking = await usecase.reserveTables(input.numOfPeople);

    expect(booking.numOfBookedTables).toBe(expected.numOfBookedTables);
    expect(booking.numOfRemainingTables).toBe(expected.numOfRemainingTables);
  }
});
