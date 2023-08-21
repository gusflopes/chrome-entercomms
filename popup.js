let isActive = false;

document.getElementById('toggleExtension').addEventListener('click', function() {
  isActive = !isActive;
  if(isActive) {
    this.textContent = "Desativar Extensão";
    chrome.storage.local.set({ 'extensionActive': true });
  } else {
    this.textContent = "Ativar Extensão";
    chrome.storage.local.set({ 'extensionActive': false });
  }
});

document.getElementById('showVisitedPages').addEventListener('click', function() {
  chrome.storage.local.get(['visitedPages'], function(result) {
    const table = document.getElementById('visitedPages');
    const tbody = table.querySelector('tbody');
    
    if (result.visitedPages && result.visitedPages.length > 0) {
      tbody.innerHTML = '';
      for (let page of result.visitedPages) {
        let row = `
          <tr>
            <td>${page.id}</td>
            <td>${page.title}</td>
            <td>${page.url}</td>
            <td>${page.isDuplicate ? 'Yes' : 'No'}</td>
            <td>${page.originalUrl || 'N/A'}</td>
            <td>${page.originalId || 'N/A'}</td>
          </tr>`;
        tbody.innerHTML += row;
      }
      table.style.display = 'block';
    }
  });
});

function clearTableContent() {
  const table = document.getElementById('visitedPages');
  const tbody = table.querySelector('tbody');
  tbody.innerHTML = '';  // Isso limpa o conteúdo da tabela.
}



document.getElementById('clearVisitedPages').addEventListener('click', function() {
  chrome.storage.local.remove('visitedPages', function() {
    // Atualize a interface ou informe ao usuário que as páginas foram limpas, se desejar.
    clearTableContent();
    alert('Páginas visitadas foram limpas!');
  });
});

// document.addEventListener('DOMContentLoaded', function() {
//   chrome.storage.local.get(['visitedPages'], function(result) {
//       const visitedPages = result.visitedPages || [];
//       const pageListElem = document.getElementById('pageList');

//       visitedPages.forEach(page => {
//           const row = document.createElement('tr');

//           const idCell = document.createElement('td');
//           idCell.textContent = page.id;
//           row.appendChild(idCell);

//           const titleCell = document.createElement('td');
//           titleCell.textContent = page.title; // Adicione a lógica de conversão se necessário
//           row.appendChild(titleCell);

//           const urlCell = document.createElement('td');
//           urlCell.textContent = page.url;
//           row.appendChild(urlCell);

//           const isDuplicateCell = document.createElement('td');
//           isDuplicateCell.textContent = page.isDuplicate ? 'Yes' : 'No';
//           row.appendChild(isDuplicateCell);

//           const originalUrlCell = document.createElement('td');
//           originalUrlCell.textContent = page.originalUrl || 'N/A';
//           row.appendChild(originalUrlCell);

//           const originalIdCell = document.createElement('td');
//           originalIdCell.textContent = page.originalId || 'N/A';
//           row.appendChild(originalIdCell);

//           pageListElem.appendChild(row);
//       });
//   });
// });
