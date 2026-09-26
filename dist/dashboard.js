(function () {
  "use strict";

  var hostedOrigin = "https://kano.retiredlake.chatgpt.site";
  var localDesktop = location.hostname === "localhost" || location.hostname === "127.0.0.1";
  var routeRoots = { story: "/story/", code: "/code/", art: "/art/" };

  document.querySelectorAll("[data-route]").forEach(function (link) {
    var route = routeRoots[link.dataset.route];
    if (route) link.href = localDesktop ? hostedOrigin + route : route;
  });

  var status = document.getElementById("status");
  var timeout;

  function announce(message) {
    window.clearTimeout(timeout);
    status.textContent = message;
    status.classList.add("is-visible");
    timeout = window.setTimeout(function () {
      status.classList.remove("is-visible");
    }, 3200);
  }

  document.querySelectorAll("[data-message]").forEach(function (control) {
    control.addEventListener("click", function () {
      announce(control.dataset.message);
    });
  });
})();
