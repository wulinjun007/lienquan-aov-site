/* Arena of Valor 粉丝演示站 · 交互脚本（零依赖） */
(function () {
  "use strict";

  var $ = function (sel, el) { return (el || document).querySelector(sel); };
  var $$ = function (sel, el) { return Array.prototype.slice.call((el || document).querySelectorAll(sel)); };

  /* ---------- 轮播 ---------- */
  var track = $("#bannerTrack");
  var slides = $$(".banner-slide", track);
  var dotsWrap = $("#bannerDots");
  var current = 0;
  var timer = null;
  var AUTOPLAY_MS = 5000;

  slides.forEach(function (_, i) {
    var b = document.createElement("button");
    b.type = "button";
    b.setAttribute("aria-label", "第 " + (i + 1) + " 张");
    if (i === 0) b.classList.add("is-active");
    b.addEventListener("click", function () { go(i); restart(); });
    dotsWrap.appendChild(b);
  });
  var dots = $$("button", dotsWrap);

  function go(i) {
    current = (i + slides.length) % slides.length;
    slides.forEach(function (s, k) { s.classList.toggle("is-current", k === current); });
    dots.forEach(function (d, k) { d.classList.toggle("is-active", k === current); });
  }
  function restart() {
    if (timer) clearInterval(timer);
    timer = setInterval(function () { go(current + 1); }, AUTOPLAY_MS);
  }
  $("#bannerPrev").addEventListener("click", function () { go(current - 1); restart(); });
  $("#bannerNext").addEventListener("click", function () { go(current + 1); restart(); });
  restart();

  /* ---------- 精选英雄切换 ---------- */
  var FEATURED = [
    {
      name: "Krixi", title: "精灵 · 自然之灵", roles: ["mage", "法师"], img: "assets/img/featured/krixi.jpg", icon: "assets/img/icons/phap-su.png",
      desc: "体型娇小却蕴含自然伟力，用星辰魔法在远处瓦解敌阵。"
    },
    {
      name: "Valhein", title: "猎魔人", roles: ["marksman", "射手"], img: "assets/img/featured/valhein.jpg", icon: "assets/img/icons/xa-thu.png",
      desc: "手持魔弹的猎魔人，注定与黑暗对决的命运。"
    },
    {
      name: "Aya", title: "精灵歌者", roles: ["support", "辅助"], img: "assets/img/featured/aya.jpg", icon: "assets/img/icons/tro-thu.png",
      desc: "以歌声连接万物，为盟友注入源源不断的灵力。"
    },
    {
      name: "Triệu Vân", title: "龙骑士", roles: ["warrior", "战士"], img: "assets/img/featured/trieu-van.jpg", icon: "assets/img/icons/dau-si.png",
      desc: "人龙合一的战场骑士，七进七出如入无人之境。"
    },
    {
      name: "Arthur", title: "正义之剑", roles: ["warrior", "战士"], img: "assets/img/featured/arthur.jpg", icon: "assets/img/icons/dau-si.png",
      desc: "手持王者之剑的不朽骑士，正义是他唯一的信条。"
    }
  ];
  var ROLE_ICON = {
    warrior: "assets/img/icons/dau-si.png",
    tank: "assets/img/icons/do-don.png",
    mage: "assets/img/icons/phap-su.png",
    assassin: "assets/img/icons/sat-thu.png",
    support: "assets/img/icons/tro-thu.png",
    marksman: "assets/img/icons/xa-thu.png"
  };
  var featTabs = $$(".feat-tab");
  featTabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      var d = FEATURED[+tab.dataset.i];
      featTabs.forEach(function (t) {
        t.classList.toggle("is-active", t === tab);
        t.setAttribute("aria-selected", t === tab ? "true" : "false");
      });
      $("#featImg").src = d.img;
      $("#featImg").alt = d.name + " " + d.title;
      $("#featName").textContent = d.name;
      $("#featTitle").textContent = d.title;
      $("#featDesc").textContent = d.desc;
      $("#featRoles").innerHTML =
        '<img src="' + d.icon + '" alt=""><span>' + d.roles[1] + "</span>";
    });
  });

  /* ---------- 英雄图鉴 ---------- */
  var heroes = (window.HEROES || []).map(function (h) {
    return { id: h.id, name: h.n, roles: h.r, img: h.img };
  });
  var ROLE_ZH = {
    warrior: "战士", tank: "坦克", mage: "法师",
    assassin: "刺客", support: "辅助", marksman: "射手"
  };
  var grid = $("#heroGrid");
  var searchInput = $("#heroSearch");
  var emptyHint = $("#emptyHint");
  var state = { role: "all", kw: "" };

  // 职业计数
  heroes.forEach(function (h) {
    h.roles.forEach(function (r) {
      var el = $("#cnt-" + r);
      if (el) el.textContent = (+el.textContent || 0) + 1;
    });
  });

  function render() {
    var kw = state.kw.trim().toLowerCase();
    var list = heroes.filter(function (h) {
      var okRole = state.role === "all" || h.roles.indexOf(state.role) !== -1;
      var okKw = !kw || h.name.toLowerCase().indexOf(kw) !== -1 || h.id.indexOf(kw) !== -1;
      return okRole && okKw;
    });
    var frag = document.createDocumentFragment();
    list.forEach(function (h) {
      var li = document.createElement("li");
      li.className = "hero-cell";
      li.tabIndex = 0;
      li.setAttribute("role", "button");
      li.setAttribute("aria-label", h.name);
      li.innerHTML =
        '<img src="' + h.img + '" alt="' + h.name + '" loading="lazy">' +
        "<figcaption>" + h.name + "</figcaption>";
      li.addEventListener("click", function () { openModal(h); });
      li.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openModal(h); }
      });
      frag.appendChild(li);
    });
    grid.innerHTML = "";
    grid.appendChild(frag);
    emptyHint.hidden = list.length > 0;
  }

  $$(".role-chip").forEach(function (chip) {
    chip.addEventListener("click", function () {
      $$(".role-chip").forEach(function (c) { c.classList.toggle("is-active", c === chip); });
      state.role = chip.dataset.role;
      render();
    });
  });
  searchInput.addEventListener("input", function () {
    state.kw = searchInput.value;
    render();
  });

  /* ---------- 英雄弹层 ---------- */
  var modal = $("#heroModal");
  function openModal(h) {
    $("#modalImg").src = h.img;
    $("#modalImg").alt = h.name;
    $("#modalName").textContent = h.name;
    $("#modalRoles").innerHTML = h.roles.map(function (r) {
      return '<img src="' + ROLE_ICON[r] + '" alt=""><span>' + ROLE_ZH[r] + "</span>";
    }).join("");
    modal.hidden = false;
    document.body.style.overflow = "hidden";
  }
  function closeModal() {
    modal.hidden = true;
    document.body.style.overflow = "";
  }
  $$("[data-close]", modal).forEach(function (el) {
    el.addEventListener("click", closeModal);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !modal.hidden) closeModal();
  });

  /* ---------- 导航搜索按钮：跳到图鉴并聚焦 ---------- */
  $("#searchBtn").addEventListener("click", function () {
    document.getElementById("heroes").scrollIntoView({ behavior: "smooth" });
    setTimeout(function () { searchInput.focus({ preventScroll: true }); }, 450);
  });

  /* ---------- 移动端抽屉 ---------- */
  var navToggle = $("#navToggle");
  var drawer = $("#mobileDrawer");
  navToggle.addEventListener("click", function () {
    var open = drawer.hidden;
    drawer.hidden = !open;
    document.body.classList.toggle("drawer-open", open);
    navToggle.setAttribute("aria-expanded", open ? "true" : "false");
  });
  $$("a", drawer).forEach(function (a) {
    a.addEventListener("click", function () {
      drawer.hidden = true;
      document.body.classList.remove("drawer-open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });

  /* ---------- 回到顶部 ---------- */
  var toTop = $("#toTop");
  window.addEventListener("scroll", function () {
    toTop.classList.toggle("is-visible", window.scrollY > 600);
  }, { passive: true });
  toTop.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  /* ---------- 导航高亮 ---------- */
  var sectionIds = ["top", "news", "featured", "gameplay", "heroes", "download"];
  var navLinks = $$(".main-nav .nav-link");
  var spy = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      var id = en.target.id;
      navLinks.forEach(function (l) {
        l.classList.toggle("is-active", l.getAttribute("href") === "#" + id);
      });
    });
  }, { rootMargin: "-40% 0px -55% 0px" });
  sectionIds.forEach(function (id) {
    var el = document.getElementById(id);
    if (el) spy.observe(el);
  });

  render();
})();
