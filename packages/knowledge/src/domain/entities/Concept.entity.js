// Concept domain entity representing a node in the knowledge graph
export class Concept {
  constructor({ id, name, description, subtrack, track, difficulty }) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.subtrack = subtrack;
    this.track = track;
    this.difficulty = difficulty !== undefined ? Number(difficulty) : null;
  }
}
