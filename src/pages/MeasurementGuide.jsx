import React from "react";

export default function MeasurementGuide() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      {/* Title Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
          Curtain Measurement Guide
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Learn how to measure your windows accurately to get perfectly fitted
          curtains. Follow this step-by-step guide to make sure your curtains
          look elegant and hang beautifully.
        </p>
      </div>

      {/* Image Section */}
      <div className="rounded-2xl overflow-hidden shadow-lg mb-12">
        <img
          src="/measurement.jpg"
          alt="Curtain Measurement Guide"
          className="w-full h-auto object-cover"
        />
      </div>

      {/* Steps Section */}
      <div className="space-y-8 text-gray-700 leading-relaxed">
        <div>
          <h2 className="text-2xl font-semibold mb-2 text-indigo-700">
            1. Measure the Width
          </h2>
          <p>
            Use a steel measuring tape for accurate results. Measure the width
            of your curtain rod or track, not the window itself. For a fuller
            look, multiply the width by 1.5x or 2x depending on your desired
            curtain fullness.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-2 text-indigo-700">
            2. Measure the Height
          </h2>
          <p>
            Decide whether you want your curtains to hang above the window frame
            or from the ceiling. Measure from the top of the rod (or hook) down
            to your desired length — typically just above the floor.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-2 text-indigo-700">
            3. Choose Mount Type
          </h2>
          <p>
            There are two main types: <strong>Inside Mount</strong> (fitted
            within the frame) and <strong>Outside Mount</strong> (covering the
            frame). Inside mounts give a modern look, while outside mounts make
            windows appear larger.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-2 text-indigo-700">
            4. Confirm Measurements
          </h2>
          <p>
            Always double-check your measurements before ordering! Note down
            both width and height clearly. You can share these directly with our
            design team when customizing your curtain.
          </p>
        </div>
      </div>

      {/* Footer Note */}
      <div className="mt-12 text-center border-t pt-6 text-gray-500 text-sm">
        Need help? Our experts can assist you with a free virtual consultation.
        Contact us today!
      </div>
    </div>
  );
}
