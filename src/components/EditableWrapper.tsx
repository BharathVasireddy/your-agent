'use client';

import { useState, useEffect } from 'react';
import { Edit2, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useEditMode } from './EditModeProvider';

interface EditableWrapperProps {
  children: React.ReactNode;
  value: string;
  onSave: (newValue: string) => Promise<void>;
  type?: 'text' | 'textarea' | 'title' | 'subtitle';
  placeholder?: string;
  className?: string;
}

export default function EditableWrapper({
  children,
  value,
  onSave,
  type = 'text',
  placeholder = 'Enter text...',
  className = ''
}: EditableWrapperProps) {
  const { isEditMode } = useEditMode();
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  const handleSave = async () => {
    if (editValue.trim() === value.trim()) {
      setIsEditing(false);
      return;
    }

    setIsSaving(true);
    try {
      await onSave(editValue.trim());
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to save:', error);
      // Reset to original value on error
      setEditValue(value);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
  };

  if (!isEditMode) {
    return <>{children}</>;
  }

  if (isEditing) {
    return (
      <div className="relative group">
        <div className="flex items-center gap-2">
          {type === 'textarea' ? (
            <Textarea
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              placeholder={placeholder}
              className={`w-full ${className}`}
              rows={4}
              autoFocus
            />
          ) : (
            <Input
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              placeholder={placeholder}
              className={`w-full ${className}`}
              autoFocus
            />
          )}
          <div className="flex gap-1">
            <Button
              size="sm"
              onClick={handleSave}
              disabled={isSaving}
              className="bg-green-600 hover:bg-green-700 text-white p-2"
            >
              <Check className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleCancel}
              disabled={isSaving}
              className="p-2"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative group">
      <div className={className}>
        {children}
      </div>
      <button
        onClick={() => setIsEditing(true)}
        className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-red-600 hover:bg-red-700 text-white rounded-full p-1.5 shadow-lg"
        title="Edit this text"
      >
        <Edit2 className="w-3 h-3" />
      </button>
    </div>
  );
}