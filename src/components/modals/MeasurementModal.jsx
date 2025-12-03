import React from "react";
import { X, Info } from "lucide-react";

export default function MeasurementModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto animate-fadeIn">
        <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-100 flex justify-between items-center z-10">
          <h3 className="text-xl font-bold text-gray-900">How to measure</h3>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 text-gray-600 text-sm leading-relaxed">
          <div className="bg-amber-50 p-4 rounded-lg border border-amber-100 flex items-start gap-3">
            <Info className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-amber-800">
              Use a <strong>metal tape measure</strong>. Cloth ones can stretch and give inaccurate measurements.
            </p>
          </div>

          <p>Measure from the <strong>top-tip of the curtain rod</strong> to the desired height.</p>

          <div className="pl-4 border-l-4 border-indigo-100 space-y-3">
            <div>
              <strong>For Windows:</strong> Add <strong>7–8 inches</strong> below the sill.
            </div>
            <div>
              <strong>For Doors:</strong> Measure till an inch above the floor.
            </div>
          </div>

          <p>
            Widthwise, the curtain should cover about <strong>2/3rd</strong> of the window width to create pleats. Decide how many panels you want.
          </p>

          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h4 className="font-bold text-gray-900 mb-2">Pro Tip</h4>
            <p>
              Always select a <strong>header style</strong> before ordering. Choose ring or pleated to suit your setup.
            </p>
          </div>

          <div className="flex justify-center py-4">
            <img
              src="/measurment.jpg"
              alt="Measurement Guide"
              className="w-full h-auto object-contain border rounded-lg shadow-sm"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          </div>
        </div>

        <div className="sticky bottom-0 bg-gray-50 px-6 py-4 border-t border-gray-100 text-center">
          <button
            onClick={onClose}
            className="w-full bg-gray-900 text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
