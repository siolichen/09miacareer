(function () {
  "use strict";
  document.documentElement.classList.add("anim-on");

  function ready(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }

  ready(function () {
    /* ---- hamburger ---- */
    var burger = document.querySelector("[data-hamburger]");
    var links = document.querySelector("[data-navlinks]");
    if (burger && links) {
      burger.addEventListener("click", function () {
        var open = links.getAttribute("data-open") === "true";
        links.setAttribute("data-open", open ? "false" : "true");
        burger.setAttribute("aria-expanded", open ? "false" : "true");
      });
    }

    /* ---- smooth scroll for in-page anchors ---- */
    document.addEventListener("click", function (e) {
      var a = e.target.closest && e.target.closest('a[href^="#"]');
      if (!a) return;
      var id = a.getAttribute("href").slice(1);
      if (!id) return;
      var el = document.getElementById(id);
      if (!el) return;
      e.preventDefault();
      window.scrollTo({ top: el.getBoundingClientRect().top + window.pageYOffset - 84, behavior: "smooth" });
      if (links) links.setAttribute("data-open", "false");
    });

    /* ---- scroll reveal ---- */
    var nodes = [].slice.call(document.querySelectorAll("[data-reveal],[data-unfold],[data-zoom],[data-slide],[data-fade]"));
    if (nodes.length) {
      if (!("IntersectionObserver" in window)) {
        nodes.forEach(function (n) { n.classList.add("is-in"); });
      } else {
        var groups = new Map();
        var io = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            var parent = entry.target.parentElement;
            var sibs = groups.get(parent) || [].slice.call(parent.querySelectorAll(":scope > [data-reveal],:scope > [data-unfold],:scope > [data-slide]"));
            groups.set(parent, sibs);
            var i = Math.max(0, sibs.indexOf(entry.target));
            entry.target.style.transitionDelay = i * 180 + "ms";
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          });
        }, { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });
        nodes.forEach(function (n) { io.observe(n); });
      }
    }

    /* ---- counting numbers ---- */
    var stats = document.querySelector("[data-stats]");
    if (stats) {
      var cells = [].slice.call(stats.querySelectorAll("[data-count]"));
      var run = function () {
        var t0 = null;
        var step = function (ts) {
          if (!t0) t0 = ts;
          var p = Math.min(1, (ts - t0) / 1600);
          var e = 1 - Math.pow(1 - p, 3);
          cells.forEach(function (c) {
            var target = parseFloat(c.getAttribute("data-count")) || 0;
            c.firstChild.nodeValue = Math.round(target * e) + (c.getAttribute("data-suffix") || "");
          });
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      };
      var done = false;
      var check = function () {
        if (done) return;
        var r = stats.getBoundingClientRect();
        if (r.top < window.innerHeight * 0.92 && r.bottom > 0) {
          done = true;
          window.removeEventListener("scroll", check);
          run();
        }
      };
      window.addEventListener("scroll", check, { passive: true });
      window.addEventListener("resize", check);
      check();
    }

    /* ---- forms (demo only) ---- */
    var sub = document.querySelector("[data-subscribe]");
    if (sub) {
      sub.addEventListener("submit", function (e) {
        e.preventDefault();
        var msg = sub.parentElement.querySelector("[data-submsg]");
        if (msg) msg.textContent = "訂閱成功，第一封信會在本週寄到你的信箱。";
      });
    }
    var reg = document.querySelector("[data-register]");
    if (reg) {
      reg.addEventListener("submit", function (e) {
        e.preventDefault();
        reg.style.display = "none";
        var ok = document.querySelector("[data-register-success]");
        if (ok) ok.style.display = "block";
      });
    }
  });
})();
