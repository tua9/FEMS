"use client";

export function IssueForm() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div>
        <label className="text-muted-foreground mb-2 block text-xs font-bold tracking-wider uppercase">
          Issue Description
        </label>
        <textarea
          className="border-border bg-secondary text-foreground placeholder:text-muted-foreground focus:border-accent focus:ring-accent h-48 w-full resize-none rounded-xl border p-4 text-sm transition-colors focus:ring-1 focus:outline-none"
          placeholder="Describe the issue (e.g., 'Slippery floor near stairs', 'Leaking faucet', 'Broken chair')."
        />
      </div>
      <div>
        <label className="text-muted-foreground mb-2 block text-xs font-bold tracking-wider uppercase">
          Visual Evidence
        </label>
        <div className="relative h-48 overflow-hidden rounded-xl">
          <img
            src="/images/camera-live-view.jpg"
            alt="Camera live view for capturing visual evidence"
            className="object-cover"
          />
          <div className="from-foreground/60 absolute right-0 bottom-0 left-0 flex items-center justify-center gap-4 bg-gradient-to-t to-transparent p-4">
            <button
              className="bg-card/20 text-primary-foreground hover:bg-card/30 flex h-9 w-9 items-center justify-center rounded-full backdrop-blur-sm transition-colors"
              aria-label="Switch camera"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
                <circle cx="12" cy="13" r="3" />
              </svg>
            </button>
            <button
              className="border-primary-foreground bg-card/20 hover:bg-card/30 flex h-12 w-12 items-center justify-center rounded-full border-2 backdrop-blur-sm transition-colors"
              aria-label="Capture photo"
            >
              <div className="bg-primary-foreground h-9 w-9 rounded-full" />
            </button>
            <button
              className="bg-card/20 text-primary-foreground hover:bg-card/30 flex h-9 w-9 items-center justify-center rounded-full backdrop-blur-sm transition-colors"
              aria-label="Toggle flash"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
            </button>
          </div>
          <div className="text-primary-foreground absolute top-3 right-3 rounded-md bg-red-500 px-2 py-0.5 text-[10px] font-bold uppercase">
            Live View
          </div>
        </div>
      </div>
    </div>
  );
}
