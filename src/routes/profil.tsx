import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Camera,
  Bell,
  Lock,
  Save,
  Users,
} from 'lucide-react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '#/components/ui/card.tsx'
import { PageHeader } from '@/components/ui/page-header'
import { Heading } from '@/components/ui/heading'

function Profile() {
  const [formData, setFormData] = useState({
    name: 'Kari Johnsen',
    email: 'kari.johnsen@example.com',
    phone: '+47 123 45 678',
    location: 'Østfold, Norge',
    birthDate: '1985-06-15',
  })

  const [treePosition, setTreePosition] = useState({
    generation: '3',
    parentName: 'Per Johansen',
    relationship: 'daughter',
  })

  const [notifications, setNotifications] = useState({
    newStories: true,
    familyUpdates: true,
    comments: false,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert('Profil oppdatert!')
  }

  const handleTreeSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert('Plassering i slektstre oppdatert!')
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <PageHeader
        title="Min profil"
        description="Administrer din informasjon og innstillinger"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <Card className="sticky top-28">
            <CardContent>
              {/* Avatar */}
              <div className="relative w-32 h-32 mx-auto mb-6">
                <div className="w-32 h-32 bg-primary flex items-center justify-center shadow-md">
                  <User className="w-16 h-16 text-primary-foreground" />
                </div>
                <button className="absolute bottom-0 right-0 w-10 h-10 bg-destructive flex items-center justify-center shadow-md hover:scale-110 transition-transform">
                  <Camera className="w-5 h-5 text-destructive-foreground" />
                </button>
              </div>

              <Heading level="h3" className="text-center mb-2">
                {formData.name}
              </Heading>
              <p className="text-muted-foreground text-center uppercase tracking-wide text-sm">
                {formData.email}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Settings Forms */}
        <div className="lg:col-span-2 space-y-8">
          {/* Personal Information */}
          <Card className="border-l-8 border-chart-5">
            <CardHeader>
              <CardTitle>Personlig informasjon</CardTitle>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-card-foreground mb-2 uppercase tracking-wide">
                      Fullt navn
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="w-full pl-12 pr-4 py-3 border-2 border-input focus:ring-0 focus:border-primary transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-card-foreground mb-2 uppercase tracking-wide">
                      E-post
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="w-full pl-12 pr-4 py-3 border-2 border-input focus:ring-0 focus:border-primary transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-card-foreground mb-2 uppercase tracking-wide">
                      Telefon
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        className="w-full pl-12 pr-4 py-3 border-2 border-input focus:ring-0 focus:border-primary transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-card-foreground mb-2 uppercase tracking-wide">
                      Lokasjon
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) =>
                          setFormData({ ...formData, location: e.target.value })
                        }
                        className="w-full pl-12 pr-4 py-3 border-2 border-input focus:ring-0 focus:border-primary transition-all"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-card-foreground mb-2 uppercase tracking-wide">
                      Fødselsdato
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <input
                        type="date"
                        value={formData.birthDate}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            birthDate: e.target.value,
                          })
                        }
                        className="w-full pl-12 pr-4 py-3 border-2 border-input focus:ring-0 focus:border-primary transition-all"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-all shadow-md flex items-center justify-center gap-2 uppercase tracking-wide"
                >
                  <Save className="w-5 h-5" />
                  Lagre endringer
                </button>
              </form>
            </CardContent>
          </Card>

          {/* Family Tree Placement */}
          <Card className="border-l-8 border-chart-4">
            <CardHeader>
              <CardTitle>Plassering i slektstreet</CardTitle>
              <CardDescription>
                Definer din plass i familietreet slik at andre kan se ditt
                forhold til resten av slekten.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleTreeSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-card-foreground mb-2 uppercase tracking-wide">
                    Generasjon
                  </label>
                  <select
                    value={treePosition.generation}
                    onChange={(e) =>
                      setTreePosition({
                        ...treePosition,
                        generation: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border-2 border-input focus:ring-0 focus:border-primary transition-all"
                  >
                    <option value="1">Generasjon 1 - Oldeforeldre</option>
                    <option value="2">Generasjon 2 - Besteforeldre</option>
                    <option value="3">Generasjon 3 - Foreldre</option>
                    <option value="4">Generasjon 4 - Denne generasjonen</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-card-foreground mb-2 uppercase tracking-wide">
                    Forhold til
                  </label>
                  <select
                    value={treePosition.relationship}
                    onChange={(e) =>
                      setTreePosition({
                        ...treePosition,
                        relationship: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border-2 border-input focus:ring-0 focus:border-primary transition-all"
                  >
                    <option value="son">Sønn av</option>
                    <option value="daughter">Datter av</option>
                    <option value="spouse">Ektefelle til</option>
                    <option value="sibling">Søsken av</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-card-foreground mb-2 uppercase tracking-wide">
                    Forelder/relatert person
                  </label>
                  <select
                    value={treePosition.parentName}
                    onChange={(e) =>
                      setTreePosition({
                        ...treePosition,
                        parentName: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border-2 border-input focus:ring-0 focus:border-primary transition-all"
                  >
                    <option value="Johan Olsen">Johan Olsen</option>
                    <option value="Kari Johnsdatter">Kari Johnsdatter</option>
                    <option value="Per Johansen">Per Johansen</option>
                    <option value="Ingrid Hansen">Ingrid Hansen</option>
                    <option value="Henrik Johansen">Henrik Johansen</option>
                    <option value="Kari Persdatter">Kari Persdatter</option>
                    <option value="Ola Andersen">Ola Andersen</option>
                    <option value="Marit Persdatter">Marit Persdatter</option>
                  </select>
                </div>

                <div className="bg-chart-4/20 p-4 border-l-4 border-chart-4">
                  <p className="text-sm text-card-foreground">
                    <strong>Eksempel:</strong> Du er{' '}
                    <span className="font-semibold text-foreground">
                      {treePosition.relationship === 'son'
                        ? 'sønn'
                        : treePosition.relationship === 'daughter'
                          ? 'datter'
                          : treePosition.relationship === 'spouse'
                            ? 'ektefelle'
                            : 'søsken'}{' '}
                      av {treePosition.parentName}
                    </span>{' '}
                    i generasjon {treePosition.generation}.
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-all shadow-md flex items-center justify-center gap-2 uppercase tracking-wide"
                >
                  <Save className="w-5 h-5" />
                  Oppdater slektstre
                </button>
              </form>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card className="border-l-8 border-chart-5">
            <CardHeader>
              <CardTitle>Varsler</CardTitle>
            </CardHeader>

            <CardContent>
              <div className="space-y-4">
                <label className="flex items-center justify-between p-4 bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors border-l-4 border-transparent hover:border-chart-5">
                  <div>
                    <div className="font-medium text-foreground">
                      Nye historier
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Få varsel når noen publiserer en ny historie
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifications.newStories}
                    onChange={(e) =>
                      setNotifications({
                        ...notifications,
                        newStories: e.target.checked,
                      })
                    }
                    className="w-5 h-5 border-input text-primary focus:ring-primary"
                  />
                </label>

                <label className="flex items-center justify-between p-4 bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors border-l-4 border-transparent hover:border-chart-5">
                  <div>
                    <div className="font-medium text-foreground">
                      Familieoppdateringer
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Varsler om endringer i slektstreet
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifications.familyUpdates}
                    onChange={(e) =>
                      setNotifications({
                        ...notifications,
                        familyUpdates: e.target.checked,
                      })
                    }
                    className="w-5 h-5 border-input text-primary focus:ring-primary"
                  />
                </label>

                <label className="flex items-center justify-between p-4 bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors border-l-4 border-transparent hover:border-chart-5">
                  <div>
                    <div className="font-medium text-foreground">
                      Kommentarer
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Få varsel når noen kommenterer på dine innlegg
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifications.comments}
                    onChange={(e) =>
                      setNotifications({
                        ...notifications,
                        comments: e.target.checked,
                      })
                    }
                    className="w-5 h-5 border-input text-primary focus:ring-primary"
                  />
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Security */}
          <Card className="border-l-8 border-destructive">
            <CardHeader>
              <CardTitle>Sikkerhet</CardTitle>
            </CardHeader>

            <CardContent>
              <div className="space-y-3">
                <button className="w-full p-4 bg-muted/30 text-left hover:bg-muted/50 transition-colors flex items-center justify-between group border-l-4 border-transparent hover:border-destructive">
                  <div>
                    <div className="font-medium text-foreground">
                      Endre passord
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Oppdater ditt passord
                    </div>
                  </div>
                  <span className="text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all">
                    →
                  </span>
                </button>

                <button className="w-full p-4 bg-muted/30 text-left hover:bg-muted/50 transition-colors flex items-center justify-between group border-l-4 border-transparent hover:border-destructive">
                  <div>
                    <div className="font-medium text-foreground">
                      Tofaktorautentisering
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Legg til ekstra sikkerhet
                    </div>
                  </div>
                  <span className="text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all">
                    →
                  </span>
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export const Route = createFileRoute('/profil')({
  component: Profile,
})
