import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

// Type definitions
interface Nutrient {
  label: string;
  quantity: number;
  unit: string;
}

interface Recipe {
  label: string;
  image: string;
  source: string;
  url: string;
  yield?: number;
  calories: number;
  totalTime?: number;
  mealType?: string[];
  dietLabels?: string[];
  healthLabels?: string[];
  ingredientLines?: string[];
  totalNutrients?: {
    ENERC_KCAL?: Nutrient;
    PROCNT?: Nutrient;
    FAT?: Nutrient;
    CHOCDF?: Nutrient;
    FIBTG?: Nutrient;
    NA?: Nutrient;
    [key: string]: Nutrient | undefined;
  };
}

interface RecipeHit {
  recipe: Recipe;
}

interface EdamamResponse {
  hits: RecipeHit[];
}

interface FetchRecipesParams {
  queryKey: [string, string];
}

function App() {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [query, setQuery] = useState<string>('chicken');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  const fetchRecipes = async ({ queryKey }: FetchRecipesParams): Promise<RecipeHit[]> => {
    const currentQuery = queryKey[1];
    const response = await fetch(
      `https://www.edamam.com/api/recipes/v2?type=public&q=${currentQuery}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data: EdamamResponse = await response.json();
    return data.hits;
  };

  const { data: recipes, isLoading, error } = useQuery({
    queryKey: ['recipes', query],
    queryFn: fetchRecipes,
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    setQuery(searchTerm);
    setSelectedRecipe(null); // Close modal when searching
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      handleSearchSubmit(e as any);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-500 mx-auto mb-4"></div>
          <p className="text-2xl font-semibold text-gray-700 animate-pulse">Discovering delicious recipes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md mx-4">
          <div className="text-center">
            <div className="text-6xl mb-4">😞</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops!</h2>
            <p className="text-gray-600">An error occurred: {error.message}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-orange-500 via-red-500 to-pink-500">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative container mx-auto px-6 py-20">
          <div className="text-center">
            <h1 className="text-6xl font-bold text-white mb-4 drop-shadow-lg">
              Recipe <span className="text-yellow-300">Finder</span>
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
              Discover amazing recipes from around the world. Search for your favorite ingredients and find culinary inspiration!
            </p>
            
            {/* Search Form */}
            <div className="max-w-2xl mx-auto">
              <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-4 bg-white/20 backdrop-blur-sm rounded-2xl p-4">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  placeholder="Search for recipes... (e.g., pasta, chicken, vegetables)"
                  className="flex-1 px-6 py-4 rounded-xl border-0 bg-white/90 backdrop-blur-sm text-gray-800 placeholder-gray-500 text-lg focus:outline-none focus:ring-4 focus:ring-yellow-300/50 transition-all duration-300"
                  onKeyPress={handleKeyPress}
                />
                <button 
                  type="submit"
                  className="px-8 py-4 bg-yellow-400 hover:bg-yellow-300 text-gray-800 font-bold rounded-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-yellow-300/50 shadow-lg"
                >
                  🔍 Search
                </button>
              </form>
            </div>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 text-6xl opacity-20 animate-bounce">🍳</div>
        <div className="absolute top-40 right-20 text-4xl opacity-20 animate-pulse">🥘</div>
        <div className="absolute bottom-10 left-1/4 text-5xl opacity-20 animate-bounce delay-500">🍝</div>
      </div>

      {/* Results Section */}
      <div className="container mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            {query.charAt(0).toUpperCase() + query.slice(1)} Recipes
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-pink-500 mx-auto rounded-full"></div>
        </div>

        {recipes && recipes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {recipes.map((hit, index) => (
              <div 
                key={index}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden group cursor-pointer"
                onClick={() => setSelectedRecipe(hit.recipe)}
              >
                <div className="relative overflow-hidden">
                  <img 
                    src={hit.recipe.image} 
                    alt={hit.recipe.label}
                    className="w-full h-48 object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="bg-white/90 px-3 py-1 rounded-full text-sm font-semibold text-gray-800">
                      🕒 {hit.recipe.totalTime ? `${hit.recipe.totalTime} min` : 'Quick'}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Click for details
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2 group-hover:text-orange-600 transition-colors duration-300">
                    {hit.recipe.label}
                  </h3>
                  
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                    <span className="flex items-center">
                      👥 {hit.recipe.yield || '4'} servings
                    </span>
                    <span className="flex items-center">
                      🔥 {Math.round(hit.recipe.calories / (hit.recipe.yield || 4))} cal
                    </span>
                  </div>

                  {hit.recipe.dietLabels && hit.recipe.dietLabels.length > 0 && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2">
                        {hit.recipe.dietLabels.slice(0, 2).map((label, i) => (
                          <span key={i} className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                            {label}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedRecipe(hit.recipe);
                      }}
                      className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-3 px-4 rounded-xl text-center transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm"
                    >
                      View Details
                    </button>
                    <a 
                      href={hit.recipe.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-3 px-4 rounded-xl text-center transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm"
                    >
                      Full Recipe →
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-8xl mb-6">🍽️</div>
            <h3 className="text-3xl font-bold text-gray-700 mb-4">No recipes found</h3>
            <p className="text-gray-600 text-lg max-w-md mx-auto">
              Try searching for different ingredients or popular dishes like "pasta", "chicken", or "salad"
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12 mt-20">
        <div className="container mx-auto px-6 text-center">
          <div className="text-4xl mb-4">🍳</div>
          <p className="text-gray-300">
            Powered by Edamam Recipe API • Find your next favorite dish
          </p>
        </div>
      </footer>

      {/* Recipe Detail Modal */}
      {selectedRecipe && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Modal Header */}
            <div className="relative">
              <img 
                src={selectedRecipe.image} 
                alt={selectedRecipe.label}
                className="w-full h-64 object-cover rounded-t-3xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-t-3xl"></div>
              <button 
                onClick={() => setSelectedRecipe(null)}
                className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300"
              >
                ✕
              </button>
              <div className="absolute bottom-6 left-6 text-white">
                <h2 className="text-3xl font-bold mb-2">{selectedRecipe.label}</h2>
                <p className="text-lg opacity-90">by {selectedRecipe.source}</p>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-8">
              {/* Recipe Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-orange-50 rounded-2xl p-4 text-center">
                  <div className="text-2xl mb-1">👥</div>
                  <div className="text-sm text-gray-600">Servings</div>
                  <div className="text-xl font-bold text-orange-600">{selectedRecipe.yield || 4}</div>
                </div>
                <div className="bg-red-50 rounded-2xl p-4 text-center">
                  <div className="text-2xl mb-1">🔥</div>
                  <div className="text-sm text-gray-600">Calories per serving</div>
                  <div className="text-xl font-bold text-red-600">
                    {Math.round(selectedRecipe.calories / (selectedRecipe.yield || 4))}
                  </div>
                </div>
                <div className="bg-green-50 rounded-2xl p-4 text-center">
                  <div className="text-2xl mb-1">🕒</div>
                  <div className="text-sm text-gray-600">Total Time</div>
                  <div className="text-xl font-bold text-green-600">
                    {selectedRecipe.totalTime ? `${selectedRecipe.totalTime} min` : 'Quick'}
                  </div>
                </div>
                <div className="bg-purple-50 rounded-2xl p-4 text-center">
                  <div className="text-2xl mb-1">🍽️</div>
                  <div className="text-sm text-gray-600">Meal Type</div>
                  <div className="text-xl font-bold text-purple-600 capitalize">
                    {selectedRecipe.mealType?.[0] || 'Any time'}
                  </div>
                </div>
              </div>

              {/* Diet and Health Labels */}
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Dietary Information</h3>
                <div className="space-y-4">
                  {selectedRecipe.dietLabels && selectedRecipe.dietLabels.length > 0 && (
                    <div>
                      <h4 className="text-lg font-semibold text-gray-700 mb-2">Diet Labels</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedRecipe.dietLabels.map((label, i) => (
                          <span key={i} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                            {label}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {selectedRecipe.healthLabels && selectedRecipe.healthLabels.length > 0 && (
                    <div>
                      <h4 className="text-lg font-semibold text-gray-700 mb-2">Health Labels</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedRecipe.healthLabels.slice(0, 8).map((label, i) => (
                          <span key={i} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                            {label.replace(/-/g, ' ')}
                          </span>
                        ))}
                        {selectedRecipe.healthLabels.length > 8 && (
                          <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
                            +{selectedRecipe.healthLabels.length - 8} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Ingredients */}
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Ingredients</h3>
                <div className="bg-gray-50 rounded-2xl p-6">
                  <ul className="space-y-2">
                    {selectedRecipe.ingredientLines?.map((ingredient, i) => (
                      <li key={i} className="flex items-start">
                        <span className="text-orange-500 mr-3 mt-1">•</span>
                        <span className="text-gray-700">{ingredient}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Nutrition Information */}
              {selectedRecipe.totalNutrients && (
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">Nutrition Facts (per serving)</h3>
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {[
                        { key: 'ENERC_KCAL', label: 'Calories', unit: 'kcal', color: 'text-red-600' },
                        { key: 'PROCNT', label: 'Protein', unit: 'g', color: 'text-blue-600' },
                        { key: 'FAT', label: 'Fat', unit: 'g', color: 'text-yellow-600' },
                        { key: 'CHOCDF', label: 'Carbs', unit: 'g', color: 'text-green-600' },
                        { key: 'FIBTG', label: 'Fiber', unit: 'g', color: 'text-purple-600' },
                        { key: 'NA', label: 'Sodium', unit: 'mg', color: 'text-orange-600' }
                      ].map(nutrient => {
                        const value = selectedRecipe.totalNutrients?.[nutrient.key];
                        if (!value) return null;
                        return (
                          <div key={nutrient.key} className="text-center">
                            <div className={`text-2xl font-bold ${nutrient.color}`}>
                              {Math.round(value.quantity / (selectedRecipe.yield || 4))}
                            </div>
                            <div className="text-xs text-gray-500">{nutrient.unit}</div>
                            <div className="text-sm font-medium text-gray-700">{nutrient.label}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4">
                <a 
                  href={selectedRecipe.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-4 px-6 rounded-xl text-center transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  View Full Recipe on {selectedRecipe.source} →
                </a>
                <button 
                  onClick={() => setSelectedRecipe(null)}
                  className="px-8 py-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold rounded-xl transition-all duration-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
