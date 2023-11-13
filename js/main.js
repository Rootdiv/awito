const dataBase = JSON.parse(localStorage.getItem('awito') || '[]');

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
const modalFileInput = document.querySelector('.modal__file-input');
const modalFileBtn = document.querySelector('.modal__file-btn');
const modalImageAdd = document.querySelector('.modal__image-add');

const textFileBtn = modalFileBtn.textContent;
const srcImageAdd = modalImageAdd.src;
const infoPhoto = {};

const saveDB = () => {
  localStorage.setItem('awito', JSON.stringify(dataBase));
};

const closeModal = event => {
  const target = event.target;
  if (target.classList.contains('modal__close') || target.classList.contains('modal') || event.code === 'Escape') {
    modalAdd.classList.add('hide');
    modalItem.classList.add('hide');
    modalSubmit.reset();
    checkFrom();
    modalImageAdd.src = srcImageAdd;
    modalFileBtn.textContent = textFileBtn;
    document.removeEventListener('keyup', closeModal);
  }
};

const checkFrom = () => {
  const validForm = elementsModalSubmit.every(elem => elem.value.trim());
  modalBtnSubmit.disabled = !validForm;
  modalBtnWarning.style.display = validForm ? 'none' : '';
};

const renderCard = () => {
  catalog.textContent = '';
  const cardList = dataBase.map(({ id, imageType, image, nameItem, costItem }) => {
    const card = document.createElement('li');
    card.className = 'card';
    card.dataset.id = id;
    const img = new Image();
    img.className = 'card__image';
    img.src = `data:${imageType};base64,${image}`;

    const description = document.createElement('div');
    description.className = 'card__description';
    const title = document.createElement('h3');
    title.className = 'card__header';
    title.textContent = nameItem;
    const price = document.createElement('div');
    price.className = 'card__price';
    price.innerHTML = `${costItem} &#8381;`;

    description.append(title, price);
    card.append(img, description);
    return card;
  });

  catalog.append(...cardList);
};

modalFileInput.addEventListener('change', ({ target }) => {
  const reader = new FileReader();
  const file = target.files[0];
  infoPhoto.name = file.name;
  infoPhoto.size = file.size;
  infoPhoto.type = file.type;
  reader.readAsBinaryString(file);

  reader.addEventListener('load', ({ target }) => {
    if (infoPhoto.size < 250000) {
      modalFileBtn.textContent = infoPhoto.name;
      infoPhoto.base64 = btoa(target.result);
      modalImageAdd.src = `data:${infoPhoto.type};base64,${infoPhoto.base64}`;
      modalImageAdd.alt = infoPhoto.name;
    } else {
      modalFileBtn.textContent = 'Файл не должен превышать 250кб';
      modalFileInput.value = '';
      checkFrom();
    }
  });
});

modalSubmit.addEventListener('input', checkFrom);

modalSubmit.addEventListener('submit', event => {
  event.preventDefault();
  const itemObj = {};
  for (const elem of elementsModalSubmit) {
    itemObj[elem.name] = elem.value;
  }
  itemObj.id = Date.now();
  itemObj.image = infoPhoto.base64;
  itemObj.imageType = infoPhoto.type;
  dataBase.push(itemObj);
  closeModal({ target: modalAdd });
  saveDB();
  renderCard();
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

renderCard();
