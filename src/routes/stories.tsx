import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Plus, Edit2, Trash2, Calendar, Search } from 'lucide-react'

export const Route = createFileRoute('/stories')({ component: Stories })

interface Story {
  id: string
  title: string
  year: string
  date: string
  content: string
  author: string
}

function Stories() {
  const [stories, setStories] = useState<Story[]>([
    {
      id: '1',
      title: 'Den store innhøstingen av 1952',
      year: '1952',
      date: '2024-03-15',
      content:
        'Den sommeren, fortalte bestefar oss, var ulikt noen annen. Hveten vokste gyllen og høy, og vaiet i bølger over hele sørjordet. Det var et mirakel etter alle de tørre årene, da regnet kom akkurat når vi trengte det mest.',
      author: 'Kari Johnsen',
    },
    {
      id: '2',
      title: 'Bygging av den gamle låven',
      year: '1928',
      date: '2024-02-20',
      content:
        'I 1928 kom hele bygda sammen for å reise låven som fortsatt står i dag. Onkel Henrik husket hvordan naboer kom langveisfra for å hjelpe til. Det var en tradisjon på den tiden - alle hjalp hverandre når det gjaldt store byggeprosjekter.',
      author: 'Per Andersen',
    },
    {
      id: '3',
      title: 'Gårdens første traktor',
      year: '1945',
      date: '2024-01-10',
      content:
        'Etter krigen kjøpte bestefar gårdens første traktor. Det var en Ferguson, og hele familien samlet seg for å se på når den kom kjørende opp gårdsveien. Hestene ble nervøse, men barna var fascinerte.',
      author: 'Henrik Johansen',
    },
    {
      id: '4',
      title: 'Oppstart av Spilling gård',
      year: '1912',
      date: '2023-12-05',
      content:
        'I 1912 etablerte oldefar Johan den første husmannsplassen som senere skulle bli Spilling gård. Med tomme hender og stor vilje bygde han opp det som skulle bli hjemmet vårt for generasjoner fremover.',
      author: 'Marit Persdatter',
    },
  ])

  const [selectedYear, setSelectedYear] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    year: '',
    content: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingId) {
      setStories(
        stories.map((story) =>
          story.id === editingId
            ? {
                ...story,
                ...formData,
                date: new Date().toISOString().split('T')[0],
              }
            : story,
        ),
      )
      setEditingId(null)
    } else {
      const newStory: Story = {
        id: Date.now().toString(),
        ...formData,
        date: new Date().toISOString().split('T')[0],
      }
      setStories([newStory, ...stories])
    }

    setFormData({ title: '', author: '', year: '', content: '' })
    setShowForm(false)
  }

  const handleEdit = (story: Story) => {
    setFormData({
      title: story.title,
      author: story.author,
      year: story.year,
      content: story.content,
    })
    setEditingId(story.id)
    setShowForm(true)
  }

  const handleDelete = (id: string) => {
    if (confirm('Er du sikker på at du vil slette denne historien?')) {
      setStories(stories.filter((story) => story.id !== id))
    }
  }

  // Sort stories by year for timeline
  const sortedStories = [...stories].sort((a, b) => parseInt(a.year) - parseInt(b.year))

  // Filter stories by year and search query
  const displayedStories = stories.filter((story) => {
    const matchesYear = selectedYear ? story.year === selectedYear : true
    const matchesSearch = searchQuery
      ? story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        story.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        story.author.toLowerCase().includes(searchQuery.toLowerCase())
      : true
    return matchesYear && matchesSearch
  })

  // Get min and max years for timeline
  const years = stories.map((s) => parseInt(s.year))
  const minYear = Math.min(...years)
  const maxYear = Math.max(...years)

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="mb-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-4xl font-serif text-gray-900 mb-3">Familiehistorier</h2>
          <p className="text-lg text-gray-600">Del og bevar minnene som formet gården vår</p>
        </div>
        <button
          onClick={() => {
            setShowForm(!showForm)
            setEditingId(null)
            setFormData({ title: '', author: '', year: '', content: '' })
          }}
          className="flex items-center gap-2 bg-[#F28B1D] text-white px-8 py-3 hover:bg-[#D45E4C] transition-all font-medium uppercase tracking-wide whitespace-nowrap self-start lg:self-auto"
        >
          <Plus className="w-5 h-5" />
          Legg til ny historie
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Søk i historier..."
          className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 focus:ring-0 focus:border-[#F28B1D] transition-all"
        />
      </div>

      {/* Interactive Timeline */}
      <div className="relative px-8">
        {/* Timeline bar */}
        <div className="absolute left-8 right-8 top-1/2 h-1 bg-gray-400"></div>

        {/* Timeline events */}
        <div className="relative flex justify-between items-center py-8">
          {sortedStories.map((story) => {
            const isSelected = selectedYear === story.year
            const position = ((parseInt(story.year) - minYear) / (maxYear - minYear)) * 100

            return (
              <button
                key={story.id}
                onClick={() => setSelectedYear(isSelected ? null : story.year)}
                className="group relative"
                style={{
                  position: 'absolute',
                  left: `${position}%`,
                  transform: 'translateX(-50%)',
                }}
              >
                {/* Event dot */}
                <div
                  className={`w-6 h-6 border-4 border-white shadow-lg transition-all ${
                    isSelected
                      ? 'bg-[#F28B1D] scale-150 z-10'
                      : 'bg-[#B4EDCE] hover:bg-[#F28B1D] hover:scale-125'
                  }`}
                ></div>

                {/* Year label */}
                <div
                  className={`absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap font-semibold transition-all ${
                    isSelected ? 'text-[#F28B1D] text-lg' : 'text-gray-700 text-sm group-hover:text-[#F28B1D]'
                  }`}
                >
                  {story.year}
                </div>

                {/* Story title on hover */}
                <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-gray-900 text-white text-xs px-3 py-2 pointer-events-none max-w-[200px] truncate">
                  {story.title}
                </div>
              </button>
            )
          })}
        </div>

        {selectedYear && (
          <div className="mt-8">
            <button
              onClick={() => setSelectedYear(null)}
              className="text-sm text-gray-600 hover:text-gray-900 uppercase tracking-wide"
            >
              ← Vis alle historier
            </button>
          </div>
        )}
      </div>

      {/* Story Form */}
      {showForm && (
        <div className="bg-white shadow-lg border-l-8 border-[#F28B1D] p-8 mb-8">
          <div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-6 uppercase tracking-wide">
              {editingId ? 'Rediger historie' : 'Ny historie'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 uppercase tracking-wide">
                    Tittel
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 focus:ring-0 focus:border-[#F28B1D] transition-all"
                    placeholder="Skriv inn tittel..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 uppercase tracking-wide">
                    År (historisk kontekst)
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 focus:ring-0 focus:border-[#F28B1D] transition-all"
                    placeholder="F.eks. 1952"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 uppercase tracking-wide">
                  Forfatter
                </label>
                <input
                  type="text"
                  required
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 focus:ring-0 focus:border-[#F28B1D] transition-all"
                  placeholder="Ditt navn..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 uppercase tracking-wide">
                  Historie
                </label>
                <textarea
                  required
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={8}
                  className="w-full px-4 py-3 border-2 border-gray-300 focus:ring-0 focus:border-[#F28B1D] transition-all resize-none"
                  placeholder="Del din historie..."
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="bg-[#F28B1D] text-white px-8 py-3 hover:bg-[#D45E4C] transition-all font-medium uppercase tracking-wide"
                >
                  {editingId ? 'Oppdater' : 'Publiser'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    setEditingId(null)
                    setFormData({ title: '', author: '', year: '', content: '' })
                  }}
                  className="bg-gray-200 text-gray-700 px-8 py-3 hover:bg-gray-300 transition-all font-medium uppercase tracking-wide"
                >
                  Avbryt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Stories List */}
      <div className="space-y-6">
        {displayedStories.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>Ingen historier funnet for {selectedYear}</p>
          </div>
        ) : (
          displayedStories.map((story) => (
            <article
              key={story.id}
              className="bg-white shadow-md border-l-4 border-[#B4EDCE] p-8 hover:shadow-lg transition-all"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="inline-block bg-[#F28B1D] text-white px-3 py-1 text-sm font-semibold uppercase tracking-wide">
                      {story.year}
                    </span>
                    <h3 className="text-2xl font-semibold text-gray-900">{story.title}</h3>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600 uppercase tracking-wide">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      Publisert{' '}
                      {new Date(story.date).toLocaleDateString('nb-NO', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                    <span>av {story.author}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(story)}
                    className="p-2 text-gray-600 hover:bg-gray-100 transition-all"
                    title="Rediger historie"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(story.id)}
                    className="p-2 text-gray-600 hover:bg-gray-100 transition-all"
                    title="Slett historie"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{story.content}</p>
            </article>
          ))
        )}
      </div>
    </div>
  )
}
