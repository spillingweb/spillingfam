import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Home, Warehouse, Tractor, TreePine, Wheat, MapPin } from 'lucide-react'

interface Building {
  id: string
  name: string
  year: string
  description: string
  icon: typeof Home
  position: { x: number; y: number }
}

function Map() {
  const buildings: Building[] = [
    {
      id: '1',
      name: 'Hovedhuset',
      year: '1924',
      description:
        'Det opprinnelige familiehjemmet, bygget av oldefar med tømmer fra nordskogen. Har den originale steinpeiisen og håndhugne bjelker.',
      icon: Home,
      position: { x: 30, y: 40 },
    },
    {
      id: '2',
      name: 'Røde låven',
      year: '1928',
      description:
        'Bygdebygget låve som har huset melkekyr, hester og utstyr i nesten et århundre. Har fortsatt det originale høyloftet og taljesystemet.',
      icon: Warehouse,
      position: { x: 55, y: 35 },
    },
    {
      id: '3',
      name: 'Redskapsskur',
      year: '1945',
      description:
        'Bygget etter krigen for å huse gårdens første traktor. Rommerrommer nå moderne jordbruksutstyr sammen med historiske redskaper.',
      icon: Tractor,
      position: { x: 70, y: 50 },
    },
    {
      id: '4',
      name: 'Sørjordet',
      year: 'Opprinnelig',
      description:
        "Det mest produktive hvetejordet, med rekordavlinger i '52, '78 og 2015. Rotert med mais og soyabønner gjennom tiårene.",
      icon: Wheat,
      position: { x: 45, y: 70 },
    },
    {
      id: '5',
      name: 'Furuskog',
      year: 'Plantet 1935',
      description:
        'Levegge plantet under støvbolletiden for å beskytte avlinger. Nå hjem for dyreliv og et familiesamlingspunkt for piknik.',
      icon: TreePine,
      position: { x: 15, y: 25 },
    },
  ]

  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(
    null,
  )

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="mb-10">
        <h2 className="text-4xl font-serif text-gray-900 mb-3">Gårdskart</h2>
        <p className="text-lg text-gray-600">
          Utforsk bygningene og landemerkene som forteller vår historie
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Map Area */}
        <div className="lg:col-span-2">
          <div className="bg-[#B4EDCE]/30 shadow-md border-2 border-gray-200 p-8 relative h-[600px] overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-4 right-4 text-gray-300">
              <MapPin className="w-10 h-10" />
            </div>

            {/* Road */}
            <div className="absolute bottom-0 left-0 right-0 h-12 bg-gray-400 opacity-20"></div>

            {/* Buildings */}
            {buildings.map((building) => {
              const Icon = building.icon
              const isSelected = selectedBuilding?.id === building.id

              return (
                <button
                  key={building.id}
                  onClick={() => setSelectedBuilding(building)}
                  style={{
                    left: `${building.position.x}%`,
                    top: `${building.position.y}%`,
                  }}
                  className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all ${
                    isSelected ? 'scale-125 z-10' : 'hover:scale-110'
                  }`}
                >
                  <div
                    className={`relative ${isSelected ? 'animate-pulse' : ''}`}
                  >
                    <div
                      className={`p-4 shadow-lg transition-all ${
                        isSelected
                          ? 'bg-[#F28B1D] text-white ring-4 ring-[#F28B1D]/30'
                          : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200'
                      }`}
                    >
                      <Icon className="w-7 h-7" />
                    </div>
                    <div
                      className={`absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-sm font-medium uppercase tracking-wide ${
                        isSelected ? 'text-gray-900' : 'text-gray-700'
                      }`}
                    >
                      {building.name}
                    </div>
                  </div>
                </button>
              )
            })}

            {/* Legend */}
            <div className="absolute bottom-16 left-4 bg-white/90 backdrop-blur-sm p-4 shadow-sm border-2 border-gray-200">
              <p className="text-sm text-gray-900 font-medium mb-1 uppercase tracking-wide">
                Klikk på markører
              </p>
              <p className="text-xs text-gray-600">Est. 1920-tallet - i dag</p>
            </div>
          </div>
        </div>

        {/* Info Panel */}
        <div className="lg:col-span-1">
          {selectedBuilding ? (
            <div className="bg-white shadow-md border-l-8 border-[#F28B1D] p-8 sticky top-24">
              <div>
                <div className="flex items-start gap-3 mb-4">
                  {(() => {
                    const Icon = selectedBuilding.icon
                    return (
                      <div className="w-14 h-14 bg-[#F28B1D] flex items-center justify-center shadow-md flex-shrink-0">
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                    )
                  })()}
                  <div>
                    <h3 className="text-2xl font-semibold text-gray-900">
                      {selectedBuilding.name}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1 uppercase tracking-wide">
                      Bygget: {selectedBuilding.year}
                    </p>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  {selectedBuilding.description}
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-white shadow-md border-2 border-gray-200 p-8 sticky top-24">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3 uppercase tracking-wide">
                  Velkommen til gården
                </h3>
                <p className="text-gray-700 mb-6">
                  Klikk på en bygning eller landemerke på kartet for å lære om
                  dens historie og betydning for familien vår.
                </p>
                <div className="space-y-2">
                  {buildings.map((building) => {
                    const Icon = building.icon
                    return (
                      <button
                        key={building.id}
                        onClick={() => setSelectedBuilding(building)}
                        className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 transition-all text-left border-l-4 border-transparent hover:border-[#F28B1D]"
                      >
                        <div className="w-10 h-10 bg-[#F28B1D] flex items-center justify-center flex-shrink-0">
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {building.name}
                          </div>
                          <div className="text-sm text-gray-600 uppercase tracking-wide">
                            {building.year}
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export const Route = createFileRoute('/map')({
  component: Map,
})
