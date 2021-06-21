export default {
  chuckNorris: {
    baseUrl: new URL('https://api.chucknorris.io/'),
    endpoints: {
      getRandomJoke: {method: 'GET', dataType: 'json', path: 'jokes/random/'},
      getJokeFromCategory: {method: 'GET', dataType: 'query', path: 'jokes/random'},
      getCategories: {method: 'GET', dataType: null, path: 'jokes/categories/'},
      textSearch: {method: 'GET', dataType: 'query', path: 'jokes/search'},
    },
    testData: {
      getRandomJoke: null,
      getJokeFromCategory: {'category': 'animal'},
      getCategories: null,
      textSearch: {'query': 'kick'},
    },
  }
}