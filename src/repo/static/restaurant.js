/* eslint-disable no-promise-executor-return */
module.exports = class RestaurantStaticRepo {
  restaurantData = null;

  async create(restaurant) {
    this.restaurantData = restaurant;
    return new Promise((resolve) => setTimeout(resolve, 100));
  }

  async count() {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return this.restaurantData ? 1 : 0;
  }

  async findOne() {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return this.restaurantData;
  }
};
