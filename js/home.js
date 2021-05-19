$(document).ready(function () {
    console.log('ready');
    quote();
    login();
    newUser();
    stroornissen();
    zoekHulp();
    profiel();
    dagboek();
    //dagboekShow();

    $('.stoornisDetail').hide();
    $('.zoekHulpDetail').hide();
    $('.profielInfo').hide();
    $('.dagboek').hide();
    $('.updateProfile').hide();

    $('.leesMeer').on('click', function () {
        $('.stoornis').hide();
        $('.stoornisDetail').show();
    });
});

function quote() {
    $.ajax({
        url: `https://type.fit/api/quotes`,
        type: 'GET',
        dataType: 'json'
    }).done(function (data) {
        //console.log(data);
        let randomQuote = Math.floor((Math.random() * 100) + 1);
        let quote = data[randomQuote];
        console.log(quote.text);
        $(`<text x='30%' y='35%' class='svgText'>`).text(`${quote.text}`).appendTo('.svg');
    })
}

function profiel() {
    let userid = localStorage.getItem("userId")
    //console.log(userid)
    $.ajax({
        url: `http://127.0.0.1:63342/getUser/${userid}`,
        type: 'GET',
        dataType: 'json'
    }).done(function (data) {
        //console.log(data)
        let userData = data
        userData = userData.sort();
        console.log(data)
        for (let i = 0; i < userData.length; i += 1) {
            let result = userData[i];
            let storeID = result.userId;

            //console.log(result.userId)
            $("#navLogin").empty();
            $("#navLogin").text("profiel");
            $(".loginForm").hide()
            $('.profielInfo').show();

            let div = $(`<div class='userProfiel' id= ${result.id}>`);

            $(`<p type=text id= ${result.userId}>`).text(`Username: ${result.username}`).appendTo(div)
            $(`<p type=text id= ${result.userId}>`).text(`Naam: ${result.name}`).appendTo(div);
            $(`<p type=text id= ${result.userId}>`).text(`Achternaam: ${result.lastname}`).appendTo(div);
            $(`<p type=text id= ${result.userId}>`).text(`Email: ${result.email}`).appendTo(div);
            $(`<button type="button" class="bewerk" id= ${result.userId}>`).text('update').appendTo(div);
            $(`<button type="button" class="logOut" id= ${result.userId}>`).text('logOut').appendTo(div);
            $(`<button type="button" class="dagboekButton" id= ${result.userId}>`).text('Dagboek').appendTo(div);

            $(".profielInfo").append(div);
        }

        $(".dagboekButton").on("click", function () {
            $('.dagboek').show();
            dagboekShow(data)
            //dagboekShow();
        })

        $(".bewerk").on("click", function () {
            $('.dagboek').hide();
            $('.profielInfo').hide();
            $('.updateProfile').show();
            updateData()
        })

        $(".logOut").on("click", function () {
            logOut()
        })

    })
}

function logOut() {
    let userid = localStorage.getItem("userId")
    $.ajax({
        url: `http://localhost:63342/getUser/${userid}`,
        type: 'GET',
        dataType: 'json'
    }).done(function (data) {
        console.log(data);
        window.localStorage.clear();
        window.location.href = "home.html";
    })
}

function dagboek() {
    let userid = localStorage.getItem("userId")
    $('.dagboekVerstuur').on("click", function (e) {
        e.preventDefault()
        let verhaal = {
            titel: $('.dagboekTitel').val(),
            verhaal: $('.dagboekVerhaal').val(),
        }
        console.log(verhaal);
        $.ajax({
            url: `http://localhost:63342/dagboek/${userid}`,
            type: 'POST',
            data: verhaal,
        }).done(function (data) {
            console.log(data)
        })
    })
}

function dagboekShow(userData) {
    let userid = localStorage.getItem("userId")
    //let result = userData[0].dagboek;
    let data = userData[0].dagboek
    for (let dag of data) {
        console.log(dag)
        //let dag = result[i]
        //console.log(dag)
        let div = $(`<div class='verhaal' id= ${dag.verhaalId}>`);

        $(`<p type=text id= ${dag.verhaalId}>`).text(`Titel: ${dag.titel}`).appendTo(div)
        $(`<p type=text id= ${dag.verhaalId}>`).text(`verhaal: ${dag.verhaal}`).appendTo(div);

        $(".dagboekContent").append(div);
    }
}

function login() {
    /*$('.loginFormulier').hide();
    $('.login').on('click', function () {
        $('.loginFormulier').show();
        $('.profielInfo').hide();
        $('.dagboek').hide();
        $('.dagboekbutton').hide();
    });

    $('.updateProfile').hide()*/
    $("form.login").submit(function (e) {
        let user = {
            username: $('#username').val(),
            password: $('#password').val(),
        }
        //$('#username').val('')
        //$('#password').val('')
        e.preventDefault();
        console.log("pressed");
        //console.log(user)
        $.ajax({
            url: "http://localhost:63342/login",
            type: "POST",
            data: user,
            success: function (data) {
                console.log('added!')
                let userId = data[0].userId
                //profiel(data)

                if (data == false) {
                    console.log("je bent fout")
                } else {
                    window.location.href = "home.html";
                    localStorage.setItem("userId", userId);

                }
            }
        }).fail(function (err1, err2) {
            console.log(err1)
            console.log(err2)
        })
    });
}

function updateData() {
    let userid = localStorage.getItem("userId")
    $.ajax({
        url: `http://localhost:63342/getUser/${userid}`,
        type: 'GET',
        dataType: 'json'
    }).done(function (data) {
        console.log(data);
        for (let user of data) {
            $("#updateUsername").val(user.username);
            $("#updateName").val(user.name);
            $("#updateLastName").val(user.lastname);
            $("#updateEmail").val(user.email);
        }

        $('form#updateProfileForm').submit(function (e) {
            e.preventDefault();

            let userupdate = {
                username: $("#updateUsername").val(),
                name: $("#updateName").val(),
                lastname: $("#updateLastName").val(),
                email: $("#updateEmail").val()
            }

            console.log("pressed");
            $.ajax({
                url: `http://localhost:63342/UpdateData/${userid}`,
                type: "PUT",
                data: userupdate,
                success: function (data) {
                    //window.location.href = "profile.html";
                    console.log('updated!')
                    console.log(data)

                }
            }).fail(function (err1, err2) {
                console.log(err1)
                console.log(err2)
            })
        })
    })
}


function newUser() {
    console.log("newUser")
    $('form#toevoegenForm').submit(function (e) {
        e.preventDefault()
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
            url: "http://localhost:63342/postNewUser",
            type: 'POST',
            data: newUser,
            success: function (data, e) {
                e.preventDefault()
                console.log(data)
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
                console.log(result.id + result.onderwerp);
                let div = $(`<div class='detailStoornis' id= ${result.id}>`);
                let video = $(`<video controls id= ${result.id}>`);

                $(`<h1 id= ${result.id}>`).text(`${result.onderwerp}`).appendTo(div);
                $(`<source src= ${result.video} type="video/mp4" id= ${result.id}>`).appendTo(video);
                $(`<p id= ${result.id}>`).text(`${result.discriptie}`).appendTo(div);
                $(`<button id= ${result.id} class="terugStroonis">`).text(`terug`).appendTo(div);
                div.append(video)
                $(".stoornisDetail").append(div);
            }
        }

        $('.terugStroonis').on("click", function () {
            $('.stoornisDetail').hide();
            $('.stoornis').show();
            $('.stoornisDetail').empty()
        })

    }).fail(function (err1, err2) {
        console.log(err1)
        console.log(err2)
    })

}

function zoekHulp() {
    console.log('hulp');
    $.ajax({
        url: 'json/hulp.json',
        type: 'GET',
        dataType: 'json',
    }).done(function (data) {
        //console.log(data);
        for (let result of data.data) {
            //console.log((result))
            let div = $(`<div class='hulpDiv' id= ${result.id}>`);
            let p = $(`<p id= ${result.id}>`);

            $(`<h1 id= ${result.id}>`).text(`${result.centra}`).appendTo(p);
            $(`<p id= ${result.id}>`).text(`${result.discriptie}`).appendTo(p);
            $(`<button id= ${result.id} class="zoekHulpbutton">`).text(`meer info`).appendTo(p);
            div.append(p);
            $(".zoekHulp").append(div);
        }

        $('.zoekHulpbutton').on("click", function () {
            let zoekHulpId = $(this).attr('id');
            console.log(zoekHulpId)
            zoekHulpDetail(zoekHulpId)
        })
    }).fail(function (err1, err2) {
        console.log(err1)
        console.log(err2)
    })
}

function zoekHulpDetail(id) {
    console.log(id);
    $('.zoekHulp').hide();
    $('.zoekHulpDetail').show();
    $.ajax({
        url: 'json/hulp.json',
        type: 'GET',
        dataType: 'json',
    }).done(function (data) {
        //console.log(data.data);
        let hulpData = data.data;
        for (let i = 0; i < hulpData.length; i += 1) {
            let result = hulpData[i];
            let cijfer = result.id;
            //console.log(i)
            if (cijfer == id) {
                let div = $(`<div class='detailHelp' id= ${result.id}>`);

                $(`<h1 id= ${result.id}>`).text(`${result.centra}`).appendTo(div);
                $(`<p id= ${result.id}>`).text(`${result.discriptie}`).appendTo(div);
                $(`<button id= ${result.id} class="terugHulp">`).text(`terug`).appendTo(div);
                $(".zoekHulpDetail").append(div);
            }
        }

        $(`.terugHulp`).on("click", function () {
            $('.zoekHulpDetail').hide();
            $('.zoekHulp').show();
            $('.zoekHulpDetail').empty()
        })


    }).fail(function (err1, err2) {
        console.log(err1)
        console.log(err2)
    })

}