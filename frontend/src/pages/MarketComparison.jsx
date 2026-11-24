import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import api from "../api/client";

export default function MarketComparison() {
  const [vegetables, setVegetables] = useState([]);
  const [mandis, setMandis] = useState([]);
  const [veg, setVeg] = useState("Tomato");
  const [selected, setSelected] = useState([]);
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get("/api/vegetables").then((r) => setVegetables(r.data.supported_vegetables || []));
    api.get("/api/mandis?state=Karnataka").then((r) => {
      const list = r.data.mandis || [];
      setMandis(list);
      setSelected(list.slice(0, 3).map((m) => m.mandi_name));
    });
  }, []);

  const runCompare = async () => {
    if (selected.length === 0) return;
    const params = new URLSearchParams({ vegetable_name: veg, state: "Karnataka" });
    selected.forEach((m) => params.append("mandis", m));
    const res = await api.get(`/api/market-comparison?${params.toString()}`);
    setData(res.data);
  };

  return (
    <div className="bg-white rounded-2xl border border-emerald-100 p-6 shadow-sm space-y-5">
      <h1 className="text-2xl font-bold text-emerald-950">Karnataka APMC Mandi Comparison</h1>
      <div className="flex flex-wrap gap-3 items-center">
        <select value={veg} onChange={(e) => setVeg(e.target.value)} className="rounded-xl border border-emerald-200 px-3 py-2 text-sm">
          {vegetables.map((v) => <option key={v.name}>{v.name}</option>)}
        </select>
        <button onClick={runCompare} className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-sm font-semibold">
          Compare Selected Mandis
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {mandis.map((m) => (
          <label key={m.mandi_name} className="px-3 py-1.5 rounded-full border text-xs flex items-center gap-1.5 cursor-pointer bg-emerald-50/40">
            <input
              type="checkbox"
              checked={selected.includes(m.mandi_name)}
              onChange={(e) =>
                setSelected(e.target.checked ? [...selected, m.mandi_name] : selected.filter((x) => x !== m.mandi_name))
              }
            />
            {m.mandi_name} ({m.district})
          </label>
        ))}
      </div>

      {data && (
        <>
          {data.highest_observed_mandi && (
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-900 text-sm">
              Highest observed latest modal price: <strong>{data.highest_observed_mandi}</strong>
            </div>
          )}
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.comparison}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mandi_name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="latest_modal_price" fill="#059669" name="Latest Modal ₹/Qtl" />
                <Bar dataKey="period_avg_modal" fill="#6ee7b7" name="Period Avg ₹/Qtl" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
}
