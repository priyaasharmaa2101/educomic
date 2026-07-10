
export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-black text-slate-300 py-16 px-4 md:px-16 lg:px-24 xl:px-32 selection:bg-purple-500/30">
      <div className="max-w-3xl mx-auto">
        
        {/* Header Section */}
        <div className="mb-12 border-b border-zinc-900 pb-6">
          <a href="/" className="text-purple-400 hover:text-purple-300 text-sm font-medium transition flex items-center gap-2 mb-4">
            ← Back to Home
          </a>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Terms of Service</h1>
          <p className="text-sm text-zinc-500">Last updated: May 24, 2026</p>
        </div>

        {/* Content Body */}
        <div className="space-y-8 text-sm md:text-base leading-relaxed">
          
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <span className="text-purple-500">1.</span> Acceptance of Framework
            </h2>
            <p className="text-slate-400">
              By instantiating an account or using the EduComic generative engine tools, you agree to comply with and stay legally bound to these operational protocols. If you do not accept these parameters, you may not make requests to the generative services.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <span className="text-purple-500">2.</span> Content Submission Boundaries
            </h2>
            <p className="text-slate-400">
              Users hold absolute authorship over input seed ideas. However, when using the interface canvas, users agree <span className="text-red-400 font-medium">never to input scripts designed to generate:</span>
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-400">
              <li>Malicious, safe-boundary-violating, or highly graphic visual output payloads.</li>
              <li>Prompts that systematically infringe upon protected properties or artistic copyrights.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <span className="text-purple-500">3.</span> Usage Limits & Automation
            </h2>
            <p className="text-slate-400">
              To preserve processing capability for all creative operators, the deployment of scraping engines, bot scripts, or malicious loop routines intended to intentionally burden or bypass AI generation boundaries is strictly forbidden.
            </p>
          </section>

          <section className="space-y-3 text-zinc-400">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <span className="text-purple-500">4.</span> Operational "As-Is" Disclaimer
            </h2>
            <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-4 text-sm text-zinc-400 italic">
              "EduComic provides structural operations on an 'as-is' baseline framework. We offer no structural guarantees that AI image models will consistently interpret instructions perfectly, nor that database state elements will enjoy interrupted 100% cloud up-times without maintenance periods."
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <span className="text-purple-500">5.</span> Scope of Liability
            </h2>
            <p className="text-slate-400">
              EduComic and its developer operators shall not be held liable for generation cache loss, transient prompt rendering glitches, or algorithmic bugs tracking back to structural third-party platform API model delivery clusters.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}