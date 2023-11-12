const modalAdd = document.querySelector('.modal__add');
const btnAdd = document.querySelector('.add__ad');
const modalBtnSubmit = document.querySelector('.modal__btn-submit');
const modalSubmit = document.querySelector('.modal__submit');
const catalog = document.querySelector('.catalog');
const modalItem = document.querySelector('.modal__item');

const closeModalAdd = ({ target }) => {
  if (target.classList.contains('modal__close') || target === modalAdd) {
    modalAdd.classList.add('hide');
    modalSubmit.reset();
  }
};

const closeModalItem = ({ target }) => {
  if (target.classList.contains('modal__close') || target === modalItem) {
    modalItem.classList.add('hide');
  }
};

btnAdd.addEventListener('click', () => {
  modalAdd.classList.remove('hide');
  modalBtnSubmit.disabled = true;
});

catalog.addEventListener('click', ({ target }) => {
  if (target.closest('.card')) {
    modalItem.classList.remove('hide');
  }
});

modalAdd.addEventListener('click', closeModalAdd);

modalItem.addEventListener('click', closeModalItem);

document.addEventListener('keyup', event => {
  if (event.key === 'Escape') {
    modalAdd.classList.add('hide');
    modalItem.classList.add('hide');
  }
});
