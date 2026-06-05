import '../src/config/env.js';
import { connectDb, disconnectDb } from '../src/infrastructure/persistence/mongoose.js';

async function run() {
  console.log('Seeding MongoDB content...\n');

  const { ContentNode } = await import('../src/infrastructure/persistence/models/ContentNode.model.js');
  const { Assessment } = await import('../src/infrastructure/persistence/models/Assessment.model.js');
  const { Question } = await import('../src/infrastructure/persistence/models/Question.model.js');

  await connectDb();

  await ContentNode.deleteMany({});
  await Assessment.deleteMany({});
  await Question.deleteMany({});

  const contentNodesData = [
    {
      node_id: 'CN01',
      estimated_duration_minutes: 10,
      version: 1,
      version_status: 'PUBLISHED',
      search_text: 'Number Sense, Counting, Cardinality, Early Arithmetic, addition, subtraction',
      blocks: [
        {
          type: 'THEORY',
          order: 1,
          content: 'Number sense is the absolute foundation of mathematics. It begins with cardinality (understanding that the last number counted represents the total quantity of objects) and subitizing (instantly recognizing small quantities without counting one-by-one). Once students can sequence numbers from 1 to 100, they transition to comparison using the mathematical relations of greater than (>), less than (<), and equal to (=). Basic single-digit addition and subtraction build directly on these counting pathways by modeling joining and separating groups of physical items.',
        },
        {
          type: 'INTERACTIVE_MATH',
          order: 2,
          content: 'Visual representations of counting groups, number comparisons, and single-digit addition arrays.',
          image: {
            type: 'IMAGE',
            url: 'https://storage.platform.com/notes/attachments/cn01-counting-sense.png',
            file_size: 154320,
            mime_type: 'image/png',
          },
        },
      ],
    },
    {
      node_id: 'CN02',
      estimated_duration_minutes: 15,
      version: 1,
      version_status: 'PUBLISHED',
      search_text: 'Multi-Digit Arithmetic, Rational Numbers, Place Value, Fractions, Decimals, Percents, FDP, order of operations',
      blocks: [
        {
          type: 'THEORY',
          order: 1,
          content: 'Our number system is base-10, meaning each position represents a power of ten. Place value allows us to perform arithmetic on arbitrarily large numbers using structured algorithms for carrying and borrowing. This base-10 structure extends directly below zero to represent tenths, hundredths, and thousandths as decimals. Fractions represent division of a whole into equal parts. Understanding that Fractions, Decimals, and Percents (FDP) are simply different formats for the exact same rational value is key to mastering algebraic balance.',
        },
        {
          type: 'EXAMPLE',
          order: 2,
          content: "Let's convert a fraction into decimal and percent notations.",
          question: 'Convert the fraction 3/5 into both a decimal and a percentage.',
          steps: "1. To convert a fraction to a decimal, divide the numerator by the denominator: 3 \u00f7 5 = 0.6.\n2. To convert a decimal to a percentage, multiply the decimal value by 100 and add the percentage symbol (%): 0.6 \u00d7 100 = 60%.",
          solution: 'Decimal: 0.6, Percentage: 60%',
          hints: [
            'Fractions represent division.',
            "Percent means 'per hundred', so multiplying by 100 scales it correctly.",
          ],
        },
      ],
    },
    {
      node_id: 'CN03',
      estimated_duration_minutes: 10,
      version: 1,
      version_status: 'PUBLISHED',
      search_text: 'Everyday Math, Measurements, Time, Clocks, Money, Currency',
      blocks: [
        {
          type: 'THEORY',
          order: 1,
          content: 'Mathematics serves to organize and scale our daily physical world. Mastering time requires reading an analog clock, which divides a standard day using modular base-12 and base-60 counting loops. Financial calculations use fractional decimals where coins represent fractional parts of a single monetary unit. Physical measurements of length, weight, and volume allow us to quantify our spatial environment using standard imperial and metric unit conversions.',
        },
        {
          type: 'EXAMPLE',
          order: 2,
          content: "Let's perform a simple real-world time calculation.",
          question: 'If a movie starts at 4:15 PM and lasts for 1 hour and 45 minutes, at what time does it end?',
          steps: '1. Add the minutes: 15 minutes + 45 minutes = 60 minutes.\n2. Convert 60 minutes to 1 hour.\n3. Add the hours: 4 PM + 1 hour (from duration) + 1 hour (from conversion) = 6 PM.',
          solution: '6:00 PM',
          hints: [
            '60 minutes equals exactly 1 hour.',
            'Add minutes first, then convert any surplus to hours.',
          ],
        },
      ],
    },
    {
      node_id: 'CN04',
      estimated_duration_minutes: 15,
      version: 1,
      version_status: 'PUBLISHED',
      search_text: 'Integers, Signed Numbers, Ratios, Rates, Proportions, absolute value, percentages',
      blocks: [
        {
          type: 'THEORY',
          order: 1,
          content: 'Integers introduce numbers with direction, extending our coordinate line below zero. While positive and negative signs indicate direction, absolute value measures distance from zero, representing pure magnitude. Building on multi-digit comparisons, ratios define the multiplicative relation between two quantities. When two ratios are set equal, they form a proportion, which can be solved using scale factors to map changes in tax, interest, or unit rates.',
        },
        {
          type: 'EXAMPLE',
          order: 2,
          content: "Let's solve a simple proportion using the cross-multiplication method.",
          question: 'Solve the proportion for x: 3/4 = x/20.',
          steps: "1. Set the cross-products equal: multiply the numerator of one fraction by the denominator of the other.\n   3 \u00d7 20 = 4 \u00d7 x\n2. Simplify the arithmetic: 60 = 4x.\n3. Isolate x by dividing both sides of the equation by 4:\n   x = 60 / 4\n4. Solve: x = 15.",
          solution: 'x = 15',
          hints: [
            'Cross-multiplication is the quickest way to clear fractions in a proportion.',
            'Divide by the coefficient of x to solve for the variable.',
          ],
        },
      ],
    },
    {
      node_id: 'CN05',
      estimated_duration_minutes: 20,
      version: 1,
      version_status: 'PUBLISHED',
      search_text: 'Algebraic Foundations, Equations, Variables, Expressions, Inequalities',
      blocks: [
        {
          type: 'THEORY',
          order: 1,
          content: 'The transition to algebra begins with the variable\u2014a symbol (usually a letter) that represents an unknown number. An expression is a mathematical statement containing numbers, variables, and operations, while an equation asserts that two expressions are equal. Solving an equation means isolating the variable on one side by applying inverse operations systematically to both sides, maintaining balance. When comparing expressions of unequal value, we use inequalities (<, >, <=, >=), graphing their solutions as half-line intervals on a standard number line.',
        },
        {
          type: 'EXAMPLE',
          order: 2,
          content: "Let's solve a two-step linear equation to find the value of the unknown variable.",
          question: 'Solve the equation for x: 3x + 5 = 20.',
          steps: '1. Isolate the variable term (3x) by subtracting 5 from both sides:\n   3x + 5 - 5 = 20 - 5\n   3x = 15\n2. Isolate the variable x by dividing both sides of the equation by 3:\n   3x / 3 = 15 / 3\n3. Solve: x = 5.',
          solution: 'x = 5',
          hints: [
            'Undo addition or subtraction first.',
            'Undo multiplication or division second to completely isolate the variable.',
          ],
        },
      ],
    },
    {
      node_id: 'CN06',
      estimated_duration_minutes: 15,
      version: 1,
      version_status: 'PUBLISHED',
      search_text: 'Powers, Roots, Scientific Notation, Exponents, Radicals',
      blocks: [
        {
          type: 'THEORY',
          order: 1,
          content: 'Exponents represent repeated multiplication of a base number by itself. Exponent rules dictate how to multiply, divide, and scale these quantities. The inverse of finding a power is calculating a root (such as square and cube roots). This exponent-based system enables scientific notation, which converts massive or tiny values into standard decimal multiples of 10. This is the foundation for logarithmic scaling in sciences.',
        },
        {
          type: 'EXAMPLE',
          order: 2,
          content: "Let's simplify an expression containing exponents using base algebra laws.",
          question: "Simplify the expression: (2x^3)^2 * x^4.",
          steps: "1. Apply the power of a product law to the first term:\n   (2x^3)^2 = 2^2 * (x^3)^2 = 4x^(3*2) = 4x^6\n2. Multiply this result by the remaining term: 4x^6 * x^4\n3. Apply the product law of exponents by adding the exponents of the identical bases:\n   4x^(6 + 4) = 4x^10.",
          solution: '4x^10',
          hints: [
            'Remember that power-of-a-power means multiplying exponents.',
            'Multiplying common bases means adding exponents.',
          ],
        },
      ],
    },
    {
      node_id: 'CN07',
      estimated_duration_minutes: 20,
      version: 1,
      version_status: 'PUBLISHED',
      search_text: 'Linear Functions, Graphs, Systems, Slope, Coordinates',
      blocks: [
        {
          type: 'THEORY',
          order: 1,
          content: 'Plotting points as ordered pairs (x, y) on a 2D Cartesian plane allows us to visualize equations. A linear function graphs as a straight line, representing a constant rate of change called slope (m). We express linear paths using slope-intercept form (y = mx + b) or point-slope form. When two or more linear equations describe the same system, we solve for their intersection using substitution, elimination, or coordinate graphing.',
        },
        {
          type: 'INTERACTIVE_MATH',
          order: 2,
          content: 'A 2D coordinate grid demonstrating how to plot lines, calculate rise-over-run slope, and pinpoint the intersection of two linear lines.',
          image: {
            type: 'IMAGE',
            url: 'https://storage.platform.com/notes/attachments/cn07-linear-graphs.png',
            file_size: 232100,
            mime_type: 'image/png',
          },
        },
        {
          type: 'EXAMPLE',
          order: 3,
          content: "Let's find the slope of a line passing through two coordinate points.",
          question: 'Find the slope of the line that passes through the points A(2, 3) and B(5, 9).',
          steps: '1. Identify coordinates: x1 = 2, y1 = 3, x2 = 5, y2 = 9.\n2. Write the slope formula: m = (y2 - y1) / (x2 - x1).\n3. Substitute values: m = (9 - 3) / (5 - 2).\n4. Simplify: m = 6 / 3 = 2.',
          solution: 'm = 2',
          hints: [
            "Slope represents 'rise over run'.",
            'Always subtract coordinates in the same direction.',
          ],
        },
      ],
    },
    {
      node_id: 'CN08',
      estimated_duration_minutes: 25,
      version: 1,
      version_status: 'PUBLISHED',
      search_text: 'Polynomial Operations, Quadratics, Factoring, Complex Numbers',
      blocks: [
        {
          type: 'THEORY',
          order: 1,
          content: 'Polynomials are algebraic expressions built from variables and coefficients. Operating on them involves combining like terms, multiplying binomials, and reverse-factoring. Solving quadratic equations introduces curved parent shapes called parabolas. When a quadratic equation does not cross the x-axis, its solutions include complex numbers, introducing the imaginary unit (i) where i^2 = -1.',
        },
        {
          type: 'EXAMPLE',
          order: 2,
          content: "Let's find the roots of a quadratic equation using the quadratic formula.",
          question: 'Solve the quadratic equation: x^2 - 5x + 6 = 0.',
          steps: "1. Identify standard coefficients: a = 1, b = -5, c = 6.\n2. Recall the quadratic formula: x = [-b \u00b1 \u221a(b^2 - 4ac)] / (2a).\n3. Substitute the coefficients: x = [-(-5) \u00b1 \u221a((-5)^2 - 4(1)(6))] / (2*1).\n4. Calculate the discriminant: b^2 - 4ac = 25 - 24 = 1.\n5. Simplify: x = [5 \u00b1 \u221a1] / 2 = [5 \u00b1 1] / 2.\n6. Solve both pathways:\n   x1 = (5 + 1)/2 = 3\n   x2 = (5 - 1)/2 = 2.",
          solution: 'x = 3 or x = 2',
          hints: [
            'Be careful with negative signs when substituting -b.',
            'The discriminant determines whether solutions are real or complex.',
          ],
        },
      ],
    },
    {
      node_id: 'CN09',
      estimated_duration_minutes: 20,
      version: 1,
      version_status: 'PUBLISHED',
      search_text: 'Advanced Functions, Rational Graphs, Transformations, Domain, Range',
      blocks: [
        {
          type: 'THEORY',
          order: 1,
          content: 'A function maps inputs (domain) to outputs (range) such that each input has exactly one output. We can transform these parent curves by shifting, stretching, or reflecting them. Composite functions feed one function into another, while inverse functions undo a function\'s mapping. Rational functions introduce fraction variables, creating asymptotes (boundaries where the function is undefined).',
        },
        {
          type: 'EXAMPLE',
          order: 2,
          content: "Let's find the inverse of a standard linear function algebraically.",
          question: 'Find the inverse function f^-1(x) for the function f(x) = 2x + 7.',
          steps: "1. Replace f(x) with y: y = 2x + 7.\n2. Interchange the variable places x and y: x = 2y + 7.\n3. Solve the equation for y:\n   x - 7 = 2y\n   y = (x - 7) / 2\n4. Replace y with the inverse notation: f^-1(x) = (x - 7) / 2.",
          solution: 'f^-1(x) = (x - 7)/2',
          hints: [
            'Swapping x and y visually mirrors the function over the line y = x.',
            'Isolate y completely to finalize your inverse model.',
          ],
        },
      ],
    },
    {
      node_id: 'CN10',
      estimated_duration_minutes: 25,
      version: 1,
      version_status: 'PUBLISHED',
      search_text: 'Exponential, Logarithmic, Matrix Algebra, Matrices, Series',
      blocks: [
        {
          type: 'THEORY',
          order: 1,
          content: 'Exponential functions model rapid real-world scaling, like population growth or radioactive decay. Logarithms are the inverse of exponents, answering the question: \'To what power must we raise this base to get this value?\' This unit also explores sequences and series (arithmetic and geometric summations) and matrices, which arrange numbers in grids to solve complex systems of equations.',
        },
        {
          type: 'EXAMPLE',
          order: 2,
          content: "Let's solve a logarithmic equation by converting it into its exponential equivalent.",
          question: 'Solve the logarithmic equation for x: log_2(x - 3) = 4.',
          steps: "1. Convert the log equation log_b(Y) = X to its exponential equivalent b^X = Y:\n   2^4 = x - 3\n2. Compute 2 to the power of 4: 16 = x - 3.\n3. Solve for x by adding 3 to both sides:\n   x = 16 + 3\n   x = 19.",
          solution: 'x = 19',
          hints: [
            'The log base becomes the base of the exponential power.',
            'Always verify that your solution yields a positive value inside the original log argument.',
          ],
        },
      ],
    },
    {
      node_id: 'CN11',
      estimated_duration_minutes: 30,
      version: 1,
      version_status: 'PUBLISHED',
      search_text: 'Limits, Derivatives, Integral Calculus, Continuity, FTC, integration',
      blocks: [
        {
          type: 'THEORY',
          order: 1,
          content: 'Calculus is the study of continuous change. It begins with limits\u2014examining how a function behaves as its input approaches a target value. When a limit is continuous, we define the derivative as the instantaneous rate of change (the exact slope of a tangent line). Conversely, the integral calculates the accumulated area under a curve. The Fundamental Theorem of Calculus (FTC) elegantly links these operations as inverse processes.',
        },
        {
          type: 'EXAMPLE',
          order: 2,
          content: "Let's calculate the derivative of a polynomial function using basic rules.",
          question: 'Find the derivative of the function f(x) = 3x^2 + 5x - 4.',
          steps: "1. Apply the Power Rule (d/dx[x^n] = n*x^(n-1)) to the first term (3x^2):\n   d/dx[3x^2] = 3 * 2 * x^(2-1) = 6x\n2. Apply the Power Rule to the linear term (5x):\n   d/dx[5x] = 5 * 1 = 5\n3. Apply the Constant Rule to the last term (-4):\n   d/dx[-4] = 0\n4. Sum the individual derivative terms: f'(x) = 6x + 5.",
          solution: "f'(x) = 6x + 5",
          hints: [
            'Power rule allows you to bring the power to the front and drop the exponent by 1.',
            'The derivative of a flat constant is always zero.',
          ],
        },
      ],
    },
    {
      node_id: 'GEO01',
      estimated_duration_minutes: 10,
      version: 1,
      version_status: 'PUBLISHED',
      search_text: 'Foundational Shapes, Angles, 2D, 3D, Perimeter, Area',
      blocks: [
        {
          type: 'THEORY',
          order: 1,
          content: 'Geometry begins by identifying shapes in our physical environment. Two-dimensional polygons (circles, squares, triangles) are measured by perimeter (the distance around the outside) and area (the space inside). When extended to three dimensions, shapes become solids (like rectangular prisms) measured by volume. Measuring angles (acute, right, obtuse) helps us understand how intersecting lines define these shapes.',
        },
        {
          type: 'EXAMPLE',
          order: 2,
          content: "Let's calculate the perimeter and area of a simple 2D rectangle.",
          question: 'Find the area and perimeter of a rectangle with length = 8 cm and width = 5 cm.',
          steps: '1. Use the Area formula: Area = length \u00d7 width.\n   Area = 8 \u00d7 5 = 40 cm^2\n2. Use the Perimeter formula: Perimeter = 2 \u00d7 (length + width).\n   Perimeter = 2 \u00d7 (8 + 5) = 2 \u00d7 13 = 26 cm.',
          solution: 'Area = 40 cm^2, Perimeter = 26 cm',
          hints: [
            'Area uses square units (cm^2) as it measures space in two dimensions.',
            'Perimeter measures length, so its units remain linear (cm).',
          ],
        },
      ],
    },
    {
      node_id: 'GEO02',
      estimated_duration_minutes: 20,
      version: 1,
      version_status: 'PUBLISHED',
      search_text: 'Geometric Proofs, Triangle Congruence, Similarity, Theorems',
      blocks: [
        {
          type: 'THEORY',
          order: 1,
          content: 'Geometric proofs use deductive logic to prove geometric properties are true. Starting with postulates, we prove theorems about parallel lines cut by transversals. We also prove triangle congruence (SSS, SAS, ASA, AAS, HL), meaning two triangles are identical, and similarity (AA, SSS, SAS similarity), meaning they share the same proportions.',
        },
        {
          type: 'EXAMPLE',
          order: 2,
          content: "Let's identify triangle congruence rules based on given spatial parameters.",
          question: 'In triangles ABC and DEF, segment AB = DE, segment BC = EF, and segment AC = DF. Are the triangles congruent? State the correct postulate.',
          steps: '1. Examine the given matched segments:\n   - Side AB matches Side DE (S)\n   - Side BC matches Side EF (S)\n   - Side AC matches Side DF (S)\n2. Since all three corresponding sides are congruent, we apply the Side-Side-Side (SSS) Postulate.\n3. Conclude that triangle ABC is congruent to triangle DEF.',
          solution: 'Congruent by the SSS Postulate.',
          hints: [
            'Check the vertices order in the congruence statement.',
            'The SSS postulate only requires corresponding side matching, not angle measures.',
          ],
        },
      ],
    },
    {
      node_id: 'GEO03',
      estimated_duration_minutes: 20,
      version: 1,
      version_status: 'PUBLISHED',
      search_text: 'Right Triangle Trig, Coordinate Geometry, Pythagorean Theorem, SOHCAHTOA',
      blocks: [
        {
          type: 'THEORY',
          order: 1,
          content: 'Right triangles have unique geometric properties. The Pythagorean Theorem (a^2 + b^2 = c^2) relates the lengths of the sides of a right triangle. Trigonometric ratios (Sine, Cosine, Tangent) use SOHCAHTOA to relate a triangle\'s angles to its side lengths. This connects geometry to algebra on the coordinate plane, allowing us to prove geometric properties algebraically.',
        },
        {
          type: 'EXAMPLE',
          order: 2,
          content: "Let's find the missing side of a right triangle using algebra.",
          question: 'Find the length of the hypotenuse c of a right triangle with legs a = 6 cm and b = 8 cm.',
          steps: "1. Write down the Pythagorean Theorem: a^2 + b^2 = c^2.\n2. Substitute the leg values: 6^2 + 8^2 = c^2.\n3. Evaluate the squares: 36 + 64 = c^2.\n4. Simplify the sum: 100 = c^2.\n5. Solve for c by taking the positive square root: c = \u221a100 = 10.",
          solution: 'c = 10 cm',
          hints: [
            'The hypotenuse c is always the longest side, positioned directly opposite the 90-degree right angle.',
            'Distance must be a positive value, so disregard negative roots.',
          ],
        },
      ],
    },
    {
      node_id: 'GEO04',
      estimated_duration_minutes: 20,
      version: 1,
      version_status: 'PUBLISHED',
      search_text: 'Circles, Conic Sections, tangents, conics',
      blocks: [
        {
          type: 'THEORY',
          order: 1,
          content: 'A circle is defined by its radius, diameter, circumference, and area. Theorems explore inscribed angles, chords, and tangent lines. In coordinate geometry, a circle is a conic section\u2014a shape formed by intersecting a plane with a cone. Other conic sections include ellipses, parabolas, and hyperbolas.',
        },
        {
          type: 'EXAMPLE',
          order: 2,
          content: "Let's compute the total boundary perimeter (circumference) of a circle.",
          question: 'Find the circumference of a circle with a radius of 7 cm (Use \u03c0 \u2248 22/7).',
          steps: "1. State the circle circumference formula: C = 2\u03c0r.\n2. Substitute the radius (r = 7) and pi fraction values: C = 2 * (22/7) * 7.\n3. Cancel out the 7 in the numerator and denominator: C = 2 * 22.\n4. Calculate the product: C = 44 cm.",
          solution: 'C = 44 cm',
          hints: [
            'Radius is half of the diameter.',
            'Canceling denominator numbers first speeds up fraction arithmetic.',
          ],
        },
      ],
    },
    {
      node_id: 'GEO05',
      estimated_duration_minutes: 25,
      version: 1,
      version_status: 'PUBLISHED',
      search_text: 'Advanced Trigonometry, Polar Curves, Unit Circle, Radians, Vectors',
      blocks: [
        {
          type: 'THEORY',
          order: 1,
          content: 'Advanced trigonometry extends beyond right triangles to periodic functions of any angle. We define radians as a natural measure of angle rotation. On the unit circle (radius of 1), coordinates represent trigonometric functions: x = cos(\u03b8) and y = sin(\u03b8). This allows us to map vectors (quantities with magnitude and direction) and polar coordinates (r, \u03b8).',
        },
        {
          type: 'INTERACTIVE_MATH',
          order: 2,
          content: 'Comprehensive unit circle graphic detailing angles in degrees/radians alongside exact coordinates.',
          image: {
            type: 'IMAGE',
            url: 'https://storage.platform.com/notes/attachments/geo05-unit-circle.png',
            file_size: 271200,
            mime_type: 'image/png',
          },
        },
        {
          type: 'EXAMPLE',
          order: 3,
          content: "Let's find the exact trigonometric coordinate value using unit circle properties.",
          question: 'Find the exact coordinate value of cos(120\u00b0) and sin(120\u00b0).',
          steps: '1. Convert 120\u00b0 to radians: 120 * (\u03c0 / 180) = 2\u03c0/3 radians.\n2. Determine the quadrant: 120\u00b0 is located in Quadrant II.\n3. Find the reference angle: 180\u00b0 - 120\u00b0 = 60\u00b0.\n4. Recall that in Quadrant II, cosine (x-coordinate) is negative and sine (y-coordinate) is positive.\n5. Calculate: cos(120\u00b0) = -cos(60\u00b0) = -1/2.\n6. Calculate: sin(120\u00b0) = +sin(60\u00b0) = \u221a3/2.',
          solution: '(-1/2, \u221a3/2)',
          hints: [
            'Quadrant II signs: x-values are always negative, y-values are always positive.',
            'Use the reference angle to match common triangles (30-60-90).',
          ],
        },
      ],
    },
    {
      node_id: 'GEO06',
      estimated_duration_minutes: 30,
      version: 1,
      version_status: 'PUBLISHED',
      search_text: 'Polar Parametric Infinite Calculus, Polar Calculus, Taylor Series',
      blocks: [
        {
          type: 'THEORY',
          order: 1,
          content: 'This advanced node applies calculus to non-Cartesian coordinate systems. Parametric equations describe x and y as functions of a third parameter, t. Polar calculus allows us to find tangent lines, arc length, and areas bounded by polar curves. Finally, Taylor and Maclaurin series expand differentiable functions into infinite polynomial series.',
        },
        {
          type: 'EXAMPLE',
          order: 2,
          content: "Let's convert a coordinate point from Cartesian format (x, y) to polar format (r, \u03b8).",
          question: 'Convert the Cartesian coordinate (3, 3) to polar coordinates (r, \u03b8).',
          steps: "1. Find the radial distance r using r = \u221a(x^2 + y^2):\n   r = \u221a(3^2 + 3^2) = \u221a(9 + 9) = \u221a18 = 3\u221a2.\n2. Find the polar angle \u03b8 using \u03b8 = arctan(y/x):\n   \u03b8 = arctan(3 / 3) = arctan(1).\n3. Since point (3,3) resides in Quadrant I, the angle is 45\u00b0 or \u03c0/4 radians.\n4. Write the coordinates: (r, \u03b8) = (3\u221a2, \u03c0/4).",
          solution: '(3\u221a2, \u03c0/4)',
          hints: [
            'r measures the direct distance from the central origin.',
            '\u03b8 represents the rotational direction angle measured counterclockwise from the positive x-axis.',
          ],
        },
      ],
    },
    {
      node_id: 'STAT01',
      estimated_duration_minutes: 15,
      version: 1,
      version_status: 'PUBLISHED',
      search_text: 'Descriptive Statistics, Data Representations, Mean, Median, Mode, Variance, Scatter Plots',
      blocks: [
        {
          type: 'THEORY',
          order: 1,
          content: 'Statistics is the science of gathering, organizing, and analyzing numerical data. We summarize datasets using measures of central tendency (mean, median, mode) and dispersion (range, variance, standard deviation). Graphical displays like histograms, box plots, and scatter plots help us visualize distributions. In scatter plots, we look for correlation\u2014the strength of the linear relationship between two variables.',
        },
        {
          type: 'INTERACTIVE_MATH',
          order: 2,
          content: 'Visual guide demonstrating standard deviation normal distribution curves and a scatter plot line of best fit.',
          image: {
            type: 'IMAGE',
            url: 'https://storage.platform.com/notes/attachments/stat01-descriptive-stats.png',
            file_size: 204300,
            mime_type: 'image/png',
          },
        },
        {
          type: 'EXAMPLE',
          order: 3,
          content: "Let's find the mean and median of a descriptive dataset.",
          question: 'Find the mean and median of the dataset: [3, 8, 5, 12, 12].',
          steps: '1. Calculate Mean (sum of values divided by count):\n   Sum = 3 + 8 + 5 + 12 + 12 = 40.\n   Count = 5.\n   Mean = 40 / 5 = 8.\n2. Calculate Median (middle value of an ordered dataset):\n   Arrange the dataset in ascending order: [3, 5, 8, 12, 12].\n   The middle value at index position 3 is 8.',
          solution: 'Mean = 8, Median = 8',
          hints: [
            'The mean is highly sensitive to outlier values.',
            'Remember to always sort values in chronological order before locating the median.',
          ],
        },
      ],
    },
    {
      node_id: 'STAT02',
      estimated_duration_minutes: 15,
      version: 1,
      version_status: 'PUBLISHED',
      search_text: 'Theoretical Applied Probability, combinations, permutations, conditional probability',
      blocks: [
        {
          type: 'THEORY',
          order: 1,
          content: 'Probability measures the likelihood of an event occurring. Theoretical probability compares favorable outcomes to all possible outcomes in an ideal setup. Combinatorics explores how many ways we can arrange items, using permutations (order matters) and combinations (order does not matter). Advanced probability covers conditional probability and independent vs. dependent events.',
        },
        {
          type: 'EXAMPLE',
          order: 2,
          content: "Let's calculate simple probability from a descriptive collection.",
          question: 'A bag contains 3 red marbles and 5 blue marbles. If you draw one marble at random, what is the probability that it is red?',
          steps: '1. Find the number of favorable outcomes (drawing a red marble) = 3.\n2. Find the total possible outcomes (all marbles combined): 3 + 5 = 8.\n3. Write the probability formula: P(Event) = Favorable Outcomes / Total Outcomes.\n4. Substitute values: P(Red) = 3/8 (or 0.375 as a decimal).',
          solution: '3/8 (or 37.5%)',
          hints: [
            'Probabilities must scale between 0 (impossible) and 1 (absolutely certain).',
            'Denominator counts must always reflect the total items in the sample space.',
          ],
        },
      ],
    },
  ];

  await ContentNode.insertMany(contentNodesData);
  console.log(`Seeded ${contentNodesData.length} content nodes`);

  const assessment = await Assessment.create({
    context_type: 'QUIZ',
    title: 'Diagnostic Assessment: Foundations of Algebra',
    state: 'active',
    target_nodes: ['CN04', 'CN05', 'CN06', 'CN07', 'CN08', 'CN09', 'CN10'],
    difficulty_level: 5,
    time_limit_minutes: 30,
    passing_score: 70.0,
    max_attempts: 3,
  });
  const assessmentId = assessment._id.toString();
  console.log(`Created assessment with id: ${assessmentId}`);

  const questionsData = [
    {
      evaluation_id: assessmentId,
      state: 'active',
      related_node_id: 'CN04',
      bloom_level: 'APPLY',
      question_type: 'MULTIPLE_CHOICE',
      data: {
        question_text: 'Evaluate the following integer expression: |{val1}| + {val2}',
        variables: { val1: -8, val2: 3 },
        options: ['11', '5', '-5', '-11'],
        correct_answer: '11',
        explanation: '1. Find the absolute value of -8: |-8| measures the distance from 0, which is positive 8.\n2. Add the remaining term: 8 + 3 = 11.',
      },
    },
    {
      evaluation_id: assessmentId,
      state: 'active',
      related_node_id: 'CN05',
      bloom_level: 'APPLY',
      question_type: 'MULTIPLE_CHOICE',
      data: {
        question_text: 'Solve the two-step linear equation for x: {coeff}x - {sub} = {result}',
        variables: { coeff: 4, sub: 7, result: 17 },
        options: ['6', '4', '5', '8'],
        correct_answer: '6',
        explanation: '1. Undo subtraction by adding 7 to both sides of the equation: 4x = 17 + 7 => 4x = 24.\n2. Undo multiplication by dividing both sides by 4: x = 24 \u00f7 4 => x = 6.',
      },
    },
    {
      evaluation_id: assessmentId,
      state: 'active',
      related_node_id: 'CN06',
      bloom_level: 'UNDERSTAND',
      question_type: 'MULTIPLE_CHOICE',
      data: {
        question_text: 'Simplify the exponential expression: ({base}^{p1}) / ({base}^{p2})',
        variables: { base: 'y', p1: 8, p2: 3 },
        options: ['y^5', 'y^11', 'y^24', '5y'],
        correct_answer: 'y^5',
        explanation: "1. Recall the quotient rule of exponents: when dividing terms with identical bases, subtract the denominator's exponent from the numerator's exponent.\n2. Apply the rule: y^(8 - 3) = y^5.",
      },
    },
    {
      evaluation_id: assessmentId,
      state: 'active',
      related_node_id: 'CN07',
      bloom_level: 'UNDERSTAND',
      question_type: 'MULTIPLE_CHOICE',
      data: {
        question_text: 'What is the slope (m) of the linear equation: y = {slope}x + {intercept}?',
        variables: { slope: -3, intercept: 4 },
        options: ['-3', '4', '3', '-4/3'],
        correct_answer: '-3',
        explanation: "1. Match the equation to slope-intercept form: y = mx + b, where 'm' is the slope and 'b' is the y-intercept.\n2. Identify the coefficient of x: m = -3.",
      },
    },
    {
      evaluation_id: assessmentId,
      state: 'active',
      related_node_id: 'CN08',
      bloom_level: 'ANALYZE',
      question_type: 'MULTIPLE_CHOICE',
      data: {
        question_text: 'Which of the following represents the correct factored form of the trinomial expression: x^2 - x - 6?',
        variables: {},
        options: ['(x - 3)(x + 2)', '(x + 3)(x - 2)', '(x - 6)(x + 1)', '(x - 1)(x + 6)'],
        correct_answer: '(x - 3)(x + 2)',
        explanation: '1. Find two numbers that multiply to the constant term (-6) and add up to the middle x-coefficient (-1).\n2. Test factors of -6: -3 and +2 satisfy both conditions because (-3) * (2) = -6, and (-3) + 2 = -1.\n3. Write the binomial factors: (x - 3)(x + 2).',
      },
    },
    {
      evaluation_id: assessmentId,
      state: 'active',
      related_node_id: 'CN09',
      bloom_level: 'UNDERSTAND',
      question_type: 'MULTIPLE_CHOICE',
      data: {
        question_text: 'Identify the restriction for the domain of the rational function f(x) = 5 / (x - {denom_sub})',
        variables: { denom_sub: 2 },
        options: ['x \u2260 2', 'x \u2260 0', 'x \u2260 -2', 'All real numbers'],
        correct_answer: 'x \u2260 2',
        explanation: "1. A rational function's domain is restricted where the denominator equals zero, as division by zero is mathematically undefined.\n2. Set the denominator to zero: x - 2 = 0 => x = 2.\n3. State the domain restriction: x cannot equal 2 (x \u2260 2).",
      },
    },
    {
      evaluation_id: assessmentId,
      state: 'active',
      related_node_id: 'CN10',
      bloom_level: 'APPLY',
      question_type: 'MULTIPLE_CHOICE',
      data: {
        question_text: 'Solve the logarithmic equation for x: log_{base}(x) = {value}',
        variables: { base: 3, value: 4 },
        options: ['81', '12', '64', '27'],
        correct_answer: '81',
        explanation: '1. Convert the logarithmic equation log_b(x) = y into its exponential form: b^y = x.\n2. Plug in the given parameters: 3^4 = x.\n3. Calculate the power of 3: 3 * 3 * 3 * 3 = 81.',
      },
    },
  ];

  await Question.insertMany(questionsData);
  console.log(`Seeded ${questionsData.length} questions linked to assessment`);

  await disconnectDb();
  console.log('\nSeed completed successfully');
}

run().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
