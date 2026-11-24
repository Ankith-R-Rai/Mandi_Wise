import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Camera, Sprout, TrendingUp } from "lucide-react";
import api from "../api/client";

export default function Dashboard() {
  const [vegs, setVegs] = useState([]);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    api.get("/api/vegetables").then((r) => setVegs(r.data.supported_vegetables || []));
    api.get("/api/analysis-history?limit=5").then((r) => setHistory(r.data.history || []));
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-emerald-700 to-teal-700 text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Welcome to AgriVision AI</h1>
          <p className="text-emerald-100 text-sm mt-1 max-w-xl">
            Inspect vegetable quality from field photos, detect visible blemishes, estimate visual grade, and check Karnataka AGMARKNET mandi prices.
          </p>
        </div>
        <Link to="/analyze" className="px-5 py-3 rounded-xl bg-white text-emerald-800 font-semibold flex items-center gap-2 shrink-0">
          <Camera className="w-5 h-5" /> Upload Crop Image
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-emerald-100 p-6">
        <h2 className="font-bold text-emerald-950 flex items-center gap-2 mb-3"><Sprout className="w-5 h-5 text-emerald-600" /> Supported Vegetables ({vegs.length})</h2>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {vegs.map((v) => (
            <div key={v.name} className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-100 text-sm font-medium text-emerald-950">
              {v.name}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-emerald-100 p-6">
        <h2 className="font-bold text-emerald-950 flex items-center gap-2 mb-3"><TrendingUp className="w-5 h-5 text-emerald-600" /> Recent Crop Analyses</h2>
        {history.length === 0 ? (
          <p className="text-sm text-slate-500">No analyses recorded yet.</p>
        ) : (
          <div className="divide-y">
            {history.map((h) => (
              <div key={h.image_id} className="py-2.5 flex items-center justify-between text-sm">
                <span><strong>{h.vegetable}</strong> — {h.grade} ({h.grade_basis})</span>
                <span className="text-xs text-slate-500">{new Date(h.uploaded_at).toLocaleString()}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
