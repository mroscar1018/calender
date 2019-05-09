//current 目前點擊的日期
var currentPostItID = 0; //目前的記事ID
var newCurrentPostIt = true; //目前的記事是否為新？也就是：目前點選的日期尚未有任何的記事資料
var currentPostItIndex = 0; //目前的記事在postIts陣列中的位置索引

function openMakeNote(){
  var modal = document.getElementById("modal");
  modal.open = true;
  modal.classList.remove("fade-out"); //淡出效果
  modal.classList.add("fade-in"); //淡入效果
  var template = document.getElementById("make-note");
  template.removeAttribute("hidden");

  document.getElementById("edit-post-it").focus(); //游標跳至文字輸入方塊中…
  if(!newCurrentPostIt){
        document.getElementById("edit-post-it").value = postIts[currentPostItIndex].note;
  }
}
function closeMakeNote(){
  //關閉對話方塊
  var modal = document.getElementById("modal");
  modal.classList.remove("fade-in");
  modal.classList.add("fade-out"); //淡出效果
  modal.open = false;
  var template = document.getElementById("make-note");
  template.setAttribute("hidden", "hidden");
}

function currentDayHasNote(uid){ //測試特定UID是否已經有記事
    for(var i = 0; i < postIts.length; i++){
        if(postIts[i].id == uid){
            newCurrentPostIt = false;
            currentPostItIndex = i;
            document.getElementById("edit-post-it").value = postIts[i].note;
            return;
        }
    }
    newCurrentPostIt = true;
}

function getRandom(min, max) { //傳回介於min與max間的亂數值
    return Math.floor(Math.random() * (max - min) ) + min;
}

function submitPostIt(){ //按了PostIt按鍵後，所要執行的方法
    const value = document.getElementById("edit-post-it").value;
      document.getElementById("edit-post-it").value = "";
      let num = getRandom(1, 6); //取得1~6的亂數，用來標示便利貼顏色的檔案代號
      let postIt = {
          id: currentPostItID,
          note_num: num,
          note: value
      }
      if(newCurrentPostIt){ //如果是新記事的話
          postIts.push(postIt); //將新記事postIT物件推入postIts陣列
          ajax({new_note_uid: postIt.id, new_note_color: postIt.note_num, new_note_text: postIt.note}); //index-9-2.php
      } else {
          postIts[currentPostItIndex].note = postIt.note; //更新現有記事物件的記事資料
          ajax({update_note_uid: postIts[currentPostItIndex].id, update_note_text: postIt.note}); //index-9-2.php
      }

    console.log(postIts)
    fillInMonth(); //這個方法可以改成fillInCalendar比較貼切，之後，我們再來統一大改 (refactoring)
    closeMakeNote();
}

function deleteNote(){
    document.getElementById("edit-post-it").value = "";
    let indexToDel;
    if(!newCurrentPostIt){
        indexToDel =currentPostItIndex;
    }
    if(indexToDel != undefined){
      ajax({delete_note_uid: postIts[indexToDel].id}); //index-9-2.php
      postIts.splice(indexToDel, 1);
    }
    fillInMonth(); //這個方法可以改成fillInCalendar比較貼切，之後，我們再來統一大改 (refactoring)
    closeMakeNote();
}


function dayClicked(elm) {
  // console.log(elm.dataset.uid)
  currentPostItID = elm.dataset.uid; //目前的記事ID為所點擊的日期表格上的uid
  currentDayHasNote(currentPostItID);//判斷目前點蠕擊的日期是否有記事資料
  openMakeNote();
}
