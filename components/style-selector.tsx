'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Palette, Home, Briefcase, Coffee, Ghost, Sun } from 'lucide-react';

interface StyleSelectorProps {
    currentStyle: string;
    onStyleSelect: (style: string) => void;
    className?: string;
}

const styles = [
    { id: 'Modern', label: 'Modern', icon: Home, description: 'Clean lines, minimalism' },
    { id: 'Scandinavian', label: 'Scandinavian', icon: Sun, description: 'Light, cozy, natural' },
    { id: 'Industrial', label: 'Industrial', icon: Briefcase, description: 'Raw, urban, edgy' },
    { id: 'Bohemian', label: 'Bohemian', icon: Coffee, description: 'Eclectic, colorful' },
    { id: 'Minimalist', label: 'Minimalist', icon: Ghost, description: 'Less is more' },
    { id: 'Contemporary', label: 'Contemporary', icon: Palette, description: 'Current, trendy' },
];

export function StyleSelector({ currentStyle, onStyleSelect, className }: StyleSelectorProps) {
    return (
        <div className={cn('grid grid-cols-2 md:grid-cols-3 gap-4', className)}>
            {styles.map((style) => {
                const Icon = style.icon;
                const isSelected = currentStyle === style.id;

                return (
                    <Card
                        key={style.id}
                        onClick={() => onStyleSelect(style.id)}
                        className={cn(
                            'cursor-pointer p-4 transition-all duration-300 hover:border-primary/50 hover:bg-muted/50 flex flex-col items-center justify-center text-center gap-2',
                            isSelected ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-border/50 bg-background/50'
                        )}
                    >
                        <div className={cn("p-2 rounded-full transition-colors", isSelected ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground")}>
                            <Icon className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="font-medium text-sm">{style.label}</h4>
                            <p className="text-xs text-muted-foreground">{style.description}</p>
                        </div>
                    </Card>
                );
            })}
        </div>
    );
}
