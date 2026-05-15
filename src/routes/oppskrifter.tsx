import { createFileRoute } from '@tanstack/react-router'
import { useState } from "react";
import { Plus, Edit2, Trash2, Clock, ChefHat, Users as UsersIcon } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { SearchInput } from "@/components/ui/search-input";
import { Heading } from "@/components/ui/heading";

interface Recipe {
  id: string;
  title: string;
  author: string;
  cookTime: string;
  servings: string;
  ingredients: string;
  instructions: string;
  story?: string;
}

function Recipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([
    {
      id: "1",
      title: "Bestemors eplekake",
      author: "Kari Persdatter",
      cookTime: "60 min",
      servings: "8-10",
      ingredients: `500g mel
200g smør
3 egg
200g sukker
1 ts bakepulver
5-6 epler
1 ts kanel`,
      instructions: `1. Forvarm ovnen til 180°C
2. Smør en kakeform
3. Bland mel, sukker og bakepulver
4. Tilsett smør og egg, rør godt
5. Hell halvparten av røren i formen
6. Legg på skivede epler og dryss kanel
7. Hell over resten av røren
8. Stek i 50-60 minutter`,
      story: "Denne oppskriften har gått i arv gjennom fire generasjoner. Bestemor vant første premie på bygdeutstillingen i 1962 med denne kaken.",
    },
    {
      id: "2",
      title: "Tradisjonell kjøttkaker",
      author: "Ingrid Hansen",
      cookTime: "45 min",
      servings: "6",
      ingredients: `800g kjøttdeig
1 egg
2 dl melk
3 ss hvetemel
Salt og pepper
Smør til steking`,
      instructions: `1. Bland kjøttdeig, egg, melk og mel
2. Krydre med salt og pepper
3. Form til kaker
4. Stek i smør på middels varme til de er gjennomstekt
5. Server med poteter, erter og brun saus`,
      story: "Dette var oldefars favorittmåltid. Han krevde alltid at kjøttkakene skulle være store som tallerkenen.",
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    cookTime: "",
    servings: "",
    ingredients: "",
    instructions: "",
    story: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingId) {
      setRecipes(recipes.map(recipe =>
        recipe.id === editingId
          ? { ...recipe, ...formData }
          : recipe
      ));
      setEditingId(null);
    } else {
      const newRecipe: Recipe = {
        id: Date.now().toString(),
        ...formData,
      };
      setRecipes([newRecipe, ...recipes]);
    }

    setFormData({ title: "", author: "", cookTime: "", servings: "", ingredients: "", instructions: "", story: "" });
    setShowForm(false);
  };

  const handleEdit = (recipe: Recipe) => {
    setFormData({
      title: recipe.title,
      author: recipe.author,
      cookTime: recipe.cookTime,
      servings: recipe.servings,
      ingredients: recipe.ingredients,
      instructions: recipe.instructions,
      story: recipe.story || "",
    });
    setEditingId(recipe.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Er du sikker på at du vil slette denne oppskriften?")) {
      setRecipes(recipes.filter(recipe => recipe.id !== id));
    }
  };

  // Filter recipes by search query
  const displayedRecipes = recipes.filter(recipe => {
    if (!searchQuery) return true;
    return recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
           recipe.ingredients.toLowerCase().includes(searchQuery.toLowerCase()) ||
           recipe.author.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="space-y-8">
      <PageHeader
        title="Familieoppskrifter"
        description="Tradisjonelle oppskrifter bevart gjennom generasjoner"
        action={
          <button
            onClick={() => {
              setShowForm(!showForm);
              setEditingId(null);
              setFormData({ title: "", author: "", cookTime: "", servings: "", ingredients: "", instructions: "", story: "" });
            }}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 hover:bg-primary/90 transition-all font-medium uppercase tracking-wide whitespace-nowrap"
          >
            <Plus className="w-5 h-5" />
            Legg til ny oppskrift
          </button>
        }
      />

      <SearchInput
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="Søk i oppskrifter..."
      />

      {/* Recipe Form */}
      {showForm && (
        <Card className="border-l-8 border-primary mb-8">
          <CardHeader>
            <CardTitle className="uppercase tracking-wide">
              {editingId ? "Rediger oppskrift" : "Ny oppskrift"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-card-foreground mb-2 uppercase tracking-wide">
                    Navn på oppskrift
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-input focus:ring-0 focus:border-primary transition-all"
                    placeholder="F.eks. Bestemors eplekake"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-card-foreground mb-2 uppercase tracking-wide">
                    Oppskriftsforfatter
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-input focus:ring-0 focus:border-primary transition-all"
                    placeholder="Navn"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-card-foreground mb-2 uppercase tracking-wide">
                    Tilberedningstid
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.cookTime}
                    onChange={(e) => setFormData({ ...formData, cookTime: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-input focus:ring-0 focus:border-primary transition-all"
                    placeholder="F.eks. 60 min"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-card-foreground mb-2 uppercase tracking-wide">
                    Porsjoner
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.servings}
                    onChange={(e) => setFormData({ ...formData, servings: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-input focus:ring-0 focus:border-primary transition-all"
                    placeholder="F.eks. 6-8"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-card-foreground mb-2 uppercase tracking-wide">
                  Ingredienser
                </label>
                <textarea
                  required
                  value={formData.ingredients}
                  onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
                  rows={6}
                  className="w-full px-4 py-3 border-2 border-input focus:ring-0 focus:border-primary transition-all resize-none"
                  placeholder="Skriv hver ingrediens på en ny linje..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-card-foreground mb-2 uppercase tracking-wide">
                  Fremgangsmåte
                </label>
                <textarea
                  required
                  value={formData.instructions}
                  onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                  rows={8}
                  className="w-full px-4 py-3 border-2 border-input focus:ring-0 focus:border-primary transition-all resize-none"
                  placeholder="Beskriv fremgangsmåten steg for steg..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-card-foreground mb-2 uppercase tracking-wide">
                  Historie (valgfritt)
                </label>
                <textarea
                  value={formData.story}
                  onChange={(e) => setFormData({ ...formData, story: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-input focus:ring-0 focus:border-primary transition-all resize-none"
                  placeholder="Del historien bak oppskriften..."
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="bg-primary text-primary-foreground px-8 py-3 hover:bg-primary/90 transition-all font-medium uppercase tracking-wide"
                >
                  {editingId ? "Oppdater" : "Publiser"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                    setFormData({ title: "", author: "", cookTime: "", servings: "", ingredients: "", instructions: "", story: "" });
                  }}
                  className="bg-secondary text-secondary-foreground px-8 py-3 hover:bg-secondary/90 transition-all font-medium uppercase tracking-wide"
                >
                  Avbryt
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Recipes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {displayedRecipes.length === 0 ? (
          <div className="col-span-2 text-center py-12 text-muted-foreground">
            <p>Ingen oppskrifter funnet</p>
          </div>
        ) : (
          displayedRecipes.map((recipe) => (
          <article key={recipe.id}>
            <Card className="border-b-4 border-chart-5 hover:shadow-lg transition-all">
              <CardContent className="pt-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <ChefHat className="w-6 h-6 text-primary" />
                  <Heading level="h3">{recipe.title}</Heading>
                </div>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4 uppercase tracking-wide">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    {recipe.cookTime}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <UsersIcon className="w-4 h-4" />
                    {recipe.servings} porsjoner
                  </span>
                  <span>
                    av {recipe.author}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(recipe)}
                  className="p-2 text-muted-foreground hover:bg-muted transition-all"
                  title="Rediger oppskrift"
                >
                  <Edit2 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(recipe.id)}
                  className="p-2 text-muted-foreground hover:bg-muted transition-all"
                  title="Slett oppskrift"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {recipe.story && (
              <div className="bg-chart-5/20 p-4 mb-4 border-l-4 border-chart-5">
                <p className="text-sm text-card-foreground italic">{recipe.story}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-foreground mb-2 uppercase tracking-wide text-sm">Ingredienser:</h4>
                <div className="text-sm text-card-foreground whitespace-pre-line bg-muted p-3 border-l-2 border">
                  {recipe.ingredients}
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2 uppercase tracking-wide text-sm">Fremgangsmåte:</h4>
                <div className="text-sm text-card-foreground whitespace-pre-line bg-muted p-3 border-l-2 border">
                  {recipe.instructions}
                </div>
              </div>
            </div>
            </CardContent>
          </Card>
          </article>
          ))
        )}
      </div>
    </div>
  );
}

export const Route = createFileRoute('/oppskrifter')({
  component: Recipes,
})
