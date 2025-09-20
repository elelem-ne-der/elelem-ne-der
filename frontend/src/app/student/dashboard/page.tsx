&#39;use client&#39;;

import { useState, useEffect } from &#39;react&#39;;
import Link from &#39;next/link&#39;;
import { useAuth } from &#39;@/contexts/AuthContext&#39;;
import { useRouter } from &#39;next/navigation&#39;;

interface Assignment {
  id: number;
  title: string;
  grade: number;
  subject: string;
  topic: string;
  questions: number;
  created_at: string;
}

export default function StudentDashboard() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push(&#39;/student/login&#39;);
      return;
    }
    fetchAssignments();
  }, [user, router]);

  const fetchAssignments = async () => {
    try {
      const response = await fetch(&#39;http://localhost:3001/api/assignments&#39;);
      const data = await response.json();
      setAssignments(data);
    } catch (error) {
      console.error(&#39;Error fetching assignments:&#39;, error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Ödevler yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">Öğrenci Paneli</h1>
            <div className="flex space-x-4">
              <Link 
                href="/student/profile" 
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition"
              >
                Profil
              </Link>
              <button
                onClick={() => signOut()}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
              >
                Çıkış
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Atanan Ödevler</h2>
          <p className="text-gray-600">Öğretmeninizin size verdiği ödevleri buradan çözebilirsiniz.</p>
        </div>

        {assignments.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Henüz ödev yok</h3>
            <p className="text-gray-600">Öğretmeniniz size ödev verdiğinde burada görünecek.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {assignments.map((assignment) => (
              <div key={assignment.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
                <div className="flex items-center justify-between mb-4">
                  <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded">
                    {assignment.grade}. Sınıf
                  </span>
                  <span className="bg-green-100 text-green-800 text-sm font-medium px-2.5 py-0.5 rounded">
                    {assignment.subject}
                  </span>
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {assignment.title}
                </h3>
                
                <p className="text-gray-600 mb-4">
                  <strong>Konu:</strong> {assignment.topic}
                </p>
                
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-500">
                    {assignment.questions} soru
                  </span>
                  <span className="text-sm text-gray-500">
                    {new Date(assignment.created_at).toLocaleDateString(&#39;tr-TR&#39;)}
                  </span>
                </div>
                
                <Link 
                  href={`/student/assignment/${assignment.id}`}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition text-center block"
                >
                  Ödevi Çöz
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
