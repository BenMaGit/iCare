function inTime(apptTime) {
    var now = new Date();
    var time = (now.getHours()+8) * 60 + now.getMinutes();
    console.log(apptTime*60 +'appointment time')
    console.log(time + " NOW")
    return (apptTime*60 - time) <= 60
}


module.exports = {inTime}