import { useState, useEffect } from "react";
import { Upload, Camera, AlertTriangle, CheckCircle2, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";

export default function CropAnalysis() {
  const [vegetables, setVegetables] = useState([]);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [hint, setHint] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/api/vegetables").then((r) => setVegetables(r.data.supported_vegetables || []));
  }, []);

  const handleFileSelect = (selected) => {
    setError("");
    setResult(null);
    if (!selected) return;
    if (!["image/jpeg", "image/jpg", "image/png"].includes(selected.type)) {
      setError("Please upload a JPG, JPEG, or PNG image.");
      return;
    }
    if (selected.size > 10 * 1024 * 1024) {
      setError("File exceeds 10 MB limit.");
      return;
    }
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setLoading(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      if (hint) fd.append("vegetable_hint", hint);
      const { data } = await api.post("/api/analyze-image", fd);
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.detail || "Analysis failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-emerald-100 p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-emerald-950">Crop Quality Analysis</h1>
        <p className="text-sm text-slate-600 mt-1">
          Upload or capture a clear photograph of your vegetable harvest for identification, defect inspection, and visual grading.
        </p>

        <div className="grid md:grid-cols-2 gap-6 mt-5">
          <div>
            <label
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                handleFileSelect(e.dataTransfer.files[0]);
              }}
              className="border-2 border-dashed border-emerald-300 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-emerald-50/50 transition min-h-[240px]"
            >
              {preview ? (
                <img src={preview} alt="Preview" className="max-h-56 rounded-xl object-contain" />
              ) : (
                <>
                  <Upload className="w-10 h-10 text-emerald-600 mb-2" />
                  <span className="font-medium text-emerald-900">Drag &amp; drop JPG / PNG or click to browse</span>
                  <span className="text-xs text-slate-500 mt-1">Max size: 10 MB</span>
                </>
              )}
              <input type="file" accept="image/png,image/jpeg" className="hidden" onChange={(e) => handleFileSelect(e.target.files[0])} />
            </label>

            <div className="flex flex-wrap gap-3 mt-3">
              <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-100 text-emerald-900 text-sm font-medium cursor-pointer">
                <Camera className="w-4 h-4" />
                Capture via Camera
                <input type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => handleFileSelect(e.target.files[0])} />
              </label>

              <select
                value={hint}
                onChange={(e) => setHint(e.target.value)}
                className="flex-1 rounded-xl border border-emerald-200 px-3 py-2 text-sm bg-white"
              >
                <option value="">Auto-detect vegetable (or optional crop hint)</option>
                {vegetables.map((v) => (
                  <option key={v.name} value={v.name}>{v.name}</option>
                ))}
              </select>
            </div>

            {error && <div className="mt-3 p-3 rounded-xl bg-red-50 text-red-700 text-sm">{error}</div>}

            <button
              disabled={!file || loading}
              onClick={handleAnalyze}
              className="mt-4 w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-semibold transition"
            >
              {loading ? "Running OpenCV & Neural Analysis..." : "Analyze Vegetable Quality"}
            </button>
          </div>

          {result && (
            <div className="space-y-4">
              {result.identification.model_status === "UNTRAINED_PENDING" && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>
                    MobileNetV2 classifier weights are not trained yet (status: UNTRAINED_PENDING). OpenCV surface inspection ran genuinely on your image; select a crop hint or train MobileNetV2 in Datasets &amp; Models.
                  </span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100">
                  <div className="text-xs text-slate-500">Identified Vegetable</div>
                  <div className="text-lg font-bold text-emerald-950">{result.identification.predicted_vegetable}</div>
                  <div className="text-xs text-slate-600">
                    Confidence: {result.identification.confidence !== null ? `${(result.identification.confidence * 100).toFixed(1)}%` : "Pending model training"}
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100">
                  <div className="text-xs text-slate-500">Quality Grade</div>
                  <div className="text-lg font-bold text-emerald-950">{result.grading.grade}</div>
                  <div className="text-xs text-emerald-700 font-medium">{result.grading.grade_basis}</div>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 text-sm space-y-2">
                <div><strong>Freshness:</strong> {result.quality.freshness_classification}</div>
                <div><strong>Defects Detected:</strong> {result.defects.length}</div>
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 pt-1">
                  <span>Color Uniformity: {(result.quality.cv_metrics.color_uniformity_score * 100).toFixed(0)}%</span>
                  <span>Surface Blemish Ratio: {(result.quality.cv_metrics.surface_defect_ratio * 100).toFixed(2)}%</span>
                  <span>Wrinkle/Texture Index: {result.quality.cv_metrics.wrinkle_texture_score}</span>
                  <span>Decay Indicator: {result.quality.cv_metrics.decay_indicator_score}</span>
                </div>
                <p className="text-xs text-slate-700 pt-1">{result.grading.explanation}</p>
                <p className="text-[11px] text-slate-500 border-t pt-2">{result.grading.agmark_disclaimer}</p>
              </div>

              {result.identification.is_supported && (
                <button
                  onClick={() =>
                    navigate("/predict-price", {
                      state: {
                        vegetable: result.identification.predicted_vegetable,
                        grade: result.grading.grade,
                        imageId: result.image_id,
                      },
                    })
                  }
                  className="w-full py-2.5 rounded-xl border border-emerald-600 text-emerald-700 font-semibold flex items-center justify-center gap-2 hover:bg-emerald-50"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Estimate Karnataka Mandi Price
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
