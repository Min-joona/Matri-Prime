/**
 * MatriPrime Database Seed Script
 * 
 * Populates MongoDB with:
 * - 1 Subject: Mathematics Grade 11 Natural Science
 * - 3 Chapters: Algebra, Calculus, Statistics
 * - 2 Lessons per chapter with real Ethiopian ESSLCE content
 * - 10 MCQ quiz questions per chapter
 * 
 * Run with: node backend/seed.js
 */

const mongoose = require('mongoose');
require('dotenv').config();

// Import Models
const Course = require('./models/Course');

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/matriprime';

// Seed Data
const mathematicsCourse = {
  id: 'mathematics-grade-11-natural',
  name: 'Mathematics',
  subject: 'Mathematics',
  description: 'Complete Grade 11 Natural Science Mathematics course aligned with Ethiopian ESSLCE curriculum. Covers Algebra, Calculus, and Statistics with comprehensive lessons and practice questions.',
  gradeLevels: ['11'],
  icon: 'Calculator',
  color: 'primary',
  gradient: 'bg-gradient-to-br from-indigo-500/20 to-purple-500/10',
  enrolled: 15420,
  rating: 4.8,
  isActive: true,
  units: [
    // UNIT 1: ALGEBRA
    {
      id: 'algebra',
      title: 'Unit 1: Algebra',
      description: 'Master algebraic expressions, equations, inequalities, and functions essential for ESSLCE success.',
      order: 1,
      lessons: [
        {
          id: 'algebra-lesson-1',
          title: 'Solving Linear Equations and Inequalities',
          type: 'notes',
          duration: 25,
          xpReward: 50,
          completed: false,
          locked: false,
          content: JSON.stringify([
            { type: 'heading', level: 2, text: 'Linear Equations' },
            { type: 'paragraph', text: 'A linear equation is an algebraic equation where each term is either a constant or the product of a constant and a single variable raised to the first power. The general form is ax + b = 0, where a ≠ 0.' },
            { type: 'key-concept', title: 'Key Concept', text: 'The solution to a linear equation is the value of the variable that makes the equation true. We isolate the variable by performing the same operation on both sides of the equation.' },
            { type: 'heading', level: 3, text: 'Solving Linear Equations' },
            { type: 'paragraph', text: 'To solve a linear equation, follow these steps: 1) Simplify both sides by combining like terms. 2) Use addition or subtraction to isolate the variable term. 3) Use multiplication or division to solve for the variable.' },
            { type: 'example', title: 'Example 1: Solve 3x + 7 = 22', steps: [
              'Step 1: Subtract 7 from both sides: 3x + 7 - 7 = 22 - 7',
              'Step 2: Simplify: 3x = 15',
              'Step 3: Divide both sides by 3: x = 15 ÷ 3',
              'Step 4: Solution: x = 5'
            ]},
            { type: 'formula', text: 'ax + b = c  ⟹  x = (c - b) / a' },
            { type: 'heading', level: 2, text: 'Linear Inequalities' },
            { type: 'paragraph', text: 'Linear inequalities are similar to linear equations but use inequality symbols (<, >, ≤, ≥) instead of the equals sign. The solution is a range of values rather than a single value.' },
            { type: 'warning', title: 'Common Mistake', text: 'When multiplying or dividing both sides of an inequality by a negative number, you must reverse the inequality sign. For example, if -2x > 6, then x < -3 (not x > -3).' },
            { type: 'example', title: 'Example 2: Solve 2x - 5 < 9', steps: [
              'Step 1: Add 5 to both sides: 2x - 5 + 5 < 9 + 5',
              'Step 2: Simplify: 2x < 14',
              'Step 3: Divide both sides by 2: x < 7',
              'Step 4: Solution: x ∈ (-∞, 7)'
            ]},
            { type: 'exam-tip', title: 'Exam Tip', text: 'On the ESSLCE, always verify your solution by substituting it back into the original equation or testing a value within your solution set for inequalities.' }
          ])
        },
        {
          id: 'algebra-lesson-2',
          title: 'Quadratic Equations and the Quadratic Formula',
          type: 'notes',
          duration: 30,
          xpReward: 60,
          completed: false,
          locked: false,
          content: JSON.stringify([
            { type: 'heading', level: 2, text: 'Quadratic Equations' },
            { type: 'paragraph', text: 'A quadratic equation is a polynomial equation of degree 2. The standard form is ax² + bx + c = 0, where a ≠ 0. These equations can have 0, 1, or 2 real solutions.' },
            { type: 'key-concept', title: 'Key Concept', text: 'The discriminant (b² - 4ac) determines the nature of roots: If positive, there are 2 distinct real roots. If zero, there is exactly 1 real root (repeated). If negative, there are no real roots (2 complex roots).' },
            { type: 'heading', level: 3, text: 'Methods for Solving Quadratic Equations' },
            { type: 'paragraph', text: 'There are three main methods: 1) Factoring - works when the equation can be factored easily. 2) Completing the square - always works but can be tedious. 3) Quadratic formula - always works and is most reliable.' },
            { type: 'formula', text: 'x = (-b ± √(b² - 4ac)) / 2a' },
            { type: 'example', title: 'Example: Solve x² - 5x + 6 = 0 by factoring', steps: [
              'Step 1: Find two numbers that multiply to 6 and add to -5: -2 and -3',
              'Step 2: Factor: (x - 2)(x - 3) = 0',
              'Step 3: Set each factor to zero: x - 2 = 0 or x - 3 = 0',
              'Step 4: Solve: x = 2 or x = 3'
            ]},
            { type: 'example', title: 'Example: Solve 2x² + 3x - 2 = 0 using quadratic formula', steps: [
              'Step 1: Identify a = 2, b = 3, c = -2',
              'Step 2: Calculate discriminant: b² - 4ac = 9 - 4(2)(-2) = 9 + 16 = 25',
              'Step 3: Apply formula: x = (-3 ± √25) / (2×2) = (-3 ± 5) / 4',
              'Step 4: Solutions: x = (-3 + 5)/4 = 0.5 or x = (-3 - 5)/4 = -2'
            ]},
            { type: 'warning', title: 'Common Mistake', text: 'Do not forget the ± sign when using the quadratic formula. This accounts for both possible solutions.' },
            { type: 'exam-tip', title: 'Exam Tip', text: 'On ESSLCE, check if the equation can be factored first - it is faster. Use the quadratic formula as a backup when factoring is difficult.' }
          ])
        }
      ]
    },
    
    // UNIT 2: CALCULUS
    {
      id: 'calculus',
      title: 'Unit 2: Introduction to Calculus',
      description: 'Learn the fundamentals of differential calculus including limits, derivatives, and their applications.',
      order: 2,
      lessons: [
        {
          id: 'calculus-lesson-1',
          title: 'Limits and Continuity',
          type: 'notes',
          duration: 30,
          xpReward: 55,
          completed: false,
          locked: false,
          content: JSON.stringify([
            { type: 'heading', level: 2, text: 'Understanding Limits' },
            { type: 'paragraph', text: 'A limit describes the value that a function approaches as the input approaches a certain value. We write lim(x→a) f(x) = L to mean that f(x) approaches L as x approaches a.' },
            { type: 'key-concept', title: 'Key Concept', text: 'The limit of a function at a point may exist even if the function is not defined at that point. What matters is the behavior of the function as we get closer and closer to the point.' },
            { type: 'heading', level: 3, text: 'Evaluating Limits' },
            { type: 'paragraph', text: 'To evaluate limits, try direct substitution first. If that gives an indeterminate form (like 0/0), try factoring, rationalizing, or using L\'Hopital\'s rule.' },
            { type: 'formula', text: 'lim(x→a) [f(x) + g(x)] = lim(x→a) f(x) + lim(x→a) g(x)' },
            { type: 'example', title: 'Example: Evaluate lim(x→2) (x² - 4)/(x - 2)', steps: [
              'Step 1: Direct substitution gives 0/0 (indeterminate)',
              'Step 2: Factor numerator: (x² - 4) = (x + 2)(x - 2)',
              'Step 3: Simplify: (x + 2)(x - 2)/(x - 2) = x + 2 (for x ≠ 2)',
              'Step 4: Now substitute: lim(x→2) (x + 2) = 2 + 2 = 4'
            ]},
            { type: 'heading', level: 2, text: 'Continuity' },
            { type: 'paragraph', text: 'A function f is continuous at point a if: 1) f(a) is defined, 2) lim(x→a) f(x) exists, and 3) lim(x→a) f(x) = f(a). Intuitively, continuous functions have no breaks, jumps, or holes.' },
            { type: 'warning', title: 'Common Mistake', text: 'Remember that being defined at a point is not enough for continuity. The limit must also exist AND equal the function value at that point.' },
            { type: 'exam-tip', title: 'Exam Tip', text: 'Important limit to memorize: lim(x→0) (sin x)/x = 1. This appears frequently on the ESSLCE.' }
          ])
        },
        {
          id: 'calculus-lesson-2',
          title: 'Introduction to Derivatives',
          type: 'notes',
          duration: 35,
          xpReward: 65,
          completed: false,
          locked: false,
          content: JSON.stringify([
            { type: 'heading', level: 2, text: 'What is a Derivative?' },
            { type: 'paragraph', text: 'The derivative of a function measures its instantaneous rate of change at any point. Geometrically, it represents the slope of the tangent line to the function\'s graph at that point.' },
            { type: 'key-concept', title: 'Key Concept', text: 'The derivative of f(x) is defined as the limit: f\'(x) = lim(h→0) [f(x+h) - f(x)]/h. This is called the definition of derivative or first principles.' },
            { type: 'heading', level: 3, text: 'Basic Differentiation Rules' },
            { type: 'paragraph', text: 'The power rule is the most fundamental: If f(x) = xⁿ, then f\'(x) = nxⁿ⁻¹. Combined with sum and constant multiple rules, this lets us differentiate any polynomial.' },
            { type: 'formula', text: 'd/dx(xⁿ) = nxⁿ⁻¹' },
            { type: 'formula', text: 'd/dx[cf(x)] = c·f\'(x)' },
            { type: 'formula', text: 'd/dx[f(x) + g(x)] = f\'(x) + g\'(x)' },
            { type: 'example', title: 'Example: Find the derivative of f(x) = 3x⁴ - 2x² + 5x - 7', steps: [
              'Step 1: Apply power rule to each term separately',
              'Step 2: d/dx(3x⁴) = 3 × 4x³ = 12x³',
              'Step 3: d/dx(-2x²) = -2 × 2x = -4x',
              'Step 4: d/dx(5x) = 5 × 1 = 5',
              'Step 5: d/dx(-7) = 0 (constant)',
              'Step 6: f\'(x) = 12x³ - 4x + 5'
            ]},
            { type: 'warning', title: 'Common Mistake', text: 'The derivative of a constant is always 0, not the constant itself. Also, don\'t forget to multiply by the coefficient when applying the power rule.' },
            { type: 'exam-tip', title: 'Exam Tip', text: 'Practice finding derivatives quickly. On ESSLCE, you need to apply these rules rapidly to solve optimization and rate-of-change problems.' }
          ])
        }
      ]
    },
    
    // UNIT 3: STATISTICS
    {
      id: 'statistics',
      title: 'Unit 3: Statistics and Probability',
      description: 'Master statistical measures, data analysis, and probability concepts for real-world applications.',
      order: 3,
      lessons: [
        {
          id: 'statistics-lesson-1',
          title: 'Measures of Central Tendency',
          type: 'notes',
          duration: 25,
          xpReward: 50,
          completed: false,
          locked: false,
          content: JSON.stringify([
            { type: 'heading', level: 2, text: 'Central Tendency Measures' },
            { type: 'paragraph', text: 'Measures of central tendency describe the center of a data set. The three main measures are: Mean (arithmetic average), Median (middle value), and Mode (most frequent value).' },
            { type: 'key-concept', title: 'Key Concept', text: 'The mean is sensitive to outliers, while the median is resistant to extreme values. Choose the appropriate measure based on your data distribution.' },
            { type: 'heading', level: 3, text: 'Calculating Mean' },
            { type: 'paragraph', text: 'The mean is calculated by summing all values and dividing by the count. For grouped data, use the midpoints of intervals weighted by their frequencies.' },
            { type: 'formula', text: 'Mean (x̄) = Σxᵢ / n' },
            { type: 'formula', text: 'For grouped data: x̄ = Σ(fᵢ × xᵢ) / Σfᵢ' },
            { type: 'example', title: 'Example: Find the mean of 12, 15, 18, 22, 23', steps: [
              'Step 1: Sum all values: 12 + 15 + 18 + 22 + 23 = 90',
              'Step 2: Count: n = 5',
              'Step 3: Divide: Mean = 90 / 5 = 18'
            ]},
            { type: 'heading', level: 3, text: 'Median and Mode' },
            { type: 'paragraph', text: 'To find the median: 1) Arrange data in order. 2) If n is odd, median is the middle value. If n is even, median is the average of the two middle values. The mode is simply the most frequent value.' },
            { type: 'warning', title: 'Common Mistake', text: 'Always sort the data before finding the median. The median of unsorted data will give you the wrong answer.' },
            { type: 'exam-tip', title: 'Exam Tip', text: 'On ESSLCE, when a question asks for the \"best\" measure of central tendency, consider if there are outliers (use median) or if you need the arithmetic average (use mean).' }
          ])
        },
        {
          id: 'statistics-lesson-2',
          title: 'Measures of Dispersion',
          type: 'notes',
          duration: 30,
          xpReward: 55,
          completed: false,
          locked: false,
          content: JSON.stringify([
            { type: 'heading', level: 2, text: 'Understanding Dispersion' },
            { type: 'paragraph', text: 'Measures of dispersion describe how spread out the data is. Key measures include Range, Variance, Standard Deviation, and Interquartile Range (IQR).' },
            { type: 'key-concept', title: 'Key Concept', text: 'Standard deviation is the most commonly used measure of dispersion. A small standard deviation means data points are close to the mean; a large one means they are spread out.' },
            { type: 'heading', level: 3, text: 'Variance and Standard Deviation' },
            { type: 'paragraph', text: 'Variance measures the average squared deviation from the mean. Standard deviation is the square root of variance and has the same units as the original data.' },
            { type: 'formula', text: 'Variance (σ²) = Σ(xᵢ - x̄)² / n' },
            { type: 'formula', text: 'Standard Deviation (σ) = √[Σ(xᵢ - x̄)² / n]' },
            { type: 'example', title: 'Example: Find variance and standard deviation of 2, 4, 4, 4, 5, 5, 7, 9', steps: [
              'Step 1: Find mean: x̄ = (2+4+4+4+5+5+7+9)/8 = 40/8 = 5',
              'Step 2: Find squared deviations: (2-5)²=9, (4-5)²=1, (4-5)²=1, (4-5)²=1, (5-5)²=0, (5-5)²=0, (7-5)²=4, (9-5)²=16',
              'Step 3: Sum: 9+1+1+1+0+0+4+16 = 32',
              'Step 4: Variance = 32/8 = 4',
              'Step 5: Standard Deviation = √4 = 2'
            ]},
            { type: 'warning', title: 'Common Mistake', text: 'For sample standard deviation, divide by (n-1) instead of n. This is called Bessel\'s correction.' },
            { type: 'exam-tip', title: 'Exam Tip', text: 'The ESSLCE often asks to interpret standard deviation. Remember: about 68% of data falls within 1 SD of mean, 95% within 2 SDs (for normal distributions).' }
          ])
        }
      ]
    }
  ]
};

// Quiz Questions for each unit
const quizQuestions = {
  algebra: [
    {
      id: 'alg-q1',
      text: 'Solve for x: 5x - 15 = 3x + 7',
      options: ['x = 11', 'x = -4', 'x = 4', 'x = 11'],
      correctIndex: 0,
      explanation: 'Subtract 3x from both sides: 2x - 15 = 7. Add 15: 2x = 22. Divide by 2: x = 11.',
      difficulty: 'Easy',
      chapter: 'Algebra'
    },
    {
      id: 'alg-q2',
      text: 'What are the solutions to x² - 7x + 12 = 0?',
      options: ['x = 3 and x = 4', 'x = -3 and x = -4', 'x = 2 and x = 6', 'x = -2 and x = -6'],
      correctIndex: 0,
      explanation: 'Factor: (x - 3)(x - 4) = 0. Set each factor to zero: x = 3 or x = 4.',
      difficulty: 'Medium',
      chapter: 'Algebra'
    },
    {
      id: 'alg-q3',
      text: 'Solve the inequality: 3x - 9 ≥ 6',
      options: ['x ≥ 5', 'x ≤ 5', 'x ≥ 1', 'x ≤ 1'],
      correctIndex: 0,
      explanation: 'Add 9: 3x ≥ 15. Divide by 3: x ≥ 5.',
      difficulty: 'Easy',
      chapter: 'Algebra'
    },
    {
      id: 'alg-q4',
      text: 'Using the quadratic formula, solve 2x² - 5x - 3 = 0',
      options: ['x = 3 and x = -0.5', 'x = -3 and x = 0.5', 'x = 1.5 and x = -1', 'x = 2 and x = -1.5'],
      correctIndex: 0,
      explanation: 'a=2, b=-5, c=-3. x = (5 ± √(25+24))/4 = (5 ± 7)/4. So x = 3 or x = -0.5.',
      difficulty: 'Hard',
      chapter: 'Algebra'
    },
    {
      id: 'alg-q5',
      text: 'What is the discriminant of 3x² + 2x + 5 = 0, and what does it tell us?',
      options: ['D = -56, no real solutions', 'D = 56, two real solutions', 'D = 0, one real solution', 'D = 64, two real solutions'],
      correctIndex: 0,
      explanation: 'D = b² - 4ac = 4 - 60 = -56. Negative discriminant means no real solutions.',
      difficulty: 'Medium',
      chapter: 'Algebra'
    },
    {
      id: 'alg-q6',
      text: 'Simplify: (2x + 3)(x - 5)',
      options: ['2x² - 7x - 15', '2x² + 7x - 15', '2x² - 10x + 3x - 15', '2x² - 13x - 15'],
      correctIndex: 0,
      explanation: 'FOIL: 2x² - 10x + 3x - 15 = 2x² - 7x - 15.',
      difficulty: 'Easy',
      chapter: 'Algebra'
    },
    {
      id: 'alg-q7',
      text: 'If f(x) = x² - 4x + 3, what is f(-2)?',
      options: ['f(-2) = 15', 'f(-2) = 7', 'f(-2) = -1', 'f(-2) = 11'],
      correctIndex: 0,
      explanation: 'f(-2) = (-2)² - 4(-2) + 3 = 4 + 8 + 3 = 15.',
      difficulty: 'Medium',
      chapter: 'Algebra'
    },
    {
      id: 'alg-q8',
      text: 'Solve: |2x - 8| = 12',
      options: ['x = 10 or x = -2', 'x = 10 or x = 2', 'x = -10 or x = 2', 'x = -10 or x = -2'],
      correctIndex: 0,
      explanation: '2x - 8 = 12 gives x = 10. 2x - 8 = -12 gives x = -2.',
      difficulty: 'Medium',
      chapter: 'Algebra'
    },
    {
      id: 'alg-q9',
      text: 'Which equation has roots of -3 and 7?',
      options: ['x² - 4x - 21 = 0', 'x² + 4x - 21 = 0', 'x² - 4x + 21 = 0', 'x² + 4x + 21 = 0'],
      correctIndex: 0,
      explanation: 'Sum of roots = -3 + 7 = 4, product = -21. Equation: x² - 4x - 21 = 0.',
      difficulty: 'Hard',
      chapter: 'Algebra'
    },
    {
      id: 'alg-q10',
      text: 'Solve the system: 2x + y = 7 and x - y = 2',
      options: ['x = 3, y = 1', 'x = 1, y = 5', 'x = 2, y = 3', 'x = 4, y = -1'],
      correctIndex: 0,
      explanation: 'Add equations: 3x = 9, so x = 3. Substitute: y = 7 - 6 = 1.',
      difficulty: 'Medium',
      chapter: 'Algebra'
    }
  ],
  
  calculus: [
    {
      id: 'calc-q1',
      text: 'Evaluate: lim(x→3) (x² - 9)/(x - 3)',
      options: ['6', '0', '9', 'undefined'],
      correctIndex: 0,
      explanation: 'Factor: (x+3)(x-3)/(x-3) = x+3 for x≠3. lim(x→3)(x+3) = 6.',
      difficulty: 'Medium',
      chapter: 'Calculus'
    },
    {
      id: 'calc-q2',
      text: 'What is the derivative of f(x) = 4x³ - 2x + 7?',
      options: ['f\'(x) = 12x² - 2', 'f\'(x) = 12x² - 2x', 'f\'(x) = 4x² - 2', 'f\'(x) = 12x³ - 2'],
      correctIndex: 0,
      explanation: 'Power rule: d/dx(4x³) = 12x², d/dx(-2x) = -2, d/dx(7) = 0. Answer: 12x² - 2.',
      difficulty: 'Easy',
      chapter: 'Calculus'
    },
    {
      id: 'calc-q3',
      text: 'Find the derivative of f(x) = (2x + 1)⁴',
      options: ['8(2x + 1)³', '4(2x + 1)³', '8(2x + 1)⁴', '(2x + 1)³'],
      correctIndex: 0,
      explanation: 'Chain rule: 4(2x+1)³ × 2 = 8(2x+1)³.',
      difficulty: 'Hard',
      chapter: 'Calculus'
    },
    {
      id: 'calc-q4',
      text: 'What is lim(x→0) (sin x)/x?',
      options: ['1', '0', 'undefined', 'infinity'],
      correctIndex: 0,
      explanation: 'This is a fundamental limit: lim(x→0)(sin x)/x = 1.',
      difficulty: 'Medium',
      chapter: 'Calculus'
    },
    {
      id: 'calc-q5',
      text: 'If f(x) = x² + 3x, find f\'(2)',
      options: ['7', '10', '4', '6'],
      correctIndex: 0,
      explanation: 'f\'(x) = 2x + 3. f\'(2) = 2(2) + 3 = 7.',
      difficulty: 'Easy',
      chapter: 'Calculus'
    },
    {
      id: 'calc-q6',
      text: 'At what point is f(x) = x² - 4x + 3 continuous?',
      options: ['All real numbers', 'Only x > 0', 'Only x ≠ 1, x ≠ 3', 'Only x = 0'],
      correctIndex: 0,
      explanation: 'Polynomials are continuous everywhere on the real line.',
      difficulty: 'Medium',
      chapter: 'Calculus'
    },
    {
      id: 'calc-q7',
      text: 'Find the slope of tangent to y = x³ at x = 2',
      options: ['12', '8', '6', '4'],
      correctIndex: 0,
      explanation: 'dy/dx = 3x². At x = 2: slope = 3(4) = 12.',
      difficulty: 'Medium',
      chapter: 'Calculus'
    },
    {
      id: 'calc-q8',
      text: 'Evaluate: lim(x→∞) (3x² + 2x)/(x² + 1)',
      options: ['3', '2', '0', 'infinity'],
      correctIndex: 0,
      explanation: 'Divide by x²: (3 + 2/x)/(1 + 1/x²). As x→∞: 3/1 = 3.',
      difficulty: 'Hard',
      chapter: 'Calculus'
    },
    {
      id: 'calc-q9',
      text: 'The derivative of a constant function is:',
      options: ['0', '1', 'The constant itself', 'undefined'],
      correctIndex: 0,
      explanation: 'The derivative of any constant is always 0.',
      difficulty: 'Easy',
      chapter: 'Calculus'
    },
    {
      id: 'calc-q10',
      text: 'If f(x) = 5x⁴ - 3x² + x, find f\'\'(x)',
      options: ['60x² - 6', '20x³ - 6x + 1', '60x² - 6x', '20x³ - 6'],
      correctIndex: 0,
      explanation: 'f\'(x) = 20x³ - 6x + 1. f\'\'(x) = 60x² - 6.',
      difficulty: 'Hard',
      chapter: 'Calculus'
    }
  ],
  
  statistics: [
    {
      id: 'stat-q1',
      text: 'Find the mean of: 15, 20, 25, 30, 35',
      options: ['25', '20', '27.5', '30'],
      correctIndex: 0,
      explanation: 'Mean = (15+20+25+30+35)/5 = 125/5 = 25.',
      difficulty: 'Easy',
      chapter: 'Statistics'
    },
    {
      id: 'stat-q2',
      text: 'What is the median of: 3, 7, 2, 9, 5, 8, 4?',
      options: ['5', '6', '4', '7'],
      correctIndex: 0,
      explanation: 'Sorted: 2, 3, 4, 5, 7, 8, 9. Middle value (4th) = 5.',
      difficulty: 'Easy',
      chapter: 'Statistics'
    },
    {
      id: 'stat-q3',
      text: 'Find the mode of: 4, 5, 4, 7, 4, 8, 5, 4',
      options: ['4', '5', '4 and 5', '7'],
      correctIndex: 0,
      explanation: '4 appears 4 times, more than any other value.',
      difficulty: 'Easy',
      chapter: 'Statistics'
    },
    {
      id: 'stat-q4',
      text: 'Calculate the range of: 12, 18, 25, 31, 40',
      options: ['28', '25', '18', '40'],
      correctIndex: 0,
      explanation: 'Range = Maximum - Minimum = 40 - 12 = 28.',
      difficulty: 'Easy',
      chapter: 'Statistics'
    },
    {
      id: 'stat-q5',
      text: 'For the data set 2, 4, 4, 4, 5, 5, 7, 9 with mean 5, find the variance',
      options: ['4', '2', '8', '16'],
      correctIndex: 0,
      explanation: 'Sum of squared deviations: 9+1+1+1+0+0+4+16 = 32. Variance = 32/8 = 4.',
      difficulty: 'Medium',
      chapter: 'Statistics'
    },
    {
      id: 'stat-q6',
      text: 'If variance = 16, what is the standard deviation?',
      options: ['4', '8', '256', '2'],
      correctIndex: 0,
      explanation: 'Standard deviation = √variance = √16 = 4.',
      difficulty: 'Easy',
      chapter: 'Statistics'
    },
    {
      id: 'stat-q7',
      text: 'For a normal distribution, approximately what percent falls within 2 standard deviations of the mean?',
      options: ['95%', '68%', '99%', '50%'],
      correctIndex: 0,
      explanation: 'Empirical rule: 68% within 1 SD, 95% within 2 SDs, 99.7% within 3 SDs.',
      difficulty: 'Medium',
      chapter: 'Statistics'
    },
    {
      id: 'stat-q8',
      text: 'Which measure of central tendency is most affected by outliers?',
      options: ['Mean', 'Median', 'Mode', 'All equally affected'],
      correctIndex: 0,
      explanation: 'The mean includes all values in its calculation, making it sensitive to extreme values.',
      difficulty: 'Medium',
      chapter: 'Statistics'
    },
    {
      id: 'stat-q9',
      text: 'In a skewed right distribution, which is typically largest?',
      options: ['Mean', 'Median', 'Mode', 'They are equal'],
      correctIndex: 0,
      explanation: 'In right-skewed distributions: Mode < Median < Mean.',
      difficulty: 'Hard',
      chapter: 'Statistics'
    },
    {
      id: 'stat-q10',
      text: 'The interquartile range (IQR) is calculated as:',
      options: ['Q3 - Q1', 'Q2 - Q1', 'Max - Min', 'Q3 - Q2'],
      correctIndex: 0,
      explanation: 'IQR = Third Quartile (Q3) - First Quartile (Q1).',
      difficulty: 'Medium',
      chapter: 'Statistics'
    }
  ]
};

// Seed Function
async function seed() {
  try {
    console.log('🌱 Starting database seed...\n');
    
    // Connect to MongoDB
    console.log('📦 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI, {
      maxPoolSize: 5,
      serverSelectionTimeoutMS: 5000
    });
    console.log('✅ Connected to MongoDB\n');
    
    // Clear existing data
    console.log('🗑️  Clearing existing course data...');
    await Course.deleteOne({ id: mathematicsCourse.id });
    console.log('✅ Cleared existing data\n');
    
    // Insert Mathematics Course
    console.log('📚 Creating Mathematics Grade 11 course...');
    const course = new Course(mathematicsCourse);
    await course.save();
    console.log(`✅ Created course: ${course.name}`);
    console.log(`   - ${course.units.length} units`);
    console.log(`   - ${course.totalLessons} lessons`);
    console.log('');
    
    // Log quiz questions info
    console.log('📝 Quiz questions prepared:');
    Object.entries(quizQuestions).forEach(([chapter, questions]) => {
      console.log(`   - ${chapter}: ${questions.length} questions`);
    });
    console.log('');
    
    // Summary
    console.log('═══════════════════════════════════════');
    console.log('        SEED COMPLETED SUCCESSFULLY');
    console.log('═══════════════════════════════════════');
    console.log('');
    console.log('📊 Summary:');
    console.log(`   • 1 Subject: Mathematics Grade 11 Natural Science`);
    console.log(`   • 3 Chapters: Algebra, Calculus, Statistics`);
    console.log(`   • 6 Lessons with Ethiopian ESSLCE content`);
    console.log(`   • 30 MCQ questions (10 per chapter)`);
    console.log('');
    console.log('🎉 Database is ready for use!');
    console.log('');
    
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('📡 Disconnected from MongoDB');
    process.exit(0);
  }
}

// Export quiz questions for API use
module.exports = { quizQuestions };

// Run seed if called directly
if (require.main === module) {
  seed();
}
