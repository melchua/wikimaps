
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('places', function (table) {
      table.increments('id');
      table.string('name');
      table.string('description');
      table.string('coordinates');
      table.string('image');
      table.integer('map_id').notNull().references('maps.id');
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('places')
  ])
};
