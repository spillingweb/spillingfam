import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { useAppForm } from '@/hooks/form'
import { z } from 'zod'
import {
  User,
  Camera,
  Save,
} from 'lucide-react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '#/components/ui/card.tsx'
import { PageHeader } from '@/components/ui/page-header'
import { Heading } from '@/components/ui/heading'
import { Button } from '@/components/ui/button'

// Zod schemas for validation
const personalInfoSchema = z.object({
  name: z.string().min(1, 'Navn er påkrevd'),
  email: z.string().email('Ugyldig e-postadresse'),
  phone: z.string().min(8, 'Ugyldig telefonnummer'),
  location: z.string().min(1, 'Lokasjon er påkrevd'),
  birthDate: z.string().min(1, 'Fødselsdato er påkrevd'),
})

function Profile() {
  const [notifications, setNotifications] = useState({
    newStories: true,
    familyUpdates: true,
    comments: false,
  })

  // Personal Information Form
  const personalInfoForm = useAppForm({
    defaultValues: {
      name: 'Kari Johnsen',
      email: 'kari.johnsen@example.com',
      phone: '+47 123 45 678',
      location: 'Østfold, Norge',
      birthDate: '1985-06-15',
    },
    onSubmit: async ({ value }) => {
      try {
        const validated = personalInfoSchema.parse(value)
        console.log('Personal info submitted:', validated)
        alert('Profil oppdatert!')
      } catch (error) {
        console.error('Validation error:', error)
      }
    },
  })

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
                <Button className="absolute bottom-0 right-0" size="icon" variant="destructive">
                  <Camera className="w-5 h-5" />
                </Button>
              </div>

              <Heading level="h3" className="text-center mb-2">
                {personalInfoForm.state.values.name}
              </Heading>
              <p className="text-muted-foreground text-center uppercase tracking-wide text-sm">
                {personalInfoForm.state.values.email}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Settings Forms */}
        <div className="lg:col-span-2 space-y-8">
          {/* Personal Information */}
          <Card className="border-l-8 border-chart-4">
            <CardHeader>
              <CardTitle>Personlig informasjon</CardTitle>
            </CardHeader>

            <CardContent>
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  personalInfoForm.handleSubmit()
                }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name Field */}
                  <personalInfoForm.AppField
                    name="name"
                    validators={{
                      onChange: ({ value }) => {
                        if (!value) return 'Navn er påkrevd'
                        return undefined
                      },
                    }}
                  >
                    {(field) => <field.Input label="Fullt navn" />}
                  </personalInfoForm.AppField>

                  {/* Email Field */}
                  <personalInfoForm.AppField
                    name="email"
                    validators={{
                      onChange: ({ value }) => {
                        if (!value) return 'E-post er påkrevd'
                        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
                          return 'Ugyldig e-postadresse'
                        return undefined
                      },
                    }}
                  >
                    {(field) => <field.Input type="email" label="E-post" />}
                  </personalInfoForm.AppField>

                  {/* Phone Field */}
                  <personalInfoForm.AppField
                    name="phone"
                    validators={{
                      onChange: ({ value }) => {
                        if (!value) return 'Telefon er påkrevd'
                        if (value.length < 8) return 'Ugyldig telefonnummer'
                        return undefined
                      },
                    }}
                  >
                    {(field) => <field.Input type="tel" label="Telefon" />}
                  </personalInfoForm.AppField>

                  {/* Location Field */}
                  <personalInfoForm.AppField
                    name="location"
                    validators={{
                      onChange: ({ value }) => {
                        if (!value) return 'Lokasjon er påkrevd'
                        return undefined
                      },
                    }}
                  >
                    {(field) => <field.Input label="Lokasjon" />}
                  </personalInfoForm.AppField>

                  {/* Birth Date Field */}
                  <personalInfoForm.AppField
                    name="birthDate"
                    validators={{
                      onChange: ({ value }) => {
                        if (!value) return 'Fødselsdato er påkrevd'
                        return undefined
                      },
                    }}
                  >
                    {(field) => (
                      <div className="md:col-span-2">
                        <field.CalendarSelect 
                          label="Fødselsdato" 
                          placeholder="Velg fødselsdato"
                          disabledAfter={new Date()}
                        />
                      </div>
                    )}
                  </personalInfoForm.AppField>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                >
                  <Save className="w-5 h-5" />
                  Lagre endringer
                </Button>
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

export const Route = createFileRoute('/profil/')({
  component: Profile,
})
