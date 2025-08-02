'use client';

import { useState, useMemo } from 'react';
import type { Note } from '@/types';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { NoteForm } from '@/components/note-form';
import { NoteCard } from '@/components/note-card';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, PenSquare, X, Tag } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarTitle,
  SidebarTrigger,
} from '@/components/ui/sidebar-new';

const capitalize = (s: string) => {
  if (typeof s !== 'string' || s.length === 0) return ''
  return s.charAt(0).toUpperCase() + s.slice(1)
}

export default function Home() {
  const [notes, setNotes] = useLocalStorage<Note[]>('notes', []);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const handleNoteCreated = (newNote: Note) => {
    setNotes(prevNotes => [newNote, ...prevNotes]);
    setActiveTag(null);
    setSearchTerm('');
  };

  const handleDeleteNote = (id: string) => {
    setNotes(prevNotes => prevNotes.filter(note => note.id !== id));
  };
  
  const handleTagClick = (tag: string) => {
    if (activeTag === tag) {
      setActiveTag(null); // Deselect if the same tag is clicked again
    } else {
      setActiveTag(tag);
      setSearchTerm(''); // Clear search term when a tag is selected
    }
  }

  const filteredNotes = useMemo(() => {
    let filtered = notes;

    if (activeTag) {
      filtered = filtered.filter(note => note.tags.includes(activeTag));
    }
    
    if(searchTerm) {
      const lowercasedTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(note =>
        note.title.toLowerCase().includes(lowercasedTerm) ||
        note.content.toLowerCase().includes(lowercasedTerm) ||
        note.tags.some(tag => tag.toLowerCase().includes(lowercasedTerm))
      );
    }

    return filtered;

  }, [notes, searchTerm, activeTag]);

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <SidebarTitle>New Note</SidebarTitle>
        </SidebarHeader>
        <SidebarContent className="p-0">
          <NoteForm onNoteCreated={handleNoteCreated} />
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <main className="flex min-h-screen flex-col p-4 md:p-8 lg:p-12">
          <div className="flex items-center justify-between mb-12 gap-4 flex-wrap">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <h1 className="text-2xl font-bold text-foreground">My Notes</h1>
            </div>
            <div className="flex items-center gap-4">
              {activeTag && (
                <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Filtering by:</span>
                    <Button variant="secondary" size="sm" onClick={() => setActiveTag(null)}>
                        <Tag className="mr-2 h-4 w-4" />
                        {capitalize(activeTag)}
                        <X className="ml-2 h-4 w-4"/>
                    </Button>
                </div>
              )}
              <div className="relative w-full max-w-xs">
                <Input
                  placeholder="Search notes..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value)
                    setActiveTag(null);
                  }}
                  className="pl-10"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNotes.length > 0 ? (
              filteredNotes.map((note, index) => (
                <NoteCard key={note.id} note={note} onDelete={handleDeleteNote} onTagClick={handleTagClick} activeTag={activeTag} animationDelay={index * 100} />
              ))
            ) : (
              <div className="col-span-full">
                <Card className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground bg-secondary/50 border-dashed">
                  <PenSquare className="h-12 w-12 mb-4" />
                  <h3 className="text-lg font-semibold">
                    {activeTag ? 'No notes with this tag' : (searchTerm ? 'No notes found' : 'No notes yet!')}
                  </h3>
                  <p className="text-sm">
                    {activeTag || searchTerm ? 'Try a different search or clear the filter.' : 'Start by writing a new note in the sidebar.'}
                  </p>
                </Card>
              </div>
            )}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
