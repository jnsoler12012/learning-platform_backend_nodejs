import '../src/config/env.js';
import { connectDb, disconnectDb } from '../src/infrastructure/persistence/mongoose.js';

// Seeds the content database with a sample content node, assessment, and question
async function run() {
  console.log('Seeding MongoDB content...\n');

  const { ContentNode } = await import('../src/infrastructure/persistence/models/ContentNode.model.js');
  const { UserNote } = await import('../src/infrastructure/persistence/models/UserNote.model.js');
  const { Assessment } = await import('../src/infrastructure/persistence/models/Assessment.model.js');
  const { Question } = await import('../src/infrastructure/persistence/models/Question.model.js');

  await connectDb();

  await ContentNode.deleteMany({});
  await UserNote.deleteMany({});
  await Assessment.deleteMany({});
  await Question.deleteMany({});

  await ContentNode.create({
    node_id: 'CN11',
    estimated_duration_minutes: 15,
    version: 1,
    version_status: 'PUBLISHED',
    search_text: 'Introduction to Derivatives and rates of change...',
    blocks: [
      {
        type: 'THEORY',
        order: 1,
        content: 'A derivative measures the sensitivity to change of a function value with respect to a change in its argument...',
      },
      {
        type: 'EXAMPLE',
        order: 2,
        content: "Let's look at a concrete application.",
        question: 'Find the derivative of f(x) = 3x^2.',
        steps: 'f(x) = 3x^2.\nf\'(x) = 6x',
        solution: 'f\'(x) = 6x',
        hints: ['Use the power rule.', 'Bring the exponent to the front and decrease it by 1.'],
      },
    ],
  });
  console.log('Created placeholder content node for CN11');

  const assessment = await Assessment.create({
    context_type: 'QUIZ',
    title: 'Diagnostic Assessment: Basic Derivatives',
    state: 'active',
    target_nodes: ['CN11', 'CN12'],
    difficulty_level: 3,
    time_limit_minutes: 30,
    passing_score: 70,
    max_attempts: 3,
  });
  console.log('Created placeholder assessment');

  await Question.create({
    evaluation_id: assessment._id.toString(),
    state: 'active',
    related_node_id: 'CN11',
    bloom_level: 'APPLY',
    question_type: 'MULTIPLE_CHOICE',
    data: {
      question_text: 'What is the first derivative of the function f(x) = 5x?',
      variables: { coeff: 5, power: 1 },
      options: ['5', '5x', '0', '1'],
      correct_answer: '5',
      explanation: 'Using the power rule, the derivative of 5x^1 is 1 * 5x^0, which equals 5.',
    },
  });
  console.log('Created placeholder question');

  await disconnectDb();
  console.log('\nSeed completed successfully');
}

run().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
