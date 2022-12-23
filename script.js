var alarmString = null;

const alarmAudio = document.getElementById("alarmAudio");

const creatAlarm = document.getElementById("creatAlarm");

const activeAlarm = document.getElementById("activeAlarm");

const deleteAlarm = document.getElementById("deleteSetAlarm");

const alarmTextContent = document.getElementById("alarmText");

var submitbtn = document.getElementById("submitbtn");



//Initialize alarm Sound
alarmAudio.src = "alarm-clock-short-6402.mp3";
alarmAudio.load();



//covert in string
const getTimeString = ({hours, minutes, seconds, zone}) => {  

    if(minutes / 10 < 1){
        minutes = "0" + minutes;
    }

    if(seconds / 10 < 1){
        seconds = "0" + seconds;
    }

    return `${hours}:${minutes}:${seconds} ${zone}`;
};

//Function to dislpay Curremt Time
const renderTime = () => {

    var currentTime = document.getElementById("currentTime");

    var currentDate = new Date();

    var hours = currentDate.getHours();
    var minutes = currentDate.getMinutes();
    var seconds = currentDate.getSeconds();

    var zone = hours >= 12 ? "PM" : "AM";

    if(hours > 12){
        hours = hours % 12;
    } 

    const timeString = getTimeString({hours, minutes, seconds, zone});


    //Alarm Ring
    if(localStorage.getItem('alarm') !== null){

        let storedv = JSON.parse(localStorage.getItem("alarm"));

        for(let i=0; i<=storedv.length; i++){
            // getting current object 
            let currentObj = storedv[i];
            if(currentObj == undefined){
                break;
            }
                

            if(hours == storedv[i].hour && minutes == storedv[i].min && seconds == storedv[i].sec && zone == storedv[i].zone){
                alarmAudio.play();
                alert("Alarm Ringing");
            }

        }
    }
    
    currentTime.innerHTML = timeString;

};

//submit alarm value 

submitbtn.addEventListener('click', function(event){
    event.preventDefault();
    let hourDiv = document.getElementById("h").value;
    let minutesDiv = document.getElementById("m").value;
    let secondsDiv = document.getElementById("s").value;
    let zoneDiv = document.getElementById("z");
        
    if(hourDiv.substring(0, 1) === "0"){
        hourDiv = hourDiv.substring(1, 2);
    }

    zoneValue = zoneDiv.options[zoneDiv.selectedIndex].value

    if(hourDiv === '' || minutesDiv === '' || secondsDiv === '' || zoneValue === ""){
        alert("Please Select Alarm Time Properly");
    }else{

        if(hourDiv <= 12 && minutesDiv <= 60 && secondsDiv <= 60){
            let obj = {
                hour : hourDiv,
                min : minutesDiv < 10 ? "0" + minutesDiv : minutesDiv,
                sec : secondsDiv < 10 ? "0" + secondsDiv : secondsDiv,
                zone : zoneValue
            }
    
            addlocalStorage(obj);
            displayLSC();

        }else if(hourDiv > 12){
            alert("Please put Hourse in between 1 to 12");
        }else if(minutesDiv > 60){
            alert("Please put Minutes in between 1 to 60");
        }else if(secondsDiv > 60){
            alert("Please put Seconds in between 1 to 60");
        }

        document.getElementById("h").value = "";
        document.getElementById("m").value = "";
        document.getElementById("s").value = "";
            
    }
});

// save in local storage
function addlocalStorage(obj){

    if(localStorage.getItem('alarm') === null){
        let alarmArray = [];
        localStorage.setItem('alarm', JSON.stringify(alarmArray));
    }

    alarmArray = JSON.parse(localStorage.getItem('alarm'));

    alarmArray.push(obj);

    localStorage.setItem('alarm', JSON.stringify(alarmArray));

}

// display local store value
function displayLSC(){

    const list = document.getElementById("alarmList");

    removeAllChildNodes(list);

    if(localStorage.getItem('alarm') !== null){

        let storedv = JSON.parse(localStorage.getItem("alarm"));

        for(let i=0; i<=storedv.length; i++){

            // getting current object 
            let currentObj = storedv[i];

            if(currentObj == undefined)
                break;

            const div = document.createElement('div');
            
            div.classList.add("currentAlaram");

            div.innerHTML = `
                <div>Alarm is set at ${currentObj.hour}:${currentObj.min}:${currentObj.sec} ${currentObj.zone}</div>
                <button value = ${i} class="remove-btn">Remove</button>
            `
            list.appendChild(div);
           
        }
    }

}

// Delete Alarm
const alarmList = document.getElementById("alarmList");

alarmList.addEventListener("click", deleteItem);

//Function of Deleting alarm
function deleteItem(e) {
    const currentItem = e.target;
    if(currentItem.classList[0] === "remove-btn"){
        const div = currentItem.parentElement;
        removeAlarmFromLocal(currentItem.value);
        div.remove();
    }
}

//Removing Alarm details From local Storage
function removeAlarmFromLocal(index){
    const alarmArray = JSON.parse(localStorage.getItem('alarm'));
    alarmArray.splice(index, 1);
    localStorage.setItem("alarm", JSON.stringify(alarmArray));
}


//Removing Extra nodes
function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

displayLSC();

//update time every second
setInterval(renderTime, 1000);
