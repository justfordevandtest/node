jest.mock('../repo/restaurant');

const config = require('../../environment/config');
const Table = require('../../entity/table');
const Restaurant = require('../../entity/restaurant');
const RestaurantRepoInterface = require('../repo/restaurant');
const StaffUsecase = require('../staff');

beforeEach(() => {
  RestaurantRepoInterface.mockClear();
});

test.each([
  // Success case
  {
    input: {
      numOfTables: 2,
    },
    mock: {
      repo: {
        create: {
          arg: {
            tables: [
              new Table(3),
              new Table(3),
            ],
          },
        },
        count: {
          result: 0,
        },
      },
    },
    expected: {},
  },
  // Error init with zero table case
  {
    input: {
      numOfTables: 0,
    },
    expected: {
      error: RangeError('restaurant must have at least one table'),
    },
  },
  // Error repo.create internal error case
  {
    input: {
      numOfTables: 2,
    },
    mock: {
      repo: {
        create: {
          arg: {
            tables: [
              new Table(3),
              new Table(3),
            ],
          },
          error: Error('internal error'),
        },
        count: {
          result: 0,
        },
      },
    },
    expected: {
      error: Error('internal error'),
    },
  },
  // Error repo.count internal error case
  {
    input: {
      numOfTables: 2,
    },
    mock: {
      repo: {
        create: {
          arg: {
            tables: [
              new Table(3),
              new Table(3),
            ],
          },
        },
        count: {
          result: 0,
          error: Error('internal error'),
        },
      },
    },
    expected: {
      error: Error('internal error'),
    },
  },
])('Initialize restaurant table', async ({ input, mock, expected }) => {
  RestaurantRepoInterface.mockImplementation(() => ({
    create: async (restaurant) => {
      expect(restaurant.tables).toHaveLength(mock.repo.create.arg.tables.length);

      if (mock.repo.create.error) throw mock.repo.create.error;

      // eslint-disable-next-line no-param-reassign
      mock.repo.count.result += 1;

      return mock.repo.create.result;
    },
    count: async () => {
      if (mock.repo.count.error) throw mock.repo.count.error;

      return mock.repo.count.result;
    },
  }));

  const repo = new RestaurantRepoInterface(null);
  const usecase = new StaffUsecase(repo);

  if (expected.error) {
    await expect(usecase.initAllTables(input.numOfTables)).rejects.toThrow(expected.error);
  } else {
    const rtr = await usecase.initAllTables(input.numOfTables);

    expect(rtr).toEqual(expected.restaurant);

    await expect(usecase.initAllTables(input.numOfTables)).rejects.toThrow(Error('already initialized'));
  }
});

// ----------------------------------------------------------------------------------------
// CancelReservation

test.each([
  // Success case reserve 1, release 1, remain 1
  {
    input: {
      bookingID: 'B1A',
    },
    mock: {
      restaurantRepo: {
        findOne: {
          restaurant: new Restaurant([
            new Table(config.numOfSeats).book('B1A'),
            new Table(config.numOfSeats).book('B1B'),
            new Table(config.numOfSeats).book('B1C'),
          ]),
        },
      },
    },
    expected: {
      numOfBookedTables: 1,
      numOfRemainingTables: 1,
    },
  },
  // Success case reserve 2, release 2, remain 2
  {
    input: {
      bookingID: 'B1A',
    },
    mock: {
      restaurantRepo: {
        findOne: {
          restaurant: new Restaurant([
            new Table(config.numOfSeats).book('B1A'),
            new Table(config.numOfSeats).book('B1A'),
            new Table(config.numOfSeats).book('B1B'),
          ]),
        },
      },
    },
    expected: {
      numOfBookedTables: 2,
      numOfRemainingTables: 2,
    },
  },
  // Success case reserve 3, release 3, remain 3
  {
    input: {
      bookingID: 'B1A',
    },
    mock: {
      restaurantRepo: {
        findOne: {
          restaurant: new Restaurant([
            new Table(config.numOfSeats).book('B1A'),
            new Table(config.numOfSeats).book('B1A'),
            new Table(config.numOfSeats).book('B1A'),
          ]),
        },
      },
    },
    expected: {
      numOfBookedTables: 3,
      numOfRemainingTables: 3,
    },
  },
  // Error booking ID not found case
  {
    input: {
      bookingID: 'B1C',
    },
    mock: {
      restaurantRepo: {
        findOne: {
          restaurant: new Restaurant([
            new Table(config.numOfSeats).book('B1A'),
            new Table(config.numOfSeats).book('B1A'),
            new Table(config.numOfSeats).book('B1B'),
          ]),
        },
      },
    },
    expected: {
      error: Error('bookingID not found'),
    },
  },
  // Error booking ID is empty case
  {
    input: {
      bookingID: '',
    },
    mock: {
      restaurantRepo: {
        findOne: {
          restaurant: new Restaurant([
            new Table(config.numOfSeats).book('B1A'),
            new Table(config.numOfSeats).book('B1A'),
            new Table(config.numOfSeats).book('B1B'),
          ]),
        },
      },
    },
    expected: {
      error: Error('empty booking ID'),
    },
  },
])('Cancel reservation', async ({ input, mock, expected }) => {
  RestaurantRepoInterface.mockImplementation(() => ({
    findOne: async () => {
      if (mock.restaurantRepo.findOne.error) throw mock.restaurantRepo.findOne.error;

      return mock.restaurantRepo.findOne.restaurant;
    },
  }));

  const repo = new RestaurantRepoInterface(null);
  const usecase = new StaffUsecase(repo);

  if (expected.error) {
    await expect(usecase.cancelReservation(input.bookingID)).rejects.toThrow(expected.error);
  } else {
    const state = await usecase.cancelReservation(input.bookingID);

    expect(state.numOfBookedTables).toBe(expected.numOfBookedTables);
    expect(state.numOfRemainingTables).toBe(expected.numOfRemainingTables);
  }
});
