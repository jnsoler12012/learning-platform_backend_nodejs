import neo4j from 'neo4j-driver';
import { env } from '../../config/env.js';

let driver;

// Returns the singleton Neo4j driver instance, creating it on first call
export function getDriver() {
  if (!driver) {
    driver = neo4j.driver(
      env.NEO4J_URI,
      neo4j.auth.basic(env.NEO4J_USER, env.NEO4J_PASSWORD),
    );
  }
  return driver;
}

// Creates and returns a new Neo4j session for the configured database
export function getSession() {
  return getDriver().session({ database: env.NEO4J_DB_NAME });
}

// Closes the Neo4j driver connection and resets the singleton
export async function closeDriver() {
  if (driver) {
    await driver.close();
    driver = null;
  }
}
