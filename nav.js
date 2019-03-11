$(document).ready(function () {
  $(".nav-item").click(function(e) {
    showPage(e.currentTarget.dataset.page);
  });
});

function showPage(page) {
  $(".page").hide();
  $(".list").hide();
  $(".nav-item").removeClass("green");
  $(page + "-nav").addClass("green");
  $(page).show();
  console.log(page);
}

