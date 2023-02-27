const express = require('express');

const StaffUseCase = require('../../usecase/staff');
const CustomerUseCase = require('../../usecase/customer');

const CustomerCtrl = require('./customer');
const StaffCtrl = require('./staff');

const RestaurantRepoInterface = require('../../usecase/repo/restaurant');
const RestaurantRepo = require('../../repo/static/restaurant');

// -----------------------------------------------------------------------------
// Repository, Usecase, and Controller

const restaurantRepo = new RestaurantRepo();
const restaurantRepoInterface = new RestaurantRepoInterface(restaurantRepo);

const staffUsecase = new StaffUseCase(restaurantRepoInterface);
const customerUsecase = new CustomerUseCase(restaurantRepoInterface);

const staffCtrl = new StaffCtrl(staffUsecase);
const customerCtrl = new CustomerCtrl(customerUsecase);

// -----------------------------------------------------------------------------
// Router

const router = new express.Router();
router.post('/staff/init-all-tables', staffCtrl.initAllTables.bind(staffCtrl));
router.post('/staff/cancel-reservation', staffCtrl.cancelReservation.bind(staffCtrl));
router.post('/customer/reserve-tables', customerCtrl.reserveTables.bind(customerCtrl));

// -----------------------------------------------------------------------------
// Middleware

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  let code = 500;
  switch (true) {
    case err instanceof RangeError:
      code = 422;
      break;
    default:
      break;
  }

  res.status(code).json({ message: err.message });
};

// -----------------------------------------------------------------------------
// App

const app = express();
app.use(express.json());
app.use('/api/v1', router);
app.use(errorHandler);

module.exports = app;
