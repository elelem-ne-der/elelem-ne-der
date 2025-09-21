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

// Admin - Tekli Veri Girişi
app.post('/api/admin/seed-data', async (req, res) => {
  try {
    const { createClient } = require('@supabase/supabase-js');
    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

    const { type, data } = req.body;

    if (type === 'student') {
      const { data: student, error: studentError } = await supabase
        .from('students')
        .insert({
          id: require('crypto').randomUUID(),
          student_number: data.student_number,
          first_name: data.first_name,
          last_name: data.last_name,
          middle_name: data.middle_name || null,
          grade: parseInt(data.grade),
          province: data.province,
          district: data.district,
          school_type: data.school_type,
          school_name: data.school_name
        })
        .select();

      if (studentError) throw studentError;

      res.json({
        success: true,
        message: 'Öğrenci başarıyla eklendi',
        data: student
      });

    } else if (type === 'teacher') {
      const { data: teacher, error: teacherError } = await supabase
        .from('teachers')
        .insert({
          id: require('crypto').randomUUID(),
          teacher_number: data.teacher_number,
          first_name: data.first_name,
          last_name: data.last_name,
          middle_name: data.middle_name || null,
          province: data.province,
          district: data.district,
          school_name: data.school_name,
          contact_info: JSON.stringify([
            { type: 'email', value: data.contact_email },
            { type: 'phone', value: data.contact_phone }
          ])
        })
        .select();

      if (teacherError) throw teacherError;

      res.json({
        success: true,
        message: 'Öğretmen başarıyla eklendi',
        data: teacher
      });
    } else {
      throw new Error('Geçersiz tip. student veya teacher olmalı');
    }

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Admin - Toplu Veri Girişi (CSV/JSON)
app.post('/api/admin/bulk-import', async (req, res) => {
  try {
    const { createClient } = require('@supabase/supabase-js');
    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

    const { dataType, data } = req.body;

    if (!Array.isArray(data)) {
      throw new Error('Veri array formatında olmalı');
    }

    let results = [];
    let errors = [];

    if (dataType === 'students') {
      for (const student of data) {
        try {
          const { data: result, error } = await supabase
            .from('students')
            .insert({
              id: require('crypto').randomUUID(),
              student_number: student.student_number,
              first_name: student.first_name,
              last_name: student.last_name,
              middle_name: student.middle_name || null,
              grade: parseInt(student.grade),
              province: student.province,
              district: student.district,
              school_type: student.school_type,
              school_name: student.school_name
            })
            .select();

          if (error) {
            errors.push({ student: student.student_number, error: error.message });
          } else {
            results.push(result[0]);
          }
        } catch (error) {
          errors.push({ student: student.student_number, error: error.message });
        }
      }
    } else if (dataType === 'teachers') {
      for (const teacher of data) {
        try {
          const { data: result, error } = await supabase
            .from('teachers')
            .insert({
              id: require('crypto').randomUUID(),
              teacher_number: teacher.teacher_number,
              first_name: teacher.first_name,
              last_name: teacher.last_name,
              middle_name: teacher.middle_name || null,
              province: teacher.province,
              district: teacher.district,
              school_name: teacher.school_name,
              contact_info: JSON.stringify([
                { type: 'email', value: teacher.contact_email },
                { type: 'phone', value: teacher.contact_phone }
              ])
            })
            .select();

          if (error) {
            errors.push({ teacher: teacher.teacher_number, error: error.message });
          } else {
            results.push(result[0]);
          }
        } catch (error) {
          errors.push({ teacher: teacher.teacher_number, error: error.message });
        }
      }
    }

    res.json({
      success: errors.length === 0,
      message: `${results.length} kayıt başarıyla eklendi, ${errors.length} hata oluştu`,
      results,
      errors
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
