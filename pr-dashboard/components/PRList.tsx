import { formatDistanceToNow } from "date-fns";

export default function PRList({ prs, loading }: any) {
  if (loading) return (
    <div className="flex flex-col items-center justify-center p-20 text-slate-500 bg-white rounded-xl border">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
      <p>Fetching GitHub data...</p>
    </div>
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border overflow-hidden min-h-75">
      <ul className="divide-y divide-slate-100">
        {prs.map((pr: any) => (
          <li key={pr.id} className="p-5 hover:bg-slate-50 transition-colors group">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-blue-600 font-mono text-sm">#{pr.number}</span>
              <h3 className="font-semibold text-slate-900 group-hover:text-blue-700">
                <a href={pr.html_url} target="_blank" rel="noreferrer">{pr.title}</a>
              </h3>
            </div>
            <div className="text-sm text-slate-500">
              opened {formatDistanceToNow(new Date(pr.created_at))} ago by <strong>{pr.user.login}</strong>
            </div>
            <div className="flex gap-2 mt-3">
              {pr.labels.map((l: any) => (
                <span key={l.name} className="text-[11px] px-2 py-0.5 rounded-full border" 
                  style={{ backgroundColor: `#${l.color}15`, borderColor: `#${l.color}`, color: `#${l.color}` }}>
                  {l.name}
                </span>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}