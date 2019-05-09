var calendarData = {
  currentDate : {
    day : "",
    date : "",
    month : "",
    year : "",
  },
  calendar:{
    month : "",
    year : ""
  }
};
var postIts = []; //記事陣列，用來放置月曆中的記事物件資料

function getWeekDayName(day){
  var weekDayNames = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  return weekDayNames[day];
}

function getMonthName(month){
  var monthNames = ["","January","February","March","April","May","June","July","August","September","October","November","December"];
  return monthNames[month];
}

function addOrdinalIndicator(date){
    switch(date){
        case 1:
        case 21:
        case 31: return date + "<sup>st</sup>";
        case 2:
        case 22: return date + "<sup>nd</sup>";
        case 3:
        case 23: return date + "<sup>rd</sup>";
        default: return date + "<sup>th</sup>";
    }
}

function updateData(){
  let today = new  Date();
  calendarData.currentDate.year = today.getFullYear();
  calendarData.currentDate.month = today.getMonth() + 1;
  calendarData.currentDate.day = today.getDay();
  calendarData.currentDate.date =today.getDate();
  calendarData.calendar.month = calendarData.currentDate.month;
  calendarData.calendar.year = today.getFullYear();

  document.getElementById("cur-year").innerHTML = calendarData.currentDate.year;
  document.getElementById("cur-day").innerHTML = getWeekDayName( calendarData.currentDate.day );
  document.getElementById("cur-month").innerHTML = getMonthName ( calendarData.currentDate.month );
  document.getElementById("cur-date").innerHTML = addOrdinalIndicator ( calendarData.currentDate.date );


  fillInMonth();

}

function getUID(month, year, day){
  if (month == 0) { //上個月減1，進到去年份
    month = 12;
    year--;
  }
  if (month == 13) { //下個月加1，進到下年份
    month = 1;
    year++;
  }
  // console.log(month.toString() + year.toString() + day.toString())
  return month.toString() + year.toString() + day.toString();
}

function fillInMonth(){
  document.getElementById("cal-year").innerHTML = calendarData.calendar.year;
  document.getElementById("cal-month").innerHTML = getMonthName ( calendarData.calendar.month );
  var monthDays = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]; //第一個元素放個啞巴元素，好讓我們可以用1~12來存取月份的天數
  //判斷今年是否是閏年
  if ( ((calendarData.calendar.year % 4 == 0) && (calendarData.calendar.year % 100 != 0)) || (calendarData.calendar.year % 400 == 0) ) monthDays[2] = 29;

  var weekDay = (new Date(calendarData.calendar.year, calendarData.calendar.month - 1 ,1)).getDay() ; //取得今年今月1日為禮拜幾
  console.log(calendarData.calendar.year + "," +  calendarData.calendar.month + "," + weekDay);

  var days = document.getElementsByTagName("td");
  //下面迴圈將整個月曆表格元素去除掉color類別屬性，也就是把顏色的設定去掉。
  console.log(days.length)
  for (let i = 0; i < days.length; i++){
    if (days[i].classList.contains("color")) days[i].classList.remove("color");
    if (days[i].classList.contains("prev-month-last-day")) days[i].classList.remove("prev-month-last-day"); //框線的處理
  }

  //中間段，當月
var uid; //index-8-1
for (let i = 0; i < monthDays[calendarData.calendar.month]; i++){
  days[weekDay + i].innerHTML = (i+1);
  uid = getUID(calendarData.calendar.month, calendarData.calendar.year, i+1); //index-8-1
  days[weekDay + i].setAttribute("data-uid", uid); //index-8-1
  // days[weekDay + i].style.backgroundColor = "GoldenRod ";
  appendSpriteToCellAndTooltip(uid, days[weekDay + i]); //index-8-3
}
//上個月段
if (weekDay > 0)  days[weekDay-1].classList.add("prev-month-last-day"); //框線的處理，上個月的最後1天
var preMonth = calendarData.calendar.month-1;
if (preMonth == 0) preMonth = 12;
for (let i = (weekDay-1), day = monthDays[preMonth]; i >=0; i--, day--){
  days[i].innerHTML = day;
  days[i].classList.add("color");
  uid = getUID(calendarData.calendar.month-1, calendarData.calendar.year, day); //index-8-1
  days[i].setAttribute("data-uid", uid); //index-8-1
  appendSpriteToCellAndTooltip(uid, days[i]); //index-8-3
}
//下個月段
for (let i = (weekDay+monthDays[calendarData.calendar.month]), day = 1; i <days.length; i++, day++){
  days[i].innerHTML = day;
  days[i].classList.add("color");
  uid = getUID(calendarData.calendar.month+1, calendarData.calendar.year, day); //index-8-1
  days[i].setAttribute("data-uid", uid); //index-8-1
  appendSpriteToCellAndTooltip(uid, days[i]); //index-8-3
}

//處理今日元素表格的顯著背景設定
  if (document.getElementById("current-day")) {
      document.getElementById("current-day").removeAttribute("id");
  }

  if (calendarData.currentDate.year == calendarData.calendar.year &&　calendarData.currentDate.month == calendarData.calendar.month)  {
    days[weekDay + calendarData.currentDate.date - 1].setAttribute("id", "current-day");
  }
  
  changeColor();
  console.log(document.getElementsByTagName('table')[0].innerHTML);
  // console.log("WeekDay=" + weekDay)
}

function previousMonth(){
  console.log("Prev...");
  calendarData.calendar.month--;
  if (calendarData.calendar.month == 0) {
    calendarData.calendar.month = 12;
    calendarData.calendar.year--;
  }
  fillInMonth();
}

function nextMonth(){
  console.log("Next...");
  calendarData.calendar.month++;
  if (calendarData.calendar.month == 13) {
    calendarData.calendar.month = 1;
    calendarData.calendar.year++;
  }

  fillInMonth();
}
document.onkeydown = function(e) {
    switch (e.keyCode) {
        case 37: previousMonth(); break;
        case 39: nextMonth(); break;
    }
};

function appendSpriteToCellAndTooltip(uid, elem){
    for(let i = 0; i < postIts.length; i++){
        if(uid == postIts[i].id){
            elem.innerHTML += `<img src='images/note${postIts[i].note_num}.png' alt='A post-it note'>`;
            elem.classList.add("tooltip");
            elem.innerHTML += `<span>${postIts[i].note}</span>`;
        }
    }
}
