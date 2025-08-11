import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <Loader2 className="w-8 h-8 text-brand animate-spin" />
        </div>
        <p className="text-zinc-600 font-medium">Loading...</p>
      </div>
    </div>
  );
}