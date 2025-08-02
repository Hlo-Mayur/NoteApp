'use client';

import { useState } from 'react';
import type { Note } from '@/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tag, Clock, Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogFooter
} from "@/components/ui/dialog"
import { cn } from '@/lib/utils';
import { ScrollArea } from './ui/scroll-area';

interface NoteCardProps {
  note: Note;
  onDelete: (id: string) => void;
  onTagClick: (tag: string) => void;
  activeTag: string | null;
  animationDelay?: number;
}

const tagColors = [
  "bg-blue-500/20 text-blue-300 border-blue-500/30 hover:bg-blue-500/30",
  "bg-green-500/20 text-green-300 border-green-500/30 hover:bg-green-500/30",
  "bg-yellow-500/20 text-yellow-300 border-yellow-500/30 hover:bg-yellow-500/30",
  "bg-red-500/20 text-red-300 border-red-500/30 hover:bg-red-500/30",
  "bg-purple-500/20 text-purple-300 border-purple-500/30 hover:bg-purple-500/30",
  "bg-pink-500/20 text-pink-300 border-pink-500/30 hover:bg-pink-500/30",
];

const getTagColor = (tag: string, allTags: string[]) => {
  const index = allTags.indexOf(tag);
  return tagColors[index % tagColors.length];
};

const capitalize = (s: string) => {
  if (typeof s !== 'string' || s.length === 0) return ''
  return s.charAt(0).toUpperCase() + s.slice(1)
}

export function NoteCard({ note, onDelete, onTagClick, activeTag, animationDelay = 0 }: NoteCardProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const formattedDate = new Date(note.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  
  const allNoteTags = note.tags;

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <Card 
        className="flex flex-col transition-all duration-300 hover:shadow-lg hover:-translate-y-1 animate-in fade-in"
        style={{ animationDelay: `${animationDelay}ms` }}
      >
        <DialogTrigger asChild>
          <div className="flex-grow cursor-pointer">
            <CardHeader>
              <CardTitle className="line-clamp-2">{note.title || "Untitled Note"}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap text-base text-muted-foreground line-clamp-4">{note.content}</p>
            </CardContent>
          </div>
        </DialogTrigger>

        <CardFooter className="flex flex-col items-start gap-4 pt-4">
            <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="mr-2 h-4 w-4" />
                <span>{formattedDate}</span>
            </div>
          {note.tags.length > 0 && (
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4 text-primary" />
              <div className="flex flex-wrap gap-1">
                {note.tags.map(tag => (
                  <Badge 
                    key={tag} 
                    variant={activeTag === tag ? "default" : "secondary"} 
                    className={cn(
                      "font-normal cursor-pointer transition-colors",
                      activeTag !== tag && getTagColor(tag, allNoteTags),
                      activeTag === tag && "bg-primary text-primary-foreground"
                    )}
                    onClick={(e) => {
                      e.stopPropagation();
                      onTagClick(tag)
                    }}
                  >
                    {capitalize(tag)}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="ml-auto text-destructive hover:bg-destructive/10 hover:text-destructive"
                onClick={(e) => e.stopPropagation()}
                >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent onClick={(e) => e.stopPropagation()}>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your note.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => onDelete(note.id)}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardFooter>
      </Card>
      
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{note.title || "Untitled Note"}</DialogTitle>
          <div className="flex items-center text-muted-foreground font-normal text-sm pt-2">
            <Clock className="mr-2 h-4 w-4" />
            <span>{formattedDate}</span>
          </div>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] pr-6">
            <p className="whitespace-pre-wrap text-base py-4">{note.content}</p>
        </ScrollArea>
        <DialogFooter className="flex-col items-start gap-4 sm:flex-col sm:items-start">
             {note.tags.length > 0 && (
                <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-primary" />
                    <div className="flex flex-wrap gap-1">
                    {note.tags.map(tag => (
                        <Badge 
                            key={tag} 
                            variant={"secondary"} 
                            className={cn("font-normal", getTagColor(tag, allNoteTags))}
                        >
                        {capitalize(tag)}
                        </Badge>
                    ))}
                    </div>
                </div>
            )}
            <DialogClose asChild>
              <Button type="button" variant="secondary" className="ml-auto">
                Close
              </Button>
            </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
