import { createFileRoute } from '@tanstack/react-router'
import { useState } from "react";
import { X, Image as ImageIcon, FileText, Filter, Upload, Search } from "lucide-react";

interface ArchiveItem {
  id: string;
  type: "photo" | "document";
  title: string;
  year: string;
  description: string;
  imageUrl?: string;
}

function Archive() {
  const [selectedItem, setSelectedItem] = useState<ArchiveItem | null>(null);
  const [filter, setFilter] = useState<"all" | "photo" | "document">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const archiveItems: ArchiveItem[] = [
    {
      id: "1",
      type: "photo",
      title: "Den opprinnelige låven",
      year: "1928",
      description: "Den røde låven på fullføringsdagen, med hele bygdesamfunnet samlet til feiring.",
      imageUrl: "https://images.unsplash.com/photo-1761959036807-5e711bdd988f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    },
    {
      id: "2",
      type: "document",
      title: "Originalt skjøte",
      year: "1924",
      description: "Skjøtet som overførte 65 mål til oldefar Johan, signert og forseglet på tinghuset.",
      imageUrl: "https://images.unsplash.com/photo-1773415709243-a1ad3e75d6f5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    },
    {
      id: "3",
      type: "photo",
      title: "Høstens innhøsting",
      year: "1952",
      description: "Den legendariske innhøstingen av '52 da sørjordet ga rekordavling.",
      imageUrl: "https://images.unsplash.com/photo-1761959194053-e83d6ee84b0b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    },
    {
      id: "4",
      type: "photo",
      title: "Første traktor",
      year: "1945",
      description: "Bestefar står stolt ved siden av gårdens første traktor, kjøpt etter krigen.",
      imageUrl: "https://images.unsplash.com/photo-1758158368643-96c2e7f74080?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    },
    {
      id: "5",
      type: "document",
      title: "Brev fra tørkåret",
      year: "1935",
      description: "Oldemors brev som beskriver støvstormene og beslutningen om å plante furuskogen som levegge.",
    },
    {
      id: "6",
      type: "photo",
      title: "Vinter på gården",
      year: "1948",
      description: "Et sjeldent fotografi av gården dekket av snø, tatt fra husverandan.",
      imageUrl: "https://images.unsplash.com/photo-1761135055918-86c0aa295e46?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    },
    {
      id: "7",
      type: "document",
      title: "Familiens oppskriftsbok",
      year: "1930-tallet",
      description: "Håndskrevne oppskrifter gått i arv gjennom generasjoner, inkludert den berømte eplekaken som vant på bygdeutstillingen.",
    },
    {
      id: "8",
      type: "photo",
      title: "Låvereising",
      year: "1928",
      description: "Bygdesamfunnet jobber sammen om å reise låveveggene, en tradisjon som brakte naboer langveisfra.",
      imageUrl: "https://images.unsplash.com/photo-1773415784937-8b13669d022c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    },
  ];

  const filteredItems = archiveItems.filter((item) => {
    const matchesFilter = filter === "all" || item.type === filter;
    const matchesSearch = searchQuery
      ? item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.year.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Page Header and Controls */}
      <div className="mb-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-4xl font-serif text-gray-900 mb-3">Familiearkiv</h2>
          <p className="text-lg text-gray-600">Et århundre med minner bevart i fotografier og dokumenter</p>
        </div>
        <button className="flex items-center gap-2 bg-[#F28B1D] text-white px-6 py-2 hover:bg-[#D45E4C] transition-all font-medium uppercase tracking-wide whitespace-nowrap self-start lg:self-auto">
          <Upload className="w-5 h-5" />
          Last opp
        </button>
      </div>

      {/* Search and Filter Controls */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        {/* Search Bar */}
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Søk i arkiv..."
            className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 focus:ring-0 focus:border-[#F28B1D] transition-all"
          />
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-4">
        <Filter className="w-5 h-5 text-gray-600" />
        <button
          onClick={() => setFilter("all")}
          className={`px-5 py-2 transition-all font-medium uppercase tracking-wide text-sm ${
            filter === "all"
              ? "bg-[#B3E9F5] text-gray-900"
              : "bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200"
          }`}
        >
          Alle elementer
        </button>
        <button
          onClick={() => setFilter("photo")}
          className={`px-5 py-2 transition-all flex items-center gap-2 font-medium uppercase tracking-wide text-sm ${
            filter === "photo"
              ? "bg-[#B3E9F5] text-gray-900"
              : "bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200"
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          Fotografier
        </button>
        <button
          onClick={() => setFilter("document")}
          className={`px-5 py-2 transition-all flex items-center gap-2 font-medium uppercase tracking-wide text-sm ${
            filter === "document"
              ? "bg-[#B3E9F5] text-gray-900"
              : "bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200"
          }`}
        >
          <FileText className="w-4 h-4" />
          Dokumenter
        </button>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setSelectedItem(item)}
            className="group bg-white shadow-md overflow-hidden hover:shadow-lg transition-all border-b-4 border-gray-200 hover:border-[#F28B1D]"
          >
            {/* Image or Document Preview */}
            <div className="aspect-square bg-gray-100 relative overflow-hidden">
              {item.imageUrl ? (
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <FileText className="w-16 h-16 text-gray-400" />
                </div>
              )}
              {/* Type Badge */}
              <div className={`absolute top-0 right-0 px-3 py-1 text-xs font-medium uppercase tracking-wide ${
                item.type === "photo"
                  ? "bg-[#B3E9F5] text-gray-900"
                  : "bg-[#B4EDCE] text-gray-900"
              }`}>
                {item.type === "photo" ? "Foto" : "Dokument"}
              </div>
            </div>

            {/* Info */}
            <div className="p-4 text-left">
              <h3 className="font-semibold text-gray-900 mb-1">
                {item.title}
              </h3>
              <p className="text-sm text-gray-600 uppercase tracking-wide">
                {item.year}
              </p>
            </div>
          </button>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="relative max-w-5xl w-full bg-white overflow-hidden shadow-2xl border-t-8 border-[#F28B1D]">
            {/* Close Button */}
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 z-10 bg-gray-900 text-white p-2 hover:bg-gray-800 transition-all"
            >
              <X className="w-6 h-6" />
            </button>

            <div>
              <div className="grid grid-cols-1 lg:grid-cols-2">
                {/* Image Side */}
                <div className="bg-gray-100 aspect-square lg:aspect-auto flex items-center justify-center p-8">
                  {selectedItem.imageUrl ? (
                    <img
                      src={selectedItem.imageUrl}
                      alt={selectedItem.title}
                      className="max-w-full max-h-full object-contain shadow-lg"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-4">
                      <FileText className="w-24 h-24 text-gray-400" />
                      <p className="text-gray-600 font-medium uppercase tracking-wide">Forhåndsvisning av dokument</p>
                    </div>
                  )}
                </div>

                {/* Info Side */}
                <div className="p-8 flex flex-col">
                  <div className={`inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium mb-4 self-start uppercase tracking-wide ${
                    selectedItem.type === "photo"
                      ? "bg-[#B3E9F5] text-gray-900"
                      : "bg-[#B4EDCE] text-gray-900"
                  }`}>
                    {selectedItem.type === "photo" ? (
                      <>
                        <ImageIcon className="w-4 h-4" />
                        Fotografi
                      </>
                    ) : (
                      <>
                        <FileText className="w-4 h-4" />
                        Dokument
                      </>
                    )}
                  </div>

                  <h2 className="text-3xl font-semibold text-gray-900 mb-2">
                    {selectedItem.title}
                  </h2>
                  <p className="text-lg text-gray-600 mb-6 uppercase tracking-wide">
                    {selectedItem.year}
                  </p>
                  <p className="text-gray-700 leading-relaxed flex-grow">
                    {selectedItem.description}
                  </p>

                  <div className="mt-6 pt-6 border-t-2 border-gray-200">
                    <p className="text-gray-600 text-sm">
                      Del av vår families arvesamling, bevart for fremtidige generasjoner.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export const Route = createFileRoute('/archive')({
  component: Archive,
})
