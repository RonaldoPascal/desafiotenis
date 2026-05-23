interface StatsCardProps {
  value: string | number
  label: string
  color?: 'tennis' | 'clay' | 'white'
}

export function StatsCard({ value, label, color = 'white' }: StatsCardProps) {
  const colorClass = {
    tennis: 'text-tennis',
    clay: 'text-orange-400',
    white: 'text-white',
  }[color]

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-sm">
      <p className={`font-display font-black text-3xl ${colorClass}`}>{value}</p>
      <p className="text-white/50 text-xs mt-1 uppercase tracking-wider">{label}</p>
    </div>
  )
}
