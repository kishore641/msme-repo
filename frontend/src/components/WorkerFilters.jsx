import { SlidersHorizontal, Zap, Droplets, Wrench, Settings, Hammer, Paintbrush, Sparkles, Laptop, Truck, Users } from 'lucide-react';

const skillsList = [
  { id: 'all', name: 'All Skills', icon: null },
  { id: 'electrical', name: 'Electrical', icon: Zap },
  { id: 'plumbing', name: 'Plumbing', icon: Droplets },
  { id: 'welding', name: 'Welding', icon: Wrench },
  { id: 'mechanical', name: 'Mechanical', icon: Settings },
  { id: 'construction', name: 'Construction', icon: Hammer },
  { id: 'painting', name: 'Painting', icon: Paintbrush },
  { id: 'cleaning', name: 'Cleaning', icon: Sparkles },
  { id: 'installation', name: 'Installation', icon: Laptop },
  { id: 'transport', name: 'Transport', icon: Truck },
  { id: 'general', name: 'General Labor', icon: Users },
];

export default function WorkerFilters({ filters, setFilters }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #EEF2FF, #DDD6FE)' }}>
          <SlidersHorizontal className="w-4 h-4 text-indigo-600" />
        </div>
        <h2 className="font-bold text-gray-900 text-base">Search Filters</h2>
      </div>

      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Skill Type</p>
        <div className="flex flex-wrap gap-2">
          {skillsList.map(({ id, name, icon: Icon }) => {
            const isSelected = filters.skill === id;
            return (
              <button
                key={id}
                onClick={() => setFilters({ ...filters, skill: id })}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold border transition-all duration-200 ${
                  isSelected
                    ? 'border-indigo-500 text-indigo-700 shadow-sm shadow-indigo-100'
                    : 'border-gray-200 text-gray-600 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50/50'
                }`}
                style={isSelected ? { background: 'linear-gradient(135deg, #EEF2FF, #E0E7FF)' } : { background: 'white' }}
              >
                {Icon && <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-indigo-600' : 'text-gray-400'}`} />}
                {name}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
