import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import api from "../api/client";

export default function PricePrediction() {
  const { state } = useLocation();
  const [vegetables, setVegetables] = useState([]);
  const [mandis, setMandis] = useState([]);
  const [veg, setVeg] = useState(state?.vegetable || "Tomato");
  const [grade, setGrade] = useState(state?.grade || "Grade A");
  const [mandi, setMandi] = useState("");
  const [history, setHistory] = useState([]);
  const [prediction, setPrediction] = useState(null);

  useEffect(() => {
    api.get("/api/vegetables").then((r) => setVegetables(r.data.supported_vegetables || []));
    api.get("/api/mandis?state=Karnataka").then((r) => {
      const list = r.data.mandis || [];
      setMandis(list);
      if (list.length > 0) setMandi(list[0].mandi_name);
    });
  }, []);

  useEffect(() => {
    if (!veg || !mandi) return;
    api.get("/api/historical-prices", { params: { vegetable_name: veg, mandi_name: mandi } }).then((r) => {
      setHistory(r.data.records || []);
    });
  }, [veg, mandi]);

  const handlePredict = async () => {
    if (!mandi) return;
    const { data } = await api.post("/api/predict-price", {
      vegetable_name: veg,
      mandi_name: mandi,
      grade,
      image_id: state?.imageId || null,
    });
    setPrediction(data);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-emerald-100 p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-emerald-950">Karnataka Mandi Price Prediction</h1>
        <p className="text-sm text-slate-600 mt-1">
          Uses AGMARKNET / data.gov.in historical mandi records and XGBoost / Random Forest time-series features.
        </p>

        <div className="grid sm:grid-cols-4 gap-3 mt-4">
          <select value={veg} onChange={(e) => setVeg(e.target.value)} className="rounded-xl border border-emerald-200 px-3 py-2 text-sm">
            {vegetables.map((v) => <option key={v.name} value={v.name}>{v.name}</option>)}
          </select>
          <select value={grade} onChange={(e) => setGrade(e.target.value)} className="rounded-xl border border-emerald-200 px-3 py-2 text-sm">
            <option>Grade A</option>
            <option>Grade B</option>
            <option>Grade C</option>
          </select>
          <select value={mandi} onChange={(e) => setMandi(e.target.value)} className="rounded-xl border border-emerald-200 px-3 py-2 text-sm">
            {mandis.length === 0 ? <option value="">No Karnataka mandis ingested yet</option> : mandis.map((m) => (
              <option key={m.mandi_name} value={m.mandi_name}>{m.mandi_name} ({m.district})</option>
            ))}
          </select>
          <button onClick={handlePredict} disabled={!mandi} className="rounded-xl bg-emerald-600 text-white font-semibold py-2 px-4 disabled:bg-slate-300">
            Predict Price
          </button>
        </div>

        {prediction && (
          <div className="mt-5 p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-2">
            <div className="flex flex-wrap gap-6">
              <div>
                <div className="text-xs text-slate-500">Predicted Modal Price</div>
                <div className="text-2xl font-bold text-emerald-900">
                  {prediction.predicted_modal_price !== null ? `₹${prediction.predicted_modal_price} / Quintal` : "Unavailable"}
                </div>
              </div>
              {prediction.predicted_min_price !== null && (
                <div>
                  <div className="text-xs text-slate-500">Expected Error Band (±RMSE)</div>
                  <div className="text-lg font-semibold text-slate-800">
                    ₹{prediction.predicted_min_price} – ₹{prediction.predicted_max_price}
                  </div>
                </div>
              )}
              <div>
                <div className="text-xs text-slate-500">Grade Specificity</div>
                <div className="text-sm font-medium text-amber-800">
                  {prediction.is_grade_specific ? "Grade-Aware Model" : "Baseline Market Model (Not Grade-Specific)"}
                </div>
              </div>
            </div>
            <p className="text-xs text-slate-700">{prediction.reliability_note}</p>
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-emerald-100 p-6 shadow-sm">
        <h2 className="font-semibold text-emerald-950 mb-3">Observed Historical Modal Prices ({veg} — {mandi || "Select Mandi"})</h2>
        {history.length === 0 ? (
          <p className="text-sm text-slate-500">No historical records loaded yet. Sync data.gov.in or upload an AGMARKNET CSV in Datasets &amp; Models.</p>
        ) : (
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={history}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="arrival_date" tick={{ fontSize: 11 }} />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="modal_price" stroke="#059669" strokeWidth={2} name="Modal ₹/Qtl" />
                <Line type="monotone" dataKey="min_price" stroke="#94a3b8" strokeDasharray="4 4" name="Min ₹/Qtl" />
                <Line type="monotone" dataKey="max_price" stroke="#0f766e" strokeDasharray="4 4" name="Max ₹/Qtl" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
