const topupDialog = document.querySelector('#topupDialog');
const balanceAmount = document.querySelector('#balanceAmount');
const toast = document.querySelector('#toast');
const packOptions = [...document.querySelectorAll('.pack-option')];
const navButtons = [...document.querySelectorAll('[data-view]')];
let balance = 500;
let selectedAmount = 300;
let inventory = [];
let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2600);
}

function openTopup() {
  if (!topupDialog.open) topupDialog.showModal();
}

document.querySelectorAll('[data-open-topup]').forEach(button => button.addEventListener('click', openTopup));
document.querySelector('.dialog-close').addEventListener('click', () => topupDialog.close());
topupDialog.addEventListener('click', event => {
  if (event.target === topupDialog) topupDialog.close();
});

packOptions.forEach(option => {
  option.addEventListener('click', () => {
    packOptions.forEach(pack => pack.classList.remove('selected'));
    option.classList.add('selected');
    selectedAmount = Number(option.dataset.amount);
    document.querySelector('.modal-summary b').textContent = `${selectedAmount.toLocaleString('uk-UA')} жетонів`;
  });
});

document.querySelector('#addBalanceButton').addEventListener('click', () => {
  balance += selectedAmount;
  balanceAmount.textContent = balance.toLocaleString('uk-UA');
  topupDialog.close();
  showToast(`Додано ${selectedAmount.toLocaleString('uk-UA')} демо-жетонів`);
});

function showView(viewId) {
  document.querySelectorAll('.view').forEach(view => {
    const active = view.id === viewId;
    view.classList.toggle('active-view', active);
    view.hidden = !active;
  });
  document.querySelectorAll('.main-nav .nav-link').forEach(button => {
    button.classList.toggle('active', button.dataset.view === viewId);
  });
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

navButtons.forEach(button => button.addEventListener('click', () => showView(button.dataset.view)));
document.querySelector('[data-scroll-cases]').addEventListener('click', () => {
  document.querySelector('#caseShelf').scrollIntoView({ behavior: 'smooth', block: 'start' });
});

const possibleDrops = [
  { name: 'Mint Circuit', value: 38, color: 'slot-green', mark: '✦' },
  { name: 'Afterglow', value: 74, color: 'slot-coral', mark: '✷' },
  { name: 'Orbit Bloom', value: 145, color: '', mark: '◉' },
  { name: 'Silver Echo', value: 210, color: 'slot-green', mark: '✳' }
];

function addInventoryItem(item) {
  inventory.unshift(item);
  document.querySelector('#inventoryCount').textContent = inventory.length;
  document.querySelector('#inventoryEmpty').hidden = true;
  const card = document.createElement('article');
  card.className = 'inventory-card';
  const illustration = document.createElement('div');
  illustration.className = `slot-illustration ${item.color}`;
  illustration.textContent = item.mark;
  const title = document.createElement('h3');
  title.textContent = item.name;
  const value = document.createElement('p');
  value.textContent = `Демо-оцінка: ${item.value} жет.`;
  card.append(illustration, title, value);
  document.querySelector('#inventoryItems').prepend(card);
}

document.querySelectorAll('.case-open').forEach(button => {
  button.addEventListener('click', () => {
    const price = Number(button.dataset.casePrice);
    if (balance < price) {
      showToast('Не вистачає жетонів — обери пакет поповнення');
      openTopup();
      return;
    }
    balance -= price;
    balanceAmount.textContent = balance.toLocaleString('uk-UA');
    const drop = possibleDrops[Math.floor(Math.random() * possibleDrops.length)];
    addInventoryItem(drop);
    showToast(`Кейс «${button.dataset.caseName}»: випав предмет ${drop.name}`);
  });
});

document.querySelector('#profileButton').addEventListener('click', event => {
  const label = document.querySelector('#profileLabel');
  if (label.textContent === 'Увійти') {
    label.textContent = 'Yaruna';
    event.currentTarget.querySelector('.profile-dot').textContent = 'YB';
    showToast('Демо-профіль активовано');
  } else {
    label.textContent = 'Увійти';
    event.currentTarget.querySelector('.profile-dot').textContent = 'Y';
    showToast('Ви вийшли з демо-профілю');
  }
});

document.querySelector('#upgradeButton').addEventListener('click', () => {
  const stake = 80;
  if (balance < stake) {
    showToast('Не вистачає жетонів для апгрейду');
    openTopup();
    return;
  }
  balance -= stake;
  balanceAmount.textContent = balance.toLocaleString('uk-UA');
  const success = Math.random() < 0.41;
  if (success) {
    const item = { name: 'Neon Current', value: 192, color: 'slot-coral', mark: '✷' };
    addInventoryItem(item);
    showToast('Апгрейд вдався — Neon Current у твоєму інвентарі!');
  } else {
    showToast('Цього разу не вийшло. Демо-раунд завершено.');
  }
});

document.querySelector('#changeTarget').addEventListener('click', () => showToast('У повній версії тут можна обрати цільовий предмет'));
