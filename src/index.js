import './css/styles.css';
import Notiflix from 'notiflix';
import { fetchImages } from './fetchImages.js';

const refs = {
  searchForm: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
};

refs.searchForm.addEventListener('submit', onSubmit);

function onSubmit(event) {
  event.preventDefault();
  resetMarcup();
  const searchQuery = event.currentTarget.elements.searchQuery.value;
  fetchImages(searchQuery)
    .then(response => {
      console.log(response);
      if (response.data.totalHits === 0) {
        Notiflix.Notify.info(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      } else {
        renderGallery(response);
      }
    })
    .catch(error => {
      Notiflix.Notify.failure(error.message);
    });
}

function renderGallery(response) {
  const marcup = response.data.hits
    .map(image => {
      return `<div class="photo-card">
      <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" class="images"/>
      <div class="info">
        <p class="info-item">
          <b>Likes:</b> ${image.likes}
        </p>
        <p class="info-item">
          <b>Views:</b> ${image.views}
        </p>
        <p class="info-item">
          <b>Comments:</b> ${image.comments}
        </p>
        <p class="info-item">
          <b>Downloads:</b> ${image.downloads}
        </p>
      </div>
    </div>`;
    })
    .join('');
  refs.gallery.insertAdjacentHTML('afterbegin', marcup);
}

function resetMarcup() {
  refs.gallery.innerHTML = '';
}
