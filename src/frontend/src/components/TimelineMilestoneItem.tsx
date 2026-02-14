import { useState } from 'react';
import { Heart, ChevronDown, ChevronUp } from 'lucide-react';
import type { TimelineMilestone } from '../backend';

interface TimelineMilestoneItemProps {
  milestone: TimelineMilestone;
  isEven: boolean;
}

export default function TimelineMilestoneItem({ milestone, isEven }: TimelineMilestoneItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const date = new Date(Number(milestone.date) / 1000000);
  const formattedDate = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className={`relative flex items-start gap-8 ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
      {/* Timeline dot */}
      <div className="absolute left-8 md:left-1/2 -translate-x-1/2 w-4 h-4 bg-primary rounded-full border-4 border-background z-10" />
      
      {/* Content */}
      <div className={`flex-1 ${isEven ? 'md:text-right md:pr-12' : 'md:pl-12'} pl-16 md:pl-0`}>
        <div className="bg-card rounded-2xl p-6 shadow-soft border border-border/50 animate-fadeIn">
          <div className="flex items-center gap-2 mb-2 text-sm text-primary font-medium">
            <Heart className="w-4 h-4 fill-primary" />
            <span>{formattedDate}</span>
          </div>
          
          <h3 className="font-script text-2xl text-foreground mb-3">{milestone.title}</h3>
          
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 mb-3"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="w-4 h-4" />
                <span className="text-sm">Show less</span>
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4" />
                <span className="text-sm">Read more</span>
              </>
            )}
          </button>
          
          {isExpanded && (
            <div className="space-y-4 animate-fadeIn">
              <p className="text-foreground/80 whitespace-pre-wrap">{milestone.description}</p>
              
              {milestone.photo && (
                <div className="rounded-xl overflow-hidden">
                  <img
                    src={milestone.photo.getDirectURL()}
                    alt={milestone.title}
                    className="w-full h-auto"
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Spacer for alignment */}
      <div className="hidden md:block flex-1" />
    </div>
  );
}
