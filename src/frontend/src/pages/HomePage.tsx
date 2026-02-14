import HeartParticles from '../components/HeartParticles';
import { Heart, ArrowRight } from 'lucide-react';
import { Link } from '@tanstack/react-router';

export default function HomePage() {
  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(/assets/generated/valentine-hero-bg.dim_1920x1080.png)'
          }}
        >
          <div className="absolute inset-0 romantic-gradient opacity-60" />
        </div>

        {/* Heart Particles */}
        <HeartParticles />

        {/* Content */}
        <div className="relative z-10 text-center px-4 animate-fadeIn">
          <Heart className="w-20 h-20 text-primary fill-primary mx-auto mb-6 animate-heartbeat" />
          <h1 className="font-script text-5xl md:text-7xl lg:text-8xl text-primary mb-6 drop-shadow-lg">
            For My Special One
          </h1>
          <p className="text-xl md:text-2xl text-foreground/80 max-w-2xl mx-auto mb-8 font-sans">
            A collection of our beautiful moments, heartfelt messages, and cherished memories
          </p>
          <Link
            to="/memories"
            className="inline-flex items-center gap-2 rose-gold-gradient text-white px-8 py-4 rounded-full text-lg font-medium hover:shadow-romantic transition-all"
          >
            Explore Our Journey
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Divider */}
      <div className="relative h-24 flex items-center justify-center">
        <img
          src="/assets/generated/rose-gold-divider.dim_1600x200.png"
          alt=""
          className="w-full max-w-2xl h-auto opacity-60"
        />
      </div>

      {/* Quick Links Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <QuickLinkCard
            to="/memories"
            title="Our Memories"
            description="Browse through our beautiful photo gallery"
            icon="📸"
          />
          <QuickLinkCard
            to="/messages"
            title="Love Messages"
            description="Read heartfelt notes and letters"
            icon="💌"
          />
          <QuickLinkCard
            to="/timeline"
            title="Our Timeline"
            description="Journey through our special moments"
            icon="⏰"
          />
          <QuickLinkCard
            to="/surprise"
            title="Interactive Surprise"
            description="Fun activities and surprises"
            icon="✨"
          />
          <QuickLinkCard
            to="/dedication"
            title="Final Dedication"
            description="A special message just for you"
            icon="💝"
          />
          <QuickLinkCard
            to="/edit"
            title="Edit Content"
            description="Manage and update your content"
            icon="✏️"
          />
        </div>
      </section>
    </div>
  );
}

interface QuickLinkCardProps {
  to: string;
  title: string;
  description: string;
  icon: string;
}

function QuickLinkCard({ to, title, description, icon }: QuickLinkCardProps) {
  return (
    <Link
      to={to}
      className="group bg-card rounded-2xl p-6 border border-border/50 hover:shadow-romantic transition-all hover:-translate-y-1"
    >
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
        {title}
      </h3>
      <p className="text-muted-foreground">{description}</p>
    </Link>
  );
}
