// If user sees article1 area 10% and article2 B area 90%, returns article1 index
export function getCurrentVisibleArticleIndexJQuery($articleList) {
  for (let i = 0; i < $articleList.length; i++) {
    const articleOffsetBottom = $articleList.eq(i).offset().top + $articleList.eq(i).outerHeight();
    if ($(window).scrollTop() < articleOffsetBottom) {
      return i;
    }
  }
}

export function getCurrentVisibleArticleIndexJS(articleList) {
  for (let i = 0; i < articleList.length; i++) {
    const articleOffsetBottom = articleList[i].offsetTop + articleList[i].offsetHeight;
    if (window.scrollY < articleOffsetBottom) {
      return i;
    }
  }
}
