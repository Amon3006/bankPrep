export interface User {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
}

export interface Topic {
  id: string;
  name: string;
  completed: boolean;
  prelimsRevisions: number;
  mainsRevisions: number;
}

export interface Subject {
  id: string;
  name: string;
  topics: Topic[];
}

export interface MockTestScore {
  id: string;
  date: string;
  provider: string; // e.g., Oliveboard, PracticeMock
  totalMarks: number;
  obtainedMarks: number;
  percentile: number;
  sectionScores: {
    quant: number;
    reasoning: number;
    english: number;
    ga: number;
  };
}

export interface StudyTask {
  id: string;
  title: string;
  completed: boolean;
  date: string;
}

export interface UserData {
  userId: string;
  syllabus: Subject[];
  scores: MockTestScore[];
  tasks: StudyTask[];
  targetExamDate?: string;
}

export type ChatMessageRole = 'user' | 'model';

export interface ChatMessage {
  id: string;
  role: ChatMessageRole;
  text: string;
  timestamp: number;
}