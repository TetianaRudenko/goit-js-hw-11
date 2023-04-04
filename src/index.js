import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import "simplelightbox/dist/simple-lightbox.min.css";
import FetchImages from './js/api-service';
import { createImageCard } from './js/image-template';


const newFetchImages = new FetchImages();

const lightbox = new SimpleLightbox('.gallery a', { 
  captionSelector: 'img',
  captionsData: 'alt',
  captionPosition: 'bottom',
  captionDelay: 250,
});


const refs = {
  searchForm: document.querySelector('#search-form'),
  galleryContainer: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more')
 
}


refs.searchForm.addEventListener('submit', onSearch);
refs.loadMoreBtn.addEventListener('click', onLoadMore);

async function onSearch(e){
  e.preventDefault();
 
  try {
    newFetchImages.query = e.target.searchQuery.value.trim();

     if (!newFetchImages.query) {
      Notify.info('OOOPS! It`s empty! Try type something...');
      return;
     } 
    
    newFetchImages.resetPage();
    clearGalleryContainer();
    const gallery = await newFetchImages.fetchImages();
    createGallaryMarkup(gallery);
    Notify.success(`Hooray! We found ${newFetchImages.totalHits} images.`);
    refs.loadMoreBtn.classList.remove('is-hidden');
  } catch (error) {
    Notify.failure(error.message);
    clearGalleryContainer();
  }

}

async function onLoadMore() {
  try {
     
    const gallery = await newFetchImages.fetchImages();
    createGallaryMarkup(gallery);
    refs.loadMoreBtn.classList.remove('is-hidden');

    if (newFetchImages.totalHits === newFetchImages.lastPage) {
      refs.loadMoreBtn.classList.add('is-hidden');
      Notify.warning("We're sorry, but you've reached the end of search results.");
      return;
    }
     
  
    
  } catch (error) {
     Notify.failure(error.message);
     //return;
  }

}
function createGallaryMarkup(hits) {
  refs.galleryContainer.insertAdjacentHTML('beforeend', createImageCard(hits));
  lightbox.refresh();
}


function clearGalleryContainer(){
  refs.galleryContainer.innerHTML ='';
}









