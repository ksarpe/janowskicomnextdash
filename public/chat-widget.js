(function() {
  // Zabezpieczenie przed podwójnym wstrzyknięciem
  if (window.JanowskiWidgetLoaded) return;
  window.JanowskiWidgetLoaded = true;

  const scriptTag = document.currentScript;
  const clientId = scriptTag.getAttribute('data-client-id') || 'demo';
  // W przyszłości pobierzesz te kolory z API, na razie hardkodujemy do dema
  const themeColor = scriptTag.getAttribute('data-color') || '#00bcd4';

  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.bottom = '24px';
  container.style.right = '24px';
  container.style.zIndex = '999999';
  container.style.display = 'flex';
  container.style.flexDirection = 'column';
  container.style.alignItems = 'flex-end';
  container.style.gap = '16px';
  // Dodajemy pointer-events-none do kontenera by nie blokować kliknięć w stronę klienta
  container.style.pointerEvents = 'none'; 

  // --- IFRAME Z OKNEM CZATU ---
  const iframe = document.createElement('iframe');
  // Parametry w URL pozwolą na konfigurację iframe'a z zewnątrz
  iframe.src = `http://localhost:3001/embed/chat?clientId=${clientId}&color=${encodeURIComponent(themeColor)}`;
  iframe.style.width = '380px';
  iframe.style.height = '480px';
  iframe.style.border = 'none';
  iframe.style.borderRadius = '16px';
  iframe.style.boxShadow = '0 20px 40px -10px rgba(0,0,0,0.5)';
  iframe.style.transition = 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
  iframe.style.opacity = '0';
  iframe.style.transform = 'translateY(20px) scale(0.9)';
  // To sprawia, że strona pod ukrytym iframem jest nadal "klikalna"
  iframe.style.pointerEvents = 'none';
  
  // Funkcja odbierająca komunikaty z wnętrza iframe (np. zamknięcie czatu krzyżykiem)
  window.addEventListener('message', function(event) {
    if (event.data === 'close-janowski-chat') {
       toggleChat();
    }
  });

  // --- PŁYWAJĄCY PRZYCISK (BUBBLE) ---
  const bubble = document.createElement('button');
  bubble.style.width = '56px';
  bubble.style.height = '56px';
  bubble.style.borderRadius = '50%';
  bubble.style.backgroundColor = themeColor;
  bubble.style.color = '#fff';
  bubble.style.border = 'none';
  bubble.style.boxShadow = `0 8px 30px ${themeColor}60`;
  bubble.style.cursor = 'pointer';
  bubble.style.display = 'flex';
  bubble.style.alignItems = 'center';
  bubble.style.justifyContent = 'center';
  bubble.style.transition = 'transform 0.2s ease';
  bubble.style.pointerEvents = 'auto'; // Przycisk musi być klikalny

  // Ikona SVG "Message"
  const iconMsg = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/></svg>`;
  // Ikona SVG "X"
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
      // Animacja powrotu rotacji
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

  // Funkcja globalna dla klienta, by móc np. konfigurować widget dynamicznie
  window.JanowskiWidget = {
    open: function() { if(!isOpen) toggleChat(); },
    close: function() { if(isOpen) toggleChat(); },
    setTheme: function(color) {
       bubble.style.backgroundColor = color;
       bubble.style.boxShadow = `0 8px 30px ${color}60`;
       // Przekazanie zmiany koloru również do wnętrza iframe!
       iframe.contentWindow.postMessage({ type: 'update-theme', color: color }, '*');
    }
  };
})();