module.exports = class CustomerCtrl {
  constructor(usecase) {
    this.usecase = usecase;
  }

  async reserveTables(req, res, next) {
    Promise.resolve().then(async () => {
      const booking = await this.usecase.reserveTables(req.body.numOfPeople);
      res.status(200).json(booking);
    }).catch(next);
  }
};
