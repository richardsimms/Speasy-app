'use client'

import { useState, useRef, useEffect } from 'react'
import { Play, Pause, SkipForward, SkipBack, Clock, Zap } from 'lucide-react'
import { cn } from '@/libs/utils'
import { motion } from 'framer-motion'

const newsletterSamples = [
  {
    id: 1,
    title: 'The Hustle',
    category: 'Business & Tech',
    duration: '2:15',
    durationSeconds: 135,
    audioUrl: '/placeholder.mp3?duration=135&voice=male&content=business',
    accentColor: 'bg-blue-500',
    glowColor: 'shadow-blue-500/20',
    transcript: "Feeling buried under unread newsletters? You're not alone. The average professional subscribes to 15+ newsletters but only reads 3.",
    stats: { saved: '12m', speed: '1.5x' }
  },
  {
    id: 2,
    title: 'Morning Brew',
    category: 'Business News',
    duration: '3:20',
    durationSeconds: 200,
    audioUrl: '/placeholder.mp3?duration=200&voice=female&content=news',
    accentColor: 'bg-orange-500',
    glowColor: 'shadow-orange-500/20',
    transcript: "Good morning! Let's get you caught up on what happened while you were sleeping. Tech stocks rallied yesterday as AI companies announced record earnings.",
    stats: { saved: '18m', speed: '1.2x' }
  },
  {
    id: 3,
    title: 'TLDR Newsletter',
    category: 'Tech & Startups',
    duration: '2:45',
    durationSeconds: 165,
    audioUrl: '/placeholder.mp3?duration=165&voice=male&content=tech',
    accentColor: 'bg-purple-500',
    glowColor: 'shadow-purple-500/20',
    transcript: "Breaking down today's biggest tech stories in under 3 minutes. OpenAI just launched a new multimodal model that can process video and audio simultaneously.",
    stats: { saved: '15m', speed: '2.0x' }
  },
]

export function AudioDemo() {
  const [currentPlaying, setCurrentPlaying] = useState<number | null>(null)
  const [progress, setProgress] = useState<Record<number, number>>({})
  const [hoveredId, setHoveredId] = useState<number | null>(null)
  const audioRefs = useRef<Record<number, HTMLAudioElement>>({})
  const canvasRefs = useRef<Record<number, HTMLCanvasElement>>({})
  const animationFrameRefs = useRef<Record<number, number>>({})

  // Audio visualization effect
  useEffect(() => {
    newsletterSamples.forEach(sample => {
      const canvas = canvasRefs.current[sample.id]
      if (!canvas) return
      
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      const draw = () => {
        if (!ctx || !canvas) return
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        
        const isPlaying = currentPlaying === sample.id
        const isHovered = hoveredId === sample.id
        
        const bars = 40
        const width = canvas.width / bars
        const gap = 2
        
        for (let i = 0; i < bars; i++) {
          // Dynamic height based on playing state and random noise
          let height = 4
          if (isPlaying) {
            height = Math.random() * 24 + 4
          } else if (isHovered) {
            height = Math.sin(Date.now() / 200 + i * 0.5) * 8 + 12
          }
          
          // Color based on progress
          const progressPercent = progress[sample.id] || 0
          const barPercent = (i / bars) * 100
          
          ctx.fillStyle = barPercent <= progressPercent 
            ? 'rgba(255, 255, 255, 0.9)' 
            : 'rgba(255, 255, 255, 0.2)'
            
          const x = i * (width + gap)
          const y = (canvas.height - height) / 2
          
          // Rounded rect manually
          ctx.beginPath()
          ctx.roundRect(x, y, width, height, 2)
          ctx.fill()
        }
        
        animationFrameRefs.current[sample.id] = requestAnimationFrame(draw)
      }
      
      draw()
    })

    return () => {
      Object.values(animationFrameRefs.current).forEach(cancelAnimationFrame)
    }
  }, [currentPlaying, hoveredId, progress])

  useEffect(() => {
    if (currentPlaying !== null) {
      const audio = audioRefs.current[currentPlaying]
      if (audio) {
        const updateProgress = () => {
          const percent = (audio.currentTime / audio.duration) * 100
          setProgress((prev) => ({ ...prev, [currentPlaying]: percent }))
        }

        const handleEnded = () => {
          setCurrentPlaying(null)
          setProgress((prev) => ({ ...prev, [currentPlaying]: 0 }))
        }

        audio.addEventListener('timeupdate', updateProgress)
        audio.addEventListener('ended', handleEnded)

        return () => {
          audio.removeEventListener('timeupdate', updateProgress)
          audio.removeEventListener('ended', handleEnded)
        }
      }
    }
    return undefined
  }, [currentPlaying])

  const togglePlay = (id: number) => {
    Object.entries(audioRefs.current).forEach(([audioId, audio]) => {
      if (Number(audioId) !== id) {
        audio.pause()
      }
    })

    const audio = audioRefs.current[id]
    if (!audio) return

    if (currentPlaying === id) {
      audio.pause()
      setCurrentPlaying(null)
    } else {
      audio.play()
      setCurrentPlaying(id)
    }
  }

  return (
    <section className="relative py-32 px-4 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.03),transparent_70%)] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8"
        >
          <div className="max-w-2xl">
            <motion.h2 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl md:text-6xl font-bold mb-6 tracking-tight text-white"
            >
              Listen to the <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50">future</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xl text-muted-foreground leading-relaxed max-w-xl"
            >
              Experience your favorite newsletters transformed into high-fidelity audio. 
              Reclaim your time with precision-engineered summaries.
            </motion.p>
          </div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="flex gap-4 text-sm font-medium text-muted-foreground"
          >
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
              <Clock className="w-4 h-4" />
              <span>Save 10+ hrs/week</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
              <Zap className="w-4 h-4" />
              <span>2x Retention</span>
            </div>
          </motion.div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {newsletterSamples.map((sample, index) => {
            const isPlaying = currentPlaying === sample.id
            
            return (
              <motion.div
                key={sample.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ 
                  duration: 0.5, 
                  delay: index * 0.1,
                  ease: [0.16, 1, 0.3, 1]
                }}
                whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                className="group relative bg-[#0A0A0A] border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all duration-500"
                onMouseEnter={() => setHoveredId(sample.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <audio
                  ref={(el) => {
                    if (el) audioRefs.current[sample.id] = el
                  }}
                  src={sample.audioUrl}
                  preload="metadata"
                />

                {/* Glowing accent line */}
                <div className={cn(
                  "absolute top-0 left-0 w-full h-[1px] transition-opacity duration-500",
                  sample.accentColor,
                  isPlaying ? "opacity-100 shadow-[0_0_20px_rgba(255,255,255,0.5)]" : "opacity-0 group-hover:opacity-50"
                )} />

                <div className="p-8 h-full flex flex-col">
                  {/* Header */}
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className={cn("w-2 h-2 rounded-full", sample.accentColor)} />
                        <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                          {sample.category}
                        </span>
                      </div>
                      <h3 className="text-2xl font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-white/70 transition-all">
                        {sample.title}
                      </h3>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-mono text-muted-foreground bg-white/5 px-2 py-1 rounded">
                      <Clock className="w-3 h-3" />
                      {sample.duration}
                    </div>
                  </div>

                  {/* Visualization */}
                  <div className="relative h-12 mb-8 w-full">
                    <canvas 
                      ref={el => { if (el) canvasRefs.current[sample.id] = el }}
                      width={300}
                      height={48}
                      className="w-full h-full opacity-50 group-hover:opacity-100 transition-opacity duration-500"
                    />
                  </div>

                  {/* Controls & Stats */}
                  <div className="mt-auto space-y-6">
                    <div className="flex items-center justify-between gap-4">
                      <motion.button 
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => togglePlay(sample.id)}
                        className={cn(
                          "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300",
                          isPlaying 
                            ? "bg-white text-black scale-110 shadow-[0_0_30px_rgba(255,255,255,0.3)]" 
                            : "bg-white/10 text-white hover:bg-white hover:text-black"
                        )}
                      >
                        {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
                      </motion.button>
                      
                      <div className="flex-1 h-[1px] bg-white/10 relative overflow-hidden">
                        <motion.div 
                          className="absolute inset-0 bg-white"
                          initial={{ width: 0 }}
                          animate={{ width: `${progress[sample.id] || 0}%` }}
                          transition={{ duration: 0.1 }}
                        />
                      </div>
                      
                      <div className="flex gap-2">
                        <motion.button 
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 text-muted-foreground hover:text-white transition-colors"
                        >
                          <SkipBack className="w-4 h-4" />
                        </motion.button>
                        <motion.button 
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 text-muted-foreground hover:text-white transition-colors"
                        >
                          <SkipForward className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>

                    {/* Value Props */}
                    <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/5">
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Time Saved</div>
                        <div className="text-lg font-mono text-white">{sample.stats.saved}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Listening Speed</div>
                        <div className="text-lg font-mono text-white">{sample.stats.speed}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
