import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from "react";
import { useAppForm } from '@/hooks/form'
import { z } from 'zod'
import { Plus, Edit2, Trash2, Clock, ChefHat, Users as UsersIcon } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { SearchInput } from "@/components/ui/search-input";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";

// Zod schema for recipe validation
const recipeSchema = z.object({
  title: z.string().min(1, 'Tittel er påkrevd'),
  author: z.string().min(1, 'Forfatter er påkrevd'),
  cookTime: z.string().min(1, 'Tilberedningstid er påkrevd'),
  servings: z.string().min(1, 'Porsjoner er påkrevd'),
  ingredients: z.string().min(10, 'Ingredienser er påkrevd'),
  instructions: z.string().min(10, 'Fremgangsmåte er påkrevd'),
  story: z.string().optional(),
})

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

  // Recipe Form
  const recipeForm = useAppForm({
    defaultValues: {
      title: "",
      author: "",
      cookTime: "",
      servings: "",
      ingredients: "",
      instructions: "",
      story: "",
    },
    onSubmit: async ({ value }) => {
      try {
        const validated = recipeSchema.parse(value)

        if (editingId) {
          setRecipes(recipes.map(recipe =>
            recipe.id === editingId
              ? { ...recipe, ...validated }
              : recipe
          ));
          setEditingId(null);
        } else {
          const newRecipe: Recipe = {
            id: Date.now().toString(),
            ...validated,
          };
          setRecipes([newRecipe, ...recipes]);
        }

        recipeForm.reset();
        setShowForm(false);
      } catch (error) {
        console.error('Validation error:', error)
      }
    },
  });

  // Update form when editing
  useEffect(() => {
    if (editingId) {
      const recipe = recipes.find(r => r.id === editingId)
      if (recipe) {
        recipeForm.setFieldValue('title', recipe.title)
        recipeForm.setFieldValue('author', recipe.author)
        recipeForm.setFieldValue('cookTime', recipe.cookTime)
        recipeForm.setFieldValue('servings', recipe.servings)
        recipeForm.setFieldValue('ingredients', recipe.ingredients)
        recipeForm.setFieldValue('instructions', recipe.instructions)
        recipeForm.setFieldValue('story', recipe.story || '')
      }
    }
  }, [editingId]);

  const handleEdit = (recipe: Recipe) => {
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
          <Button
            onClick={() => {
              setShowForm(!showForm);
              setEditingId(null);
              recipeForm.reset();
            }}
          >
            <Plus className="w-5 h-5" />
            Legg til ny oppskrift
          </Button>
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
            <form
              onSubmit={(e) => {
                e.preventDefault()
                e.stopPropagation()
                recipeForm.handleSubmit()
              }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Title Field */}
                <recipeForm.AppField
                  name="title"
                  validators={{
                    onChange: ({ value }) => {
                      if (!value) return 'Tittel er påkrevd'
                      return undefined
                    },
                  }}
                >
                  {(field) => <field.Input label="Navn på oppskrift" placeholder="F.eks. Bestemors eplekake" />}
                </recipeForm.AppField>

                {/* Author Field */}
                <recipeForm.AppField
                  name="author"
                  validators={{
                    onChange: ({ value }) => {
                      if (!value) return 'Forfatter er påkrevd'
                      return undefined
                    },
                  }}
                >
                  {(field) => <field.Input label="Oppskriftsforfatter" placeholder="Navn" />}
                </recipeForm.AppField>

                {/* Cook Time Field */}
                <recipeForm.AppField
                  name="cookTime"
                  validators={{
                    onChange: ({ value }) => {
                      if (!value) return 'Tilberedningstid er påkrevd'
                      return undefined
                    },
                  }}
                >
                  {(field) => <field.Input label="Tilberedningstid" placeholder="F.eks. 60 min" />}
                </recipeForm.AppField>

                {/* Servings Field */}
                <recipeForm.AppField
                  name="servings"
                  validators={{
                    onChange: ({ value }) => {
                      if (!value) return 'Porsjoner er påkrevd'
                      return undefined
                    },
                  }}
                >
                  {(field) => <field.Input label="Porsjoner" placeholder="F.eks. 6-8" />}
                </recipeForm.AppField>
              </div>

              {/* Ingredients Field */}
              <recipeForm.AppField
                name="ingredients"
                validators={{
                  onChange: ({ value }) => {
                    if (!value) return 'Ingredienser er påkrevd'
                    if (value.length < 10) return 'Ingredienser må være minst 10 tegn'
                    return undefined
                  },
                }}
              >
                {(field) => <field.TextArea label="Ingredienser" rows={6} placeholder="Skriv hver ingrediens på en ny linje..." />}
              </recipeForm.AppField>

              {/* Instructions Field */}
              <recipeForm.AppField
                name="instructions"
                validators={{
                  onChange: ({ value }) => {
                    if (!value) return 'Fremgangsmåte er påkrevd'
                    if (value.length < 10) return 'Fremgangsmåte må være minst 10 tegn'
                    return undefined
                  },
                }}
              >
                {(field) => <field.TextArea label="Fremgangsmåte" rows={8} placeholder="Beskriv fremgangsmåten steg for steg..." />}
              </recipeForm.AppField>

              {/* Story Field (Optional) */}
              <recipeForm.AppField name="story">
                {(field) => <field.TextArea label="Historie (valgfritt)" rows={4} placeholder="Del historien bak oppskriften..." />}
              </recipeForm.AppField>

              <div className="flex gap-3">
                <Button
                  type="submit"
                >
                  {editingId ? "Oppdater" : "Publiser"}
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                    recipeForm.reset();
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
                <Button
                  onClick={() => handleEdit(recipe)}
                  variant="ghost"
                  size="icon-sm"
                  title="Rediger oppskrift"
                >
                  <Edit2 className="w-5 h-5" />
                </Button>
                <Button
                  onClick={() => handleDelete(recipe.id)}
                  variant="ghost"
                  size="icon-sm"
                  title="Slett oppskrift"
                >
                  <Trash2 className="w-5 h-5" />
                </Button>
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

export const Route = createFileRoute('/oppskrifter/')({
  component: Recipes,
})
