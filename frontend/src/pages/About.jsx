export default function About() {
  return (
    <div className="bg-white rounded-2xl border border-emerald-100 p-6 space-y-3 text-sm text-slate-700">
      <h1 className="text-2xl font-bold text-emerald-950">About AgriVision AI</h1>
      <p>
        AgriVision AI combines OpenCV surface inspection, MobileNetV2 classification, optional YOLOv8 defect detection,
        and XGBoost / Random Forest market price modeling for 10 major Indian vegetables, designed for modular integration into MandiWise.
      </p>
      <p>
        <strong>Market Data Provenance:</strong> Connects to the Government of India Open Data Platform (data.gov.in / AGMARKNET)
        with CSV fallback and strict separation between verified mandi records and demonstration data.
      </p>
      <p>
        <strong>Public Vision Datasets:</strong> VegQual (Figshare), VegNet (Mendeley Data, CC BY 4.0), BanglaVeg (Data in Brief, CC BY 4.0),
        and AFruitDB for out-of-distribution negative rejection.
      </p>
    </div>
  );
}
