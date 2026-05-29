import '../src/config/env.js';
import { getSession, closeDriver } from '../src/infrastructure/persistence/neo4j.js';

const CONCEPTS = [
  { id: 'CN01', name: 'Number Sense, Counting & Early Arithmetic', description: 'Cardinality, standard counting sequences, comparison (<, >, =), and basic single-digit addition and subtraction.', subtrack: 'Core Algebraic Spine', track: 'Mathematics', difficulty: 1 },
  { id: 'CN02', name: 'Multi-Digit Arithmetic & Rational Numbers', description: 'Place value, multi-digit operations, order of operations, factors, prime numbers, and fractions/decimals/percent foundations (FDP).', subtrack: 'Core Algebraic Spine', track: 'Mathematics', difficulty: 2 },
  { id: 'CN03', name: 'Everyday Math & Measurements', description: 'Telling time, reading clocks, understanding money values, units of measurement, and practical everyday counting.', subtrack: 'Core Algebraic Spine', track: 'Mathematics', difficulty: 2 },
  { id: 'CN04', name: 'Integers, Ratios & Rates', description: 'Negative numbers, absolute value on a coordinate scale, ratios, proportions, unit rates, and real-world interest/percentage applications.', subtrack: 'Core Algebraic Spine', track: 'Mathematics', difficulty: 4 },
  { id: 'CN05', name: 'Algebraic Foundations & Equations', description: 'Using variables, parsing expressions, combining like terms, and solving multi-step equations and inequalities.', subtrack: 'Core Algebraic Spine', track: 'Mathematics', difficulty: 5 },
  { id: 'CN06', name: 'Powers, Roots & Scientific Notation', description: 'Base-exponent patterns, square roots, radical calculations, exponent math laws, and scientific notation operations.', subtrack: 'Core Algebraic Spine', track: 'Mathematics', difficulty: 5 },
  { id: 'CN07', name: 'Linear Functions, Graphs & Systems', description: 'Cartesian coordinates, linear slope graphing (y = mx + b), systems of equations/inequalities, and visual solution regions.', subtrack: 'Core Algebraic Spine', track: 'Mathematics', difficulty: 6 },
  { id: 'CN08', name: 'Polynomial Operations & Quadratics', description: 'Polynomial algebra, binomial factoring techniques, solving quadratic forms, vertex parameters, and complex/imaginary numbers (i).', subtrack: 'Core Algebraic Spine', track: 'Mathematics', difficulty: 7 },
  { id: 'CN09', name: 'Advanced Functions & Rational Graphs', description: 'Domain, range, inverse operations, compositions, geometric curve translations, and radical/rational equations with asymptotes.', subtrack: 'Core Algebraic Spine', track: 'Mathematics', difficulty: 8 },
  { id: 'CN10', name: 'Exponential, Logarithmic & Matrix Algebra', description: 'Exponential modeling, properties of logarithms, arithmetic/geometric series, summation patterns, and matrix calculations.', subtrack: 'Core Algebraic Spine', track: 'Mathematics', difficulty: 9 },
  { id: 'CN11', name: 'Limits, Derivatives & Integral Calculus', description: 'Limits and continuity, differentiation methods (chain rule, optimization), and basic integrals (FTC, integration techniques, and applications).', track: 'Mathematics', subtrack: 'Core Algebraic Spine', difficulty: 10 },
  { id: 'GEO01', name: 'Foundational Shapes & Angles', description: 'Classifying 2D and 3D shapes, calculating perimeter, area, and volume of rectangular shapes, and identifying acute, obtuse, and right angles.', subtrack: 'Geometry & Trigonometry', track: 'Mathematics', difficulty: 2 },
  { id: 'GEO02', name: 'Geometric Proofs & Triangle Congruence', description: 'Establishing theorems, constructing formal logic proofs, parsing transversal lines, and proving triangle similarity/congruence.', subtrack: 'Geometry & Trigonometry', track: 'Mathematics', difficulty: 6 },
  { id: 'GEO03', name: 'Right Triangle Trig & Coordinate Geometry', description: 'Applying the Pythagorean Theorem, utilizing special right triangles, right triangle trigonometric ratios (SOHCAHTOA), and coordinate plane proofs.', subtrack: 'Geometry & Trigonometry', track: 'Mathematics', difficulty: 7 },
  { id: 'GEO04', name: 'Circles & Conic Sections', description: 'Inscribed angle theorems, chords, tangents, arc length/sector calculations, and graphing conics (ellipses, parabolas, hyperbolas).', subtrack: 'Geometry & Trigonometry', track: 'Mathematics', difficulty: 8 },
  { id: 'GEO05', name: 'Advanced Trigonometry & Polar Curves', description: 'Radians, the unit circle, trigonometric graphing identities, polar coordinate graphs, and vector systems.', subtrack: 'Geometry & Trigonometry', track: 'Mathematics', difficulty: 9 },
  { id: 'GEO06', name: 'Polar, Parametric & Infinite Calculus', description: 'Calculus rules applied directly to polar and parametric paths, alongside infinite sequences, Taylor, and Maclaurin expansions.', subtrack: 'Geometry & Trigonometry', track: 'Mathematics', difficulty: 10 },
  { id: 'STAT01', name: 'Descriptive Statistics & Data Representations', description: 'Interpreting plots, calculating central tendencies (mean, median, mode), analyzing scatter plots/correlations, and understanding variance.', subtrack: 'Statistics & Probability', track: 'Mathematics', difficulty: 3 },
  { id: 'STAT02', name: 'Theoretical & Applied Probability', description: 'Computing simple probability, permutations, combinations, and advanced conditional probability distributions.', subtrack: 'Statistics & Probability', track: 'Mathematics', difficulty: 6 },
];

const REQUIRES_TO = [
  ['CN01', 'CN02'], ['CN01', 'CN03'], ['CN02', 'CN04'], ['CN04', 'CN05'],
  ['CN05', 'CN06'], ['CN05', 'CN07'], ['CN05', 'CN08'],
  ['CN07', 'CN09'], ['CN08', 'CN09'], ['CN06', 'CN10'], ['CN09', 'CN10'],
  ['CN09', 'CN11'], ['CN10', 'CN11'],
  ['GEO01', 'GEO02'], ['GEO02', 'GEO03'], ['GEO01', 'GEO04'],
  ['GEO03', 'GEO05'], ['GEO05', 'GEO06'],
  ['STAT01', 'STAT02'],
];

const RELATES_TO = [
  ['CN01', 'GEO01'], ['CN02', 'GEO01'], ['CN02', 'CN03'],
  ['CN05', 'GEO02'], ['CN07', 'GEO03'], ['CN08', 'GEO04'],
  ['GEO05', 'CN09'], ['GEO06', 'CN11'],
  ['CN03', 'STAT01'], ['CN02', 'STAT02'], ['CN07', 'STAT01'],
  ['STAT02', 'CN10'],
];

// Seeds the Neo4j knowledge graph with predefined concepts and relationships
async function run() {
  console.log('Seeding Neo4j knowledge graph...\n');

  const session = getSession();

  try {
    // Clear existing data
    await session.run('MATCH (n:Concept) DETACH DELETE n');
    console.log('Cleared existing concepts');

    // Ensure uniqueness constraint on concept id
    await session.run('CREATE CONSTRAINT unique_concept_id IF NOT EXISTS FOR (c:Concept) REQUIRE c.id IS UNIQUE');
    console.log('Ensured uniqueness constraint on Concept.id');

    // Create concept nodes
    for (const c of CONCEPTS) {
      await session.run(
        `MERGE (c:Concept {id: $id})
         ON CREATE SET c.name = $name, c.description = $description,
           c.subtrack = $subtrack, c.track = $track, c.difficulty = $difficulty`,
        c,
      );
    }
    console.log(`Created ${CONCEPTS.length} concept nodes`);

    // Create REQUIRES_TO relationships (prerequisite chains)
    for (const [from, to] of REQUIRES_TO) {
      await session.run(
        'MATCH (a:Concept {id: $from}), (b:Concept {id: $to}) MERGE (a)-[:REQUIRES_TO]->(b)',
        { from, to },
      );
    }
    console.log(`Created ${REQUIRES_TO.length} REQUIRES_TO relationships`);

    // Create RELATES_TO relationships (cross-topic connections)
    for (const [from, to] of RELATES_TO) {
      await session.run(
        'MATCH (a:Concept {id: $from}), (b:Concept {id: $to}) MERGE (a)-[:RELATES_TO]->(b)',
        { from, to },
      );
    }
    console.log(`Created ${RELATES_TO.length} RELATES_TO relationships`);

    // Clean up any orphaned nodes without labels
    await session.run('MATCH (n) WHERE labels(n) = [] DETACH DELETE n');
    console.log('Cleaned up any blank nodes');
  } finally {
    await session.close();
    await closeDriver();
  }

  console.log('\nSeed completed successfully');
}

run().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
