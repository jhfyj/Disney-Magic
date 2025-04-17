export function createButton(label, onClick) {
    const btn = document.createElement('button');
    btn.innerText = label;
    btn.addEventListener('click', onClick);
    document.body.appendChild(btn);
    return btn;
  }