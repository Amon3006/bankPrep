import { Subject } from './types';

const createTopic = (id: string, name: string) => ({
  id,
  name,
  completed: false,
  prelimsRevisions: 0,
  mainsRevisions: 0
});

export const INITIAL_SYLLABUS: Subject[] = [
  {
    id: 'quant',
    name: 'Quantitative Aptitude',
    topics: [
      createTopic('q1', 'Simplification & Approximation'),
      createTopic('q2', 'Number Series (Missing & Wrong)'),
      createTopic('q3', 'Quadratic Equations'),
      createTopic('q4', 'Data Interpretation (Table, Bar, Line)'),
      createTopic('q5', 'Data Interpretation (Caselet)'),
      createTopic('q6', 'Arithmetic: Percentage & Ratio'),
      createTopic('q7', 'Arithmetic: Profit & Loss'),
      createTopic('q8', 'Arithmetic: SI & CI'),
      createTopic('q9', 'Arithmetic: Time, Speed & Distance'),
      createTopic('q10', 'Arithmetic: Time & Work'),
    ],
  },
  {
    id: 'reasoning',
    name: 'Reasoning Ability',
    topics: [
      createTopic('r1', 'Inequalities'),
      createTopic('r2', 'Syllogism'),
      createTopic('r3', 'Coding-Decoding'),
      createTopic('r4', 'Blood Relations'),
      createTopic('r5', 'Direction Sense'),
      createTopic('r6', 'Puzzles (Floor, Box, Month)'),
      createTopic('r7', 'Seating Arrangement (Linear, Circular)'),
      createTopic('r8', 'Input-Output'),
      createTopic('r9', 'Logical Reasoning'),
    ],
  },
  {
    id: 'english',
    name: 'English Language',
    topics: [
      createTopic('e1', 'Reading Comprehension'),
      createTopic('e2', 'Cloze Test'),
      createTopic('e3', 'Error Detection'),
      createTopic('e4', 'Sentence Rearrangement (Parajumbles)'),
      createTopic('e5', 'Fillers'),
      createTopic('e6', 'Phrase Replacement'),
    ],
  },
  {
    id: 'ga',
    name: 'General Awareness',
    topics: [
      createTopic('g1', 'Current Affairs (Last 6 Months)'),
      createTopic('g2', 'Banking Awareness'),
      createTopic('g3', 'Static GK'),
      createTopic('g4', 'Financial Awareness'),
    ],
  },
];