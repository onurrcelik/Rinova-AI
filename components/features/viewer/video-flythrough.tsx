'use client';

import React, { useState } from 'react';
import { X, Download, Loader2, Video, RefreshCw, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Language } from '@/lib/translations';
import { cn } from '@/lib/utils';

interface VideoFlythroughProps {
    imageUrls: string[];
    onClose: () => void;
    lang?: Language;
}

const videoTranslations = {
    en: {
        selectTitle: 'Select 2 Images for Video Tour',
        selectDescription: 'Your video will be generated based on these images. Choose wisely — pick images that show different parts of the room with a common element.',
        image1: 'Image 1',
        image2: 'Image 2',
        generateVideo: 'Generate Video',
        generatingTitle: 'Generating AI Video Tour',
        generatingVideo: 'Creating cinematic room tour...',
        estimatedTime: 'This may take 60-90 seconds',
        videoReady: 'Your AI Video Tour is Ready!',
        download: 'Download Video',
        regenerate: 'Generate New Video',
        close: 'Close',
        error: 'Failed to generate video',
        tryAgain: 'Try Again',
        clickToSelect: 'Click to select',
    },
    it: {
        selectTitle: 'Seleziona 2 Immagini per il Video Tour',
        selectDescription: 'Il video verrà generato in base a queste immagini. Scegli con attenzione — seleziona immagini che mostrano parti diverse della stanza con un elemento in comune.',
        image1: 'Immagine 1',
        image2: 'Immagine 2',
        generateVideo: 'Genera Video',
        generatingTitle: 'Generazione Video Tour AI',
        generatingVideo: 'Creazione tour cinematico della stanza...',
        estimatedTime: 'Potrebbe richiedere 60-90 secondi',
        videoReady: 'Il tuo Video Tour AI è Pronto!',
        download: 'Scarica Video',
        regenerate: 'Genera Nuovo Video',
        close: 'Chiudi',
        error: 'Impossibile generare il video',
        tryAgain: 'Riprova',
        clickToSelect: 'Clicca per selezionare',
    }
};

type GenerationStep = 'selecting' | 'generating' | 'ready' | 'error';

export function VideoFlythrough({ imageUrls, onClose, lang = 'en' }: VideoFlythroughProps) {
    const [step, setStep] = useState<GenerationStep>('selecting');
    const [startImageIndex, setStartImageIndex] = useState<number | null>(null);
    const [endImageIndex, setEndImageIndex] = useState<number | null>(null);
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const t = videoTranslations[lang];

    const handleImageClick = (index: number) => {
        if (startImageIndex === null) {
            setStartImageIndex(index);
        } else if (endImageIndex === null && index !== startImageIndex) {
            setEndImageIndex(index);
        } else if (index === startImageIndex) {
            // Deselect start
            setStartImageIndex(endImageIndex);
            setEndImageIndex(null);
        } else if (index === endImageIndex) {
            // Deselect end
            setEndImageIndex(null);
        } else {
            // Replace end with new selection
            setEndImageIndex(index);
        }
    };

    const generateVideo = async () => {
        if (startImageIndex === null || endImageIndex === null) return;

        setStep('generating');
        setError(null);

        try {
            const response = await fetch('/api/generate-video', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    startImageUrl: imageUrls[startImageIndex],
                    endImageUrl: imageUrls[endImageIndex]
                })
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.details || 'Failed to generate video');
            }

            const videoData = await response.json();
            setVideoUrl(videoData.videoUrl);
            setStep('ready');

        } catch (err) {
            console.error('Video generation error:', err);
            setError(err instanceof Error ? err.message : 'Unknown error');
            setStep('error');
        }
    };

    const handleDownload = async () => {
        if (!videoUrl) return;
        try {
            const response = await fetch(videoUrl);
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = `room-tour-${Date.now()}.mp4`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);
        } catch (e) {
            console.error('Download failed:', e);
        }
    };

    const resetSelection = () => {
        setStartImageIndex(null);
        setEndImageIndex(null);
        setVideoUrl(null);
        setError(null);
        setStep('selecting');
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 overflow-auto">
            {/* Close button */}
            <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="absolute top-4 right-4 text-white hover:bg-white/20 z-10"
            >
                <X className="w-6 h-6" />
            </Button>

            <div className="max-w-5xl w-full">
                {/* Selection State */}
                {step === 'selecting' && (
                    <div className="space-y-8">
                        <div className="text-center text-white space-y-3">
                            <h2 className="text-3xl font-bold">{t.selectTitle}</h2>
                            <p className="text-white/70 text-lg">{t.selectDescription}</p>
                        </div>

                        {/* Image Grid - Larger 2-column layout */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                            {imageUrls.map((url, index) => {
                                const isStart = startImageIndex === index;
                                const isEnd = endImageIndex === index;
                                const isSelected = isStart || isEnd;

                                return (
                                    <button
                                        key={index}
                                        onClick={() => handleImageClick(index)}
                                        className={cn(
                                            "relative aspect-[4/3] rounded-2xl overflow-hidden transition-all duration-300 group",
                                            isStart && "ring-4 ring-green-500 shadow-[0_0_30px_rgba(34,197,94,0.4)]",
                                            isEnd && "ring-4 ring-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.4)]",
                                            !isSelected && "ring-2 ring-white/20 hover:ring-white/50 hover:shadow-lg"
                                        )}
                                    >
                                        <img
                                            src={url}
                                            alt={`Image ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />

                                        {/* Image number badge */}
                                        <div className="absolute top-3 left-3 w-8 h-8 rounded-full bg-black/60 flex items-center justify-center text-white font-bold text-sm">
                                            {index + 1}
                                        </div>

                                        {/* Selection badge */}
                                        {isSelected && (
                                            <div className={cn(
                                                "absolute top-3 right-3 px-4 py-2 rounded-full text-sm font-bold text-white shadow-lg",
                                                isStart ? "bg-green-600" : "bg-blue-600"
                                            )}>
                                                {isStart ? `✓ ${t.image1}` : `✓ ${t.image2}`}
                                            </div>
                                        )}

                                        {/* Hover overlay for unselected */}
                                        {!isSelected && (
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-6">
                                                <span className="text-white text-lg font-medium bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                                                    {t.clickToSelect}
                                                </span>
                                            </div>
                                        )}

                                        {/* Selected checkmark overlay */}
                                        {isSelected && (
                                            <div className={cn(
                                                "absolute inset-0 bg-gradient-to-t via-transparent to-transparent",
                                                isStart ? "from-green-600/30" : "from-blue-600/30"
                                            )} />
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Generate Button */}
                        <div className="flex justify-center pt-4">
                            <Button
                                onClick={generateVideo}
                                disabled={startImageIndex === null || endImageIndex === null}
                                className="bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed text-lg px-8 py-6 h-auto"
                                size="lg"
                            >
                                <Video className="w-6 h-6 mr-3" />
                                {t.generateVideo}
                            </Button>
                        </div>
                    </div>
                )}

                {/* Generating State */}
                {step === 'generating' && (
                    <div className="text-center text-white space-y-6">
                        <div className="relative">
                            <div className="w-24 h-24 mx-auto rounded-full border-4 border-white/20 border-t-white animate-spin" />
                            <Video className="w-10 h-10 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold">{t.generatingTitle}</h2>
                        <p className="text-white/80">{t.generatingVideo}</p>
                        <p className="text-sm text-white/60">{t.estimatedTime}</p>

                        {/* Show selected images */}
                        <div className="flex justify-center gap-4 mt-6">
                            {startImageIndex !== null && (
                                <div className="relative">
                                    <img
                                        src={imageUrls[startImageIndex]}
                                        alt="Start"
                                        className="w-32 h-20 object-cover rounded-lg border-2 border-green-500"
                                    />
                                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-xs font-bold">
                                        1
                                    </div>
                                </div>
                            )}
                            <div className="flex items-center text-white/50">→</div>
                            {endImageIndex !== null && (
                                <div className="relative">
                                    <img
                                        src={imageUrls[endImageIndex]}
                                        alt="End"
                                        className="w-32 h-20 object-cover rounded-lg border-2 border-blue-500"
                                    />
                                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-xs font-bold">
                                        2
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Video Ready */}
                {step === 'ready' && videoUrl && (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-white text-center">{t.videoReady}</h2>

                        <div className="rounded-2xl overflow-hidden shadow-2xl bg-black">
                            <video
                                src={videoUrl}
                                controls
                                autoPlay
                                loop
                                className="w-full aspect-video"
                            />
                        </div>

                        <div className="flex justify-center gap-4">
                            <Button
                                onClick={handleDownload}
                                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                                size="lg"
                            >
                                <Download className="w-5 h-5 mr-2" />
                                {t.download}
                            </Button>
                            <Button
                                onClick={resetSelection}
                                variant="ghost"
                                size="lg"
                                className="border border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white"
                            >
                                <RefreshCw className="w-5 h-5 mr-2" />
                                {t.regenerate}
                            </Button>
                        </div>
                    </div>
                )}

                {/* Error State */}
                {step === 'error' && (
                    <div className="text-center text-white space-y-6">
                        <div className="w-20 h-20 mx-auto rounded-full bg-red-500/20 flex items-center justify-center">
                            <X className="w-10 h-10 text-red-400" />
                        </div>
                        <h2 className="text-2xl font-bold">{t.error}</h2>
                        <p className="text-white/60">{error}</p>
                        <Button
                            onClick={resetSelection}
                            className="bg-white text-black hover:bg-white/90"
                            size="lg"
                        >
                            <RefreshCw className="w-5 h-5 mr-2" />
                            {t.tryAgain}
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
