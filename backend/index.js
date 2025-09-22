const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const supabase = require('./lib/supabase');
const { tagQuestion, generateQuestions, analyzeResults } = require('./lib/ai');
const { generateText: generateTextWithGemini, defaultModel: GEMINI_DEFAULT_MODEL } = require('./lib/gemini');

// Manuel öğretmen oluşturma fonksiyonu (Auth.users bypass)
async function createTeacherManually(supabase, teacher, userId) {
  try {
    console.log('Creating teacher without auth user:', teacher.teacher_number);
    
    // 1. District bul veya oluştur
    let districtId;
    const { data: existingDistrict } = await supabase
      .from('districts')
      .select('id')
      .eq('name', teacher.district)
      .single();

    if (existingDistrict) {
      districtId = existingDistrict.id;
      console.log('Using existing district:', teacher.district);
    } else {
      console.log('Creating new district:', teacher.district);
      const { data: newDistrict, error: districtError } = await supabase
        .from('districts')
        .insert({ name: teacher.district })
        .select()
        .single();
      
      if (districtError) {
        console.error('District creation failed:', districtError);
        throw districtError;
      }
      districtId = newDistrict.id;
    }

    // 2. School oluştur
    console.log('Creating school:', teacher.school_name);
    const { data: school, error: schoolError } = await supabase
      .from('schools')
      .insert({
        district_id: districtId,
        name: teacher.school_name,
        level: 'ortaokul', // Varsayılan
        type: 'resmi'
      })
      .select()
      .single();

    if (schoolError) {
      console.error('School creation failed:', schoolError);
      throw schoolError;
    }

    // 3. Profile oluştur (auth_user_id olmadan)
    console.log('Creating profile for teacher:', teacher.teacher_number);
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        email: teacher.email || `${teacher.teacher_number}@teacher.example.com`,
        name: `${teacher.first_name} ${teacher.last_name}`,
        role: 'teacher'
      })
      .select()
      .single();

    if (profileError) {
      console.error('Profile creation failed:', profileError);
      throw profileError;
    }

    // 4. Teacher oluştur
    console.log('Creating teacher record:', teacher.teacher_number);
    const { data: teacherData, error: teacherError } = await supabase
      .from('teachers')
      .insert({
        id: userId,
        teacher_number: teacher.teacher_number,
        first_name: teacher.first_name,
        last_name: teacher.last_name,
        middle_name: teacher.middle_name || null,
        school_id: school.id,
        contact_info: [
          { type: 'email', value: teacher.contact_email || null },
          { type: 'phone', value: teacher.contact_phone || null }
        ]
      })
      .select()
      .single();

    if (teacherError) {
      console.error('Teacher record creation failed:', teacherError);
      throw teacherError;
    }

    console.log('Teacher created successfully:', teacherData.teacher_number);
    return teacherData;
  } catch (error) {
    console.error('Manual teacher creation failed:', error);
    throw error;
  }
}

// Manuel öğrenci oluşturma fonksiyonu (Auth.users bypass)
async function createStudentManually(supabase, student, userId) {
  try {
    console.log('Creating student without auth user:', student.student_number);
    
    // 1. District bul veya oluştur
    let districtId;
    const { data: existingDistrict } = await supabase
      .from('districts')
      .select('id')
      .eq('name', student.district)
      .single();

    if (existingDistrict) {
      districtId = existingDistrict.id;
      console.log('Using existing district:', student.district);
    } else {
      console.log('Creating new district:', student.district);
      const { data: newDistrict, error: districtError } = await supabase
        .from('districts')
        .insert({ name: student.district })
        .select()
        .single();
      
      if (districtError) {
        console.error('District creation failed:', districtError);
        throw districtError;
      }
      districtId = newDistrict.id;
    }

    // 2. School oluştur
    console.log('Creating school:', student.school_name);
    const { data: school, error: schoolError } = await supabase
      .from('schools')
      .insert({
        district_id: districtId,
        name: student.school_name,
        level: student.school_type === 'ortaokul' ? 'ortaokul' : 'lise',
        type: 'resmi'
      })
      .select()
      .single();

    if (schoolError) {
      console.error('School creation failed:', schoolError);
      throw schoolError;
    }

    // 3. Profile oluştur (auth_user_id olmadan)
    console.log('Creating profile for student:', student.student_number);
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        email: student.email || `${student.student_number}@student.example.com`,
        name: `${student.first_name} ${student.last_name}`,
        role: 'student'
      })
      .select()
      .single();

    if (profileError) {
      console.error('Profile creation failed:', profileError);
      throw profileError;
    }

    // 4. Student oluştur
    console.log('Creating student record:', student.student_number);
    const { data: studentData, error: studentError } = await supabase
      .from('students')
      .insert({
        id: userId,
        student_number: student.student_number,
        first_name: student.first_name,
        last_name: student.last_name,
        middle_name: student.middle_name || null,
        grade: parseInt(student.grade),
        school_id: school.id
      })
      .select()
      .single();

    if (studentError) {
      console.error('Student record creation failed:', studentError);
      throw studentError;
    }

    console.log('Student created successfully:', studentData.student_number);
    return studentData;
  } catch (error) {
    console.error('Manual student creation failed:', error);
    throw error;
  }
}

const app = express();
const PORT = process.env.PORT || 3001;

// CORS configuration for production
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    // Allow localhost for development
    if (origin.includes('localhost')) return callback(null, true);

    // Allow Vercel domains (for production)
    if (origin.includes('vercel.app')) return callback(null, true);

    // Allow your custom domain (when you have one)
    // if (origin.includes('yourdomain.com')) return callback(null, true);

    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// JWT authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Access token required'
    });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) {
      return res.status(403).json({
        success: false,
        error: 'Invalid or expired token'
      });
    }

    req.user = user;
    next();
  });
};

// Legacy API key middleware (for backward compatibility)
const adminAuth = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  const expectedApiKey = process.env.ADMIN_API_KEY;

  if (!expectedApiKey) {
    return res.status(500).json({
      success: false,
      error: 'Admin API key not configured'
    });
  }

  if (!apiKey || apiKey !== expectedApiKey) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized - Invalid API key'
    });
  }

  next();
};

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
      ai_hf: process.env.HUGGINGFACE_API_KEY ? 'bağlı' : 'bağlı değil',
      ai_gemini: process.env.GEMINI_API_KEY ? 'bağlı' : 'bağlı değil'
    }
  });
});

// Test endpoint - Auth users erişim testi
app.post('/api/test/auth-access', async (req, res) => {
  try {
    const { createClient } = require('@supabase/supabase-js');
    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

    console.log('Testing auth.users access with service role...');

    // 1. Service role ile auth.users'a erişim testi
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
      console.error('Auth users access failed:', authError);
      return res.status(500).json({
        success: false,
        error: 'Auth users access failed: ' + authError.message,
        details: authError
      });
    }

    console.log('Auth users access successful, found users:', authUsers.users.length);

    // 2. Yeni kullanıcı oluşturma testi
    const testEmail = `test-${Date.now()}@example.com`;
    const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
      email: testEmail,
      password: 'TestPass123!',
      user_metadata: {
        full_name: 'Test User',
        role: 'student'
      }
    });

    if (createError) {
      console.error('User creation failed:', createError);
      return res.status(500).json({
        success: false,
        error: 'User creation failed: ' + createError.message,
        details: createError
      });
    }

    console.log('User created successfully:', newUser.user.id);

    // 3. Oluşturulan kullanıcıyı sil
    const { error: deleteError } = await supabase.auth.admin.deleteUser(newUser.user.id);
    if (deleteError) {
      console.error('User deletion failed:', deleteError);
    }

    res.json({
      success: true,
      message: 'Auth access test successful',
      details: {
        existingUsers: authUsers.users.length,
        testUserCreated: true,
        testUserDeleted: !deleteError
      }
    });

  } catch (error) {
    console.error('Auth access test error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Admin Login
app.post('/api/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Simple admin credentials (you can change these)
    const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      // Generate JWT token
      const token = jwt.sign(
        { username: ADMIN_USERNAME, role: 'admin' },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );

      res.json({
        success: true,
        message: 'Login successful',
        token: token,
        user: { username: ADMIN_USERNAME, role: 'admin' }
      });
    } else {
      res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Admin - Tekli Veri Girişi
app.post('/api/admin/seed-data', authenticateToken, async (req, res) => {
  try {
    const { createClient } = require('@supabase/supabase-js');
    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

    const { type, data } = req.body;

    if (type === 'student') {
      // Manuel oluşturma fonksiyonunu kullan
      const userId = require('crypto').randomUUID();
      console.log('Creating single student:', data.student_number);
      
      try {
        const result = await createStudentManually(supabase, data, userId);
        res.json({
          success: true,
          message: 'Öğrenci başarıyla eklendi',
          data: result
        });
      } catch (error) {
        console.error('Single student creation failed:', error);
        res.status(500).json({
          success: false,
          error: error.message
        });
      }

    } else if (type === 'teacher') {
      // Önce auth.users'a kullanıcı oluştur (Service Role ile)
      const userId = require('crypto').randomUUID();
      const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
        id: userId,
        email: data.email || `${data.teacher_number}@teacher.example.com`,
        password: 'TempPass123!', // Geçici şifre, kullanıcı giriş yapınca değiştirebilir
        user_metadata: {
          full_name: `${data.first_name} ${data.last_name}`,
          role: 'teacher'
        }
      });

      if (authError) throw authError;

      // Önce district'i bul veya oluştur
      const { data: district, error: districtError } = await supabase
        .from('districts')
        .select('id')
        .eq('name', data.district)
        .eq('province', data.province)
        .single();

      let districtId;
      if (districtError || !district) {
        // District yoksa oluştur
        const { data: newDistrict, error: newDistrictError } = await supabase
          .from('districts')
          .insert({
            name: data.district,
            province: data.province
          })
          .select()
          .single();
        
        if (newDistrictError) throw newDistrictError;
        districtId = newDistrict.id;
      } else {
        districtId = district.id;
      }

      // Okul bilgilerini al (varsayılan okul oluştur)
      const { data: school, error: schoolError } = await supabase
        .from('schools')
        .insert({
          district_id: districtId,
          name: data.school_name,
          level: 'ortaokul', // Varsayılan
          type: 'resmi'
        })
        .select()
        .single();

      if (schoolError) throw schoolError;

      // Öğretmen oluştur
      const { data: teacher, error: teacherError } = await supabase
        .from('teachers')
        .insert({
          id: userId, // auth.users'dan gelen ID
          teacher_number: data.teacher_number,
          first_name: data.first_name,
          last_name: data.last_name,
          middle_name: data.middle_name || null,
          school_id: school.id,
          contact_info: [
            { type: 'email', value: data.contact_email || null },
            { type: 'phone', value: data.contact_phone || null }
          ]
        })
        .select()
        .single();

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
app.post('/api/admin/bulk-import', authenticateToken, async (req, res) => {
  try {
    const { createClient } = require('@supabase/supabase-js');
    // Service role ile RLS bypass
    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    const { dataType, data } = req.body;

    if (!Array.isArray(data)) {
      throw new Error('Veri array formatında olmalı');
    }

    let results = [];
    let errors = [];

    if (dataType === 'students') {
      for (const student of data) {
        try {
          const userId = require('crypto').randomUUID();
          console.log('Creating student:', student.student_number, 'ID:', userId);
          
          // Manuel oluşturma fonksiyonunu kullan (RLS bypass)
          const result = await createStudentManually(supabase, student, userId);
          results.push(result);
          console.log('Student created successfully:', result.student_number);
          
        } catch (error) {
          console.error('Student creation failed:', student.student_number, error.message);
          errors.push({ student: student.student_number, error: error.message });
        }
      }
    } else if (dataType === 'teachers') {
      for (const teacher of data) {
        try {
          const userId = require('crypto').randomUUID();
          console.log('Creating teacher:', teacher.teacher_number);
          
          // Manuel öğretmen oluşturma (auth bypass)
          const result = await createTeacherManually(supabase, teacher, userId);
          results.push(result);
          console.log('Teacher created successfully:', result.teacher_number);
          
        } catch (error) {
          console.error('Teacher creation failed:', teacher.teacher_number, error.message);
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

// Gemini AI - simple completion
app.post('/api/ai/complete', async (req, res) => {
  try {
    const { prompt, model, system } = req.body || {};
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'prompt gerekli' });
    }
    const text = await generateTextWithGemini({ prompt, model, system });
    res.json({ text, model: model || GEMINI_DEFAULT_MODEL });
  } catch (error) {
    console.error('Error in /api/ai/complete:', error);
    res.status(500).json({ error: 'AI completion failed', details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
