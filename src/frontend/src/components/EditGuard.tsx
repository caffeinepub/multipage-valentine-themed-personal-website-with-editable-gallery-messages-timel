import { ReactNode } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import ProfileSetupModal from './ProfileSetupModal';
import { Heart, Lock } from 'lucide-react';
import LoginButton from './LoginButton';

interface EditGuardProps {
  children: ReactNode;
}

export default function EditGuard({ children }: EditGuardProps) {
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();

  const isAuthenticated = !!identity;
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  if (!isAuthenticated) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <div className="text-center max-w-md animate-fadeIn">
          <Lock className="w-16 h-16 text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-script text-primary mb-4">Login Required</h2>
          <p className="text-muted-foreground mb-6">
            Please login to edit and manage your Valentine's website content.
          </p>
          <LoginButton />
        </div>
      </div>
    );
  }

  if (showProfileSetup) {
    return <ProfileSetupModal onComplete={() => {}} />;
  }

  if (profileLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Heart className="w-12 h-12 text-primary fill-primary animate-heartbeat" />
      </div>
    );
  }

  return <>{children}</>;
}
