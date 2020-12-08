import Knex, { SchemaBuilder } from 'knex';

export async function up(knex: Knex): Promise<SchemaBuilder> {
  return knex.schema.createTable('people', tableBuilder => {
    tableBuilder.increments('personId').primary();
    tableBuilder.string('kind').notNullable();
    tableBuilder.string('role').notNullable();
    tableBuilder.string('document').notNullable();
    tableBuilder.string('corporateName').notNullable();
    tableBuilder.string('name').notNullable();
    tableBuilder.string('email').notNullable();
    tableBuilder.string('password').notNullable();
    tableBuilder.string('landlinePhoneNumber').notNullable();
    tableBuilder.string('mobilePhoneNumber').notNullable();
    tableBuilder.string('avatarUrl').notNullable();
    tableBuilder.string('sex').notNullable();
    tableBuilder.string('birthDate').notNullable();
    tableBuilder.string('createdAt').notNullable().defaultTo(knex.fn.now());
    tableBuilder.string('updatedAt').notNullable().defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<SchemaBuilder> {
  return knex.schema.dropTable('people');
}
