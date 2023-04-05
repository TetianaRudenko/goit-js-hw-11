import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

class FetchImages {
  constructor() { 
    this.BASE_URL = 'https://pixabay.com/api/';
    this.API_KEY = '34783032-e2a986b6ea45253b9670a189f';
    this.page = 0;
    this.perPage = 40;
    this.lastPage = 0;
    this.totalHits = 0;
    this.hitsLength = 0;
    this.searchQuery = '';
    this.prevSearchQuery = '';
    this.isLoading = false;
  }
  
  async fetchImages() {

    if (this.searchQuery === this.prevSearchQuery && !this.isLoading) {
      return;
    }
    try {
      this.incrementPage();
      const options = {
        params: {
          key: this.API_KEY,
          q: this.searchQuery,
          image_type: 'photo',
          orientation: 'horizontal',
          safesearch: true,
          per_page: this.perPage,
          page: this.page,
        }
      }

      const response = await axios.get(this.BASE_URL, options);
      const { hits, totalHits } = await response.data;
     

      if (totalHits === 0) {
        return Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        
      }
      
      this.totalHits = totalHits;
      this.hitsLength = hits.length;
      //this.lastPage = this.hitsLength;

      console.log('totalHits:', totalHits);
      //console.log('hitsLength:', hitsLength);

      
      return hits;
    } catch (error) {
      //console.log(error);
      Notify.failure(error.message);
    } 
  }

  incrementPage() {
    this.page += 1;
    this.lastPage += this.hitsLength;
  }

  resetPage() {
    this.page = 0;
    this.lastPage = 0;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}

export default FetchImages;

