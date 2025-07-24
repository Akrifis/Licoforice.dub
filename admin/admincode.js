// В начале admin.html
const password = prompt('daz1io0:');
if (password !== 'daz1io0') {
  document.body.innerHTML = '<h1>Доступ запрещен</h1>';
  throw new Error('Unauthorized');
}
