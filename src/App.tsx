import { Layout } from './components/Layout';
import { Hero } from './components/Hero';
import { PromptEngine } from './components/PromptEngine';
import { Methodology } from './components/Methodology';
import { Analytics } from './components/Analytics';

function App() {
  return (
    <Layout>
      <Hero />
      <PromptEngine />
      <Methodology />
      <Analytics />
    </Layout>
  );
}

export default App;
