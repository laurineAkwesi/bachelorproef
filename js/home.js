$(document).ready(function () {
    console.log("ready");
    quote();
    login();
    newUser();

    $('.stoornisDetail').hide();


    $('.leesMeer').on("click", function () {
        $('.stoornis').hide();
        $('.stoornisDetail').show();
    })
});

function quote() {
    $.ajax({
        url: `https://type.fit/api/quotes`,
        type: 'GET',
        dataType: 'json'
    }).done(function (data) {
        console.log(data);
        let randomQuote = Math.floor((Math.random() * 100) + 1);
        let quote = data[randomQuote];
        console.log(quote.text);
        $(`<text x="30%" y="35%" class="svgText">`).text(`${quote.text}`).appendTo('.svg');
    })
}

function login() {
    $('.loginFormulier').hide();
    $('.login').on("click", function () {
        $('.loginFormulier').show()
        $('.profielInfo').hide();
        $('.dagboek').hide();
        $('.dagboekbutton').hide();
    })
}

function newUser() {
    $("form#toevoegenForm").submit(function () {
        let newUser = {
            username: $('#newUsername').val(),
            name: $('#newName').val(),
            lastname: $('#newLastName').val(),
            email: $('#newEmail').val(),
            password: $('#newPassword').val(),
            passwordCheck: $('#newPasswordCheck').val()
        }
        console.log(newUser);
        console.log("pressed");
        $.ajax({
            url: "http://127.0.0.1:63342/api/newUser",
            type: "POST",
            data: newUser,
            success: function (data) {
                console.log('added!')
                //window.location.href = "login.html";
            }
        }).fail(function (err1, err2) {
            console.log(err1)
            console.log(err2)
        })
    });
}


function stroornissen() {
    console.log("hure");
    $.ajax({
        url:`json/zoekHulp.json`,
        type:``,
        dataType: JSON
    }).done(function (data) {
        console.log("yess")
    })
}