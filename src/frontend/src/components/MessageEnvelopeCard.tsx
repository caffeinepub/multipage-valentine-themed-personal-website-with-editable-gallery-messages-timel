import { useState } from 'react';
import { Mail, X } from 'lucide-react';
import type { LoveMessage } from '../backend';

interface MessageEnvelopeCardProps {
  message: LoveMessage;
}

export default function MessageEnvelopeCard({ message }: MessageEnvelopeCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (isOpen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fadeIn">
        <div className="w-full max-w-2xl bg-card rounded-2xl shadow-romantic p-8 max-h-[80vh] overflow-y-auto">
          <div className="flex items-start justify-between mb-6">
            <h3 className="font-script text-3xl text-primary">{message.title}</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-accent rounded-lg transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="prose prose-lg max-w-none">
            <p className="text-foreground whitespace-pre-wrap font-serif leading-relaxed">
              {message.fullText}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => setIsOpen(true)}
      className="group bg-card rounded-2xl p-6 border border-border/50 hover:shadow-romantic transition-all hover:-translate-y-1 text-left w-full"
    >
      <div className="flex items-center gap-4 mb-4">
        <img
          src="/assets/generated/love-envelope-icon.dim_512x512.png"
          alt=""
          className="w-12 h-12 opacity-80 group-hover:opacity-100 transition-opacity"
        />
        <h3 className="font-script text-2xl text-primary group-hover:text-primary/80 transition-colors">
          {message.title}
        </h3>
      </div>
      <p className="text-muted-foreground line-clamp-3">{message.preview}</p>
      <p className="text-sm text-primary mt-4 flex items-center gap-2">
        <Mail className="w-4 h-4" />
        Click to read
      </p>
    </button>
  );
}
