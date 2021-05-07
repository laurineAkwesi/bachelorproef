$(document).ready(function () {
    console.log('ready');
    quote();
    login();
    newUser();

    $('.stoornisDetail').hide();


    $('.leesMeer').on('click', function () {
        $('.stoornis').hide();
        $('.stoornisDetail').show();
        stoornisDetail()
    });

    $('.navStoornissen').on('click', function (e) {
        e.preventDefault();
        stroornissen();
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
        $(`<text x='30%' y='35%' class='svgText'>`).text(`${quote.text}`).appendTo('.svg');
    })
}

/*function login() {
    $('.loginFormulier').hide();
    $('.login').on('click', function () {
        $('.loginFormulier').show()
        $('.profielInfo').hide();
        $('.dagboek').hide();
        $('.dagboekbutton').hide();
    })

        $('.updateProfile').hide()
        $("form.login").submit(function (e) {
            let user = {
                username: $('#username').val(),
                password: $('#password').val(),
            }
            $('#username').val('')
            $('#password').val('')
            //window.location.href = "home.html";
            e.preventDefault();
            console.log("pressed");
            //console.log(user)
            $.ajax({
                url: "http://127.0.0.1:3000/api/login",
                type: "POST",
                data: user,
                success: function (data) {
                    console.log('added!')
                    console.log(data)

                    if (data == false) {
                        $('.wrong').show()
                    } else {
                        window.location.href = "home.html";
                        let spelerData = data
                        spelerData = spelerData.sort();
                        console.log(data)
                        for (let i = 0; i < spelerData.length; i += 1) {
                            let result = spelerData[i];
                            let storeID = result.userId;
                            console.log(result.userId)
                            $("#navLogin").hide();
                            sessionStorage.setItem("userId", storeID);
                        }
                    }
                }
            }).fail(function (err1, err2) {
                console.log(err1)
                console.log(err2)
            })
        });
}*/

function newUser() {
    $('form#toevoegenForm').submit(function () {
        let newUser = {
            username: $('#newUsername').val(),
            name: $('#newName').val(),
            lastname: $('#newLastName').val(),
            email: $('#newEmail').val(),
            password: $('#newPassword').val(),
            passwordCheck: $('#newPasswordCheck').val()
        }
        console.log(newUser);
        console.log('pressed');
        $.ajax({
            url: 'http://127.0.0.1:63342/api/newUser',
            type: 'POST',
            data: newUser,
            success: function (data) {
                console.log('added!')
                //window.location.href = 'login.html';
            }
        }).fail(function (err1, err2) {
            console.log(err1)
            console.log(err2)
        })
    });
}


function stroornissen() {
    console.log('hure');
    $.ajax({
        url: 'json/stoornissen.json',
        type: 'GET',
        dataType: 'json',
    }).done(function (data) {
        //console.log(data);
        for (let result of data.data) {
            //console.log((result))
            let div = $(`<div class='stoornisDiv' id= ${result.id}>`);
            let p = $(`<p id= ${result.id}>`);

            $(`<h1 id= ${result.id}>`).text(`${result.onderwerp}`).appendTo(p);
            $(`<p id= ${result.id}>`).text(`${result.discriptie}`).appendTo(p);
            $(`<button id= ${result.id} class="infoButton">`).text(`meer info`).appendTo(p);
            div.append(p);
            $(".stoornis").append(div);
        }

        $('.infoButton').on("click", function () {
            let idStoornis = $(this).attr('id');
            stoornisDetail(idStoornis)
        })
    }).fail(function (err1, err2) {
        console.log(err1)
        console.log(err2)
    })
}

function stoornisDetail(id) {
    console.log(id);
    $('.stoornis').hide();
    $('.stoornisDetail').show();

    $.ajax({
        url: 'json/stoornissen.json',
        type: 'GET',
        dataType: 'json',
    }).done(function (data) {
        //console.log(data.data);
        let spelerData = data.data;
        for (let i = 0; i < spelerData.length; i += 1) {
            let result = spelerData[i];
            let cijfer = result.id;
            //console.log(i)
            if (cijfer == id) {
                console.log(result.id + result.onderwerp)
            }
        }
    }).fail(function (err1, err2) {
        console.log(err1)
        console.log(err2)
    })

}