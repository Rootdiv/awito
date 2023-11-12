const dataBase = [];

const modalAdd = document.querySelector('.modal__add');
const btnAdd = document.querySelector('.add__ad');
const modalBtnSubmit = document.querySelector('.modal__btn-submit');
const modalSubmit = document.querySelector('.modal__submit');
const catalog = document.querySelector('.catalog');
const modalItem = document.querySelector('.modal__item');
const elementsModalSubmit = [...modalSubmit.elements].filter(
  elem => elem.tagName !== 'BUTTON' && elem.type !== 'submit',
);
const modalBtnWarning = document.querySelector('.modal__btn-warning');

// prettier-ignore
const closeModal = function(event) {
  const target = event.target;
  if (target.classList.contains('modal__close') || target === this || event.key === 'Escape') {
    modalAdd.classList.add('hide');
    modalItem.classList.add('hide');
    modalBtnWarning.removeAttribute('style')
    modalSubmit.reset();
    document.removeEventListener('keyup', closeModal);
  }
};

modalSubmit.addEventListener('input', () => {
  const validForm = elementsModalSubmit.every(elem => elem.value.trim());
  modalBtnSubmit.disabled = !validForm;
  modalBtnWarning.style.display = validForm ? 'none' : '';
});

modalSubmit.addEventListener('submit', event => {
  event.preventDefault();
  const itemObj = {};
  for (const elem of elementsModalSubmit) {
    itemObj[elem.name] = elem.value;
  }
  dataBase.push(itemObj);
  closeModal(event);
});

btnAdd.addEventListener('click', () => {
  modalAdd.classList.remove('hide');
  modalBtnSubmit.disabled = true;
  document.addEventListener('keyup', closeModal);
});

catalog.addEventListener('click', ({ target }) => {
  if (target.closest('.card')) {
    modalItem.classList.remove('hide');
    document.addEventListener('keyup', closeModal);
  }
});

modalAdd.addEventListener('click', closeModal);

modalItem.addEventListener('click', closeModal);
