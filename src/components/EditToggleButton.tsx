'use client';

import { Edit, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEditMode } from './EditModeProvider';

export default function EditToggleButton() {
  const { isEditMode, toggleEditMode, isOwner } = useEditMode();

  if (!isOwner) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        onClick={toggleEditMode}
        className={`rounded-full p-4 shadow-lg ${
          isEditMode
            ? 'bg-green-600 hover:bg-green-700 text-white'
            : 'bg-brand hover:bg-brand-hover text-white'
        }`}
        size="lg"
      >
        {isEditMode ? (
          <>
            <Save className="w-5 h-5 mr-2" />
            Save Changes
          </>
        ) : (
          <>
            <Edit className="w-5 h-5 mr-2" />
            Edit Page
          </>
        )}
      </Button>
    </div>
  );
}