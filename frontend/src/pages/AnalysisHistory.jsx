import { useEffect, useState } from "react";
import api from "../api/client";

export default function AnalysisHistory() {
  const [items, setItems] = useState([]);
  useEffect(() => {
    api.get("/api/analysis-history?limit=50").then((r) => setItems(r.data.history || []));
  }, []);

  return (
    <div className="bg-white rounded-2xl border border-emerald-100 p-6">
      <h1 className="text-2xl font-bold text-emerald-950 mb-4">Saved Analysis History</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((it) => (
          <div key={it.image_id} className="border rounded-2xl overflow-hidden bg-slate-50/50">
            <img src={it.image_url} alt={it.filename} className="h-40 w-full object-cover" />
            <div className="p-4 text-sm space-y-1">
              <div className="font-bold text-emerald-950">{it.vegetable}</div>
              <div>Grade: <strong>{it.grade}</strong> ({it.grade_basis})</div>
              <div>Freshness: {it.freshness} • Defects: {it.defect_count}</div>
              <div className="text-xs text-slate-500">{new Date(it.uploaded_at).toLocaleString()}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
