
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('maps', function (table) {
      table.increments('id');
      table.string('name');
      table.string('coordinates');
      table.string('zoom');
      table.date('date_updated');
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('maps')
  ])
};
