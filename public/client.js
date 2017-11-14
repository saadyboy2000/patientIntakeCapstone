let FORM_URL = '/forms';
let NEW_FORM_URL = '/forms/new';

/*function handleNewFormButton() {
    $('#nav-create-button').on('click', function () {
        $('#new-formEntry').removeClass('hide-display');
        $('.start-page').addClass('hide-display');
    })
}
*/


//post a new form
function postNewForm() {
    $('#new-form').on('submit', function (e) {
        e.preventDefault();
        let doctorInput = $(this).parent().find('#doctor').val();
        let specialtyInput = $(this).parent().find('#specialty').val();
        let idInput = $(this).parent().find('#id').val();
        let questionsInput = $(this).parent().find('#questions').val();

        let dataInput = {
            'doctor': doctorInput,
            'specialty': specialtyInput,
            'id': idInput,
            'questions': questionsInput,
        };

        let htmlOutput = "";
        $.ajax({
                method: 'POST',
                dataType: 'json',
                contentType: 'application/json',
                data: JSON.stringify(dataInput),
                url: NEW_FORM_URL
            })
            .done(function (data) {

                htmlOutput += '<div class="current-form">';
                htmlOutput += '<input type="hidden" class="formID" value="';
                htmlOutput += data.id;
                htmlOutput += '">';
                htmlOutput += '<h2>Doctor: </h2>';
                htmlOutput += '<p class="form-doctor">';
                htmlOutput += data.doctor;
                htmlOutput += '</p><br><br>';
                htmlOutput += '<h2>Specialty: </h2>';
                htmlOutput += '<p class="form-specialty">';
                htmlOutput += data.specialty;
                htmlOutput += '</p><br><br>';
                htmlOutput += '<h2>Questions: </h2>';
                htmlOutput += '<p class="form-questions">';
                htmlOutput += data.questions;
                htmlOutput += '</p><br><br>';
                htmlOutput += '</div>';
                htmlOutput += '<button id="edit-button" class="form-button">Edit</button>';
                htmlOutput += '<button id="delete-button" class="form-button">Delete</button>';
                htmlOutput += '<button id="view-all-button" class="form-button">View All</button>';

                $('#forms').html(htmlOutput);
                $('#new-form :input').val("");
                $('#new-formEntry').addClass('hide-display');
                $('#form-container').removeClass('hide-display');
            })
            .fail(function (jqXHR, error, errorThrown) {
                console.log(jqXHR);
                console.log(error);
                console.log(errorThrown);
                $('forms').html('No entry submitted');
            })
    });
}


//display all forms
function displayForms() {
    $('#nav-view-button').on('click', function () {
    $.ajax({
            method: 'GET',
            url: FORM_URL
        })
        .done(function (data) {

            if (data.length === 0) {
                $('#form-container').html('<p> No forms found! </p>');
            };

            let formInput = data.map(function (forms, index) {
                return `<div id="entries">
                        <input type="hidden" class="formID" value="${forms.id}">
                        <p class="reflection-info">Doctor:</p> <p class="form-doctor">${forms.doctor}</p><br><br>
                        <p class="reflection-info">Specialty:</p> <p class="form-specialty"> ${forms.specialty}</p><br><br>
                        <div id="truncate"><p class="reflection-info">Questions:</p> <p class="form-question"> ${forms.questions}</p></div><br><br>
                        <button id="edit-button" class="form-button">Edit</button>
                        <button id="delete-button" class="form-button">Delete</button>
                        <button id="current-button" class="form-button">View</button>
                        </div>`;
            });
            $('#forms').html(formInput);
        })
        .fail(function (jqXHR, error, errorThrown) {
            console.log(jqXHR);
            console.log(error);
            console.log(errorThrown);
            $('#forms').html('No forms found');
        })
    })
}

//display reflections by id
function displayFormById() {
    $('#forms').on('click', '#current-button', function () {
        let idParameter = $(this).parent().find('.reflectionID').val();
        $.ajax({
                method: 'GET',
                url: FORM_URL + '/' + idParameter
            })
            .done(function (data) {
                let htmlOutput = "";
                htmlOutput += '<div class="current-form">';
                htmlOutput += '<input type="hidden" class="formID" value="';
                htmlOutput += data.id;
                htmlOutput += '">';
                htmlOutput += '<h2>Form for: </h2>';
                htmlOutput += '<p class="form-doctor">';
                htmlOutput += data.doctor;
                htmlOutput += '</p><br><br>';
                htmlOutput += '<h2>Specialty: </h2>';
                htmlOutput += '<p class="form-specialty">';
                htmlOutput += data.specialty;
                htmlOutput += '</p><br><br>';
                htmlOutput += '<h2>Questions: </h2>';
                htmlOutput += '<p class="form-question">';
                htmlOutput += data.questions;
                htmlOutput += '</p><br><br>';
                htmlOutput += '</div>';
                htmlOutput += '<button id="edit-button" class="form-button">Edit</button>';
                htmlOutput += '<button id="delete-button" class="form-button">Delete</button>';
                htmlOutput += '<button id="view-all-button" class="form-button">View All</button>';

                $('#forms').html(htmlOutput);
            })
            .fail(function (jqXHR, error, errorThrown) {
                console.log(jqXHR);
                console.log(error);
                console.log(errorThrown);
                $('#forms').html('No reflections found');
                $('#new-formEntry').removeClass('hide-display');
            })
    })
}

//update the selected reflection
//first retrieve the post by id and put data in form
function retrieveForm() {
    $('#forms').on('click', '#edit-button', function () {
        /*$('#new-formEntry').removeClass('hide-display');
        $('#form-container').addClass('hide-display'); */
        let idParameter = $(this).parent().find('.formID').val();
        $.ajax({
                method: 'GET',
                url: FORM_URL + '/' + idParameter,
                contentType: 'application/json'
            })
            .done(function (data) {
                $('#new-formEntry').html(`<form method="post" id="new-form">
                <input type="hidden" class="formID" value="${data.id}">
                <fieldset>
                <legend>Write a form</legend>
                <label>Doctor:</label><br>
                <input type="text" id="doctor" name="doctor" required value="${data.doctor}"><br>
                <label>Specialty:</label><br>
                <input type="text" id="specialty" name="specialty" value="${data.specialty}" required><br>
                <label>Questions:</label><br>
                <input type = "text" name="questions" id="questions" value="${data.questions}"><br>
                <button type="submit" id="update-button">Update</button>
                </fieldset>
                </form>`)
            })
            .fail(function (jqXHR, error, errorThrown) {
                console.log(jqXHR);
                console.log(error);
                console.log(errorThrown);
                $('#forms').html('No forms found');
            })
    });
}

//submit updated reflection
function updateForm() {
    let idParameter = $('form').find('.formID').val();
    let doctorInput = $('form').parent().find('#doctor').val();
    let specialtyInput = $('form').parent().find('#specialty').val();
    let questionsInput = $('form').parent().find('#questions').val();
    let newDataInput = {
        'doctor': doctorInput,
        'specialty': specialtyInput,
        'questions': questionsInput,
    };

    let htmlOutput = "";

    $.ajax({
            method: 'PUT',
            url: FORM_URL + '/' + idParameter,
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify(newDataInput)
        })
        .done(function (data) {
            htmlOutput += '<div class="current-form">';
            htmlOutput += '<input type="hidden" class="formID" value="';
            htmlOutput += idParameter;
            htmlOutput += '">';
            htmlOutput += '<h2>Doctor: </h2>';
            htmlOutput += '<p class="form-doctor">';
            htmlOutput += newDataInput.doctor;
            htmlOutput += '</p><br><br>';
            htmlOutput += '<h2>Specialty: </h2>';
            htmlOutput += '<p class="form-doctor">';
            htmlOutput += newDataInput.specialty;
            htmlOutput += '</p><br><br>';
            htmlOutput += '<h2>questions: </h2>';
            htmlOutput += '<p class="form-questions">';
            htmlOutput += newDataInput.questions;
            htmlOutput += '</p><br><br>';
            htmlOutput += '</div>';
            htmlOutput += '<button id="edit-button" class="form-button">Edit</button>';
            htmlOutput += '<button id="delete-button" class="form-button">Delete</button>';
            htmlOutput += '<button id="view-all-button" class="form-button">View All</button>';

            $('#forms').html(htmlOutput);
            $('#new-formEntry').addClass('hide-display');
            $('#form-container').removeClass('hide-display');
        })
        .fail(function (jqXHR, error, errorThrown) {
            console.log(jqXHR);
            console.log(error);
            console.log(errorThrown);
            $('forms').html('No forms found');
        })
}

//delete selected reflection
function deleteForm() {
    let idParameter = $('div').find('.formID').val();
    $.ajax({
            method: 'DELETE',
            url: FORM_URL + '/' + idParameter,
            contentType: 'application/json',
            dataType: 'json'
        })
        .done(function (data) {
            console.log('deleting form');
            displayForms();
        })
        .fail(function (jqXHR, error, errorThrown) {
            console.log(jqXHR);
            console.log(error);
            console.log(errorThrown);
            $('#forms').html('No forms found');
            $('#new-formEntry').removeClass('hide-display');
        })
}


function handleDisplayForms() {
    $('#forms').on('click', '#view-all-button', function () {
        displayForms();
        $('.current-form').addClass('hide-display');
    });
}

function handleDeleteForms() {
    $('#form-container').on('click', '#delete-button', function () {
        deleteForm();
    });
}

function handleUpdateForm() {
    $('#new-formEntry').on('click', '#update-button', function (e) {
        e.preventDefault();
        updateForm();
    });
}

//navigation buttons

/* function handleNavCreateButton() {
    $('.dropdown-content').on('click', '#nav-create-button', function () {
        $('#new-form :input').val("");
        $('#new-formEntry').removeClass('hide-display').html(` <form method="post" id="new-form">
            <fieldset>
            <legend class="section-header">Write a form</legend>
            <label>Doctor:</label><br>
            <input type="text" id="doctor" name="doctor" required><br>
            <label>Specialty:</label><br>
            <input type="text" id="specialty" name="specialty" required><br>
            <label>Questions:</label><br>
            <input type = "text" name="questions" id="questions" required><br> 
            <button type="submit" id="new-submit-button">Submit</button>
            </fieldset>`);
        $('#form-container').addClass('hide-display');
        postNewForm();
    })
}

function handleNavViewButton() {
    $('#nav-view-button').click(function () {
        displayReflections();
        $('#form-container').removeClass('hide-display');
        $('#new-form').addClass('hide-display');
        $('.start-page').addClass('hide-display');
    })
}
*/

function handleNavCreateButton() {
    $('.dropdown-content').on('click', '#nav-create-button', function () {
        console.log('clicked');
        $('#createForm').toggle();
        })
    };

function hideCreateForm(){
    $('.dropdown-content').on('click', '#nav-create-button', function () {
        $('div#createForm').hide()
    })
};

//When the user clicks on the button,
//toggle between hiding and showing the dropdown content

function showMenu() {
    $('.dropbtn').click(function () {
        console.log('clicked');
        $('#myDropdown').toggle();
    })
};

/*function hideMenu() {
    //    $(document).click(function (e) {
    //        if (e.target.class != 'drpbtn') {
    //            $(".drpbtn").hide();
    //        }
    //    });
    $('li').on('click', function () {
        $('div#myDropdown').hide();
    })
};
*/



$(function () {
    postNewForm();
    handleDeleteForms();
    handleDisplayForms();
    retrieveForm();
    displayFormById();
    displayForms();
    handleUpdateForm();
    handleNavCreateButton();
    //handleNavViewButton();
    //handleNavResourcesButton();
    hideCreateForm();
    //handleNewFormButton();
    showMenu();
    //hideMenu();
})