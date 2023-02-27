module.exports = class RestaurantRepoInterface {
  constructor(repo) {
    this.repo = repo;
  }

  async create(restaurant) {
    return this.repo.create(restaurant);
  }

  async count() {
    return this.repo.count();
  }

  async findOne() {
    return this.repo.findOne();
  }
};
