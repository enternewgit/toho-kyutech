"use client";

import { ActivityItem } from '@/lib/activities';

interface ActivityTimelineProps {
  activities: ActivityItem[];
  compact?: boolean;
}

export function ActivityTimeline({ activities, compact = false }: ActivityTimelineProps) {
  if (activities.length === 0) {
    return (
      <div className="text-gray-500 text-center p-4">
        活動記録がありません。
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {activities.map((activity) => (
        <div key={activity.id} className="flex gap-2 p-3 border rounded-lg hover:bg-gray-50 transition-colors bg-white">
          <div className="flex-shrink-0 w-16 text-xs text-gray-600 font-mono">
            {new Date(activity.date).toLocaleDateString('ja-JP', {
              year: '2-digit',
              month: '2-digit',
              day: '2-digit'
            })}
          </div>
          
          <div className="flex-grow">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-gray-800 text-sm">{activity.title}</h3>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                {activity.type}
              </span>
            </div>
            
            {activity.description && (
              <p className="text-gray-600 text-xs leading-relaxed">{activity.description}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
