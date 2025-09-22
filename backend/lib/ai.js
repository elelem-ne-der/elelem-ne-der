// Soru etiketleme fonksiyonu
async function tagQuestion(question) {
  try {
    // Basit bir kural tabanlı etiketleme (gerçek AI yerine)
    const tags = [];
    
    // Matematik konuları
    if (question.includes('kesir') || question.includes('1/') || question.includes('2/')) {
      tags.push('kesirler');
    }
    if (question.includes('+') || question.includes('topla')) {
      tags.push('toplama');
    }
    if (question.includes('-') || question.includes('çıkar')) {
      tags.push('çıkarma');
    }
    if (question.includes('x') || question.includes('çarp')) {
      tags.push('çarpma');
    }
    if (question.includes('÷') || question.includes('böl')) {
      tags.push('bölme');
    }
    
    // Türkçe konuları
    if (question.includes('fiil') || question.includes('yapıyor')) {
      tags.push('fiiller');
    }
    if (question.includes('isim') || question.includes('ad')) {
      tags.push('isimler');
    }
    
    // Zorluk seviyesi
    if (question.length < 50) {
      tags.push('kolay');
    } else if (question.length < 100) {
      tags.push('orta');
    } else {
      tags.push('zor');
    }
    
    return {
      tags: tags,
      confidence: 0.8
    };
  } catch (error) {
    console.error('Error tagging question:', error);
    return {
      tags: ['genel'],
      confidence: 0.5
    };
  }
}

// Yeni soru üretimi
async function generateQuestions(topic, grade, count = 1) {
  try {
    const questions = [];
    
    // Örnek sorular (gerçek AI yerine)
    const sampleQuestions = {
      'kesirler': [
        {
          question: `${grade}. sınıf seviyesinde ${topic} konusunda bir soru: 1/2 + 1/4 = ?`,
          options: ['2/6', '3/4', '1/6', '2/4'],
          correct_answer: 1,
          tags: [topic, 'toplama', 'kesirler']
        },
        {
          question: `${topic} konusunda: 3/4 - 1/2 = ?`,
          options: ['2/2', '1/4', '2/4', '1/2'],
          correct_answer: 1,
          tags: [topic, 'çıkarma', 'kesirler']
        }
      ],
      'fiiller': [
        {
          question: `${topic} konusunda: Aşağıdakilerden hangisi fiildir?`,
          options: ['güzel', 'koşmak', 'mavi', 'ev'],
          correct_answer: 1,
          tags: [topic, 'fiiller', 'türkçe']
        }
      ]
    };
    
    const topicQuestions = sampleQuestions[topic] || sampleQuestions['kesirler'];
    
    for (let i = 0; i < count; i++) {
      const baseQuestion = topicQuestions[i % topicQuestions.length];
      questions.push({
        ...baseQuestion,
        id: Date.now() + i,
        question: baseQuestion.question.replace('{topic}', topic)
      });
    }
    
    return questions;
  } catch (error) {
    console.error('Error generating questions:', error);
    return [];
  }
}

// Hata analizi
async function analyzeResults(answers) {
  try {
    const analysis = {
      weakTopics: [],
      strongTopics: [],
      overallScore: 0,
      recommendations: [],
      roadmap: [],
      rootCauses: [], // [{topic, cause, frequency, examples: [..]}]
      subtopicBreakdown: {} // { subtopic: { correct, total, rate } }
    };
    
    // Basit analiz
    const correctAnswers = answers.filter(a => a.is_correct).length;
    analysis.overallScore = (correctAnswers / answers.length) * 100;
    
    // Konu bazlı analiz
    const topicStats = {};
    const causeStats = {}; // e.g. { 'işlem hatası': { count, examples: [...] } }
    const subtopicStats = {}; // e.g. { 'kesir toplama payda eşitleme': { correct, total } }
    answers.forEach(answer => {
      answer.tags?.forEach(tag => {
        if (!topicStats[tag]) {
          topicStats[tag] = { correct: 0, total: 0 };
        }
        topicStats[tag].total++;
        if (answer.is_correct) {
          topicStats[tag].correct++;
        }
      });

      // Heuristic root-cause extraction (rule-based for demo)
      if (!answer.is_correct) {
        const joined = (answer.tags || []).join(' ').toLowerCase();
        let cause = 'kavramsal eksik';
        if (joined.includes('toplama') || joined.includes('+')) cause = 'işlem hatası (toplama)';
        if (joined.includes('çıkarma') || joined.includes('-')) cause = 'işlem hatası (çıkarma)';
        if (joined.includes('kesir')) cause = 'payda eşitleme eksikliği';
        if (joined.includes('fiil')) cause = 'tanım/kural hatası (fiiller)';

        if (!causeStats[cause]) {
          causeStats[cause] = { count: 0, examples: [] };
        }
        causeStats[cause].count++;
        if (causeStats[cause].examples.length < 3) {
          causeStats[cause].examples.push({ questionId: answer.question_id, tags: answer.tags });
        }

        // Subtopic heuristic
        const sub = joined.includes('kesir') && joined.includes('toplama')
          ? 'kesir toplama - payda eşitleme'
          : joined.includes('kesir') && joined.includes('çıkarma')
          ? 'kesir çıkarma - payda eşitleme'
          : (answer.tags && answer.tags[0]) || 'genel';
        if (!subtopicStats[sub]) subtopicStats[sub] = { correct: 0, total: 0 };
        subtopicStats[sub].total++;
      } else {
        const joined = (answer.tags || []).join(' ').toLowerCase();
        const sub = joined.includes('kesir') && joined.includes('toplama')
          ? 'kesir toplama - payda eşitleme'
          : joined.includes('kesir') && joined.includes('çıkarma')
          ? 'kesir çıkarma - payda eşitleme'
          : (answer.tags && answer.tags[0]) || 'genel';
        if (!subtopicStats[sub]) subtopicStats[sub] = { correct: 0, total: 0 };
        subtopicStats[sub].total++;
        subtopicStats[sub].correct++;
      }
    });
    
    // Zayıf ve güçlü konuları belirle
    Object.entries(topicStats).forEach(([topic, stats]) => {
      const successRate = (stats.correct / stats.total) * 100;
      if (successRate < 50) {
        analysis.weakTopics.push(topic);
      } else if (successRate > 80) {
        analysis.strongTopics.push(topic);
      }
    });
    
    // Öneriler
    if (analysis.weakTopics.length > 0) {
      analysis.recommendations.push(`${analysis.weakTopics.join(', ')} konularını tekrar etmelisin`);
    }
    
    // Yol haritası
    analysis.weakTopics.forEach(topic => {
      analysis.roadmap.push({
        title: `${topic} konusunu tekrar et`,
        description: `${topic} ile ilgili temel kavramları öğren`,
        type: 'study',
        resources: [`${topic} konu anlatımı`, `${topic} örnek sorular`],
        estimated_time: 30
      });
    });

    // Root causes
    analysis.rootCauses = Object.entries(causeStats)
      .sort((a,b) => b[1].count - a[1].count)
      .map(([cause, info]) => ({ cause, frequency: info.count, examples: info.examples }));

    // Subtopic breakdown with rates
    Object.entries(subtopicStats).forEach(([sub, st]) => {
      analysis.subtopicBreakdown[sub] = {
        correct: st.correct,
        total: st.total,
        rate: st.total ? Math.round((st.correct / st.total) * 100) : 0
      };
    });
    
    return analysis;
  } catch (error) {
    console.error('Error analyzing results:', error);
    return {
      weakTopics: [],
      strongTopics: [],
      overallScore: 0,
      recommendations: ['Genel tekrar yapmanı öneriyoruz'],
      roadmap: []
    };
  }
}

module.exports = {
  tagQuestion,
  generateQuestions,
  analyzeResults
};
