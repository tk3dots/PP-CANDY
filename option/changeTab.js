document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('tab1-btn').addEventListener('click', function() { changeTab(1); });
  document.getElementById('tab3-btn').addEventListener('click', function() { changeTab(3); });
  document.getElementById('tab4-btn').addEventListener('click', function() { changeTab(4); });
  document.getElementById('tab5-btn').addEventListener('click', function() { changeTab(5); });
});

function changeTab(tabNumber) {
  var i, tabcontent;
  tabcontent = document.getElementsByClassName("tab-content");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  document.getElementById("tab" + tabNumber).style.display = "block";
}

// 初期表示でMainタブを表示
changeTab(1);
