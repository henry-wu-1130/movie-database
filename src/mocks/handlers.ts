import { http, HttpResponse } from 'msw'

const mockMovies = {
  page: 1,
  results: [
    {
      id: 1,
      title: 'Mock Movie 1',
      overview: 'This is a mock movie for development',
      poster_path: '/mock1.jpg',
      backdrop_path: '/backdrop1.jpg',
      release_date: '2024-01-01',
      vote_average: 8.5,
      vote_count: 100,
      popularity: 500.5,
      original_language: 'en',
      genre_ids: [28, 12],
      adult: false,
      video: false
    },
    {
      id: 2,
      title: 'Mock Movie 2',
      overview: 'Another mock movie for development',
      poster_path: '/mock2.jpg',
      backdrop_path: '/backdrop2.jpg',
      release_date: '2024-01-02',
      vote_average: 7.5,
      vote_count: 90,
      popularity: 450.5,
      original_language: 'en',
      genre_ids: [28, 12],
      adult: false,
      video: false
    },
  ],
  total_pages: 2,
  total_results: 40,
}

const mockCredits = {
  id: 1,
  cast: [
    {
      id: 1,
      name: 'Mock Actor 1',
      character: 'Character 1',
      profile_path: '/actor1.jpg',
      order: 1,
      credit_id: 'credit1',
      known_for_department: 'Acting',
      gender: 1,
      popularity: 10.5,
      adult: false,
      original_name: 'Mock Actor 1',
      cast_id: 1
    }
  ],
  crew: [
    {
      id: 2,
      name: 'Mock Director',
      job: 'Director',
      profile_path: '/director.jpg',
      credit_id: 'credit2',
      department: 'Directing',
      known_for_department: 'Directing',
      gender: 1,
      popularity: 8.5,
      adult: false,
      original_name: 'Mock Director'
    }
  ]
}

const mockVideos = {
  id: 1,
  results: [
    {
      id: 'video1',
      key: 'mockYouTubeKey1',
      name: 'Official Trailer',
      site: 'YouTube',
      size: 1080,
      type: 'Trailer',
      official: true,
      published_at: '2024-01-01T00:00:00.000Z'
    }
  ]
}

const mockReviews = {
  id: 1,
  page: 1,
  results: [
    {
      id: 'review1',
      author: 'Mock Reviewer',
      content: 'This is a mock review for testing purposes.',
      created_at: '2024-01-01T00:00:00.000Z',
      updated_at: '2024-01-01T00:00:00.000Z',
      url: 'https://example.com/review1',
      author_details: {
        name: 'Mock Reviewer',
        username: 'mockreviewer',
        avatar_path: '/reviewer.jpg',
        rating: 8
      }
    }
  ],
  total_pages: 1,
  total_results: 1
}

const mockMovieDetail = {
  ...mockMovies.results[0],
  budget: 150000000,
  revenue: 500000000,
  runtime: 120,
  status: 'Released',
  tagline: 'Mock movie tagline',
  credits: mockCredits,
  videos: mockVideos,
  reviews: mockReviews
}

export const handlers = [
  // Popular movies
  http.get('https://api.themoviedb.org/3/movie/popular', () => {
    return HttpResponse.json(mockMovies)
  }),

  // Movie details with credits, videos, and reviews
  http.get('https://api.themoviedb.org/3/movie/:id', ({ params }) => {
    const { id } = params
    return HttpResponse.json({
      ...mockMovieDetail,
      id: Number(id)
    })
  }),

  // Movie credits
  http.get('https://api.themoviedb.org/3/movie/:id/credits', ({ params }) => {
    const { id } = params
    return HttpResponse.json({
      ...mockCredits,
      id: Number(id)
    })
  }),

  // Movie videos
  http.get('https://api.themoviedb.org/3/movie/:id/videos', ({ params }) => {
    const { id } = params
    return HttpResponse.json({
      ...mockVideos,
      id: Number(id)
    })
  }),

  // Movie reviews
  http.get('https://api.themoviedb.org/3/movie/:id/reviews', ({ params }) => {
    const { id } = params
    return HttpResponse.json({
      ...mockReviews,
      id: Number(id)
    })
  }),

  // Now playing movies
  http.get('https://api.themoviedb.org/3/movie/now_playing', () => {
    return HttpResponse.json(mockMovies)
  }),

  // Upcoming movies
  http.get('https://api.themoviedb.org/3/movie/upcoming', () => {
    return HttpResponse.json(mockMovies)
  }),

  // Search movies (assuming there's a search endpoint)
  http.get('https://api.themoviedb.org/3/search/movie', ({ request }) => {
    const url = new URL(request.url)
    const query = url.searchParams.get('query')
    return HttpResponse.json({
      ...mockMovies,
      results: mockMovies.results.filter(movie => 
        movie.title.toLowerCase().includes((query || '').toLowerCase())
      )
    })
  })
]
