import { defineStore } from 'pinia'

//create store
export const useNasaStore = defineStore('nasa', {
  state: () => ({ //variables
    astronomyData: null as any, //hold the data, without type check
    isLoading: false, //to track if network request is running?
    photos: [] as any[], //holding the array of photos
    selectedPhoto: null as any, //the photos selected by user
    error: null as string | null, //hold errors
  }),
  actions: {
    async fetchApodData() { //fetch data (async)
      this.isLoading = true; //when true, turns the loading spinner in ui
      this.error = null; //remove all previous errors

      //make http request to nasa's servers
      try {
        const response = await fetch('https://api.nasa.gov/planetary/apod?api_key=fKftoChO6gHdlfb39OSG3Xn81S5d3NL5wPY0gk3i');

        if (!response.ok) {
          //know the exact error that the api call resulted in
          throw new Error(`Failed to fetch data. Status: ${response.status}`);
        }

        this.astronomyData = await response.json();
      } catch (err: any) {
        //print error to browser console
        console.error("FETCH ERROR:", err);
        this.error = err.message || 'Unknown fetch error occurred';
      } finally {
        this.isLoading = false; //turn off the loading spinner when fetch call succeed or fail
      }
    },

    // Fetching all the photos
    async fetchApodRange(startDate: string, endDate: string) {
      this.isLoading = true
      this.error = null

      try {
        const response = await fetch(
          `https://api.nasa.gov/planetary/apod?api_key=fKftoChO6gHdlfb39OSG3Xn81S5d3NL5wPY0gk3i&start_date=${startDate}&end_date=${endDate}`
        )

        if (!response.ok) {
          throw new Error(`Failed to fetch data. Status: ${response.status}`)
        }
        const data = await response.json()
        console.log('RAW APOD RESPONSE:', data, Array.isArray(data))
        this.photos = Array.isArray(data) ? data.reverse() : [data]
        // NASA returns oldest-first
      } catch (err: any) {
        console.error('FETCH ERROR:', err)
        this.error = err.message || 'Unknown fetch error occurred'
      } finally {
        this.isLoading = false
      }
    },


    // ApodDetailsView, fetch by date
    async fetchApodByDate(date: string) {
      this.isLoading = true
      this.error = null

      try {
        const response = await fetch(
          `https://api.nasa.gov/planetary/apod?api_key=fKftoChO6gHdlfb39OSG3Xn81S5d3NL5wPY0gk3i&date=${date}`
        )
        if (!response.ok) {
          throw new Error(`Failed to fetch data. Status: ${response.status}`)
        }
        this.selectedPhoto = await response.json()
      } catch (err: any) {
        console.error('FETCH ERROR:', err)
        this.error = err.message || 'Unknown fetch error occurred'
      } finally {
        this.isLoading = false
      }
    }

  }
})
