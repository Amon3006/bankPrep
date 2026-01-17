import { User, UserData, Subject, Topic } from '../types';
import { INITIAL_SYLLABUS } from '../constants';

const USERS_KEY = 'bankprep_users';
const DATA_PREFIX = 'bankprep_data_';

// --- Auth Helpers ---

export async function hashPassword(password: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// --- User Management ---

export const getUsers = (): User[] => {
  const usersStr = localStorage.getItem(USERS_KEY);
  return usersStr ? JSON.parse(usersStr) : [];
};

export const saveUser = (user: User): void => {
  const users = getUsers();
  // Check if updating existing user or adding new
  const index = users.findIndex(u => u.id === user.id);
  if (index >= 0) {
    users[index] = user;
  } else {
    users.push(user);
  }
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const getUserData = (userId: string): UserData => {
  const dataStr = localStorage.getItem(`${DATA_PREFIX}${userId}`);
  if (dataStr) {
    // Migration check: ensure new fields exist for old data
    const data = JSON.parse(dataStr);
    data.syllabus.forEach((s: Subject) => {
       s.topics.forEach((t: any) => {
          if (t.prelimsRevisions === undefined) t.prelimsRevisions = 0;
          if (t.mainsRevisions === undefined) t.mainsRevisions = 0;
       });
    });
    return data;
  }
  
  // Initialize default data if not found
  const defaultData: UserData = {
    userId,
    syllabus: JSON.parse(JSON.stringify(INITIAL_SYLLABUS)), // Deep copy
    scores: [],
    tasks: [],
  };
  saveUserData(defaultData);
  return defaultData;
};

export const saveUserData = (data: UserData): void => {
  localStorage.setItem(`${DATA_PREFIX}${data.userId}`, JSON.stringify(data));
};

// --- Syllabus Management ---

export const updateSyllabusTopic = (userId: string, subjectId: string, topicId: string, updates: Partial<Topic>) => {
  const data = getUserData(userId);
  const subject = data.syllabus.find(s => s.id === subjectId);
  if (subject) {
    const topic = subject.topics.find(t => t.id === topicId);
    if (topic) {
      Object.assign(topic, updates);
      saveUserData(data);
    }
  }
  return data;
};

export const addSubject = (userId: string, name: string) => {
  const data = getUserData(userId);
  const newSubject: Subject = {
    id: Date.now().toString(),
    name,
    topics: []
  };
  data.syllabus.push(newSubject);
  saveUserData(data);
  return data;
};

export const deleteSubject = (userId: string, subjectId: string) => {
  const data = getUserData(userId);
  data.syllabus = data.syllabus.filter(s => s.id !== subjectId);
  saveUserData(data);
  return data;
};

export const addTopic = (userId: string, subjectId: string, topicName: string) => {
  const data = getUserData(userId);
  const subject = data.syllabus.find(s => s.id === subjectId);
  if (subject) {
    const newTopic: Topic = {
      id: Date.now().toString(),
      name: topicName,
      completed: false,
      prelimsRevisions: 0,
      mainsRevisions: 0
    };
    subject.topics.push(newTopic);
    saveUserData(data);
  }
  return data;
};

export const deleteTopic = (userId: string, subjectId: string, topicId: string) => {
  const data = getUserData(userId);
  const subject = data.syllabus.find(s => s.id === subjectId);
  if (subject) {
    subject.topics = subject.topics.filter(t => t.id !== topicId);
    saveUserData(data);
  }
  return data;
};

// --- Other Data ---

export const addMockScore = (userId: string, score: any) => {
  const data = getUserData(userId);
  data.scores.push({ ...score, id: Date.now().toString() });
  // Sort by date desc
  data.scores.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  saveUserData(data);
  return data;
};

export const addTask = (userId: string, title: string, date: string) => {
  const data = getUserData(userId);
  data.tasks.push({
    id: Date.now().toString(),
    title,
    date,
    completed: false
  });
  saveUserData(data);
  return data;
};

export const toggleTask = (userId: string, taskId: string) => {
  const data = getUserData(userId);
  const task = data.tasks.find(t => t.id === taskId);
  if (task) {
    task.completed = !task.completed;
    saveUserData(data);
  }
  return data;
};

export const deleteScore = (userId: string, scoreId: string) => {
    const data = getUserData(userId);
    data.scores = data.scores.filter(s => s.id !== scoreId);
    saveUserData(data);
    return data;
};