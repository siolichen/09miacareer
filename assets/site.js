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

    /* ---- mobile sticky stacking cards ---- */
    var track = document.querySelector("[data-stacktrack]");
    if (track) {
      var pin = track.querySelector("[data-stackpin]");
      var wrap = track.querySelector("[data-stackwrap]");
      var cards = [].slice.call(track.querySelectorAll("[data-stack]"));
      if (pin && wrap && cards.length > 1) {
        var mobile = false, span = 1;

        var reset = function () {
          track.style.height = "";
          pin.style.position = ""; pin.style.top = ""; pin.style.height = "";
          wrap.style.display = "grid"; wrap.style.gap = "34px"; wrap.style.position = ""; wrap.style.height = "";
          cards.forEach(function (c) {
            c.style.position = ""; c.style.left = ""; c.style.right = ""; c.style.top = "";
            c.style.width = ""; c.style.height = ""; c.style.overflow = ""; c.style.margin = "";
            c.style.transform = ""; c.style.zIndex = ""; c.style.boxShadow = "";
          });
        };

        var onScroll = function () {
          if (!mobile) return;
          var rect = track.getBoundingClientRect();
          var p = Math.min(1, Math.max(0, (84 - rect.top) / span));
          var n = cards.length - 1;
          cards.forEach(function (c, i) {
            if (i === 0) { c.style.transform = "translateY(0)"; return; }
            var hold = 0.38;
            var raw = p * n - (i - 1);
            var seg = Math.min(1, Math.max(0, (raw - hold) / (1 - hold)));
            var eased = 1 - Math.pow(1 - seg, 3);
            c.style.transform = "translateY(" + (1 - eased) * 105 + "%)";
          });
        };

        var layout = function () {
          mobile = track.clientWidth <= 760;
          if (!mobile) { reset(); return; }
          wrap.style.display = "block"; wrap.style.gap = "0";
          var maxH = 0;
          cards.forEach(function (c) {
            c.style.position = "static"; c.style.width = "100%"; c.style.margin = "0"; c.style.height = "";
            maxH = Math.max(maxH, c.offsetHeight);
            c.style.position = "absolute";
          });
          cards.forEach(function (c, i) {
            c.style.left = "0"; c.style.right = "0";
            c.style.height = maxH + "px"; c.style.overflow = "hidden";
            c.style.top = i * 14 + "px";
            c.style.zIndex = String(10 + i);
            c.style.boxShadow = "0 -10px 36px rgba(53,48,74,0.24)";
          });
          wrap.style.position = "relative";
          wrap.style.height = maxH + (cards.length - 1) * 14 + "px";
          pin.style.position = "sticky"; pin.style.top = "84px"; pin.style.height = wrap.style.height;
          span = Math.round(window.innerHeight * 1.6) * (cards.length - 1);
          track.style.height = maxH + (cards.length - 1) * 14 + span + 160 + "px";
          onScroll();
        };

        setTimeout(layout, 120);
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", layout);
      }
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
