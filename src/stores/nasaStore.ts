import { defineStore } from 'pinia'

//create store
export const useNasaStore = defineStore('nasa', {
  state: () => ({ //variables
    astronomyData: null as any, //hold the data, without type check
    isLoading: false, //to track if network request is running?
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
    }
  }
})
