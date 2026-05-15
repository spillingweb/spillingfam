import { createFileRoute } from '@tanstack/react-router'
import HomeImg from '../assets/img/home.jpg';
import { Heading } from '@/components/ui/heading'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  return (
    <div className="relative h-full">
      {/* Hero Section - Full Viewport */}
      <div className="relative h-full w-full">
        {/* Background Image */}
        <div className="absolute inset-0 w-full h-full">
          <img
            src={HomeImg}
            alt="Vegårshei fra nord-øst"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/40 to-black/80"></div>
        </div>

        {/* Welcome Message */}
        <div className="relative z-10 h-full flex items-end px-8 md:px-12 lg:px-16 pb-20 md:pb-24">
          <div className="max-w-3xl text-white">
            <Heading level="h1" className="md:text-6xl lg:text-7xl mb-6 leading-tight drop-shadow-2xl text-white">
              Spillingfamilien
            </Heading>
            <p className="text-lg md:text-xl lg:text-2xl font-light leading-relaxed drop-shadow-lg max-w-2xl">
              Her samler vi våre minner, historier og røtter fra over 100 år med familietradisjoner
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

