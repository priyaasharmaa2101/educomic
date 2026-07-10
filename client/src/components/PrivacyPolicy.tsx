
export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-black text-slate-300 py-16 mt-8 px-4 md:px-16 lg:px-24 xl:px-32 selection:bg-purple-500/30">
      <div className="max-w-3xl mx-auto">
        
        {/* Header Section */}
        <div className="mb-12 border-b border-zinc-900 pb-6">
          <a href="/" className="text-purple-400 hover:text-purple-300 text-sm font-medium transition flex items-center gap-2 mb-4">
            ← Back to Home
          </a>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Privacy Policy</h1>
          <p className="text-sm text-zinc-500">Last updated: May 24, 2026</p>
        </div>

        {/* Content Body */}
        <div className="space-y-8 text-sm md:text-base leading-relaxed">
          
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <span className="text-purple-500">1.</span> Information We Collect
            </h2>
            <p className="text-slate-400">
              To provide the core AI comic generation engine, EduComic collects minimal data essential for system operations:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-slate-400">
              <li><strong className="text-slate-200">Account Credentials:</strong> Name, email addresses, and encrypted security hashes for login verification.</li>
              <li><strong className="text-slate-200">Generation Text Prompts:</strong> Text scripts or descriptive inputs submitted to transform ideas into visual panels.</li>
              <li><strong className="text-slate-200">Media Workspace Data:</strong> Saved comic narratives, active generation settings, and profile parameters.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <span className="text-purple-500">2.</span> How Your Data is Used
            </h2>
            <p className="text-slate-400">
              Your information is exclusively leveraged to construct your personalized experience:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-400">
              <li>Processing natural language scripts into comic structures.</li>
              <li>Maintaining your dedicated <span className="text-purple-400">"My Creations"</span> persistence workspace gallery.</li>
              <li>Managing account sessions and addressing specific feature support requests.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <span className="text-purple-500">3.</span> AI Engine Data Sharing
            </h2>
            <p className="text-slate-400">
              EduComic <span className="font-medium text-slate-200">does not sell, broker, or rent user profiles</span> to advertiser data networks. Your structural comic text descriptions are securely dispatched via internal API pipelines to deep machine learning rendering infrastructures to return image canvas outputs.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <span className="text-purple-500">4.</span> Storage Security & Deletion
            </h2>
            <p className="text-slate-400">
              All records run across protected secure backend instances. Users retain full rights over their production traces. You may terminate data state links at any time by issuing an account removal command inside your dashboard parameters or reaching out to our administrative hub.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}