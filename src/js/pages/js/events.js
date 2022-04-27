import { getCurrentVisibleArticleIndexJS } from "@/js/commons/functions";
import { TABLET_WIDTH, DURATION_IN_MS } from "@/js/commons/variables";

/* VARIABLES */
const $header = document.getElementById("header");

const $menu = document.getElementById("menu");
const $sideNav = document.getElementById("side-nav");

const $menuItemList = document.querySelectorAll("#menu ul li");
const $sideNavItemList = document.querySelectorAll("#side-nav ul li");
const $navDotAItemList = document.querySelectorAll("#dot-nav-a ul li");
const $navDotBItemList = document.querySelectorAll("#dot-nav-b ul li");
const $navDotCItemList = document.querySelectorAll("#dot-nav-c ul li");

const $articleList = document.querySelectorAll("#main article");

const $btnToggleMenu = document.querySelector("#header .btn-toggle-menu");
const $btnToggleSideNav = document.querySelector("#side-nav .btn-toggle-side-nav");

const $chkboxHeaderScrollMode = document.querySelector(
  "#header .switch-header-scroll-mode input[type='checkbox']"
);
const $chkboxFullPageScrollMode = document.querySelector(
  "#header .switch-full-page-scroll-mode input[type='checkbox']"
);

let lastWindowScrollTop = window.offsetTop;
let isScrolling = false;

/* EVENTS */
for (let i = 0; i < $menuItemList.length; i++) {
  $menuItemList[i].addEventListener("click", goToArticle);
  $sideNavItemList[i].addEventListener("click", goToArticle);
  $navDotAItemList[i].addEventListener("click", goToArticle);
  $navDotBItemList[i].addEventListener("click", goToArticle);
  $navDotCItemList[i].addEventListener("click", goToArticle);
}

window.addEventListener("scroll", function () {
  const currentArticleIndex = getCurrentVisibleArticleIndexJS($articleList);

  updateCurrentNavItem(currentArticleIndex);
  animateArticle();
});

$btnToggleMenu.addEventListener("click", toggleMenuInMobile);
$btnToggleSideNav.addEventListener("click", toggleSideNav);

$chkboxHeaderScrollMode.addEventListener("change", toggleHeaderScrollMode);
$chkboxFullPageScrollMode.addEventListener("change", toggleFullPageScrollMode);

/* FUNCTIONS */
function goToArticle(e) {
  let li = e.target;

  while (li.tagName !== "LI") {
    li = li.parentElement;
  }

  const index = [...li.parentElement.children].indexOf(li);
  animateScroll($articleList[index].offsetTop, DURATION_IN_MS, "easeInExpo");
}

function updateCurrentNavItem(currentArticleIndex) {
  for (let i = 0; i < $menuItemList.length; i++) {
    $menuItemList[i].classList.remove("on");
    $navDotAItemList[i].classList.remove("on");
    $navDotBItemList[i].classList.remove("on");
    $navDotCItemList[i].classList.remove("on");
    $sideNavItemList[i].classList.remove("on");
  }

  $menuItemList[currentArticleIndex].classList.add("on");
  $navDotAItemList[currentArticleIndex].classList.add("on");
  $navDotBItemList[currentArticleIndex].classList.add("on");
  $navDotCItemList[currentArticleIndex].classList.add("on");
  $sideNavItemList[currentArticleIndex].classList.add("on");
}

function animateArticle() {
  for (let i = 0; i < $articleList.length; i++) {
    if (window.scrollY > $articleList[i].offsetTop - window.outerHeight / 3) {
      $articleList[i].classList.add("on");
    } else {
      $articleList[i].classList.remove("on");
    }
  }
}

function toggleMenuInMobile() {
  if ($menu.style.display === "") {
    $menu.style.display = "block";
    $btnToggleMenu.setAttribute("aria-label", "close menu");
  } else {
    $menu.style.display = null;
    $btnToggleMenu.setAttribute("aria-label", "open menu");
  }

  window.onresize = () => {
    if (window.outerWidth > TABLET_WIDTH) {
      $menu.style.display = null;
      window.onresize = null;
    }
  };
}

function toggleSideNav() {
  $sideNav.classList.toggle("on");

  if ($sideNav.classList.contains("on")) {
    $btnToggleSideNav.textContent = "Close";
  } else {
    $btnToggleSideNav.textContent = "Open";
  }
}

function toggleHeaderScrollMode() {
  if ($chkboxHeaderScrollMode.checked) {
    window.onscroll = () => {
      if (window.scrollY >= lastWindowScrollTop) {
        $header.style.top = `${-$header.clientHeight}px`;
      } else {
        $header.style.top = null;
      }
      lastWindowScrollTop = window.scrollY;
    };
  } else {
    window.onscroll = null;
    $header.style.top = null;
  }
}

function toggleFullPageScrollMode() {
  if ($chkboxFullPageScrollMode.checked) {
    document.body.style.overflow = "hidden";
    window.onwheel = handleFullPageScrollMode;
  } else {
    window.onwheel = null;
    document.body.style.overflow = null;
  }
}

function handleFullPageScrollMode(e) {
  if (isScrolling) {
    return;
  }
  const $currentArticle = e.target.closest("main > article");

  if (e.deltaY < 0) {
    const $prevArticle = $currentArticle.previousElementSibling;
    if ($prevArticle) {
      animateScroll($prevArticle.offsetTop, DURATION_IN_MS, "easeInExpo");
    }
  } else {
    const $nextArticle = $currentArticle.nextElementSibling;
    if ($nextArticle) {
      animateScroll($nextArticle.offsetTop, DURATION_IN_MS, "easeInExpo");
    }
  }
}

function animateScroll(
  destinationOffsetTop,
  durationInMs = DURATION_IN_MS,
  easing = "linear",
  callback
) {
  if (isScrolling) {
    return;
  }
  isScrolling = true;

  if ("requestAnimationFrame" in window === false) {
    window.scroll(0, destinationOffsetTop);
    if (callback) {
      callback();
    }
    isScrolling = false;
    return;
  }

  const easingCalculator = {
    linear(t) {
      return t;
    },
    easeInExpo(t) {
      return t === 0 ? 0 : Math.pow(2, 10 * t - 10);
    },
  };

  const startInMs = new Date().getTime();
  const startScrollTop = window.scrollY;
  const totalMoveMent = destinationOffsetTop - startScrollTop;

  function animate() {
    const nowInMs = new Date().getTime();
    const progress = Math.min(1, (nowInMs - startInMs) / durationInMs);
    const delta = easingCalculator[easing](progress);

    window.scroll(0, totalMoveMent * delta + startScrollTop);

    if (window.scrollY === destinationOffsetTop) {
      if (callback) {
        callback();
      }
      isScrolling = false;
      return;
    }
    requestAnimationFrame(animate);
  }
  animate();
}
