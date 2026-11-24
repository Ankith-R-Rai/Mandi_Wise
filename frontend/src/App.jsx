import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import CropAnalysis from "./pages/CropAnalysis";
import PricePrediction from "./pages/PricePrediction";
import MarketComparison from "./pages/MarketComparison";
import AnalysisHistory from "./pages/AnalysisHistory";
import DatasetModelManager from "./pages/DatasetModelManager";
import About from "./pages/About";

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/analyze" element={<CropAnalysis />} />
          <Route path="/predict-price" element={<PricePrediction />} />
          <Route path="/markets" element={<MarketComparison />} />
          <Route path="/history" element={<AnalysisHistory />} />
          <Route path="/models" element={<DatasetModelManager />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
