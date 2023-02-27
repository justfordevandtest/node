module.exports = class StaffCtrl {
  constructor(usecase) {
    this.usecase = usecase;
  }

  async initAllTables(req, res, next) {
    Promise.resolve().then(async () => {
      await this.usecase.initAllTables(req.body.numOfTables);
      res.status(201).send();
    }).catch(next);
  }

  async cancelReservation(req, res, next) {
    Promise.resolve().then(async () => {
      const state = await this.usecase.cancelReservation(req.body.bookingID);
      res.status(200).json(state);
    }).catch(next);
  }
};
