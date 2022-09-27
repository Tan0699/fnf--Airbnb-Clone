'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
     await queryInterface.bulkInsert('Bookings', [
      {
        spotId:1,
        userId:1,
        startDate:"2030-01-01",
        endDate:"2030-01-02",
      },
      {
        spotId:2,
        userId:2,
        startDate:"2030-01-01",
        endDate:"2030-01-02",
      },
      {
        spotId:3,
        userId:3,
        startDate:"2030-01-01",
        endDate:"2030-01-02",
      },
      {
        spotId:4,
        userId:4,
        startDate:"2030-01-01",
        endDate:"2030-01-02",
      },
      {
        spotId:5,
        userId:5,
        startDate:"2030-01-01",
        endDate:"2030-01-02",
      },
      {
        spotId:6,
        userId:6,
        startDate:"2030-01-01",
        endDate:"2030-01-02",
      },
      {
        spotId:7,
        userId:7,
        startDate:"2030-01-01",
        endDate:"2030-01-02",
      }
     ])
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
     const Op = Sequelize.Op;
     await queryInterface.bulkDelete('Bookings',{
       spotId:{[Op.in] : [1,2,3,4,5,6,7]}
     },{});
  }
};
