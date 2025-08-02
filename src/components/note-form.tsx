'use client';

import { useState, useTransition, useRef } from 'react';
import { createNoteWithTags } from '@/app/actions';
import type { Note } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Sparkles } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useSidebar } from './ui/sidebar-new';

interface NoteFormProps {
  onNoteCreated: (note: Note) => void;
}

export function NoteForm({ onNoteCreated }: NoteFormProps) {
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();
  const { isMobile, setOpenMobile } = useSidebar();


  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;

    if (!title.trim() && !content.trim()) {
      toast({
        title: "Heads up!",
        description: "Your note needs a title or some content.",
        variant: "destructive",
      })
      return;
    }

    startTransition(async () => {
      try {
        const newNote = await createNoteWithTags(title, content);
        onNoteCreated(newNote);
        formRef.current?.reset();
        if(isMobile) {
          setOpenMobile(false);
        }
        toast({
            title: "Note Created!",
            description: "Your new note has been saved with AI tags.",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to create note. Please try again.",
          variant: "destructive",
        })
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} ref={formRef} className="flex flex-col h-full p-2">
      <div className="p-2">
        <Input
            name="title"
            placeholder="Note title..."
            className="text-lg font-semibold w-full border-0 shadow-none focus-visible:ring-0 px-2"
            disabled={isPending}
        />
      </div>
        <div className="flex-grow p-2">
            <Textarea
                name="content"
                placeholder="What's on your mind? Type your note here and we'll suggest tags for you..."
                rows={10}
                className="text-base w-full h-full resize-none border-0 shadow-none focus-visible:ring-0"
                disabled={isPending}
            />
        </div>
        <div className="mt-4 p-2">
            <Button type="submit" disabled={isPending} className="w-full bg-primary hover:bg-primary/90">
                {isPending ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                </>
                ) : (
                <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Save Note
                </>
                )}
            </Button>
        </div>
    </form>
  );
}
