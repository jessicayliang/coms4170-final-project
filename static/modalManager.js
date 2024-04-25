// file for managing the popups for modals, as well as the wine image dimming
let wines;
$(document).ready(() => {
    refreshAllImages();

    function refreshAllImages() {
        console.log('refreshing all')
        $("#wine-display").empty()
        $.ajax({
            url: '/getwines',  // Endpoint returning JSON array of wines
            type: 'GET',
            contentType: 'application/json',
            success: function (response) {
                // Assuming 'response' is an object where keys are wine_ids and values are wine details
                $.each(response, function (wine_num, details) {
                    // console.log(details['seen'])
                    let imgClass = details['seen'] ? 'img-fluid dimmed' : 'img-fluid';
                    let wineHtml = `
                    <div class="col">
                        <div class="image-container-blank modal-trigger" data-toggle="modal"
                             data-target="#modal_${wine_num}">
                            <img data-wine-id="${wine_num}" id='glass${wine_num}' class='${imgClass} wine-glass' 
                                 src="${details.wine_img}"
                                 alt="glass of ${details.wine_name}">
                               
                            <span class="hover-text">${details.wine_name}</span>
                        </div>
                    </div>`;
                    $('#wine-display').append(wineHtml);
                });

                // reattach event listeners
                $('.modal-trigger').on('click', (event) => {
                    markWineAsSeen($(event.currentTarget).find('img').attr('data-wine-id'));
                });

            },
            error: function (error) {
                console.error("Error fetching wines:", error);
            }
        });
    }

    function markWineAsSeen(wine_id) {
        /* Called when a modal is triggered.
        *  Sends a message to the server marking the wine as seen.
        *  Also refreshes all the modals.
        */
        $.ajax({
            url: `/mark_as_seen/${wine_id}`,
            type: 'GET',
            contentType: 'application/json',
            success: function (response) {
                // console.log("marked", wine_id, 'as seen');
                refreshAllImages();
            },
            error: function (err) {
                console.error("there was an error:", err);
            }
        })
    }

});
