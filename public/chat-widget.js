(function () {
  if (window.ChatBubbleWidgetLoaded) return;
  window.ChatBubbleWidgetLoaded = true;

  const scriptTag = document.currentScript;
  const clientId = scriptTag.getAttribute("data-client-id");
  const serverOrigin = new URL(scriptTag.src).origin;

  const DEFAULT_COLOR = "#d19652";
  const DEFAULT_POSITION = "bottom-right";
  let configPayload = "";
  let isConfigReady = false;

  const container = document.createElement("div");
  container.style.position = "fixed";
  container.style.bottom = "24px";
  container.style.right = "24px";
  container.style.zIndex = "999999";
  container.style.display = "flex";
  container.style.flexDirection = "column";
  container.style.alignItems = "flex-end";
  container.style.gap = "16px";
  container.style.opacity = "0";
  container.style.pointerEvents = "none";
  container.style.transition =
    "opacity 0.5s ease, left 0.3s ease, right 0.3s ease";

  // --- IFRAME (LAZY LOADED) ---
  const iframe = document.createElement("iframe");
  iframe.style.width = "380px";
  iframe.style.height = "480px";
  iframe.style.border = "none";
  iframe.style.borderRadius = "16px";
  iframe.style.boxShadow = "0 20px 40px -10px rgba(0,0,0,0.5)";
  iframe.style.transition = "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)";
  iframe.style.opacity = "0";
  iframe.style.transform = "translateY(20px) scale(0.9)";
  iframe.style.pointerEvents = "none";

  // --- BUBBLE ---
  const bubble = document.createElement("button");
  bubble.style.width = "56px";
  bubble.style.height = "56px";
  bubble.style.borderRadius = "50%";
  bubble.style.color = "#fff";
  bubble.style.border = "none";
  bubble.style.cursor = "pointer";
  bubble.style.display = "flex";
  bubble.style.alignItems = "center";
  bubble.style.justifyContent = "center";
  bubble.style.transition =
    "transform 0.2s ease, background-color 0.3s ease, box-shadow 0.3s ease";
  bubble.style.pointerEvents = "auto";
  bubble.setAttribute("aria-label", "Otwórz czat");

  const iconMsg = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/></svg>`;
  const iconClose = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;

  bubble.innerHTML = iconMsg;

  function revealWidget(color, pos) {
    bubble.style.backgroundColor = color;
    bubble.style.boxShadow = `0 8px 30px ${color}60`;
    if (pos === "bottom-left") {
      container.style.right = "auto";
      container.style.left = "24px";
      container.style.alignItems = "flex-start";
    } else {
      container.style.left = "auto";
      container.style.right = "24px";
      container.style.alignItems = "flex-end";
    }

    container.style.opacity = "1";
  }

  fetch(`${serverOrigin}/api/widget/config/chat?clientId=${clientId}`)
    .then((res) => res.json())
    .then((data) => {
      const chatConfig = data;
      revealWidget(
        chatConfig.themeColor || DEFAULT_COLOR,
        chatConfig.position || DEFAULT_POSITION,
      );

      configPayload = btoa(encodeURIComponent(JSON.stringify(chatConfig)));
      isConfigReady = true;
    })
    .catch((err) => {
      console.error("Error loading widget theme", err);
      revealWidget(DEFAULT_COLOR, DEFAULT_POSITION);
    });

  let iframeLoaded = false;
  let isOpen = false;

  function toggleChat() {
    if (!isConfigReady) return;

    isOpen = !isOpen;

    // Ładowanie Iframe dopiero przy pierwszym kliknięciu (Lazy Load)
    if (isOpen && !iframeLoaded) {
      iframe.src = `${serverOrigin}/embed/chat?clientId=${clientId}&config=${configPayload}`;
      container.insertBefore(iframe, bubble);
      iframeLoaded = true;
    }

    if (isOpen) {
      iframe.style.opacity = "1";
      iframe.style.transform = "translateY(0) scale(1)";
      iframe.style.pointerEvents = "auto";
      bubble.innerHTML = iconClose;
      bubble.style.transform = "rotate(90deg)";
      setTimeout(() => (bubble.style.transform = "rotate(0deg)"), 150);
    } else {
      iframe.style.opacity = "0";
      iframe.style.transform = "translateY(20px) scale(0.9)";
      iframe.style.pointerEvents = "none";
      bubble.innerHTML = iconMsg;
      bubble.style.transform = "rotate(-90deg)";
      setTimeout(() => (bubble.style.transform = "rotate(0deg)"), 150);
    }
  }

  bubble.onclick = toggleChat;

  bubble.addEventListener("mouseenter", function () {
    const svg = bubble.querySelector("svg");
    if (svg) {
      svg.style.transition = "transform 0.6s";
      svg.style.transform = "rotate(180deg)";
    }
  });

  bubble.addEventListener("mouseleave", function () {
    const svg = bubble.querySelector("svg");
    if (svg) {
      svg.style.transform = "rotate(0deg)";
    }
  });

  // Dodajemy tylko bubble, iframe dojdzie przy kliknięciu
  container.appendChild(bubble);
  document.body.appendChild(container);

  //ODBIERANIE KOMUNIKATÓW Z IFRAME (np. po zmianie koloru w panelu admina na żywo)
  window.addEventListener("message", function (event) {
    if (event.origin !== serverOrigin) return;
    if (event.data === "close-chat-bubble-widget") {
      if (isOpen) toggleChat();
    }
  });

  window.ChatBubbleWidget = {
    open: function () {
      if (!isOpen) toggleChat();
    },
    close: function () {
      if (isOpen) toggleChat();
    },

    setTheme: function (color) {
      console.log("setTheme", color);
      bubble.style.backgroundColor = color;
      bubble.style.boxShadow = `0 8px 30px ${color}60`;
      if (iframeLoaded && iframe.contentWindow) {
        iframe.contentWindow.postMessage(
          { type: "update-theme", color: color },
          serverOrigin,
        );
      }
    },
    setSuccessMessage: function (message) {
      if (iframeLoaded && iframe.contentWindow) {
        iframe.contentWindow.postMessage(
          { type: "update-success-message", message: message },
          serverOrigin,
        );
      }
    },
    setWelcomeMessage: function (message) {
      if (iframeLoaded && iframe.contentWindow) {
        iframe.contentWindow.postMessage(
          { type: "update-welcome-message", message: message },
          serverOrigin,
        );
      }
    },
  };
})();
