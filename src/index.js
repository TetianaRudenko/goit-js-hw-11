import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import "simplelightbox/dist/simple-lightbox.min.css";

const API_KEY = '34783032-e2a986b6ea45253b9670a189f';
const BASE_URL = 'https://pixabay.com/api/';

const lightbox = new SimpleLightbox('.gallery a', { 
  caption: true,
  captionSelector: 'img',
  captionType: 'attr',
  captionsData: 'alt',
  captionPosition: 'bottom',
  captionDelay: 250
});


const refs = {
  searchForm: document.querySelector('#search-form'),
  galleryContainer: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more')
}

let searchQuerry = '';
let currentPage = 1;

refs.searchForm.addEventListener('submit', onSearch);
refs.loadMoreBtn.addEventListener('click', onLoadMore)

function onSearch(e){
  
  e.preventDefault();
  resetPage();
  clearGalleryContainer();
  searchQuerry = e.currentTarget.elements.searchQuery.value.trim();
  const url = `${BASE_URL}?key=${API_KEY}&q=${searchQuerry}&type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${currentPage}`;
  if (searchQuerry === '') {
    refs.loadMoreBtn.classList.add('is-hidden');
    return Notify.warning('OOOPS! It`s empty! Try type something...');
  }
  else{
    fetchImage(url).then(cards => {
      if (cards.total === 0) {
        refs.loadMoreBtn.classList.add('is-hidden');
        Notify.failure("Sorry, there are no images matching your search query. Please try again.");
      }
      else{
        Notify.success(`Hooray! We found ${cards.totalHits} images.`);
      }
    })
  }
}

async function fetchImage(url){
  try {
    const response = await axios(url);
    const cards = response.data;
    refs.galleryContainer.insertAdjacentHTML('beforeend', createGallaryMarkup(cards));
    currentPage +=1;
    refs.loadMoreBtn.classList.remove('is-hidden');
    lightbox.refresh();
    return cards;
  } catch (error) {
    refs.loadMoreBtn.classList.add('is-hidden');
    //Notify.failure("We're sorry, but you've reached the end of search results.");
  }
}

function onLoadMore(e) {
  const url = `${BASE_URL}?key=${API_KEY}&q=${searchQuerry}&type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${currentPage}`;
  fetchImage(url).then(cards => {
    if (cards.totalHits) {
      Notify.failure("We're sorry, but you've reached the end of search results.");
      refs.loadMoreBtn.classList.add('is-hidden');
    }
  })

}

function createGallaryMarkup(cards){
  return cards.hits
    .map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
      return `
        <div class="photo-card">
          <a class='gallery__link' href='${largeImageURL}'>
            <img class='gallery__image' src="${webformatURL}" alt="${tags}" loading="lazy" width='360' height='260'/>
          </a>
          <div class="info">
            <p class="info-item">
              <b>Likes:${likes}</b>
            </p>
            <p class="info-item">
              <b>Views:${views}</b>
            </p>
            <p class="info-item">
              <b>Comments:${comments}</b>
            </p>
            <p class="info-item">
              <b>Downloads:${downloads}</b>
            </p>
          </div>
        </div>`
    }).join('')
}

function clearGalleryContainer(){
  refs.galleryContainer.innerHTML ='';
}

function resetPage(){
  currentPage = 1;
}








