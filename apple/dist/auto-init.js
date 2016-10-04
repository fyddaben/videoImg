(function(){var i="analytics-page-view-data";var l=require("ac-analytics");var h=document.addEventListener?"addEventListener":"attachEvent";
var j=document.addEventListener?"":"on";var g={};var k;document[h](j+"readystatechange",function(){if(document.readyState==="complete"){k=document.getElementById(i);
if(k){try{k=k.innerHTML;k=JSON.parse(k);g.page={data:k}}catch(a){}}l.createBasicObserverSuite(g)
}})}());