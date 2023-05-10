import './css/styles.css';
import { fetchCountries } from './fetchCountries.js';
// const debounce = require('lodash.debounce');
import Notiflix from 'notiflix';

const refs = {
  searchForm: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
};

// const DEBOUNCE_DELAY = 300;

refs.searchForm.addEventListener('submit', onSubmit);

function onSubmit(event) {
  resetMarcup();
  const searchQuery = event.target.value.trim();
  fetchCountries(searchQuery)
    .then(data => {
      if (data.length > 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      } else if (data.length >= 2 && data.length <= 10) {
        renderCountryList(data);
      } else {
        renderCountryInfo(data);
      }
    })
    .catch(error => {
      error.status === '404'
        ? Notiflix.Notify.failure('Oops, there is no country with that name.')
        : Notiflix.Notify.failure(error.message);
    });
}

function renderCountryList(data) {
  const marcup = data
    .map(country => {
      return `<li class="country-list-item">
        <img src="${country.flags.svg}" alt="" width="50px"/>
        <p class="list-item-paragraph">${country.name.official}</p>
    </li>`;
    })
    .join('');
  refs.countryList.insertAdjacentHTML('afterbegin', marcup);
}

// function renderCountryInfo(data) {
//   const marcup = data
//     .map(country => {
//       const languages = Object.values(country.languages).join(', ');
//       return `
//         <img src="${country.flags.svg}" alt="" width="50px"/>
//         <p class="item-paragraph">${country.name.official}</p>
//         <p><b>Capital: </b>${country.capital}</p>
//         <p><b>Population: </b>${country.population}</p>
//         <p><b>Languages: </b>${languages}</p>
//     `;
//     })
//     .join('');
//   refs.countryInfo.insertAdjacentHTML('afterbegin', marcup);
// }

function resetMarcup() {
  refs.countryList.innerHTML = '';
  refs.countryInfo.innerHTML = '';
}
