import React from "react";
import { CheckCircle } from "lucide-react";

export default function SuccessPage({ onNavigate }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <CheckCircle className="h-16 w-16 text-green-500 mb-6" />
      <h2 className="text-3xl font-bold mb-2">Order Successful!</h2>
      <p className="text-gray-600 mb-8">We’ll reach out soon to confirm your details.</p>
      <button
        onClick={() => onNavigate("home")}
        className="bg-indigo-600 text-white px-8 py-3 rounded hover:bg-indigo-700"
      >
        Return Home
      </button>
    </div>
  );
}
