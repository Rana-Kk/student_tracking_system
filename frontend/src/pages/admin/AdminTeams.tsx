import { TEAMS, GROUPS } from '../../data/mockData'

export default function AdminTeams() {
  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold" style={{ fontFamily: 'Outfit, sans-serif' }}>Teams</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{TEAMS.length} teams across {GROUPS.length} groups</p>
        </div>
      </div>

      <div className="space-y-4">
        {GROUPS.map((g) => {
          const groupTeams = TEAMS.filter((t) => t.groupId === g.id)
          if (groupTeams.length === 0) return null
          return (
            <div key={g.id} className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
              <div className="px-5 py-3.5 flex items-center gap-3" style={{ background: 'var(--muted)', borderBottom: '1px solid var(--border)' }}>
                <span className="text-xs font-semibold mono px-2 py-0.5 rounded-full" style={{ background: '#DBEAFE', color: '#1E40AF' }}>{g.name}</span>
                <span className="text-sm font-medium">{g.courseName}</span>
                <span className="text-xs ml-auto" style={{ color: 'var(--muted-foreground)' }}>{groupTeams.length} team{groupTeams.length !== 1 ? 's' : ''}</span>
              </div>
              <div className="divide-y" style={{ '--tw-divide-opacity': 1 } as React.CSSProperties}>
                {groupTeams.map((team) => (
                  <div key={team.id} className="px-5 py-4 flex items-center gap-5" style={{ borderTop: '1px solid var(--border)' }}>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold" style={{ background: '#EDE9FE', color: '#6D28D9' }}>
                      {team.name.charAt(team.name.lastIndexOf(' ') + 1)}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold">{team.name}</p>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {team.memberNames.map((name) => (
                          <span key={name} className="text-xs px-2 py-0.5 rounded" style={{ background: 'var(--secondary)', color: 'var(--muted-foreground)' }}>{name}</span>
                        ))}
                      </div>
                    </div>
                    <span className="text-sm mono" style={{ color: 'var(--muted-foreground)' }}>{team.memberNames.length} members</span>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
