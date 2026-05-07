export default function Pagination({ page, setPage, totalPages }) {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200/60 bg-gray-50/60">
      <span className="text-xs text-gray-500">
        Page {page} of {totalPages}
      </span>
      <div className="flex gap-2">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="px-3 py-1.5 text-xs font-semibold border border-gray-200/70 rounded-lg bg-white/80 text-gray-800 shadow-sm ring-1 ring-black/5 hover:bg-gray-50/80 disabled:opacity-40 disabled:cursor-not-allowed transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/20"
        >
          ← Prev
        </button>
        <button
          disabled={page === totalPages || totalPages === 0}
          onClick={() => setPage(page + 1)}
          className="px-3 py-1.5 text-xs font-semibold border border-gray-200/70 rounded-lg bg-white/80 text-gray-800 shadow-sm ring-1 ring-black/5 hover:bg-gray-50/80 disabled:opacity-40 disabled:cursor-not-allowed transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/20"
        >
          Next →
        </button>
      </div>
    </div>
  )
}