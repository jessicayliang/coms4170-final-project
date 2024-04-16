/*
* A debugging script to keep track of which wines have been marked as seen.
*/

$(document).ready(() => {
    console.log("Button exists:", $('#next-btn').length > 0);

    $("#next-btn").click(() => {
        console.log("click")
        $.ajax({
            url: '/getwines',
            type: "GET",
            contentType: 'application/json',
            success: function (response) {
                console.log(response);
            },
            error: function (error) {
                console.error("Error:", error);
            }
        });
    });


})