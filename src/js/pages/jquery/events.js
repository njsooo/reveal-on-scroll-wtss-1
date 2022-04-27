import "jquery-ui/ui/effect";
import { getCurrentVisibleArticleIndexJQuery } from "@/js/commons/functions";
import { TABLET_WIDTH, DURATION_IN_MS } from "@/js/commons/variables";

/* VARIABLES */
const $window = $(window);
const $header = $("#header");

const $menu = $("#menu");
const $sideNav = $("#side-nav");

const $menuItemList = $("#menu ul li");
const $sideNavItemList = $("#side-nav ul li");
const $navDotAItemList = $("#dot-nav-a ul li");
const $navDotBItemList = $("#dot-nav-b ul li");
const $navDotCItemList = $("#dot-nav-c ul li");

const $articleList = $("#main article");

const $btnToggleMenu = $("#header .btn-toggle-menu");
const $btnToggleSideNav = $("#side-nav .btn-toggle-side-nav");

const $chkboxHeaderScrollMode = $("#header .switch-header-scroll-mode input[type='checkbox']");
const $chkboxFullPageScrollMode = $("#header .switch-full-page-scroll-mode input[type='checkbox']");

let lastWindowScrollTop = $window.scrollTop();
let isScrolling = false;

/* EVENTS */
$menuItemList.on("click", goToArticle);
$sideNavItemList.on("click", goToArticle);
$navDotAItemList.on("click", goToArticle);
$navDotBItemList.on("click", goToArticle);
$navDotCItemList.on("click", goToArticle);

$window.on("scroll", function () {
  const currentArticleIndex = getCurrentVisibleArticleIndexJQuery($articleList);

  updateCurrentNavItem(currentArticleIndex);
  animateArticle();
});

$btnToggleMenu.on("click", toggleMenuInMobile);
$btnToggleSideNav.on("click", toggleSideNav);

$chkboxHeaderScrollMode.on("change", toggleHeaderScrollMode);
$chkboxFullPageScrollMode.on("change", toggleFullPageScrollMode);

/* FUNCTIONS */
function goToArticle() {
  const index = $(this).index();
  const articleOffsetTop = $articleList.eq(index).offset().top;
  $("html, body").animate({ scrollTop: articleOffsetTop }, DURATION_IN_MS, "easeInOutExpo");
}

function updateCurrentNavItem(currentArticleIndex) {
  $menuItemList.removeClass("on");
  $navDotAItemList.removeClass("on");
  $navDotBItemList.removeClass("on");
  $navDotCItemList.removeClass("on");
  $sideNavItemList.removeClass("on");

  $menuItemList.eq(currentArticleIndex).addClass("on");
  $navDotAItemList.eq(currentArticleIndex).addClass("on");
  $navDotBItemList.eq(currentArticleIndex).addClass("on");
  $navDotCItemList.eq(currentArticleIndex).addClass("on");
  $sideNavItemList.eq(currentArticleIndex).addClass("on");
}

function animateArticle() {
  for (let i = 0; i < $articleList.length; i++) {
    if ($window.scrollTop() > $articleList.eq(i).offset().top - $window.outerHeight() / 3) {
      $articleList.eq(i).addClass("on");
    } else {
      $articleList.eq(i).removeClass("on");
    }
  }
}

function toggleMenuInMobile() {
  if ($menu.css("display") === "none") {
    $menu.show();
    $btnToggleMenu.attr("aria-label", "close nav");
  } else {
    $menu.hide();
    $btnToggleMenu.attr("aria-label", "open nav");
  }

  window.onresize = () => {
    if ($window.outerWidth() > TABLET_WIDTH) {
      $menu.css("display", "");
      window.onresize = null;
    }
  };
}

function toggleSideNav() {
  $sideNav.toggleClass("on");

  if ($sideNav.hasClass("on")) {
    $(this).text("Close");
  } else {
    $(this).text("Open");
  }
}

function toggleHeaderScrollMode() {
  if ($(this).is(":checked")) {
    window.onscroll = () => {
      if ($window.scrollTop() >= lastWindowScrollTop) {
        $header.css({ top: -$header.outerHeight() });
      } else {
        $header.css({ top: "" });
      }
      lastWindowScrollTop = $window.scrollTop();
    };
  } else {
    window.onscroll = null;
    $header.css({ top: "" });
  }
}

function toggleFullPageScrollMode() {
  if ($(this).is(":checked")) {
    $(document.body).css({ overflow: "hidden" });
    window.onwheel = handleFullPageScrollMode;
  } else {
    window.onwheel = null;
    $(document.body).css({ overflow: "" });
  }
}

function handleFullPageScrollMode(e) {
  if (isScrolling) {
    return;
  }
  const $currentArticle = $(e.target).closest($articleList);

  if (e.deltaY < 0) {
    const $prevArticle = $currentArticle.prev();
    if ($prevArticle.length !== 0) {
      isScrolling = true;
      $("html, body").animate(
        { scrollTop: $prevArticle.offset().top },
        DURATION_IN_MS,
        "easeInExpo",
        () => {
          isScrolling = false;
        }
      );
    }
  } else {
    const $nextArticle = $currentArticle.next();
    if ($nextArticle.length !== 0) {
      isScrolling = true;
      $("html, body").animate(
        { scrollTop: $nextArticle.offset().top },
        DURATION_IN_MS,
        "easeInExpo",
        () => {
          isScrolling = false;
        }
      );
    }
  }
}
