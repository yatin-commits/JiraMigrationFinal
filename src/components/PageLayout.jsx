export default function PageLayout({ title, children }) {
  return (
    <div className="w-full max-w-screen mx-auto px-4 sm:px-6 py-6">
      {title ? (
        <h2 className="text-lg font-bold text-[#172b4d] mb-4">{title}</h2>
      ) : null}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        {children}
      </div>
    </div>
  )
}