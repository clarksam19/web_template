export default {
// API name
  chuckNorris: {
    // Base URL
    baseUrl: new URL('https://api.chucknorris.io/'),
    // API endpoints organized by name of action with corresponding endpoint data
    endpoints: {
      getRandomJoke: {method: 'GET', dataType: 'json', path: 'jokes/random/'},
      getJokeFromCategory: {method: 'GET', dataType: 'query', path: 'jokes/random'},
      getCategories: {method: 'GET', dataType: null, path: 'jokes/categories/'},
      textSearch: {method: 'GET', dataType: 'query', path: 'jokes/search'},
    },
    // Sample data for testing endpoints
    testData: {
      getRandomJoke: null,
      getJokeFromCategory: {'category': 'animal'},
      getCategories: null,
      textSearch: {'query': 'kick'},
    },
  }
}