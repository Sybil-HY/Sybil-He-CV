// Bilingual toggle — remembers the last choice, defaults to Chinese.
(function () {
  var STORAGE_KEY = "cv-lang";
  var buttons = document.querySelectorAll(".lang-switch button");

  function apply(lang) {
    document.body.classList.remove("lang-zh", "lang-en");
    document.body.classList.add("lang-" + lang);
    document.documentElement.lang = lang === "zh" ? "zh" : "en";
    buttons.forEach(function (b) {
      b.classList.toggle("active", b.dataset.lang === lang);
    });
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {}
  }

  var saved;
  try {
    saved = localStorage.getItem(STORAGE_KEY);
  } catch (e) {}
  apply(saved === "en" ? "en" : "zh");

  buttons.forEach(function (b) {
    b.addEventListener("click", function () {
      apply(b.dataset.lang);
    });
  });
})();

// Project accordion — click a card header to expand / collapse.
(function () {
  var toggles = document.querySelectorAll(".card-toggle");
  toggles.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var card = btn.closest(".card");
      var open = card.classList.toggle("is-open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
  });
})();

// Stat count-up — animate numbers when the stats row scrolls into view.
(function () {
  var nums = document.querySelectorAll(".stat-num[data-count]");
  if (!nums.length || !("IntersectionObserver" in window)) return;

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function run(el) {
    var target = parseInt(el.dataset.count, 10);
    var suffix = el.dataset.suffix || "";
    if (reduce) { el.textContent = target + suffix; return; }
    var start = null;
    var dur = 1100;
    function step(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { run(e.target); io.unobserve(e.target); }
    });
  }, { threshold: 0.6 });

  nums.forEach(function (n) { io.observe(n); });
})();

// Scroll progress bar — thin accent line at top of viewport.
(function () {
  var bar = document.getElementById('scroll-progress');
  if (!bar) return;
  function update() {
    var total = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.transform = 'scaleX(' + (total > 0 ? window.scrollY / total : 0) + ')';
  }
  window.addEventListener('scroll', update, { passive: true });
  update();
})();

// Back-to-top button — appears after scrolling 400px, smooth-scrolls to top.
(function () {
  var btn = document.getElementById('back-top');
  if (!btn) return;
  window.addEventListener('scroll', function () {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });
  btn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

// Card 3D tilt — subtle perspective tilt on mouse hover (pointer devices only).
(function () {
  if (window.matchMedia('(hover: none)').matches) return;
  document.querySelectorAll('.card').forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      var r = card.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - 0.5;
      var y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transition = 'box-shadow 0.25s ease, border-color 0.2s ease';
      card.style.transform = 'perspective(700px) rotateY(' + (x * 8) + 'deg) rotateX(' + (-y * 6) + 'deg) translateZ(4px)';
    });
    card.addEventListener('mouseleave', function () {
      card.style.transition = 'box-shadow 0.25s ease, border-color 0.2s ease, transform 0.45s ease';
      card.style.transform = '';
    });
  });
})();

// Scroll-spy — highlight the nav link(s) for the section currently in view.
// Drives both the top nav and the fixed side dot-nav.
(function () {
  var links = Array.prototype.slice.call(
    document.querySelectorAll(".nav-links a, .dots a")
  );
  if (!links.length || !("IntersectionObserver" in window)) return;

  var map = {};
  var seen = {};
  var sections = [];
  links.forEach(function (a) {
    var id = a.getAttribute("href");
    if (id && id.charAt(0) === "#") {
      var sec = document.querySelector(id);
      if (sec) {
        (map[id] = map[id] || []).push(a);
        if (!seen[id]) { seen[id] = true; sections.push(sec); }
      }
    }
  });

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        links.forEach(function (a) { a.classList.remove("active"); });
        (map["#" + e.target.id] || []).forEach(function (a) {
          a.classList.add("active");
        });
      }
    });
  }, { rootMargin: "-45% 0px -50% 0px" });

  sections.forEach(function (s) { io.observe(s); });
})();
