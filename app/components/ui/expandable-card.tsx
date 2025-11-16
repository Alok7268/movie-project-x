"use client";

import React, { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useOutsideClick } from "@/hooks/use-outside-click";
import { Movie } from "@/types/movie";
import { getPosterUrl, getBackdropUrl } from "@/lib/movies";
import Image from "next/image";

interface ExpandableCardProps {
  activeMovie: Movie | null;
  onClose: () => void;
}

export default function ExpandableCard({ activeMovie, onClose }: ExpandableCardProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    if (activeMovie) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeMovie, onClose]);

  useOutsideClick(ref, () => onClose());

  if (!activeMovie) return null;

  const posterUrl = getPosterUrl(activeMovie.posterPath, 'w500');
  const backdropUrl = getBackdropUrl(activeMovie.backdropPath, 'w1280');
  const year = activeMovie.year || (activeMovie.releaseDate ? new Date(activeMovie.releaseDate).getFullYear() : null);
  const runtimeHours = Math.floor(activeMovie.runtime / 60);
  const runtimeMinutes = activeMovie.runtime % 60;
  const runtimeFormatted = runtimeHours > 0 
    ? `${runtimeHours}h ${runtimeMinutes}m` 
    : `${runtimeMinutes}m`;

  return (
    <>
      <AnimatePresence>
        {activeMovie && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm h-full w-full z-[60]"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {activeMovie && (
          <div className="fixed inset-0 grid place-items-center z-[150] pointer-events-none pt-20 md:pt-24">
            <motion.button
              key={`button-${activeMovie.id}`}
              layout
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
                transition: {
                  duration: 0.05,
                },
              }}
              className="flex absolute top-20 md:top-24 right-4 lg:top-28 lg:right-6 items-center justify-center bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full h-10 w-10 border border-white/20 pointer-events-auto transition-colors z-10"
              onClick={onClose}
            >
              <CloseIcon />
            </motion.button>

            <motion.div
              layoutId={`card-${activeMovie.id}`}
              ref={ref}
              className="w-full max-w-[1200px] h-[calc(100vh-6rem)] md:h-fit md:max-h-[calc(100vh-8rem)] flex flex-col md:flex-row bg-gradient-to-br from-[#232323] to-[#000000] dark:bg-neutral-900 sm:rounded-3xl overflow-hidden border border-[#343434]/50 pointer-events-auto shadow-2xl mx-4"
            >
              {/* Poster/Backdrop Image - Left Side */}
              <motion.div 
                layoutId={`image-${activeMovie.id}`}
                className="relative w-full md:w-2/5 lg:w-2/5 flex-shrink-0 bg-gradient-to-br from-[#232323] to-[#000000] flex items-center justify-center overflow-hidden"
                style={{ minHeight: '400px' }}
              >
                {/* Use poster for better display on left side */}
                {posterUrl && !posterUrl.includes('no-poster') && !posterUrl.endsWith('.svg') && posterUrl !== '/no-poster.svg' && posterUrl !== 'no-poster.svg' ? (
                  <div className="relative w-full h-full flex items-center justify-center p-4">
                    <Image
                      src={posterUrl}
                      alt={activeMovie.title}
                      width={400}
                      height={600}
                      className="object-contain max-w-full max-h-full rounded-lg"
                      sizes="(max-width: 768px) 100vw, 40vw"
                      unoptimized={posterUrl.startsWith('http')}
                      priority
                    />
                  </div>
                ) : backdropUrl && !backdropUrl.includes('no-backdrop') && backdropUrl !== '/no-backdrop.svg' && backdropUrl !== 'no-backdrop.svg' ? (
                  <div className="relative w-full h-full flex items-center justify-center p-4">
                    <Image
                      src={backdropUrl}
                      alt={activeMovie.title}
                      width={400}
                      height={600}
                      className="object-contain max-w-full max-h-full rounded-lg"
                      sizes="(max-width: 768px) 100vw, 40vw"
                      unoptimized={backdropUrl.startsWith('http')}
                      priority
                    />
                  </div>
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#232323] to-[#000000] flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-gray-400 text-sm">No image available</p>
                    </div>
                  </div>
                )}
              </motion.div>

              {/* Content - Right Side */}
              <div className="flex-1 overflow-y-auto flex flex-col">
                <div className="p-6 md:p-8">
                  {/* Title and Basic Info */}
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
                    <div className="flex-1">
                      <motion.h2
                        layoutId={`title-${activeMovie.id}`}
                        className="font-bold text-2xl md:text-3xl lg:text-4xl text-white mb-3"
                      >
                        {activeMovie.title}
                      </motion.h2>
                      {activeMovie.tagline && (
                        <motion.p
                          layoutId={`tagline-${activeMovie.id}`}
                          className="text-[#696969] italic text-lg mb-4"
                        >
                          {activeMovie.tagline}
                        </motion.p>
                      )}
                      <div className="flex flex-wrap items-center gap-3 mb-4">
                        {year && (
                          <span className="text-gray-200 text-sm bg-[#003566]/60 px-3 py-1.5 rounded-full border border-[#003566]/80">
                            {year}
                          </span>
                        )}
                        {activeMovie.runtime > 0 && (
                          <span className="text-gray-200 text-sm bg-[#003566]/60 px-3 py-1.5 rounded-full border border-[#003566]/80">
                            {runtimeFormatted}
                          </span>
                        )}
                        {activeMovie.genres.map((genre) => (
                          <span
                            key={genre}
                            className="px-3 py-1.5 bg-[#001d3d]/80 backdrop-blur-sm text-[#ffc300] text-sm rounded-full border border-[#003566]/50 font-medium"
                          >
                            {genre}
                          </span>
                        ))}
                      </div>
                    </div>
                    <motion.div
                      layoutId={`rating-${activeMovie.id}`}
                      className="flex items-center gap-2"
                    >
                      <div className="bg-gradient-to-r from-[#ffc300] to-[#ffd60a] backdrop-blur-sm text-[#000814] px-4 py-2 rounded-full flex items-center gap-2 font-bold text-lg shadow-lg shadow-[#ffc300]/30">
                        <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        {activeMovie.voteAverage.toFixed(1)}
                      </div>
                    </motion.div>
                  </div>

                  {/* Overview */}
                  {activeMovie.overview && (
                    <motion.div
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="mb-6"
                    >
                      <h3 className="text-white font-semibold text-lg mb-2">Overview</h3>
                      <p className="text-gray-300 text-base leading-relaxed">
                        {activeMovie.overview}
                      </p>
                    </motion.div>
                  )}

                  {/* Movie Details Grid */}
                  <motion.div
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6"
                  >
                    {activeMovie.director && (
                      <div>
                        <h4 className="text-[#ffc300] font-semibold text-sm mb-1">Director</h4>
                        <p className="text-gray-300 text-sm">{activeMovie.director}</p>
                      </div>
                    )}
                    {activeMovie.originalLanguage && (
                      <div>
                        <h4 className="text-[#ffc300] font-semibold text-sm mb-1">Language</h4>
                        <p className="text-gray-300 text-sm uppercase">{activeMovie.originalLanguage}</p>
                      </div>
                    )}
                    {activeMovie.status && (
                      <div>
                        <h4 className="text-[#ffc300] font-semibold text-sm mb-1">Status</h4>
                        <p className="text-gray-300 text-sm">{activeMovie.status}</p>
                      </div>
                    )}
                    {activeMovie.voteCount > 0 && (
                      <div>
                        <h4 className="text-[#ffc300] font-semibold text-sm mb-1">Vote Count</h4>
                        <p className="text-gray-300 text-sm">{activeMovie.voteCount.toLocaleString()}</p>
                      </div>
                    )}
                    {activeMovie.budget > 0 && (
                      <div>
                        <h4 className="text-[#ffc300] font-semibold text-sm mb-1">Budget</h4>
                        <p className="text-gray-300 text-sm">${activeMovie.budget.toLocaleString()}</p>
                      </div>
                    )}
                    {activeMovie.revenue > 0 && (
                      <div>
                        <h4 className="text-[#ffc300] font-semibold text-sm mb-1">Revenue</h4>
                        <p className="text-gray-300 text-sm">${activeMovie.revenue.toLocaleString()}</p>
                      </div>
                    )}
                  </motion.div>

                  {/* Cast */}
                  {activeMovie.cast && activeMovie.cast.length > 0 && (
                    <motion.div
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="mb-6"
                    >
                      <h3 className="text-white font-semibold text-lg mb-3">Cast</h3>
                      <div className="flex flex-wrap gap-2">
                        {activeMovie.cast.slice(0, 10).map((actor, index) => (
                          <div
                            key={`${actor.name}-${index}`}
                            className="bg-[#001d3d]/60 backdrop-blur-sm px-3 py-2 rounded-lg border border-[#003566]/50"
                          >
                            <p className="text-gray-200 text-sm font-medium">{actor.name}</p>
                            {actor.character && (
                              <p className="text-[#696969] text-xs mt-1">as {actor.character}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Production Companies */}
                  {activeMovie.productionCompanies && activeMovie.productionCompanies.length > 0 && (
                    <motion.div
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="mb-6"
                    >
                      <h3 className="text-white font-semibold text-lg mb-3">Production Companies</h3>
                      <div className="flex flex-wrap gap-2">
                        {activeMovie.productionCompanies.map((company, index) => (
                          <span
                            key={`${company}-${index}`}
                            className="px-3 py-1.5 bg-[#001d3d]/60 backdrop-blur-sm text-gray-300 text-sm rounded-full border border-[#003566]/50"
                          >
                            {company}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Keywords */}
                  {activeMovie.keywords && activeMovie.keywords.length > 0 && (
                    <motion.div
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <h3 className="text-white font-semibold text-lg mb-3">Keywords</h3>
                      <div className="flex flex-wrap gap-2">
                        {activeMovie.keywords.slice(0, 15).map((keyword, index) => (
                          <span
                            key={`${keyword}-${index}`}
                            className="px-3 py-1.5 bg-[#343434]/60 backdrop-blur-sm text-gray-300 text-sm rounded-full border border-[#696969]/30"
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

export const CloseIcon = () => {
  return (
    <motion.svg
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      exit={{
        opacity: 0,
        transition: {
          duration: 0.05,
        },
      }}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5 text-white"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M18 6l-12 12" />
      <path d="M6 6l12 12" />
    </motion.svg>
  );
};

