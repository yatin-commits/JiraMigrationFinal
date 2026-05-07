export default function ProjectFilter({
  value,
  onChange,
  projects = [],
  disabled = false
}) {
  return (
    <div className="flex flex-col gap-1 w-full sm:w-64">
      <label className="text-xs font-semibold uppercase text-gray-500">
        Project
      </label>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={`
          rounded-lg border border-gray-200/70 bg-white/80 px-3 py-2 text-sm text-gray-800
          shadow-sm ring-1 ring-black/5 backdrop-blur supports-[backdrop-filter]:bg-white/60
          focus:outline-none
          focus-visible:ring-2
          focus-visible:ring-blue-500/20
          focus-visible:border-blue-400
          ${disabled ? "opacity-50 cursor-not-allowed bg-gray-100/60" : ""}
        `}
      >
        <option value="">All Projects</option>

        {projects.map((project) => (
          <option key={project.key} value={project.key}>
            {project.name}
          </option>
        ))}
      </select>
    </div>
  );
}
