import './css/styles.css';
import Notiflix from 'notiflix';
import { fetchImages } from './fetchImages.js';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  searchForm: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
  loadMore: document.querySelector('.load-more'),
  submit: document.querySelector('.submit'),
  searchFormInput: document.querySelector('.search-form-input'),
};

const lightbox = new SimpleLightbox('.gallery a', {
  captions: true,
  captionsData: 'alt',
  captionPosition: 'bottom',
  captionDelay: 250,
});

let searchQuery = '';
let page = 1;
const perPage = 40;

refs.searchForm.addEventListener('submit', onSubmit);
refs.loadMore.addEventListener('click', loadMore);

async function onSubmit(event) {
  event.preventDefault();
  resetMarcup();
  refs.loadMore.classList.add('hide');
  page = 1;
  searchQuery = event.currentTarget.elements.searchQuery.value;
  if (searchQuery === '') {
    return Notiflix.Notify.failure('Enter value!.');
  }
  try {
    const response = await fetchImages(searchQuery, page, perPage);
    if (response.data.totalHits === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else {
      Notiflix.Notify.info(
        `Hooray! We found ${response.data.totalHits} images and ${Math.ceil(
          response.data.totalHits / perPage
        )} pages.`
      );
      renderGallery(response);
      refs.loadMore.classList.remove('hide');
      lightbox.refresh();
      if (response.data.hits.length < 40) {
        refs.loadMore.classList.add('hide');
      }
    }
  } catch (error) {
    Notiflix.Notify.failure(error.message);
  } finally {
    refs.searchFormInput.value = '';
  }
}

function renderGallery(response) {
  const marcup = response.data.hits
    .map(image => {
      return `<li class="gallery__item"">
      <a href="${image.largeImageURL}" class="gallery__link">
      <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" height="300px" class="gallery__image""/>
      </a>
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
    </li>`;
    })
    .join('');
  refs.gallery.insertAdjacentHTML('beforeend', marcup);
}

function resetMarcup() {
  refs.gallery.innerHTML = '';
}

async function loadMore() {
  page += 1;
  const response = await fetchImages(searchQuery, page, perPage);
  if (page > response.data.totalHits / perPage) {
    renderGallery(response);
    lightbox.refresh();
    refs.loadMore.classList.add('hide');
    showNotification();
  } else {
    renderGallery(response);
    lightbox.refresh();
  }
}

function showNotification() {
  Notiflix.Notify.failure(
    'We are sorry, but you have reached the end of search results.'
  );
  refs.loadMore.classList.add('hide');
}
