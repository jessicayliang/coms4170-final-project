// file for managing the popups for modals
let seenWines = []
$(document).ready(() => {
    $('.modal-trigger').on('click', (event) => {
        let target = $(event.currentTarget).attr("data-target");
        $(event.currentTarget).find('img').addClass('dimmed');

        $('#' + target).modal('show');

    });

    function refreshModals() {
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
    }


});
