window.onload = function() {
  var a = document.getElementById("night");
  a.onclick = function() {
   	if (document.getElementsByTagName("html")[0].style.backgroundColor === "rgb(45, 48, 44)") {
   		document.getElementsByTagName("html")[0].style.backgroundColor = "";
   		document.getElementsByTagName("body")[0].style.backgroundColor = "";
     	return false;
    } else {
   		document.getElementsByTagName("html")[0].style.backgroundColor = "#2D302C";
   		document.getElementsByTagName("body")[0].style.backgroundColor = "#2D302C";
  		return false;
    }
  }
}
