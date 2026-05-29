import { getSession } from '../neo4j.js';
import { Concept } from '../../../domain/entities/Concept.entity.js';

// Maps a Neo4j node object to a Concept domain entity
function toEntity(node) {
  if (!node) return null;
  return new Concept(node.properties);
}

// Maps a single Neo4j record to a Concept entity by extracting the named key
function singleToEntity(record, key) {
  if (!record) return null;
  return toEntity(record.get(key));
}

// Maps an array of Neo4j records to Concept entities by extracting the named key
function listToEntity(records, key) {
  return records.map((r) => toEntity(r.get(key))).filter(Boolean);
}

// Retrieves all non-deleted concepts, optionally filtered by track and/or subtrack
export async function findAll({ track, subtrack } = {}) {
  const session = getSession();
  try {
    let cypher = 'MATCH (c:Concept) WHERE c.deletedAt IS NULL';
    const params = {};
    if (track) {
      cypher += ' AND c.track = $track';
      params.track = track;
    }
    if (subtrack) {
      cypher += ' AND c.subtrack = $subtrack';
      params.subtrack = subtrack;
    }
    cypher += ' RETURN c ORDER BY c.difficulty';
    const result = await session.run(cypher, params);
    return listToEntity(result.records, 'c');
  } finally {
    await session.close();
  }
}

// Finds a concept by its unique id
export async function findById(id) {
  const session = getSession();
  try {
    const result = await session.run(
      'MATCH (c:Concept {id: $id}) RETURN c',
      { id },
    );
    return singleToEntity(result.records[0], 'c');
  } finally {
    await session.close();
  }
}

// Finds all concepts matching a given track, excluding deleted ones
export async function findByTrack(track) {
  const session = getSession();
  try {
    const result = await session.run(
      'MATCH (c:Concept {track: $track}) WHERE c.deletedAt IS NULL RETURN c ORDER BY c.difficulty',
      { track },
    );
    return listToEntity(result.records, 'c');
  } finally {
    await session.close();
  }
}

// Finds all concepts matching a given subtrack, excluding deleted ones
export async function findBySubtrack(subtrack) {
  const session = getSession();
  try {
    const result = await session.run(
      'MATCH (c:Concept {subtrack: $subtrack}) WHERE c.deletedAt IS NULL RETURN c ORDER BY c.difficulty',
      { subtrack },
    );
    return listToEntity(result.records, 'c');
  } finally {
    await session.close();
  }
}

// Creates a new Concept node with the given properties
export async function create(data) {
  const session = getSession();
  try {
    const result = await session.run(
      `CREATE (c:Concept {
        id: $id,
        name: $name,
        description: $description,
        subtrack: $subtrack,
        track: $track,
        difficulty: $difficulty
      }) RETURN c`,
      data,
    );
    return singleToEntity(result.records[0], 'c');
  } finally {
    await session.close();
  }
}

// Dynamically updates a concept node by id with only the provided fields
export async function update(id, data) {
  const session = getSession();
  try {
    const setClauses = Object.keys(data)
      .map((key) => `c.${key} = $${key}`)
      .join(', ');
    const result = await session.run(
      `MATCH (c:Concept {id: $id}) SET ${setClauses} RETURN c`,
      { id, ...data },
    );
    return singleToEntity(result.records[0], 'c');
  } finally {
    await session.close();
  }
}

// Permanently deletes a concept node and all its relationships
export async function remove(id) {
  const session = getSession();
  try {
    await session.run(
      'MATCH (c:Concept {id: $id}) DETACH DELETE c',
      { id },
    );
  } finally {
    await session.close();
  }
}

// Retrieves all prerequisites (incoming REQUIRES_TO relationships) for a concept
export async function getPrerequisites(id) {
  const session = getSession();
  try {
    const result = await session.run(
      'MATCH (c:Concept {id: $id})<-[:REQUIRES_TO]-(pre:Concept) RETURN pre ORDER BY pre.difficulty',
      { id },
    );
    return listToEntity(result.records, 'pre');
  } finally {
    await session.close();
  }
}

// Retrieves all dependents (outgoing REQUIRES_TO relationships) for a concept
export async function getDependents(id) {
  const session = getSession();
  try {
    const result = await session.run(
      'MATCH (c:Concept {id: $id})-[:REQUIRES_TO]->(dep:Concept) RETURN dep ORDER BY dep.difficulty',
      { id },
    );
    return listToEntity(result.records, 'dep');
  } finally {
    await session.close();
  }
}

// Retrieves all related concepts (bidirectional RELATES_TO) for a concept
export async function getRelated(id) {
  const session = getSession();
  try {
    const result = await session.run(
      'MATCH (c:Concept {id: $id})-[r:RELATES_TO]-(rel:Concept) RETURN rel, type(r) AS relType ORDER BY rel.difficulty',
      { id },
    );
    return listToEntity(result.records, 'rel');
  } finally {
    await session.close();
  }
}

// Creates a REQUIRES_TO (prerequisite) relationship between two concepts
export async function addRequiresTo(fromId, toId) {
  const session = getSession();
  try {
    await session.run(
      'MATCH (a:Concept {id: $fromId}), (b:Concept {id: $toId}) MERGE (a)-[:REQUIRES_TO]->(b)',
      { fromId, toId },
    );
  } finally {
    await session.close();
  }
}

// Creates a RELATES_TO (related) relationship between two concepts
export async function addRelatesTo(fromId, toId) {
  const session = getSession();
  try {
    await session.run(
      'MATCH (a:Concept {id: $fromId}), (b:Concept {id: $toId}) MERGE (a)-[:RELATES_TO]->(b)',
      { fromId, toId },
    );
  } finally {
    await session.close();
  }
}

// Removes a REQUIRES_TO relationship between two concepts
export async function removeRequiresTo(fromId, toId) {
  const session = getSession();
  try {
    await session.run(
      'MATCH (a:Concept {id: $fromId})-[r:REQUIRES_TO]->(b:Concept {id: $toId}) DELETE r',
      { fromId, toId },
    );
  } finally {
    await session.close();
  }
}

// Removes a RELATES_TO relationship between two concepts
export async function removeRelatesTo(fromId, toId) {
  const session = getSession();
  try {
    await session.run(
      'MATCH (a:Concept {id: $fromId})-[r:RELATES_TO]->(b:Concept {id: $toId}) DELETE r',
      { fromId, toId },
    );
  } finally {
    await session.close();
  }
}

// Returns the full knowledge graph with all concept nodes and their relationships
export async function getFullGraph() {
  const session = getSession();
  try {
    const result = await session.run(
      `MATCH (c:Concept)
       OPTIONAL MATCH (c)-[r]->(target:Concept)
       RETURN c, r, target`,
    );

    const nodeMap = new Map();
    const edges = [];

    for (const record of result.records) {
      const c = record.get('c');
      if (c && !nodeMap.has(c.properties.id)) {
        nodeMap.set(c.properties.id, {
          id: c.properties.id,
          name: c.properties.name,
          subtrack: c.properties.subtrack,
          track: c.properties.track,
          difficulty: c.properties.difficulty,
        });
      }

      const r = record.get('r');
      const target = record.get('target');
      if (r && target && !nodeMap.has(target.properties.id)) {
        nodeMap.set(target.properties.id, {
          id: target.properties.id,
          name: target.properties.name,
          subtrack: target.properties.subtrack,
          track: target.properties.track,
          difficulty: target.properties.difficulty,
        });
      }

      if (r && target) {
        edges.push({
          from: c.properties.id,
          to: target.properties.id,
          type: r.type,
        });
      }
    }

    return {
      nodes: [...nodeMap.values()],
      edges,
    };
  } finally {
    await session.close();
  }
}

// Returns the knowledge graph filtered to a specific track
export async function getGraphByTrack(track) {
  const session = getSession();
  try {
    const result = await session.run(
      `MATCH (c:Concept {track: $track})
       OPTIONAL MATCH (c)-[r]->(target:Concept {track: $track})
       RETURN c, r, target`,
      { track },
    );

    const nodeMap = new Map();
    const edges = [];

    for (const record of result.records) {
      const c = record.get('c');
      if (c && !nodeMap.has(c.properties.id)) {
        nodeMap.set(c.properties.id, {
          id: c.properties.id,
          name: c.properties.name,
          subtrack: c.properties.subtrack,
          track: c.properties.track,
          difficulty: c.properties.difficulty,
        });
      }

      const r = record.get('r');
      const target = record.get('target');
      if (r && target && !nodeMap.has(target.properties.id)) {
        nodeMap.set(target.properties.id, {
          id: target.properties.id,
          name: target.properties.name,
          subtrack: target.properties.subtrack,
          track: target.properties.track,
          difficulty: target.properties.difficulty,
        });
      }

      if (r && target) {
        edges.push({
          from: c.properties.id,
          to: target.properties.id,
          type: r.type,
        });
      }
    }

    return {
      nodes: [...nodeMap.values()],
      edges,
    };
  } finally {
    await session.close();
  }
}

// Finds the shortest path between two concepts using REQUIRES_TO relationships
export async function getConceptPath(fromId, toId) {
  const session = getSession();
  try {
    const pathResult = await session.run(
      `MATCH path = shortestPath(
        (from:Concept {id: $fromId})-[:REQUIRES_TO*]-(to:Concept {id: $toId})
      )
       RETURN nodes(path) AS pathNodes`,
      { fromId, toId },
    );

    if (pathResult.records.length === 0) return null;

    const pathNodes = pathResult.records[0].get('pathNodes');
    const nodeIds = pathNodes.map((n) => n.properties.id);

    const edgesResult = await session.run(
      `MATCH (a:Concept)-[r:REQUIRES_TO]->(b:Concept)
       WHERE a.id IN $nodeIds AND b.id IN $nodeIds
       RETURN a.id AS from, b.id AS to, type(r) AS type`,
      { nodeIds },
    );

    const nodes = pathNodes.map((n) => ({
      id: n.properties.id,
      name: n.properties.name,
      subtrack: n.properties.subtrack,
      track: n.properties.track,
      difficulty: n.properties.difficulty,
    }));

    const edges = edgesResult.records.map((r) => ({
      from: r.get('from'),
      to: r.get('to'),
      type: r.get('type'),
    }));

    return { nodes, edges };
  } finally {
    await session.close();
  }
}

// Returns a concept with all its prerequisites, dependents, and related concepts expanded
export async function getFullConceptDetail(id) {
  const session = getSession();
  try {
    const concept = await findById(id);
    if (!concept) return null;

    const prereqs = await getPrerequisites(id);
    const dependents = await getDependents(id);
    const related = await getRelated(id);

    return {
      ...concept,
      prerequisites: prereqs.map((p) => ({ id: p.id, name: p.name, difficulty: p.difficulty })),
      dependents: dependents.map((d) => ({ id: d.id, name: d.name, difficulty: d.difficulty })),
      related: related.map((r) => ({ id: r.id, name: r.name, difficulty: r.difficulty })),
    };
  } finally {
    await session.close();
  }
}
