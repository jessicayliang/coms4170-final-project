/*
* A script to timestamp when the user hits 'start'
*/

$(document).ready(() => {
    let learningStarted;
    $("#start-btn").click(() => {
        learningStarted = Date.now();
        logStartTime();
    });

    function logStartTime() {
        /**
         * Sends the start time to the server.
         **/
        $.ajax({
            url: '/learn/record/time', type: 'POST',
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
            error: function (e) {
                console.error(e)
            }
        })
    }

});



