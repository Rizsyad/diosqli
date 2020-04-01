var d = new Date();

var month = d.getMonth() + 1;
var day = d.getDate();

var pada_tanggal = (('' + day).length < 2 ? '0' : '') + day + '-' + (('' + month).length < 2 ? '0' : '') + month + '-' + d.getFullYear();

document.getElementById('pada_tanggal').innerHTML = pada_tanggal;

function updateTime() {
    var currentTime = new Date()
    var hours = currentTime.getHours()
    var minutes = currentTime.getMinutes()
    var seconds = currentTime.getSeconds()
    if (minutes < 10) {
        minutes = "0" + minutes
    }
    var t_str = hours + ":" + minutes + ":" + seconds + " ";
    if (hours > 11) {
        t_str += "Night / Malam";
    } else {
        t_str += " Morning / Pagi";
    }
    document.getElementById('pada_jam').innerHTML = t_str;
}
setInterval(updateTime, 1000);
