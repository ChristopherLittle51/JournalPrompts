import { Layout } from './components/Layout';
import { Hero } from './components/Hero';
import { PromptEngine } from './components/PromptEngine';
import { Methodology } from './components/Methodology';
import { Analytics } from './components/Analytics';
import { Login } from './components/Login';
import { useAuth } from './contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import { Routes, Route, Navigate } from 'react-router-dom';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFFBF5]">
        <Loader2 className="w-8 h-8 text-stone-400 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return (
    <Routes>
      <Route path="/" element={
        <Layout>
          <Hero />
          <PromptEngine />
          <Methodology />
          <Analytics />
        </Layout>
      } />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
