/*
* A script to keep track of the user's choices in the learn phase.
*/

let learningStarted;
let currentWine;
$(document).ready(() => {
    $("#start-btn").click(() => {
        learningStarted = Date.now();
        logStartTime();
    });
    // $("#next-btn").click(() =>
    //     currentWine
    // });
})

function logStartTime() {
    /**
     * Sends the start time to the server.
     **/
    $.ajax({
        url: '/record/learn', type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({'time_started': learningStarted}),
        success: function (response) {
            // Check if the server responded with a redirect URL
            if (response.redirect) {
                // If so, the browser to the specified URL
                console.log("time_started:", response.time_started);
                window.location.href = response.redirect;
            } else {
                console.log("No redirection needed.");
            }
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
        success: function (response) {
            console.log(response);
        },
        error: function (_) {
            console.error(this.error)
        }
    })
}