'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

interface Question {
  id: number;
  question: string;
  options: string[];
  correct_answer: number;
  tags: string[];
}

export default function AssignmentPage() {
  const params = useParams();
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState<{
    weakTopics: string[];
    strongTopics: string[];
    overallScore: number;
    recommendations: string[];
  } | null>(null);

  useEffect(() => {
    if (params.id) {
      fetchQuestions();
    }
  }, [params.id, fetchQuestions]);

  const fetchQuestions = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/questions/${params.id}`);
      const data = await response.json();
      setQuestions(data);
      setAnswers(new Array(data.length).fill(-1));
    } catch (error) {
      console.error('Error fetching questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      const studentAnswers = questions.map((question, index) => ({
        question_id: question.id,
        selected_answer: answers[index],
        is_correct: answers[index] === question.correct_answer,
        tags: question.tags
      }));

      const response = await fetch('http://localhost:3001/api/analyze-results', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          answers: studentAnswers,
          studentId: 'demo-student'
        }),
      });

      const analysis = await response.json();
      setResults(analysis);
      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting answers:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Sorular yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (submitted && results) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">🎉</div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Ödev Tamamlandı!</h1>
              <p className="text-xl text-gray-600">
                Genel Puan: <span className="font-bold text-blue-600">{results.overallScore.toFixed(1)}%</span>
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="bg-red-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-red-800 mb-4">Zayıf Konular</h3>
                {results.weakTopics.length > 0 ? (
                  <ul className="space-y-2">
                    {results.weakTopics.map((topic: string, index: number) => (
                      <li key={index} className="text-red-700">• {topic}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-red-600">Zayıf konu bulunamadı!</p>
                )}
              </div>

              <div className="bg-green-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-green-800 mb-4">Güçlü Konular</h3>
                {results.strongTopics.length > 0 ? (
                  <ul className="space-y-2">
                    {results.strongTopics.map((topic: string, index: number) => (
                      <li key={index} className="text-green-700">• {topic}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-green-600">Güçlü konu bulunamadı!</p>
                )}
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-semibold text-blue-800 mb-4">Öneriler</h3>
              <ul className="space-y-2">
                {results.recommendations.map((rec: string, index: number) => (
                  <li key={index} className="text-blue-700">• {rec}</li>
                ))}
              </ul>
            </div>

            <div className="text-center">
              <button
                onClick={() => router.push('/student/dashboard')}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
              >
                Dashboard'a Dön
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Ödev Bulunamadı</h1>
          <p className="text-gray-600 mb-4">Bu ödev mevcut değil veya erişim yetkiniz yok.</p>
          <button
            onClick={() => router.push('/student/dashboard')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Dashboard'a Dön
          </button>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Ödev Çözme</h1>
            <div className="text-sm text-gray-600">
              {currentQuestion + 1} / {questions.length}
            </div>
          </div>
          <div className="mt-2">
            <div className="bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Soru {currentQuestion + 1}
            </h2>
            <p className="text-lg text-gray-700">{question.question}</p>
          </div>

          <div className="space-y-4 mb-8">
            {question.options.map((option, index) => (
              <label
                key={index}
                className={`block p-4 border-2 rounded-lg cursor-pointer transition ${
                  answers[currentQuestion] === index
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="answer"
                  value={index}
                  checked={answers[currentQuestion] === index}
                  onChange={() => handleAnswerSelect(index)}
                  className="sr-only"
                />
                <span className="font-medium text-gray-700">
                  {String.fromCharCode(65 + index)}. {option}
                </span>
              </label>
            ))}
          </div>

          <div className="flex justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Önceki
            </button>

            {currentQuestion === questions.length - 1 ? (
              <button
                onClick={handleSubmit}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
              >
                Ödevi Tamamla
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Sonraki
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
