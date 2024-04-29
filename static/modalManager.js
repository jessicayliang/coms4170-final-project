// file for managing the popups for modals, as well as the wine image dimming
let wines;
let num_seen = 0;
let doSuccessPopup = true
$(document).ready(() => {
    $("#to_quiz_modal").modal({show: false});
    countSeen();

    // add an event listener for every modal in which it checks to trigger end of lesson on close
    $('#modal-container .modal').on('hidden.bs.modal', function () {
        // console.log('Modal closed. Total seen:', num_seen);
        if (num_seen >= 10 && doSuccessPopup) {
            openSuccessModal();
        }
    });

    refreshAllImages();

    $('#reset-btn').on('click', function () {
        markAllWineAsUnseen()
        $("#quiz-btn-holder").empty()
        doSuccessPopup = true
    });

    function refreshAllImages() {
        console.log('refreshing all')
        $("#wine-display").empty()
        $.ajax({
            url: '/getwines',  // Endpoint returning JSON array of wines
            type: 'GET',
            contentType: 'application/json',
            success: function (response) {
                // Assuming 'response' is an object where keys are wine_ids and values are wine details
                num_seen = 0
                $.each(response, function (wine_num, details) {
                    // console.log(details['seen'])
                    if (details['seen']) {
                        num_seen++;
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
                if (num_seen === 10 && !doSuccessPopup) {
                    console.log('appending')
                    $("#quiz-btn-holder").empty().append("<button class='btn btn-success'>To quiz</button>").click(function () {
                        window.location.href = './quiz/1'
                    })
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

    function markAllWineAsUnseen() {
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

    function openSuccessModal() {
        doSuccessPopup = false
        $("#quiz-btn-holder").empty()
        $("#to_quiz_modal").modal('show').on('hidden.bs.modal', function () {
            $("#quiz-btn-holder").empty().append("<button class='btn btn-success'>To quiz</button>").click(function () {
                window.location.href = './quiz/1'
            })
        });

        $("#btn-to-quiz").click(function () {
            window.location.href = './quiz/1'
        })

        confetti();
    }

    function countSeen() {
        $.ajax({
            url: '/getwines',  // Endpoint returning JSON array of wines
            type: 'GET',
            contentType: 'application/json',
            success: function (response) {
                // Assuming 'response' is an object where keys are wine_ids and values are wine details
                num_seen = 0
                $.each(response, function (wine_num, details) {
                    // console.log(details['seen'])
                    if (details['seen']) {
                        num_seen++;
                    }
                });
                if(num_seen == 10){
                    doSuccessPopup = false;
                }
            },
            error: function (error) {
                console.error("Error fetching wines:", error);
            }
        });

    }


});
