import { useEffect, useState } from "react";
import api from "../api/client";

export default function DatasetModelManager() {
  const [status, setStatus] = useState(null);
  const [evals, setEvals] = useState(null);
  const [msg, setMsg] = useState("");
  const [csvFile, setCsvFile] = useState(null);

  const load = () => {
    api.get("/api/models/status").then((r) => setStatus(r.data));
    api.get("/api/models/evaluation").then((r) => setEvals(r.data));
  };
  useEffect(load, []);

  const syncAgmarknet = async () => {
    const { data } = await api.post("/api/market-data/sync?state=Karnataka");
    setMsg(`AGMARKNET Sync: ${data.status} — Inserted ${data.records_inserted} records. ${data.message || ""}`);
  };

  const uploadCsv = async () => {
    if (!csvFile) return;
    const fd = new FormData();
    fd.append("file", csvFile);
    const { data } = await api.post("/api/market-data/upload-csv", fd);
    setMsg(`CSV Ingested: ${data.rows_inserted} new rows (${data.rows_matched_supported_vegetables} matched).`);
  };

  const trainPrice = async () => {
    const { data } = await api.post("/api/models/train-price");
    setMsg(`Price Training: ${data.status} ${JSON.stringify(data.baseline_metrics || data.message || "")}`);
    load();
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-emerald-100 p-6 space-y-4">
        <h1 className="text-2xl font-bold text-emerald-950">Datasets, AGMARKNET Sync &amp; Model Evaluation</h1>
        {msg && <div className="p-3 rounded-xl bg-emerald-50 text-emerald-900 text-sm">{msg}</div>}

        <div className="flex flex-wrap gap-3 items-center">
          <button onClick={syncAgmarknet} className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-sm font-semibold">
            Sync Karnataka AGMARKNET (data.gov.in)
          </button>
          <input type="file" accept=".csv" onChange={(e) => setCsvFile(e.target.files[0])} className="text-xs" />
          <button onClick={uploadCsv} disabled={!csvFile} className="px-4 py-2 rounded-xl bg-teal-600 text-white text-sm font-semibold disabled:bg-slate-300">
            Upload AGMARKNET CSV
          </button>
          <button onClick={trainPrice} className="px-4 py-2 rounded-xl border border-emerald-600 text-emerald-800 text-sm font-semibold">
            Train &amp; Evaluate Price Model
          </button>
        </div>
      </div>

      {status && (
        <div className="bg-white rounded-2xl border border-emerald-100 p-6">
          <h2 className="font-bold text-emerald-950 mb-3">Live Model Registry Status</h2>
          <pre className="text-xs bg-slate-50 p-4 rounded-xl overflow-auto">{JSON.stringify(status, null, 2)}</pre>
        </div>
      )}

      {evals && (
        <div className="bg-white rounded-2xl border border-emerald-100 p-6">
          <h2 className="font-bold text-emerald-950 mb-3">Verified Evaluation Metrics (Never Fabricated)</h2>
          <pre className="text-xs bg-slate-50 p-4 rounded-xl overflow-auto">{JSON.stringify(evals, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
