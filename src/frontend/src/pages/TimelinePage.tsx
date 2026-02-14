import { useGetAllTimelineMilestones } from '../hooks/useQueries';
import TimelineMilestoneItem from '../components/TimelineMilestoneItem';
import { Heart, Clock } from 'lucide-react';

export default function TimelinePage() {
  const { data: milestones, isLoading } = useGetAllTimelineMilestones();

  const sortedMilestones = milestones
    ? [...milestones].sort((a, b) => Number(a.date) - Number(b.date))
    : [];

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Heart className="w-12 h-12 text-primary fill-primary animate-heartbeat" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12 animate-fadeIn">
        <Clock className="w-12 h-12 text-primary mx-auto mb-4" />
        <h1 className="font-script text-4xl md:text-5xl text-primary mb-4">Our Timeline</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          A journey through our most precious moments together
        </p>
      </div>

      {sortedMilestones.length === 0 ? (
        <div className="text-center py-16">
          <Clock className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
          <p className="text-muted-foreground">No milestones yet. Start documenting your journey!</p>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-primary/30" />
            
            {/* Milestones */}
            <div className="space-y-12">
              {sortedMilestones.map((milestone, index) => (
                <TimelineMilestoneItem
                  key={milestone.id}
                  milestone={milestone}
                  isEven={index % 2 === 0}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
