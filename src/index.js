import './css/styles.css';
import Notiflix from 'notiflix';
import { fetchImages } from './fetchImages.js';
import SimpleLightbox from 'simplelightbox';

const refs = {
  searchForm: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
  loadMore: document.querySelector('.load-more'),
  submit: document.querySelector('.submit'),
};

let searchQuery = '';
let page = 1;

refs.searchForm.addEventListener('submit', onSubmit);
refs.loadMore.addEventListener('click', onClick);

function onSubmit(event) {
  event.preventDefault();
  resetMarcup();
  refs.loadMore.classList.add('hide');
  page = 1;
  searchQuery = event.currentTarget.elements.searchQuery.value;
  if (searchQuery === '') {
    return Notiflix.Notify.failure('Enter value!.');
  }
  fetchImages(searchQuery, page)
    .then(response => {
      if (response.data.totalHits === 0) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      } else {
        renderGallery(response);
        refs.loadMore.classList.remove('hide');
        if (searchQuery === '') {
          refs.submit.setAttribute('disabled', '');
        }
      }
    })
    .catch(error => {
      Notiflix.Notify.failure(error.message);
    });
  event.currentTarget.reset();
}

function renderGallery(response) {
  const marcup = response.data.hits
    .map(image => {
      return `<div class="photo-card">
      <img src="${image.webformatURL}" alt="${image.tags}" height="300" loading="lazy" class="images"/>
      <div class="info">
        <p class="info-item">
          <b>Likes</b><span
          >${image.likes}</span
         >
        </p>
        <p class="info-item">
          <b>Views</b><span>${image.views}</span>
        </p>
        <p class="info-item">
          <b>Comments</b><span
          >${image.comments}</span
         >
        </p>
        <p class="info-item">
          <b>Downloads</b><span
          >${image.downloads}</span
         >
        </p>
      </div>
    </div>`;
    })
    .join('');
  refs.gallery.insertAdjacentHTML('beforeend', marcup);
}

function resetMarcup() {
  refs.gallery.innerHTML = '';
}

function onClick() {
  page += 1;
  fetchImages(searchQuery, page).then(response => {
    if (response.data.totalHits === 0) {
      Notiflix.Notify.failure(
        'We are sorry, but you have reached the end of search results.'
      );
      refs.loadMore.classList.add('hide');
    } else {
      renderGallery(response);
    }
  });
}
