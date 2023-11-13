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

const renderCardItem = ({ id, imageType, image, nameItem, status, descriptionItem, costItem }) => {
  const modalBlock = document.createElement('div');
  modalBlock.className = 'modal__block';
  const modalHeader = document.createElement('h2');
  modalHeader.className = 'modal__header';
  modalHeader.textContent = 'Купить';
  const modalContent = document.createElement('div');
  modalContent.className = 'modal__content';

  const divImage = document.createElement('div');
  const img = new Image();
  img.className = 'modal__image modal__image-item';
  img.src = `data:${imageType};base64,${image}`;
  img.alt = nameItem;
  divImage.append(img);

  const modalDescription = document.createElement('div');
  modalDescription.className = 'modal__description';
  const title = document.createElement('h3');
  title.className = 'modal__header-item';
  title.textContent = nameItem;

  const statusWrapElem = document.createElement('p');
  statusWrapElem.textContent = 'Состояние: ';
  const statusElem = document.createElement('span');
  statusElem.className = 'modal__status-item';
  statusElem.textContent = status === 'new' ? 'отличное' : 'б/у';
  statusWrapElem.append(statusElem);

  const descriptionElem = document.createElement('p');
  descriptionElem.textContent = 'Описание: ';
  const description = document.createElement('span');
  description.className = 'modal__description-item';
  description.textContent = descriptionItem;
  descriptionElem.append(description);

  const priceElem = document.createElement('p');
  priceElem.textContent = 'Цена: ';
  const price = document.createElement('span');
  price.className = 'modal__cost-item';
  price.innerHTML = `${costItem} &#8381;`;
  priceElem.append(price);

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'btn';
  button.textContent = 'Купить';
  button.dataset.id = id;

  const modalClose = document.createElement('button');
  modalClose.type = 'button';
  modalClose.className = 'modal__close';
  modalClose.innerHTML = '&#10008;';

  modalDescription.append(divImage, title, statusWrapElem, descriptionElem, priceElem, button);
  modalContent.append(divImage, modalDescription, modalClose);
  modalBlock.append(modalHeader, modalContent);

  return modalBlock;
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
    modalItem.textContent = '';
    const id = target.closest('.card').dataset.id;
    const cardData = dataBase.find(item => Number(id) === item.id);
    modalItem.append(renderCardItem(cardData));
    modalItem.classList.remove('hide');
    document.addEventListener('keyup', closeModal);
  }
});

modalAdd.addEventListener('click', closeModal);

modalItem.addEventListener('click', closeModal);

renderCard();
