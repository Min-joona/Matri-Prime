const express = require('express');
const router = express.Router();

// Static flashcard data grouped by subject
const flashcardData = {
  biology: {
    title: 'Biology Grade 12',
    cards: [
      { id: 1, question: 'What is the powerhouse of the cell?', answer: 'The mitochondria — it produces ATP through cellular respiration, providing energy for all cellular processes.' },
      { id: 2, question: 'What is DNA?', answer: 'Deoxyribonucleic Acid — the hereditary material in humans and almost all other organisms, carrying genetic information.' },
      { id: 3, question: 'What is photosynthesis?', answer: 'The process by which green plants convert sunlight, water, and CO₂ into glucose and oxygen using chlorophyll.' },
      { id: 4, question: 'What are the four bases of DNA?', answer: 'Adenine (A), Thymine (T), Guanine (G), and Cytosine (C). A pairs with T, and G pairs with C.' },
      { id: 5, question: 'What is osmosis?', answer: 'The movement of water molecules through a semipermeable membrane from an area of low solute concentration to high solute concentration.' },
      { id: 6, question: 'What is natural selection?', answer: 'The process by which organisms with favorable traits survive and reproduce more successfully than those without, driving evolution.' },
      { id: 7, question: 'What is the function of ribosomes?', answer: 'Ribosomes are the site of protein synthesis — they translate mRNA into polypeptide chains (proteins).' },
      { id: 8, question: 'What is meiosis?', answer: 'A type of cell division that reduces the chromosome number by half, producing four haploid gametes (sperm or eggs).' }
    ]
  },
  mathematics: {
    title: 'Mathematics',
    cards: [
      { id: 1, question: 'What is the Pythagorean theorem?', answer: 'a² + b² = c², where c is the hypotenuse of a right triangle and a, b are the other two sides.' },
      { id: 2, question: 'What is a derivative?', answer: 'The rate of change of a function at a given point. Geometrically, it represents the slope of the tangent line.' },
      { id: 3, question: 'What is the quadratic formula?', answer: 'x = (-b ± √(b²-4ac)) / 2a, used to solve ax² + bx + c = 0.' },
      { id: 4, question: 'What is a prime number?', answer: 'A natural number greater than 1 that has no positive divisors other than 1 and itself.' },
      { id: 5, question: 'What is the area of a circle?', answer: 'A = πr², where r is the radius of the circle.' },
      { id: 6, question: 'What is a logarithm?', answer: 'The inverse operation of exponentiation. log_b(x) = y means b^y = x.' }
    ]
  },
  physics: {
    title: 'Physics',
    cards: [
      { id: 1, question: "What is Newton's First Law of Motion?", answer: 'An object at rest stays at rest, and an object in motion stays in motion, unless acted upon by an external force.' },
      { id: 2, question: "What is Einstein's famous equation?", answer: 'E = mc², where E is energy, m is mass, and c is the speed of light (~3×10⁸ m/s).' },
      { id: 3, question: 'What is the speed of light?', answer: 'Approximately 3×10⁸ meters per second (299,792,458 m/s) in a vacuum.' },
      { id: 4, question: 'What is Ohm\'s Law?', answer: 'V = IR, where V is voltage (volts), I is current (amperes), and R is resistance (ohms).' },
      { id: 5, question: 'What is the law of conservation of energy?', answer: 'Energy cannot be created or destroyed; it can only be converted from one form to another.' }
    ]
  },
  chemistry: {
    title: 'Chemistry',
    cards: [
      { id: 1, question: 'What is an atom?', answer: 'The smallest unit of matter that retains the chemical properties of an element, consisting of protons, neutrons, and electrons.' },
      { id: 2, question: 'What is a covalent bond?', answer: 'A chemical bond formed by the sharing of electron pairs between atoms.' },
      { id: 3, question: 'What is the pH scale?', answer: 'A scale from 0-14 measuring acidity/alkalinity. pH < 7 is acidic, pH = 7 is neutral, pH > 7 is basic.' },
      { id: 4, question: 'What is the periodic table?', answer: 'A tabular arrangement of chemical elements ordered by atomic number, electron configuration, and recurring chemical properties.' },
      { id: 5, question: 'What is an exothermic reaction?', answer: 'A chemical reaction that releases energy to the surroundings in the form of heat or light.' }
    ]
  }
};

router.get('/:subject', (req, res) => {
  const subject = req.params.subject.toLowerCase();
  const data = flashcardData[subject];
  if (!data) return res.status(404).json({ message: 'Flashcard set not found' });
  res.json(data);
});

router.get('/', (req, res) => {
  const sets = Object.entries(flashcardData).map(([key, val]) => ({
    id: key,
    title: val.title,
    count: val.cards.length
  }));
  res.json(sets);
});

module.exports = router;
