import { BookOpen, Rocket, FileText, Calendar } from 'lucide-react';
import type { Profile } from '../pages/teacher/profileBuilderSections/profileBuilderTypes';

type RecentActivityProps = {
  profile: Profile;
};

export default function GlobalRecentActivity({ profile }: RecentActivityProps) {
  const parseYear = (value: string) => Number.parseInt(value, 10) || 0;

  // 1. Collect everything from the profile object
  const allActivities = [
    // Qualifications
    ...(profile.qualifications || []).map((q) => ({
      title: q.degree || q.educationlevel,
      subtitle: q.institution,
      date: q.yearofpassing,
      icon: <BookOpen size={16} className="text-blue-500" />,
      color: 'bg-blue-50'
    })),
    
    // Research Projects / Publications
    ...(profile.publications || []).map((p) => ({
      title: p.title,
      subtitle: 'Publication',
      date: p.year,
      icon: <FileText size={16} className="text-purple-500" />,
      color: 'bg-purple-50'
    })),

    // Add your workshops or other sections here
    ...(profile.projects || []).map((project) => ({
      title: project.title,
      subtitle: 'Research Project',
      date: project.year,
      icon: <Rocket size={16} className="text-orange-500" />,
      color: 'bg-orange-50'
    }))
  ];

  // 2. Sort by year descending
  const sortedActivities = allActivities
    .filter((a) => a.title) // Only show items that have a title
    .sort((a, b) => parseYear(b.date) - parseYear(a.date))
    .slice(0, 6);

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-800">Overall Activity</h3>
        <Calendar size={18} className="text-gray-400" />
      </div>

      <div className="space-y-5 flex-1 overflow-y-auto pr-2">
        {sortedActivities.length > 0 ? (
          sortedActivities.map((item, index) => (
            <div key={index} className="flex gap-4 group relative">
              {/* Timeline Connector */}
              {index !== sortedActivities.length - 1 && (
                <div className="absolute left-[19px] top-10 bottom-[-20px] w-[2px] bg-gray-50" />
              )}
              
              <div className={`p-2.5 ${item.color} rounded-lg z-10`}>
                {item.icon}
              </div>
              
              <div className="flex-1 border-b border-gray-50 pb-4 group-last:border-0">
                <p className="text-sm font-bold text-gray-800 leading-tight">
                  {item.title}
                </p>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-xs text-gray-500">{item.subtitle}</span>
                  <span className="text-[10px] font-mono text-gray-400 bg-gray-50 px-1.5 rounded">
                    {item.date}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-10">
            <p className="text-sm text-gray-400 italic">Start adding details to see your timeline.</p>
          </div>
        )}
      </div>
    </div>
  );
}