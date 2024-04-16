/*
* A script to keep track of the user's choices in the learn phase.
*/

let learningStarted;
let currentWine;
$(document).ready(() => {
    $("#start-btn").click(() => {
        learningStarted = Date.now();
        logStartTime();
    })
    $("#next-btn").click(() => {
        currentWine
    })
})

function logStartTime() {
    /**
     * Sends the start time to the server.
     **/
    $.ajax({
        url: '/record/learn', type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({'time_started': learningStarted}),
        success: function (_) {
            console.log("saved the time:", learningStarted);
        },
        error: function (_) {
            console.error(this.error)
        }
    })
}

function sendWineSeen(wine_name) {
    /**
     * Sends a message to the server telling it a wine has been seen.
     **/
    $.ajax({
        url: '/record/learn', type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({'wine_visited': wine_name}),
        success: function (_) {
            console.log("saved the time:", learningStarted);
        },
        error: function (_) {
            console.error(this.error)
        }
    })
}