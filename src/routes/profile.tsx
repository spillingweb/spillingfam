import { createFileRoute } from '@tanstack/react-router'
import { useState } from "react";
import { User, Mail, Phone, MapPin, Calendar, Camera, Bell, Lock, Save, Users } from "lucide-react";

function Profile() {
  const [formData, setFormData] = useState({
    name: "Kari Johnsen",
    email: "kari.johnsen@example.com",
    phone: "+47 123 45 678",
    location: "Østfold, Norge",
    birthDate: "1985-06-15",
  });

  const [treePosition, setTreePosition] = useState({
    generation: "3",
    parentName: "Per Johansen",
    relationship: "daughter",
  });

  const [notifications, setNotifications] = useState({
    newStories: true,
    familyUpdates: true,
    comments: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Profil oppdatert!");
  };

  const handleTreeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Plassering i slektstre oppdatert!");
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="mb-10">
        <h2 className="text-4xl font-serif text-gray-900 mb-3">Min profil</h2>
        <p className="text-lg text-gray-600">Administrer din informasjon og innstillinger</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-white shadow-md border-2 border-gray-200 p-8 sticky top-28">
            {/* Avatar */}
            <div className="relative w-32 h-32 mx-auto mb-6">
              <div className="w-32 h-32 bg-[#F28B1D] flex items-center justify-center shadow-md">
                <User className="w-16 h-16 text-white" />
              </div>
              <button className="absolute bottom-0 right-0 w-10 h-10 bg-[#D45E4C] flex items-center justify-center shadow-md hover:scale-110 transition-transform">
                <Camera className="w-5 h-5 text-white" />
              </button>
            </div>

            <h3 className="text-2xl font-semibold text-gray-900 text-center mb-2">
              {formData.name}
            </h3>
            <p className="text-gray-600 text-center uppercase tracking-wide text-sm">{formData.email}</p>
          </div>
        </div>

        {/* Settings Forms */}
        <div className="lg:col-span-2 space-y-8">
          {/* Personal Information */}
          <div className="bg-white shadow-md border-l-8 border-[#B4EDCE] p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-[#B4EDCE] flex items-center justify-center">
                <User className="w-6 h-6 text-gray-800" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 uppercase tracking-wide">Personlig informasjon</h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 uppercase tracking-wide">
                    Fullt navn
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 focus:ring-0 focus:border-[#F28B1D] transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 uppercase tracking-wide">
                    E-post
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 focus:ring-0 focus:border-[#F28B1D] transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 uppercase tracking-wide">
                    Telefon
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 focus:ring-0 focus:border-[#F28B1D] transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 uppercase tracking-wide">
                    Lokasjon
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 focus:ring-0 focus:border-[#F28B1D] transition-all"
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2 uppercase tracking-wide">
                    Fødselsdato
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="date"
                      value={formData.birthDate}
                      onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 focus:ring-0 focus:border-[#F28B1D] transition-all"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#F28B1D] text-white font-medium hover:bg-[#D45E4C] transition-all shadow-md flex items-center justify-center gap-2 uppercase tracking-wide"
              >
                <Save className="w-5 h-5" />
                Lagre endringer
              </button>
            </form>
          </div>

          {/* Family Tree Placement */}
          <div className="bg-white shadow-md border-l-8 border-[#B3E9F5] p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-[#B3E9F5] flex items-center justify-center">
                <Users className="w-6 h-6 text-gray-800" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 uppercase tracking-wide">Plassering i slektstreet</h3>
            </div>

            <p className="text-gray-600 mb-6">
              Definer din plass i familietreet slik at andre kan se ditt forhold til resten av slekten.
            </p>

            <form onSubmit={handleTreeSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 uppercase tracking-wide">
                  Generasjon
                </label>
                <select
                  value={treePosition.generation}
                  onChange={(e) => setTreePosition({ ...treePosition, generation: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 focus:ring-0 focus:border-[#F28B1D] transition-all"
                >
                  <option value="1">Generasjon 1 - Oldeforeldre</option>
                  <option value="2">Generasjon 2 - Besteforeldre</option>
                  <option value="3">Generasjon 3 - Foreldre</option>
                  <option value="4">Generasjon 4 - Denne generasjonen</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 uppercase tracking-wide">
                  Forhold til
                </label>
                <select
                  value={treePosition.relationship}
                  onChange={(e) => setTreePosition({ ...treePosition, relationship: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 focus:ring-0 focus:border-[#F28B1D] transition-all"
                >
                  <option value="son">Sønn av</option>
                  <option value="daughter">Datter av</option>
                  <option value="spouse">Ektefelle til</option>
                  <option value="sibling">Søsken av</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 uppercase tracking-wide">
                  Forelder/relatert person
                </label>
                <select
                  value={treePosition.parentName}
                  onChange={(e) => setTreePosition({ ...treePosition, parentName: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 focus:ring-0 focus:border-[#F28B1D] transition-all"
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

              <div className="bg-[#B3E9F5]/20 p-4 border-l-4 border-[#B3E9F5]">
                <p className="text-sm text-gray-700">
                  <strong>Eksempel:</strong> Du er {" "}
                  <span className="font-semibold text-gray-900">
                    {treePosition.relationship === "son" ? "sønn" :
                     treePosition.relationship === "daughter" ? "datter" :
                     treePosition.relationship === "spouse" ? "ektefelle" : "søsken"} av {treePosition.parentName}
                  </span> i generasjon {treePosition.generation}.
                </p>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#F28B1D] text-white font-medium hover:bg-[#D45E4C] transition-all shadow-md flex items-center justify-center gap-2 uppercase tracking-wide"
              >
                <Save className="w-5 h-5" />
                Oppdater slektstre
              </button>
            </form>
          </div>

          {/* Notifications */}
          <div className="bg-white shadow-md border-l-8 border-[#B4EDCE] p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-[#B4EDCE] flex items-center justify-center">
                <Bell className="w-6 h-6 text-gray-800" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 uppercase tracking-wide">Varsler</h3>
            </div>

            <div className="space-y-4">
              <label className="flex items-center justify-between p-4 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors border-l-4 border-transparent hover:border-[#B4EDCE]">
                <div>
                  <div className="font-medium text-gray-900">Nye historier</div>
                  <div className="text-sm text-gray-600">Få varsel når noen publiserer en ny historie</div>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.newStories}
                  onChange={(e) => setNotifications({ ...notifications, newStories: e.target.checked })}
                  className="w-5 h-5 border-gray-300 text-[#F28B1D] focus:ring-[#F28B1D]"
                />
              </label>

              <label className="flex items-center justify-between p-4 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors border-l-4 border-transparent hover:border-[#B4EDCE]">
                <div>
                  <div className="font-medium text-gray-900">Familieoppdateringer</div>
                  <div className="text-sm text-gray-600">Varsler om endringer i slektstreet</div>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.familyUpdates}
                  onChange={(e) => setNotifications({ ...notifications, familyUpdates: e.target.checked })}
                  className="w-5 h-5 border-gray-300 text-[#F28B1D] focus:ring-[#F28B1D]"
                />
              </label>

              <label className="flex items-center justify-between p-4 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors border-l-4 border-transparent hover:border-[#B4EDCE]">
                <div>
                  <div className="font-medium text-gray-900">Kommentarer</div>
                  <div className="text-sm text-gray-600">Få varsel når noen kommenterer på dine innlegg</div>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.comments}
                  onChange={(e) => setNotifications({ ...notifications, comments: e.target.checked })}
                  className="w-5 h-5 border-gray-300 text-[#F28B1D] focus:ring-[#F28B1D]"
                />
              </label>
            </div>
          </div>

          {/* Security */}
          <div className="bg-white shadow-md border-l-8 border-[#D45E4C] p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-[#D45E4C] flex items-center justify-center">
                <Lock className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 uppercase tracking-wide">Sikkerhet</h3>
            </div>

            <div className="space-y-3">
              <button className="w-full p-4 bg-gray-50 text-left hover:bg-gray-100 transition-colors flex items-center justify-between group border-l-4 border-transparent hover:border-[#D45E4C]">
                <div>
                  <div className="font-medium text-gray-900">Endre passord</div>
                  <div className="text-sm text-gray-600">Oppdater ditt passord</div>
                </div>
                <span className="text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all">→</span>
              </button>

              <button className="w-full p-4 bg-gray-50 text-left hover:bg-gray-100 transition-colors flex items-center justify-between group border-l-4 border-transparent hover:border-[#D45E4C]">
                <div>
                  <div className="font-medium text-gray-900">Tofaktorautentisering</div>
                  <div className="text-sm text-gray-600">Legg til ekstra sikkerhet</div>
                </div>
                <span className="text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all">→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute('/profile')({
  component: Profile,
})
