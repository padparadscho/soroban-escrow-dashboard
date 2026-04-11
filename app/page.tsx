// SPDX-FileCopyrightText: 2026 Padparadscho <contact@padparadscho.com>
// SPDX-License-Identifier: GPL-3.0-only

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-50 dark:bg-zinc-950 font-mono">
      <h1 className="flex items-center gap-4 text-2xl font-medium text-zinc-900 dark:text-zinc-100">
        <span>🚧</span>
        <span>Work in progress...</span>
      </h1>
      <a
        href="https://github.com/padparadscho/soroban-escrow-dashboard"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm underline transition-colors"
      >
        GitHub
      </a>
    </div>
  );
}
