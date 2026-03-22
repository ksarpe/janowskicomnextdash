(function () {
  if (window.BookingWidgetLoaded) return;
  window.BookingWidgetLoaded = true;

  const scriptTag = document.currentScript;
  const clientId = scriptTag.getAttribute("data-client-id") || "demo";
  const serverOrigin = new URL(scriptTag.src).origin;

  const DEFAULT_COLOR = "#000000";
  let configPayload = "";

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
  container.style.transition = "opacity 0.5s ease";

  const iframe = document.createElement("iframe");
  iframe.style.width = "400px";
  iframe.style.height = "550px"; // Trochę wyższy na kalendarz
  iframe.style.border = "none";
  iframe.style.borderRadius = "16px";
  iframe.style.boxShadow = "0 20px 40px -10px rgba(0,0,0,0.5)";
  iframe.style.transition = "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)";
  iframe.style.opacity = "0";
  iframe.style.transform = "translateY(20px) scale(0.9)";
  iframe.style.pointerEvents = "none";

  const button = document.createElement("button");
  button.style.padding = "0 24px";
  button.style.height = "56px";
  button.style.borderRadius = "28px";
  button.style.color = "#fff";
  button.style.border = "none";
  button.style.cursor = "pointer";
  button.style.display = "flex";
  button.style.alignItems = "center";
  button.style.gap = "8px";
  button.style.fontFamily = "system-ui, sans-serif";
  button.style.fontWeight = "600";
  button.style.fontSize = "16px";
  button.style.transition = "transform 0.2s ease";
  button.style.pointerEvents = "auto";

  const calendarIcon = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>`;
  button.innerHTML = `${calendarIcon} Umów wizytę`;

  function revealWidget(color) {
    button.style.backgroundColor = color;
    button.style.boxShadow = `0 8px 30px ${color}60`;
    container.style.opacity = "1";
  }

  fetch(`${serverOrigin}/api/widget/config/chat?clientId=${clientId}`)
    .then((res) => res.json())
    .then((data) => {
      const configData = data.settings ? data.settings.chat : data;
      revealWidget(configData.themeColor || DEFAULT_COLOR);
      configPayload = btoa(encodeURIComponent(JSON.stringify(configData)));
    })
    .catch(() => revealWidget(DEFAULT_COLOR));

  let iframeLoaded = false;
  let isOpen = false;

  button.onclick = () => {
    isOpen = !isOpen;

    if (isOpen && !iframeLoaded) {
      iframe.src = `${serverOrigin}/embed/booking?clientId=${clientId}&config=${configPayload}`;
      container.insertBefore(iframe, button);
      iframeLoaded = true;
    }

    if (isOpen) {
      iframe.style.opacity = "1";
      iframe.style.transform = "translateY(0) scale(1)";
      iframe.style.pointerEvents = "auto";
      button.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg> Zamknij`;
    } else {
      iframe.style.opacity = "0";
      iframe.style.transform = "translateY(20px) scale(0.9)";
      iframe.style.pointerEvents = "none";
      button.innerHTML = `${calendarIcon} Umów wizytę`;
    }
  };

  container.appendChild(button);
  document.body.appendChild(container);
  window.addEventListener("message", function (event) {
    if (event.data === "close-booking-widget" && isOpen) button.click();
  });
})();
