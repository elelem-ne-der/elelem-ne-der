// Ortak tip tanımları

export interface User {
  id: string;
  email: string;
  role: 'student' | 'teacher' | 'parent';
  name: string;
  created_at: string;
}

export interface Student extends User {
  role: 'student';
  grade: number;
  parent_id?: string;
}

export interface Teacher extends User {
  role: 'teacher';
  school: string;
}

export interface Parent extends User {
  role: 'parent';
  children: string[]; // student IDs
}

export interface Assignment {
  id: string;
  title: string;
  description?: string;
  grade: number;
  subject: string;
  topic: string;
  questions: Question[];
  teacher_id: string;
  created_at: string;
  due_date?: string;
}

export interface Question {
  id: string;
  question: string;
  options: string[];
  correct_answer: number;
  tags: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  explanation?: string;
}

export interface StudentAnswer {
  id: string;
  student_id: string;
  question_id: string;
  assignment_id: string;
  selected_answer: number;
  is_correct: boolean;
  time_spent: number; // seconds
  created_at: string;
}

export interface AnalysisResult {
  student_id: string;
  assignment_id: string;
  weak_topics: string[];
  strong_topics: string[];
  overall_score: number;
  recommendations: string[];
  roadmap: RoadmapStep[];
}

export interface RoadmapStep {
  id: string;
  title: string;
  description: string;
  type: 'study' | 'practice' | 'test';
  resources: string[];
  estimated_time: number; // minutes
  completed: boolean;
  created_at: string;
}

export interface Tag {
  id: string;
  name: string;
  subject: string;
  grade: number;
  description?: string;
  created_at: string;
}

// Database tabloları için ek tipler
export interface Province {
  id: string;
  name: string;
  created_at: string;
}

export interface District {
  id: string;
  name: string;
  province_id: string;
  created_at: string;
}

export interface School {
  id: string;
  name: string;
  level: 'anaokulu' | 'ilkokul' | 'ortaokul' | 'lise' | 'üniversite';
  type?: string;
  address?: string;
  phone?: string;
  email?: string;
  district_id: string;
  created_at: string;
  updated_at: string;
}

export interface ParentStudentRelationship {
  parent_id: string;
  student_id: string;
  relationship: string;
}
