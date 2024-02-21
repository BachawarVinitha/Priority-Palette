const workTimeInput = document.getElementById("work-time");
const shortBreakTimeInput = document.getElementById("short-break-time");
const longBreakTimeInput = document.getElementById("long-break-time");
const timerStart = document.getElementById("timer-start");
const timerPause = document.getElementById("timer-pause");
const timerResume = document.getElementById("timer-resume");
const timerRestart = document.getElementById("timer-restart");
const timerMinutes = document.getElementById("timer-minutes");
const timerSeconds = document.getElementById("timer-seconds");
const darkModeSwitch = document.getElementById('dark-mode-switch');
const toggleSlider = document.querySelector('.toggle-slider');

let interval;
let timeRemaining;
let timerType = "work";
let workSessionsCompleted = 0;

function updateTimerDisplay(minutes, seconds) {
    timerMinutes.textContent = String(minutes).padStart(2, "0");
    timerSeconds.textContent = String(seconds).padStart(2, "0");
}
function showCustomNotification() {
    var audio = new Audio("https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3");
    audio.play();
    Swal.fire({
        title: 'It\'s Time for a Break!',
        icon: 'info',
        confirmButtonText: 'OK'
    });
}

function startTimer(duration) {
    timeRemaining = duration;
    updateTimerDisplay(Math.floor(duration / 60), duration % 60);

    interval = setInterval(() => {
        timeRemaining--;

        if (timeRemaining < 0) {
            clearInterval(interval);
            showCustomNotification();
            switchTimer();
            return;
        }

        updateTimerDisplay(Math.floor(timeRemaining / 60), timeRemaining % 60);
    }, 1000);
}

function switchTimer() {
    if (timerType === "work") {
        workSessionsCompleted++;
        timerType = workSessionsCompleted % 3 === 0 ? "long-break" : "short-break";
        startTimer(
            parseInt(
                timerType === "short-break"
                    ? shortBreakTimeInput.value
                    : longBreakTimeInput.value
            ) * 60
        );
    } else {
        timerType = "work";
        startTimer(parseInt(workTimeInput.value) * 60);
    }
}

timerStart.addEventListener("click", () => {
    timerStart.setAttribute("hidden", "");
    timerPause.removeAttribute("hidden");
    timerRestart.removeAttribute("hidden");
    startTimer(parseInt(workTimeInput.value) * 60);
});

timerPause.addEventListener("click", () => {
    timerPause.setAttribute("hidden", "");
    timerResume.removeAttribute("hidden");
    clearInterval(interval);
});

timerResume.addEventListener("click", () => {
    timerResume.setAttribute("hidden", "");
    timerPause.removeAttribute("hidden");
    startTimer(timeRemaining);
});

timerRestart.addEventListener("click", () => {
    clearInterval(interval);
    timerStart.removeAttribute("hidden");
    timerPause.setAttribute("hidden", "");
    timerResume.setAttribute("hidden", "");
    timerRestart.setAttribute("hidden", "");
    updateTimerDisplay(parseInt(workTimeInput.value), 0);
});

document.addEventListener("DOMContentLoaded", () => {});

darkModeSwitch.addEventListener("change", () => {
    document.body.classList.toggle("dark-mode", darkModeSwitch.checked);
});

toggleSlider.addEventListener("click", () => {
    darkModeSwitch.checked = !darkModeSwitch.checked;
    document.body.classList.toggle("dark-mode", darkModeSwitch.checked);
});