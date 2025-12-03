import React from "react";
import { Ruler, Info } from "lucide-react";

export default function MeasurePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-center mb-12">How to Measure</h2>
      <div className="grid md:grid-cols-2 gap-10 items-center">
        <div className="bg-indigo-50 p-12 rounded-2xl flex justify-center">
          <Ruler className="h-40 w-40 text-indigo-400" />
        </div>
        <div className="space-y-4 text-gray-600">
          <p>Measure the width of the rod, not the window. Add 6–12″ extra for 3D folds.</p>
          <p>Measure from rod to floor for full-length curtains or sill-length depending on preference.</p>
          <div className="flex items-start bg-yellow-50 border-l-4 border-yellow-400 p-3">
            <Info className="h-5 w-5 mr-2 mt-0.5 text-yellow-600" />
            <p>
              Prefer <strong>metal measuring tape</strong> for accuracy. Note down in inches or feet and convert as required.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
