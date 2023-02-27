const uuid = require('uuid');
const request = require('supertest');
const app = require('../app');

test('Integration test', async () => {
  let res = null;
  // reserve before init result in error
  await request(app)
    .post('/api/v1/customer/reserve-tables')
    .send({ numOfPeople: 3 })
    .expect(500);

  // init zero tables result in error
  await request(app)
    .post('/api/v1/staff/init-all-tables')
    .send({ numOfTables: 0 })
    .expect(422);

  // reserve before init success result in error
  await request(app)
    .post('/api/v1/customer/reserve-tables')
    .send({ numOfPeople: 3 })
    .expect(500);

  // init tables
  await request(app)
    .post('/api/v1/staff/init-all-tables')
    .send({ numOfTables: 3 })
    .expect(201);

  // init tables again will result in error
  await request(app)
    .post('/api/v1/staff/init-all-tables')
    .send({ numOfTables: 3 })
    .expect(500);

  // init tables again and still got error
  await request(app)
    .post('/api/v1/staff/init-all-tables')
    .send({ numOfTables: 3 })
    .expect(500);

  // reserve for 3, booked 2, remain 1
  res = await request(app)
    .post('/api/v1/customer/reserve-tables')
    .send({ numOfPeople: 3 })
    .expect(200);

  expect(uuid.validate(res.body.id)).toBeTruthy();
  expect(res.body.numOfBookedTables).toBe(2);
  expect(res.body.numOfRemainingTables).toBe(1);

  // another group reserve for 3 not enough tables
  await request(app)
    .post('/api/v1/customer/reserve-tables')
    .send({ numOfPeople: 3 })
    .expect(500);

  // init tables again and still got error
  await request(app)
    .post('/api/v1/staff/init-all-tables')
    .send({ numOfTables: 3 })
    .expect(500);

  // cancel lastest reservation, booked 2, remain 1
  let tmpBookingID = res.body.id;
  res = await request(app)
    .post('/api/v1/staff/cancel-reservation')
    .send({ bookingID: res.body.id })
    .expect(200);

  expect(res.body.numOfBookedTables).toBe(2);
  expect(res.body.numOfRemainingTables).toBe(3);

  // cancel with booking ID that already canceled result in error
  await request(app)
    .post('/api/v1/staff/cancel-reservation')
    .send({ bookingID: tmpBookingID })
    .expect(500);

  // another group reserve for 7 not enough tables because store has 3 tables 2 seats each
  await request(app)
    .post('/api/v1/customer/reserve-tables')
    .send({ numOfPeople: 7 })
    .expect(500);

  // new group reserve for 6 not enough tables try again and success
  res = await request(app)
    .post('/api/v1/customer/reserve-tables')
    .send({ numOfPeople: 6 })
    .expect(200);

  expect(uuid.validate(res.body.id)).toBeTruthy();
  expect(res.body.numOfBookedTables).toBe(3);
  expect(res.body.numOfRemainingTables).toBe(0);

  // cancel with empty booking ID result in error
  await request(app)
    .post('/api/v1/staff/cancel-reservation')
    .send({ bookingID: '' })
    .expect(422);

  // cancel lastest reservation all tables released
  tmpBookingID = res.body.id;
  res = await request(app)
    .post('/api/v1/staff/cancel-reservation')
    .send({ bookingID: tmpBookingID })
    .expect(200);

  expect(res.body.numOfBookedTables).toBe(3);
  expect(res.body.numOfRemainingTables).toBe(3);
});
