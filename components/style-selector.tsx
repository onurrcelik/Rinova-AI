import React from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

export interface StyleOption {
    id: string;
    label: string;
    icon: LucideIcon;
    description: string;
}

interface StyleSelectorProps {
    currentStyle: string;
    onStyleSelect: (style: string) => void;
    className?: string;
    styles: StyleOption[];
}

export function StyleSelector({ currentStyle, onStyleSelect, className, styles }: StyleSelectorProps) {
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
