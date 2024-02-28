document.addEventListener("DOMContentLoaded", () => {
  //? select the element
  const startButton = document.getElementById("start-countdown");
  const pauseButton = document.getElementById("pause-countdown");
  const cancelButton = document.getElementById("cancel-countdown");
  const resumeButton = document.getElementById("resume-countdown");

  //! initial values
  let countdownTimer;
  let endTime;

  //? Function to update the display
  function updateDisplay(time) {
    //! get days
    const days = Math.floor(time / (1000 * 60 * 60 * 24));
    //! get hours
    const hours = Math.floor((time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    //! get minutes
    const minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
    //! get seconds
    const seconds = Math.floor((time % (1000 * 60)) / (1000));
    document.getElementById("days").textContent = days
      .toString()
      .padStart(2, "0");
    document.getElementById("hours").textContent = hours
      .toString()
      .padStart(2, "0");
    document.getElementById("minutes").textContent = minutes
      .toString()
      .padStart(2, "0");
    document.getElementById("seconds").textContent = seconds
      .toString()
      .padStart(2, "0");
  }

  //? Function to reset the display
  function resetDisplayButton() {
    document.getElementById("target-date").value = "";
    document.getElementById("days").textContent = "00";
    document.getElementById("hours").textContent = "00";
    document.getElementById("minutes").textContent = "00";
    document.getElementById("seconds").textContent = "00";
    startButton.disabled = false;
    pauseButton.disabled = true;
    cancelButton.disabled = true;
    resumeButton.disabled = true;
  }

  //? Function to start the countdown
  function startCountDown(duration, isResuming = false) {
    if (!isResuming) {
      endTime = Date.now() + duration;
    }
    countdownTimer = setInterval(() => {
      const now = Date.now();
      const timeLeft = endTime - now;
      if (timeLeft <= 0) {
        clearInterval(countdownTimer);
        displayMessage("Countdown finished");
        localStorage.removeItem("countdownTarget");
        resetDisplayButton();
        return;
      }
      updateDisplay(timeLeft);
      pauseButton.disabled = false;
      cancelButton.disabled = false;
    }, 1000);
  }

  //? Function to display the message
  function displayMessage(message) {
    const display = document.getElementById("timer-display");
    display.textContent = message;
  }

  //? Function to add event listener to the buttons
  //! Start button
  startButton.addEventListener("click", function () {
    const targetDateValue = document.getElementById("target-date").value;
    if (targetDateValue) {
      const targetDate = new Date(targetDateValue);
      const now = new Date();
      if (targetDate > now) {
        const duration = targetDate - now;
        localStorage.setItem("countdownTarget", targetDate.toString());
        startCountDown(duration);
        startButton.disabled = true;
        pauseButton.disabled = false;
        cancelButton.disabled = true;
        resumeButton.disabled = false;
      } else {
        alert("please select a future date and time");
      }
    } else {
      alert("Please select date and time");
    }
  });

  //! pause button
  pauseButton.addEventListener("click", function () {
    clearInterval(countdownTimer);
    pauseButton.disabled = true;
    resumeButton.disabled = false;
  });

  //! resume button
  resumeButton.addEventListener("click", function () {
    const duration = endTime - Date.now();
    startCountDown(duration, true);
    pauseButton.disabled = false;
    resumeButton.disabled = true;
  });

  //! cancel button
  cancelButton.addEventListener("click", function () {
    clearInterval(countdownTimer);
    localStorage.removeItem("countdownTarget");
    resetDisplayButton();
  });

  //? function to load and auto start the countdown if a saved target exists
  const savedDate = localStorage.getItem("countdownTarget");
  if (savedDate) {
    const targetDate = new Date(savedDate);
    const now = new Date();
    if (targetDate > now) {
      const duration = targetDate - now;
      startCountDown(duration);
      startButton.disabled = true;
      pauseButton.disabled = false;
      cancelButton.disabled = false;
    } else {
      localStorage.removeItem("countdownTarget");
      resetDisplayButton();
    }
  }
});
