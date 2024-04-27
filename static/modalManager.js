// file for managing the popups for modals, as well as the wine image dimming
let wines;

$(document).ready(() => {
    let num_seen = 0;
    refreshAllImages();

    $('#reset-btn').on('click', function(){
        markAllWineAsUnseen()
        num_seen = 0;
    });

    function refreshAllImages() {
        console.log('refreshing all')
        num_seen = 0
        $("#wine-display").empty()
        $.ajax({
            url: '/getwines',  // Endpoint returning JSON array of wines
            type: 'GET',
            contentType: 'application/json',
            success: function (response) {
                // Assuming 'response' is an object where keys are wine_ids and values are wine details
                $.each(response, function (wine_num, details) {
                    // console.log(details['seen'])
                    if(details['seen'] == true){
                        num_seen += 1;
                    }
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

                if(num_seen == 10){
                    console.log('finished lesson');
                }

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

    function markWineAsUnseen(wine_id) {
        /* Called when a modal is triggered.
        *  Sends a message to the server marking the wine as unseen.
        *  Also refreshes all the modals.
        */
        $.ajax({
            url: `/mark_as_unseen/${wine_id}`,
            type: 'GET',
            contentType: 'application/json',
            success: function (response) {
                // refreshAllImages();
            },
            error: function (err) {
                console.error("there was an error:", err);
            }
        })
    }

    function markAllWineAsUnseen(){
        $.ajax({
            url: '/getwines',  // Endpoint returning JSON array of wines
            type: 'GET',
            contentType: 'application/json',
            success: function (response) {
                // Assuming 'response' is an object where keys are wine_ids and values are wine details
                $.each(response, function (wine_num) {
                    markWineAsUnseen(wine_num)
                });
                refreshAllImages()
            },
            error: function (error) {
                console.error("Error fetching wines:", error);
            }
        });
    }

});
