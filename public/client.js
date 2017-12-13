let FORM_URL = '/forms';
let NEW_FORM_URL = '/forms/new';

/*function handleNewFormButton() {
    $('#nav-create-button').on('click', function () {
        
        //$('#new-formEntry').removeClass('hide-display');
        //$('.start-page').addClass('hide-display');
    })
}
*/
function startPage(){
    $('.start-page').on('click', function(){
        $('.welcome-screen').remove();
        $('.hidden-elements').removeClass('hidden-elements');
    })
}

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

                htmlOutput = `<div class="current-form">
                <input type="hidden" class="formID" value="${data._id}">
                <h2>Doctor: </h2>
                <p class="form-doctor">${data.doctor}</p><br><br>
                <h2>Specialty: </h2>
                <p class="form-specialty">${data.specialty}</p><br><br>
                <h2>Max intended age: </h2>
                <p class="form-id">${data.id}</p><br><br>
                <h2>Questions: </h2>
                <p class="form-questions">${data.questions}</p><br><br>
                </div>
                <button id="edit-button" class="nav-button">Edit</button>
                <button id="delete-button" class="nav-button">Delete</button>
                <button id="nav-view-button" class="view-button">View All</button>`;


             

                $('#forms').html(htmlOutput);
                $('#new-form :input').val("");
                $('#new-formEntry').addClass('hide-display');
                $('#form-container').removeClass('hide-display');
                displayForms();
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
    $('.view-button').on('click', function () {
        $('form-container').removeClass("hide-forms");
        $('#createForm').addClass("hide");
    $.ajax({
            method: 'GET',
            url: FORM_URL
        })
        .done(function (data) {

            if (data.length === 0) {
                $('#form-container').html('<p> No forms found! </p>');
            };

            let formInput = data.map(function (forms, index) {
                return `<div id="form-entries">
                        <input type="hidden" class="formID" value="${forms._id}">
                        <p class="reflection-info">Doctor:</p> <p class="form-doctor">${forms.doctor}</p><br><br>
                        <p class="reflection-info">Specialty:</p> <p class="form-specialty"> ${forms.specialty}</p><br><br>
                        <div id="truncate"><p class="reflection-info">Max age intended:</p> <p class="form-question"> ${forms.id}</p></div><br><br>
                        <div id="truncate"><p class="reflection-info">Questions:</p> <p class="form-question"> ${forms.questions}</p></div><br><br>
                        <button id="edit-button" class="nav-button">Edit</button>
                        <button id="delete-button" class="nav-button" data-form-id="${forms._id}">Delete</button>
                        <button id="current-button" class="nav-button">View</button>
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
        let idParameter = $(this).parent().find('.formID').val();
        $.ajax({
                method: 'GET',
                url: FORM_URL + '/' + idParameter
            })
            .done(function (data) {
                let htmlOutput = `<div class="current-form">
                                <input type="hidden" class="formID" value="${data._id}">
                                <h2>Form for: </h2>
                                <p class="form-doctor"> ${data.doctor}</p><br><br>
                                <h2>Specialty: </h2>
                                <p class="form-specialty"> ${data.specialty}</p><br><br>
                                 <h2>Max age intended: </h2>
                                <p class="form-age">${data.id}</p><br><br>
                                <h2>Questions: </h2>
                                <p class="form-question">${data.questions}</p><br><br>
                                </div>
                                <button id="edit-button" class="nav-button">Edit</button>
                                <button id="delete-button" class="nav-button">Delete</button>
                                <button id="nav-view-button" class="view-button">View All</button>`;

              
                $('#forms').html(htmlOutput);
                displayForms();
            })
            .fail(function (jqXHR, error, errorThrown) {
                console.log(jqXHR);
                console.log(error);
                console.log(errorThrown);
                $('#forms').html('No form found');
                $('#new-entry').removeClass('hide-display');
            })
    })
}

//update the selected reflection
//first retrieve the post by id and put data in form
function retrieveForm() {
    $('#forms').on('click', '#edit-button', function () {
         $('#createForm').removeClass("hide");
        //$('#form-container').addClass('hide-display'); */
        let idParameter = $(this).parent().find('.formID').val();
        $.ajax({
                method: 'GET',
                url: FORM_URL + '/' + idParameter,
                contentType: 'application/json'
            })
            .done(function (data) {
                $('#new-entry').html(`<form method="post" id="new-form">
                <input type="hidden" class="formID" value="${data._id}">
                <fieldset>
                <legend>Write a form</legend>
                <label>Doctor:</label><br>
                <input type="text" id="doctor" name="doctor" required value="${data.doctor}"><br>
                <label>Specialty:</label><br>
                <input type="text" id="specialty" name="specialty" value="${data.specialty}" required><br>
                 <label>Max age intended:</label><br>
                <input type = "number" name="age" id="age" value="${data.id}"><br>
                <label>Questions:</label><br>
               <textarea id = "questions" name = "questions" required>${data.questions}</textarea><br>
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
    let ageInput = $('form').parent().find('#age').val();
    let specialtyInput = $('form').parent().find('#specialty').val();
    let questionsInput = $('form').parent().find('#questions').val();
    let newDataInput = {
        'doctor': doctorInput,
        'specialty': specialtyInput,
        'questions': questionsInput,
        'age' : ageInput
    };

    let htmlOutput = "";
    console.log("updating form");
    $.ajax({
            method: 'PUT',
            url: FORM_URL + '/' + idParameter,
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify(newDataInput)
        })
        .done(function (data) {
            $('#forms').html(`<div class="current-form">
                <input type="hidden" class="formID" value="${idParameter}">
                <h2>Doctor: </h2>
                <p class="form-doctor">${newDataInput.doctor}</p><br><br>
                <h2>Specialty: </h2>
                <p class="form-specialty">${newDataInput.specialty}</p><br><br>
                 <h2>Max intended age: </h2>
                <p class="form-age">${newDataInput.age}</p><br><br>
                <h2>questions: </h2>
                <p class="form-questions">${newDataInput.questions}</p><br><br>
                </div>
                <button id="edit-button" class="nav-button">Edit</button>
                <button id="delete-button" class="nav-button">Delete</button>
                <button id="nav-view-button" class="view-button">View All</button>`);
           /*

            $('#forms').html(htmlOutput); */
            displayForms();
            $('#new-entry').addClass('hide-display');
            $('#form-container').removeClass('hide-display');
        })
        .fail(function (jqXHR, error, errorThrown) {
            console.log(jqXHR);
            console.log(error);
            console.log(errorThrown);
            $('forms').html('No forms found');
        })
}

//delete selected form
function deleteForm(idParameter) {
    
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
            $('#new-entry').removeClass('hide-display');
        })
}


function handleDisplayForms() {
   // $('#forms').on('click', '#view-all-button', function () {
        displayForms();
        //$('.current-form').addClass('hide-display');
    //});
}


function handleDeleteForms() {
    $('#form-container').on('click', '#delete-button', function () {
        deleteForm($(this).attr("data-form-id"));
        $(this).parent().remove();
    });
}

function handleUpdateForm() {
    console.log("handleUpdateForm");
    $('#new-entry').on('click', '#update-button', function (e) {
        console.log("clicking on update");
        e.preventDefault();
        updateForm();
    });
}




function navCreateButton() {
    $('.dropdown-content').on('click', '#nav-create-button', function () {
        console.log('clicked');
         $('#createForm').removeClass("hide");
         $('form-container').addClass("hide");
         $('#new-form').html(`<fieldset>
            <legend class="section-header">Create a form</legend>
            <label>Doctor:</label><br>
            <input type="text" id="doctor" name="doctor" required><br>
                <label>Specialty:</label><br>
                <input type="text" id="specialty" name="specialty" required><br>
                <label>Max intended age:</label><br>
                 <input type="number" id="id" name="id" required><br>
                 <label>Questions:</label><br>
                <textarea id = "questions" name = "questions" required></textarea><br>
                <button type="submit " id="new-submit-button">Submit</button>
            </fieldset>`);
        })
        postNewForm();
    };



//When the user clicks on the button,
//toggle between hiding and showing the dropdown content
/*
function showMenu() {
    $('.dropbtn').click(function () {
        console.log('clicked');
        $('#myDropdown').toggle();
    })
};
*/

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
    startPage();
    postNewForm();
    handleDeleteForms();
    handleDisplayForms();
    retrieveForm();
    displayFormById();
    displayForms();
    handleUpdateForm();
    //handleNavCreateButton();
    navCreateButton();
    //handleNavViewButton();
    //handleNavResourcesButton();
    //handleNewFormButton();
    //showMenu();
    //hideMenu();
})

//look at age vs id