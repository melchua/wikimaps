module.exports = function makeUserActions(knex){
  function findUserById(id){
    return knex('users')
      .first('*')
      .where({id: Number(id) || 0});
  }
  return {
    findUserById
  };
};
