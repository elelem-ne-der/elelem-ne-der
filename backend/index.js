const express = require('express');
const cors = require('cors');
require('dotenv').config();
const supabase = require('./lib/supabase');
const { tagQuestion, generateQuestions, analyzeResults } = require('./lib/ai');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Elelem Ne Der API is running!' });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// API Status
app.get('/api/status', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Backend API çalışıyor',
    timestamp: new Date().toISOString(),
    services: {
      supabase: process.env.SUPABASE_URL ? 'bağlı' : 'bağlı değil',
      ai: process.env.HUGGINGFACE_API_KEY ? 'bağlı' : 'bağlı değil'
    }
  });
});

// Admin - Veri Girişi
app.post('/api/admin/seed-data', async (req, res) => {
  try {
    // Örnek öğrenci verisi
    const { createClient } = require('@supabase/supabase-js');
    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

    // Örnek öğrenci
    const { data: student, error: studentError } = await supabase
      .from('students')
      .insert({
        id: '550e8400-e29b-41d4-a716-446655440006',
        student_number: 'OGR003',
        first_name: 'Can',
        last_name: 'Demir',
        grade: 7,
        province: 'İzmir',
        district: 'Konak',
        school_type: 'ortaokul',
        school_name: 'Konak Ortaokulu'
      })
      .select();

    if (studentError) throw studentError;

    // Örnek öğretmen
    const { data: teacher, error: teacherError } = await supabase
      .from('teachers')
      .insert({
        id: '550e8400-e29b-41d4-a716-446655440007',
        teacher_number: 'OGR003',
        first_name: 'Ali',
        last_name: 'Yılmaz',
        province: 'İzmir',
        district: 'Konak',
        school_name: 'Konak Ortaokulu',
        contact_info: JSON.stringify([
          { type: 'email', value: 'ali.yilmaz@okul.edu.tr' },
          { type: 'phone', value: '05551234567' }
        ])
      })
      .select();

    if (teacherError) throw teacherError;

    res.json({
      success: true,
      message: 'Örnek veriler eklendi',
      data: { student, teacher }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Sample data endpoints
app.get('/api/assignments', (req, res) => {
  const assignments = [
    {
      id: 1,
      title: 'Matematik - Kesirler',
      grade: '5',
      subject: 'Matematik',
      topic: 'Kesirler',
      questions: 10,
      created_at: new Date().toISOString()
    },
    {
      id: 2,
      title: 'Türkçe - Fiiller',
      grade: '6',
      subject: 'Türkçe',
      topic: 'Fiiller',
      questions: 8,
      created_at: new Date().toISOString()
    }
  ];
  res.json(assignments);
});

app.get('/api/questions/:assignmentId', (req, res) => {
  const { assignmentId } = req.params;
  const questions = [
    {
      id: 1,
      question: '1/2 + 1/4 = ?',
      options: ['2/6', '3/4', '1/6', '2/4'],
      correct_answer: 1,
      tags: ['kesirler', 'toplama', 'temel']
    },
    {
      id: 2,
      question: '3/4 - 1/2 = ?',
      options: ['2/2', '1/4', '2/4', '1/2'],
      correct_answer: 1,
      tags: ['kesirler', 'çıkarma', 'temel']
    }
  ];
  res.json(questions);
});

// AI endpoints
app.post('/api/tag-question', async (req, res) => {
  try {
    const { question } = req.body;
    const result = await tagQuestion(question);
    res.json(result);
  } catch (error) {
    console.error('Error in tag-question:', error);
    res.status(500).json({ error: 'Failed to tag question' });
  }
});

app.post('/api/generate-questions', async (req, res) => {
  try {
    const { topic, grade, count } = req.body;
    const questions = await generateQuestions(topic, grade, count);
    res.json({ questions });
  } catch (error) {
    console.error('Error in generate-questions:', error);
    res.status(500).json({ error: 'Failed to generate questions' });
  }
});

app.post('/api/analyze-results', async (req, res) => {
  try {
    const { answers, studentId } = req.body;
    const analysis = await analyzeResults(answers);
    res.json(analysis);
  } catch (error) {
    console.error('Error in analyze-results:', error);
    res.status(500).json({ error: 'Failed to analyze results' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
