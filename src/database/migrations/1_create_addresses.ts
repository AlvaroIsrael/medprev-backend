import Knex, { SchemaBuilder } from 'knex';

export async function up(knex: Knex): Promise<SchemaBuilder> {
  return knex.schema.createTable('addresses', tableBuilder => {
    tableBuilder.increments('addressId').primary();
    tableBuilder.string('personId').notNullable().references('personId').inTable('people');
    tableBuilder.string('street').notNullable();
    tableBuilder.string('number').notNullable();
    tableBuilder.string('complement').notNullable();
    tableBuilder.string('district').notNullable();
    tableBuilder.string('city').notNullable();
    tableBuilder.string('state').notNullable();
    tableBuilder.string('zipCode').notNullable();
    tableBuilder.string('createdAt').notNullable().defaultTo(knex.fn.now());
    tableBuilder.string('updatedAt').notNullable().defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<SchemaBuilder> {
  return knex.schema.dropTable('addresses');
}
