exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('contributions', function (table) {
      table.increments('id');
      table.integer('map_id').notNull().references('maps.id');
      table.integer('user_id').notNull().references('users.id');
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('contributions')
  ])
};
