import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { useAppForm } from '@/hooks/form'
import { z } from 'zod'
import { Plus, Edit2, Trash2, Calendar } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { PageHeader } from '@/components/ui/page-header'
import { SearchInput } from '@/components/ui/search-input'
import { Heading } from '@/components/ui/heading'
import { DUMMY_HISTORY } from './-lib/dummy-history'
import { Button } from '@/components/ui/button'

// Zod schema for story validation
const storySchema = z.object({
  title: z.string().min(1, 'Tittel er påkrevd'),
  author: z.string().min(1, 'Forfatter er påkrevd'),
  year: z.string().min(1, 'År er påkrevd'),
  content: z.string().min(10, 'Historien må være minst 10 tegn'),
})

export const Route = createFileRoute('/historie/')({ component: Stories })

interface Story {
  id: string
  title: string
  year: string
  date: string
  content: string
  author: string
}

function Stories() {
  const [stories, setStories] = useState<Story[]>(DUMMY_HISTORY)
  const [selectedYear, setSelectedYear] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  // Story Form
  const storyForm = useAppForm({
    defaultValues: {
      title: '',
      author: '',
      year: '',
      content: '',
    },
    onSubmit: async ({ value }) => {
      try {
        const validated = storySchema.parse(value)
        
        if (editingId) {
          setStories(
            stories.map((story) =>
              story.id === editingId
                ? {
                    ...story,
                    ...validated,
                    date: new Date().toISOString().split('T')[0],
                  }
                : story,
            ),
          )
          setEditingId(null)
        } else {
          const newStory: Story = {
            id: Date.now().toString(),
            ...validated,
            date: new Date().toISOString().split('T')[0],
          }
          setStories([newStory, ...stories])
        }

        storyForm.reset()
        setShowForm(false)
      } catch (error) {
        console.error('Validation error:', error)
      }
    },
  })

  // Update form when editing
  useEffect(() => {
    if (editingId) {
      const story = stories.find(s => s.id === editingId)
      if (story) {
        storyForm.setFieldValue('title', story.title)
        storyForm.setFieldValue('author', story.author)
        storyForm.setFieldValue('year', story.year)
        storyForm.setFieldValue('content', story.content)
      }
    }
  }, [editingId])

  const handleEdit = (story: Story) => {
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
      <PageHeader
        title="Familiehistorier"
        description="Del og bevar minnene som formet gården vår"
        action={
          <Button
            onClick={() => {
              setShowForm(!showForm)
              setEditingId(null)
              storyForm.reset()
            }}
          >
            <Plus className="w-5 h-5" />
            Legg til ny historie
          </Button>
        }
      />

      <SearchInput
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="Søk i historier..."
      />

      {/* Interactive Timeline */}
      <div className="relative px-8 pt-6">
        {/* Timeline bar */}
        <div className="absolute left-8 right-8 top-13.5 h-1 bg-muted"></div>

        {/* Timeline events */}
        <div className="relative flex justify-between items-center py-8">
          {sortedStories.map((story) => {
            const isSelected = selectedYear === story.year
            const position = ((parseInt(story.year) - minYear) / (maxYear - minYear)) * 100

            return (
              <Button
                key={story.id}
                onClick={() => setSelectedYear(isSelected ? null : story.year)}
                className="group relative"
                variant="ghost"
                size="icon-xs"
                style={{
                  position: 'absolute',
                  left: `${position}%`,
                  transform: 'translateX(-50%)',
                }}
              >
                {/* Event dot */}
                <div
                  className={`w-6 h-6 border-4 border-card shadow-lg transition-all ${
                    isSelected
                      ? 'bg-primary scale-150 z-10'
                      : 'bg-chart-5 hover:bg-primary hover:scale-125'
                  }`}
                ></div>

                {/* Year label */}
                <div
                  className={`absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap font-semibold transition-all ${
                    isSelected ? 'text-primary text-lg' : 'text-card-foreground text-sm group-hover:text-primary'
                  }`}
                >
                  {story.year}
                </div>

                {/* Story title on hover */}
                <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-foreground text-primary-foreground text-xs px-3 py-2 pointer-events-none max-w-[200px] truncate">
                  {story.title}
                </div>
              </Button>
            )
          })}
        </div>

        {selectedYear && (
          <div className="text-right">
            <Button
              onClick={() => setSelectedYear(null)}
              variant="ghost"
              size="sm"
            >
              ← Vis alle historier
            </Button>
          </div>
        )}
      </div>

      {/* Story Form */}
      {showForm && (
        <Card className="border-l-8 border-primary mb-8">
          <CardHeader>
            <CardTitle className="uppercase tracking-wide">
              {editingId ? 'Rediger historie' : 'Ny historie'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                e.stopPropagation()
                storyForm.handleSubmit()
              }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Title Field */}
                <storyForm.AppField
                  name="title"
                  validators={{
                    onChange: ({ value }) => {
                      if (!value) return 'Tittel er påkrevd'
                      return undefined
                    },
                  }}
                >
                  {(field) => <field.Input label="Tittel" placeholder="Skriv inn tittel..." />}
                </storyForm.AppField>

                {/* Year Field */}
                <storyForm.AppField
                  name="year"
                  validators={{
                    onChange: ({ value }) => {
                      if (!value) return 'År er påkrevd'
                      return undefined
                    },
                  }}
                >
                  {(field) => <field.Input label="År (historisk kontekst)" placeholder="F.eks. 1952" />}
                </storyForm.AppField>
              </div>

              {/* Author Field */}
              <storyForm.AppField
                name="author"
                validators={{
                  onChange: ({ value }) => {
                    if (!value) return 'Forfatter er påkrevd'
                    return undefined
                  },
                }}
              >
                {(field) => <field.Input label="Forfatter" placeholder="Ditt navn..." />}
              </storyForm.AppField>

              {/* Content Field */}
              <storyForm.AppField
                name="content"
                validators={{
                  onChange: ({ value }) => {
                    if (!value) return 'Historie er påkrevd'
                    if (value.length < 10) return 'Historien må være minst 10 tegn'
                    return undefined
                  },
                }}
              >
                {(field) => <field.TextArea label="Historie" rows={8} placeholder="Del din historie..." />}
              </storyForm.AppField>

              <div className="flex gap-3">
                <Button
                  type="submit"
                >
                  {editingId ? 'Oppdater' : 'Publiser'}
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    setEditingId(null)
                    storyForm.reset()
                  }}
                  variant="secondary"
                >
                  Avbryt
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Stories List */}
      <div className="space-y-6">
        {displayedStories.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>Ingen historier funnet for {selectedYear}</p>
          </div>
        ) : (
          displayedStories.map((story) => (
            <article key={story.id}>
              <Card className="border-l-4 border-chart-5 hover:shadow-lg transition-all">
                <CardContent className="pt-6">
                <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="inline-block bg-primary text-primary-foreground px-3 py-1 text-sm font-semibold uppercase tracking-wide">
                      {story.year}
                    </span>
                    <Heading level="h3">{story.title}</Heading>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground uppercase tracking-wide">
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
                  <Button
                    onClick={() => handleEdit(story)}
                    variant="ghost"
                    size="icon-sm"
                    title="Rediger historie"
                  >
                    <Edit2 className="w-5 h-5" />
                  </Button>
                  <Button
                    onClick={() => handleDelete(story.id)}
                    variant="ghost"
                    size="icon-sm"
                    title="Slett historie"
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </div>
              </div>
              <p className="text-card-foreground leading-relaxed whitespace-pre-wrap">{story.content}</p>
              </CardContent>
            </Card>
            </article>
          ))
        )}
      </div>
    </div>
  )
}
