$(document).ready(function() {
    $('#update-events-form').on('submit', function(event) {
        event.preventDefault();
        $.ajax({
            url: '/update-content',
            method: 'POST',
            data: $(this).serialize(),
            success: function(response) {
                alert(response);
            },
            error: function() {
                alert('Error updating content');
            }
        });
    });
});
