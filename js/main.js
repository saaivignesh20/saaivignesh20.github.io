$(document).ready(function() {
    let mouseX = 0;
    let mouseY = 0;

    $(document).on('mousemove', function(e) {
        // Update mouse coordinates
        mouseX = e.pageX;
        mouseY = e.pageY;

        // Move the small circle immediately
        $('.circle-in').css({
            'top': mouseY - 4, // Center the small circle
            'left': mouseX - 4 // Center the small circle
        });
    });

    function updateOuterCircle() {
        const circleOut = $('.circle-out');
        const currentTop = parseInt(circleOut.css('top'), 10);
        const currentLeft = parseInt(circleOut.css('left'), 10);

        // Calculate the new position for the outer circle
        const newTop = currentTop + (mouseY - currentTop - 13) * 0.8; // Adjust the multiplier for speed
        const newLeft = currentLeft + (mouseX - currentLeft - 13) * 0.8; // Adjust the multiplier for speed

        // Update the position of the outer circle
        circleOut.css({
            'top': newTop,
            'left': newLeft
        });

        // Call this function again to keep updating
        requestAnimationFrame(updateOuterCircle);
    }

    // Initialize the position of the outer circle
    $('.circle-out').css({
        'top': '0px',
        'left': '0px'
    });

    // Start updating the outer circle
    updateOuterCircle();
});