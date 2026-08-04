function Hero() {
  return (
    <main className="flex flex-col items-center justify-center text-center px-6 py-24">
      <h2 className="text-5xl font-bold text-slate-800 mb-6">
        Your Medical History,
        <br />
        Unified.
      </h2>

      <p className="text-lg text-slate-600 max-w-2xl mb-10">
        Securely access your medical records, prescriptions, lab reports,
        AI-generated summaries, and healthcare history from one place.
      </p>

      <div className="flex gap-4">
        <button className="bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700">
          Get Started
        </button>

        <button className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-xl hover:bg-blue-50">
          Learn More
        </button>
      </div>
    </main>
  );
}

export default Hero;