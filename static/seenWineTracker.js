/*
* A debugging script to keep track of which wines have been marked as seen.
*/

$(document).ready(() => {
    console.log("Seen wines:")
    $.ajax({
        url: '/getwines',
        type: "GET",
        contentType: 'application/json',
        success: function (response) {
            Object.keys(response).forEach(function (key) {
                let wine = response[key];
                if (wine.seen) {
                    console.log(wine.wine_name);
                }

            });
        },
        error: function (error) {
            console.error("Error:", error);
        }
    });


})