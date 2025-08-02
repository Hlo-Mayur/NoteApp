'use server';

import { suggestTags } from '@/ai/flows/suggest-tags';
import type { Note } from '@/types';

export async function createNoteWithTags(title: string, content: string): Promise<Note> {
  if (!title.trim() && !content.trim()) {
    throw new Error('Note title and content cannot be empty.');
  }

  try {
    const noteTextForTags = `${title}\n\n${content}`;
    const { tags } = await suggestTags({ noteContent: noteTextForTags });
    
    const newNote: Note = {
      id: crypto.randomUUID(),
      title,
      content,
      tags: tags || [],
      createdAt: new Date().toISOString(),
    };
    
    return newNote;
  } catch (error) {
    console.error("Failed to get tag suggestions:", error);
    // Return a note with empty tags as a fallback
    const newNote: Note = {
      id: crypto.randomUUID(),
      title,
      content,
      tags: [],
      createdAt: new Date().toISOString(),
    };
    return newNote;
  }
}
