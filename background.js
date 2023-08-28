// Versão 01
// chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
//   if (changeInfo.status === 'complete') {
//     chrome.storage.local.get(['extensionActive', 'visitedPages'], function(result) {
//       if (result.extensionActive) {
//         const page = {
//           title: decodeURIComponent(escape(tab.title)),
//           url: tab.url
//         };
//         let visitedPages = result.visitedPages || [];
//         visitedPages.push(page);
//         chrome.storage.local.set({ 'visitedPages': visitedPages });
//       }
//     });
//   }
// });

let pageEncoding = {}; // Vamos armazenar a codificação por tabId

chrome.webRequest.onHeadersReceived.addListener(
  function(details) {
    let encoding = null;
    for (let header of details.responseHeaders) {
      if (header.name.toLowerCase() === "content-type") {
        const matches = header.value.match(/charset=([^;]+)/i);
        if (matches) {
          encoding = matches[1];
        }
        break;
      }
    }
    if (encoding) {
      pageEncoding[details.tabId] = encoding;
    }
  },
  { urls: ["<all_urls>"], types: ["main_frame"] },
  ["responseHeaders"]
);

// Versão 02
// chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
//   if (changeInfo.status === 'complete') {
//     let title = tab.title;

//     if (pageEncoding[tabId] && pageEncoding[tabId].toLowerCase() === 'iso-8859-1') {
//       title = latin1ToUtf8(title);
//     }

//     chrome.storage.local.get(['extensionActive', 'visitedPages'], function(result) {
//       if (result.extensionActive) {
//         const page = {
//           title: title,
//           url: tab.url
//         };
//         let visitedPages = result.visitedPages || [];
//         visitedPages.push(page);
//         chrome.storage.local.set({ 'visitedPages': visitedPages });
//       }
//     });
//   }
// });

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete") {
      chrome.storage.local.get(['extensionActive', 'visitedPages'], function (result) {
        if (result.extensionActive) {
          let visitedPages = result.visitedPages || [];
          let existingPage = visitedPages.find(page => page.url === tab.url);

          let pageData = {
              id: generateUniqueId(),
              url: tab.url,
              title: tab.title // Adicione a lógica de conversão se necessário
          };

          if (existingPage) {
              pageData.isDuplicate = true;
              pageData.originalUrl = existingPage.url;
              pageData.originalId = existingPage.id;
          } else {
              pageData.isDuplicate = false;
              pageData.originalUrl = null;
              pageData.originalId = null;
          }

          visitedPages.push(pageData);

          chrome.storage.local.set({ visitedPages: visitedPages });


        }  
        

      });
  }
});


function latin1ToUtf8(input) {
  const latin1Encoded = new Uint8Array(input.length);
  for (let i = 0; i < input.length; i++) {
      latin1Encoded[i] = input.charCodeAt(i);
  }
  return new TextDecoder('ISO-8859-1').decode(latin1Encoded);
}

function generateUniqueId() {
  return `id-${Date.now().toString()}`;
}
