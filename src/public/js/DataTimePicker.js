options  = {
    drops: 'down',
    singleDatePicker: true,
    showDropdowns: true,
    minYear: 2020,
    timePicker : true,
    timePicker24Hour : true,
    timePickerIncrement : 1,
    locale : {
        format : 'YYYY-MM-DD HH:mm'
    }
}

options2  = {
    drops: 'down',
    singleDatePicker: true,
    showDropdowns: true,
    minYear: 2020,
    locale : {
        format : 'YYYY-MM-DD'
    }
}

$('#DateI').daterangepicker(options);
$('#DateModification').daterangepicker(options2);
