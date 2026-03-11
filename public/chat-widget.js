(function() {
  // Zabezpieczenie przed podwójnym wstrzyknięciem
  if (window.JanowskiWidgetLoaded) return;
  window.JanowskiWidgetLoaded = true;

  const scriptTag = document.currentScript;
  const clientId = scriptTag.getAttribute('data-client-id') || 'demo';

  // Domyślny kolor ładowania (zanim przyjdą dane z bazy)
  const DEFAULT_COLOR = '#00bcd4';

  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.bottom = '24px';
  container.style.right = '24px';
  container.style.zIndex = '999999';
  container.style.display = 'flex';
  container.style.flexDirection = 'column';
  container.style.alignItems = 'flex-end';
  container.style.gap = '16px';
  container.style.pointerEvents = 'none'; 

  // --- IFRAME Z OKNEM CZATU ---
  const iframe = document.createElement('iframe');
  iframe.src = `http://localhost:3001/embed/chat?clientId=${clientId}`;
  iframe.style.width = '380px';
  iframe.style.height = '480px';
  iframe.style.border = 'none';
  iframe.style.borderRadius = '16px';
  iframe.style.boxShadow = '0 20px 40px -10px rgba(0,0,0,0.5)';
  iframe.style.transition = 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
  iframe.style.opacity = '0';
  iframe.style.transform = 'translateY(20px) scale(0.9)';
  iframe.style.pointerEvents = 'none';
  
  // --- PŁYWAJĄCY PRZYCISK (BUBBLE) ---
  const bubble = document.createElement('button');
  bubble.style.width = '56px';
  bubble.style.height = '56px';
  bubble.style.borderRadius = '50%';
  bubble.style.backgroundColor = DEFAULT_COLOR; // Ustawiamy domyślny kolor
  bubble.style.color = '#fff';
  bubble.style.border = 'none';
  bubble.style.boxShadow = `0 8px 30px ${DEFAULT_COLOR}60`; // Domyślny cień
  bubble.style.cursor = 'pointer';
  bubble.style.display = 'flex';
  bubble.style.alignItems = 'center';
  bubble.style.justifyContent = 'center';
  bubble.style.transition = 'transform 0.2s ease, background-color 0.3s ease, box-shadow 0.3s ease';
  bubble.style.pointerEvents = 'auto';

  // --- ODBIERANIE KOMUNIKATÓW Z IFRAME ---
  window.addEventListener('message', function(event) {
    // 1. Zamknięcie czatu krzyżykiem
    if (event.data === 'close-janowski-chat') {
       toggleChat();
    }
    
    // 2. Aktualizacja koloru prosto z bazy danych!
    if (event.data && event.data.type === 'janowski-theme-loaded') {
       const newColor = event.data.color;
       bubble.style.backgroundColor = newColor;
       bubble.style.boxShadow = `0 8px 30px ${newColor}60`;
    }
  });

  const iconMsg = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/></svg>`;
  const iconClose = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;
  
  bubble.innerHTML = iconMsg;

  let isOpen = false;

  function toggleChat() {
    isOpen = !isOpen;
    if (isOpen) {
      iframe.style.opacity = '1';
      iframe.style.transform = 'translateY(0) scale(1)';
      iframe.style.pointerEvents = 'auto';
      bubble.innerHTML = iconClose;
      bubble.style.transform = 'rotate(90deg)';
      setTimeout(() => bubble.style.transform = 'rotate(0deg)', 150);
    } else {
      iframe.style.opacity = '0';
      iframe.style.transform = 'translateY(20px) scale(0.9)';
      iframe.style.pointerEvents = 'none';
      bubble.innerHTML = iconMsg;
      bubble.style.transform = 'rotate(-90deg)';
      setTimeout(() => bubble.style.transform = 'rotate(0deg)', 150);
    }
  }

  bubble.onclick = toggleChat;

  container.appendChild(iframe);
  container.appendChild(bubble);
  document.body.appendChild(container);

  window.JanowskiWidget = {
    open: function() { if(!isOpen) toggleChat(); },
    close: function() { if(isOpen) toggleChat(); },
    setTheme: function(color) {
       bubble.style.backgroundColor = color;
       bubble.style.boxShadow = `0 8px 30px ${color}60`;
       iframe.contentWindow.postMessage({ type: 'update-theme', color: color }, '*');
    }
  };
})();