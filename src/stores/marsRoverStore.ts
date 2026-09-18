import { defineStore } from 'pinia'

// A rover can only ever be one of these two values, uninion provide type safety and autocomplete
export type RoverId = 'curiosity' | 'perseverance'

// an interface describes a single photo object returned by the /rovers/{rover}/photos
// and /photos/{id} API endpoints.
interface RoverPhoto {
  id: number
  sol: number // Martian day this photo was taken on
  camera: {
    name: string // short code, e.g. "MAST"
    full_name: string // a label, e.g. "Mast Camera"
  }
  img_src: string // direct URL to the actual image file
  earth_date: string //YYYY-MM-DD calendar date
  rover: {
    name: string
  }
}

// Describes ONE entry inside the manifest's "photos" array.
// NOTE: this photo per sol; Not per photo
interface ManifestEntry {
  sol: number
  earth_date: string
  total_photos: number
  cameras: string[] // which cameras were used that sol
}

// Describes the full manifest response for one rover, this is needed for the drop-down

interface RoverManifest {
  name: string
  landing_date: string
  max_sol: number // highest sol number so far
  max_date: string // most recent Earth date with data
  total_photos: number // total photos across the rover's entire mission
  photos: ManifestEntry[] // one entry per sol that has at least 1 photo
}

// Shape of everything this store tracks.
interface MarsRoverState {
  photos: RoverPhoto[] //The actual photo search
  manifest: RoverManifest | null // the "valid dates" lookup table, it is set to null until loaded
  isLoading: boolean // true while a photo search is in flight
  isManifestLoading: boolean // true while the manifest is being fetched
  error: string | null // user-facing error/info message, or null if none
}

// Insteasd of NASA, the community-maintained replacement for NASA's archived official Mars Photos API. since it is more reliable
const BASE_URL = 'https://rovers.nebulum.one/api/v1'

export const useMarsRoverStore = defineStore('marsRover', {
  // state() must be a function (not a plain object) so Pinia creates
  // a fresh, independent state object for this store.
  state: (): MarsRoverState => ({
    photos: [],
    manifest: null,
    isLoading: false,
    isManifestLoading: false,
    error: null,
  }),

  actions: {
    // Fetches the "valid dates" manifest for a given rover.
    // Called once when the Gallery page loads, and BEFORE the user searches anything,
    // so we already know which dates/sols are safe to offer as options.

    resetStore() { //so previous user searches don't affect the current one
      this.photos = []
      this.manifest = null
      this.isLoading = false
      this.isManifestLoading = false
      this.error = null
    },
    async fetchManifest(rover: RoverId) {
      this.isManifestLoading = true
      this.manifest = null // clear any previous rover's manifest immediately

      try {
        const response = await fetch(`${BASE_URL}/manifests/${rover}`)

        // convert a bad status/network error into a JS error so it can be caught below.
        if (!response.ok) {
          throw new Error(`Failed to fetch manifest. Status: ${response.status}`)
        }

        const data = await response.json()
        // The real manifest data is nested one level deeper, under "photo_manifest".
        this.manifest = data.photo_manifest
      } catch (err: unknown) {
        console.error('MANIFEST FETCH ERROR:', err)
        // "unknown" forces us to verify the error type before reading .message, this is safer than assuming every caught value is a real Error object.
        this.error = err instanceof Error ? err.message : 'Unknown fetch error occurred'
      } finally {
        // Runs whether the request succeeded or failed, guaranteeing the loading flag never gets stuck at true.
        this.isManifestLoading = false
      }
    },

    // Fetches actual photos for a rover, searching by EITHER an Earth date
    // OR a sol number (never both — only one will be set by the caller).
    async fetchPhotos(
      rover: RoverId,
      params: { earthDate?: string; sol?: number },
    ) {
      this.isLoading = true
      this.error = null // clear any leftover error/message from a previous search
      this.photos = [] // clear old results so stale photos don't linger on screen

      try {
        // build url
        const url = new URL(`${BASE_URL}/rovers/${rover}/photos`)

        if (params.earthDate) {
          url.searchParams.set('earth_date', params.earthDate)
        } else if (params.sol !== undefined) {
          // covert sol to string. searchParams.set() requires a string, but sol is a number,
          url.searchParams.set('sol', String(params.sol))
        } else {
          // Defensive guard: this should never actually happen!! UI Constrained
          throw new Error('You must provide either an Earth date or a sol.')
        }

        const response = await fetch(url)

        if (!response.ok) {
          throw new Error(`Failed to fetch rover photos. Status: ${response.status}`)
        }

        const data = await response.json()
        // Defensive handling: accept either a bare array response,
        // or one wrapped in a "photos" key, just in case the API' exact response shape ever changes.
        this.photos = Array.isArray(data) ? data : data.photos ?? []

        // A successful request, but no photos found
        if (this.photos.length === 0) {
          this.error = 'No photos were found for this search.'
        }
      } catch (err: unknown) {
        console.error('MARS ROVER FETCH ERROR:', err)
        this.error = err instanceof Error ? err.message : 'Unknown fetch error occurred'
      } finally {
        this.isLoading = false
      }
    },
  },
})
