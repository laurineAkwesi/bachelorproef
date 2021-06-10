$(document).ready(function () {
    console.log('ready');
    profiel();
    quote();
    login();
    newUser();
    stroornissen();
    zoekHulp();
    //dagboekShow();

    $('.stoornisDetail').hide();
    $('.zoekHulpDetail').hide();
    $('.profiel').hide();
    $('.dagboek').hide();
    $('.updateProfile').hide();
    $('.WatDoenWeHidden').hide();

    $('.leesMeer').on('click', function () {
        $('#stoornis').hide();
        $('.stoornisDetail').show();
    });

    $('.BewerkTerug').on('click', function () {
        $('.updateProfile').hide();
        $('.profiel').show();
    });

    $("#navLogin").text("Login");

    $('.dagboekTerugButton').on('click', function(){
        $('.dagboek').hide();
        $('.profiel').show();
    })

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
        //console.log(quote.text);
        $(`<p class='quote'>`).text(`${quote.text}`).appendTo('.caption');
        $(`<p class='author'>`).text(`- ${quote.author} -`).appendTo('.caption');
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
        //console.log(data)
        for (let i = 0; i < userData.length; i += 1) {
            let result = userData[i];
            let storeID = result.userId;

            //console.log(result.userId)
            $("#navLogin").empty();
            $("#navLogin").text("profiel");
            $(".loginForm").hide()
            $('.profiel').show();

            let div = $(`<div class='userProfiel' id= ${result.userId}>`);

            $(`<button type="button" class="dagboekShowButton btn btn-success" id= ${result.userId}>`).text('Dagboek').appendTo(div);
            $(`<h2 type=text id= ${result.userId} userInfo>`).text(`${result.username}`).appendTo(div)
            $(`<p type=text id= ${result.userId}>`).text(`Naam: ${result.name}`).appendTo(div);
            $(`<p type=text id= ${result.userId}>`).text(`Achternaam: ${result.lastname}`).appendTo(div);
            $(`<p type=text id= ${result.userId}>`).text(`Email: ${result.email}`).appendTo(div);
            $(`<button type="button" class="bewerk btn btn-primary" id= ${result.userId}>`).text('Update').appendTo(div);
            $(`<button type="button" class="logOut btn btn-warning" id= ${result.userId}>`).text('Log Out').appendTo(div);
            

            $(".profielInfo").append(div);
        }

        $(".dagboekShowButton").on("click", function () {
            $('.dagboek').show();
            dagboek(data)
            $('.profiel').hide()
            //dagboekShow();
            //dagboek(data);
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
        //console.log(data);
        window.localStorage.clear();
        window.location.href = "home.html";
    })
}

function dagboek(userData) {
    let username = userData[0].username
    let userid = localStorage.getItem("userId")

    $.ajax({
        url: `http://localhost:63342/userDagboek/${userid}`,
        type: 'GET',
        dataType: 'json',
    }).done(function (data) {
        //console.log(data);
        let dataDagboek = data[0].dagboek
        for (let dag of dataDagboek) {
            //console.log(dag)
            //let dag = result[i]
            //console.log(dag)
            let div = $(`<div class='verhaal' id= ${dag.verhaalId}>`);
    
            //$(`<label class="font-weight-bold">`).text(username).appendTo(div)
            $(`<h5 class= type=text id= ${dag.verhaalId} required>`).text(`${dag.titel}`).appendTo(div)
            $(`<p type=text id= ${dag.verhaalId} required>`).text(`${dag.verhaal}`).appendTo(div);

            $(".dagboekAppendVerhaal").append(div);
    
        }

    }).fail(function (err1, err2) {
        console.log(err1)
        console.log(err2)
    })

    $('.dagboekVerstuur').on("click", function (e) {
        e.preventDefault()
        let verhaalInfo = {
            titel: $('.dagboekTitel').val(),
            verhaal: $('.dagboekVerhaal').val(),
        }
        $(".verhaal").remove()
        //console.log(verhaal);
        $.ajax({
            url: `http://localhost:63342/dagboek/${userid}`,
            type: 'POST',
            data: verhaalInfo,
            success: function (response) {
                response = response.value.dagboek
                console.log(response)
                dagboekShow(userData)
            }
        })
    })

    $('.dagboekVerstuur').on('click', function () {
        $('.dagboekTitel').val("")
        $('.dagboekVerhaal').val("")
    })
}

function dagboekShow(userData) {
    let username = userData[0].username
    console.log(userData)
    let userid = localStorage.getItem("userId")
    $.ajax({
        url: `http://localhost:63342/userDagboek/${userid}`,
        type: 'GET',
        dataType: 'json',
    }).done(function (data) {
        console.log(data[0].dagboek);
        let dataDagboek = data[0].dagboek
        for (let dag of dataDagboek) {
            //console.log(dag)
            //let dag = result[i]
            //console.log(dag)
            let div = $(`<div class='verhaal' id= ${dag.verhaalId}>`);
    
            //$(`<label class="font-weight-bold">`).text(username).appendTo(div)
            $(`<h3 type=text id= ${dag.verhaalId}>`).text(`${dag.titel}`).appendTo(div)
            $(`<p type=text id= ${dag.verhaalId}>`).text(`${dag.verhaal}`).appendTo(div);

            $(".dagboekAppendVerhaal").append(div);
    
        }
    }).fail(function (err1, err2) {
        console.log(err1)
        console.log(err2)
    })
}

function login() {
    $("form.login").submit(function (e) {
        let user = {
            username: $('#username').val(),
            password: $('#password').val(),
        }
        //$('#username').val('')
        //$('#password').val('')
        e.preventDefault();
        //console.log("pressed");
        //console.log(user)
        $.ajax({
            url: "http://localhost:63342/login",
            type: "POST",
            data: user,
            success: function (data) {
                console.log('added!')
                let userId = data[0].userId
                let username = data[0].username
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
    $('.profiel').hide()
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
                    window.location.href = "profiel.html";
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
    //console.log("newUser")
    $('form#toevoegenForm').submit(function (e) {
        e.preventDefault()
        let password = $('#newPassword').val()
        let passwordCheck = $('#newPasswordCheck').val()
        if(password === passwordCheck){
            window.location.href = 'profiel.html';
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
            }
        }).fail(function (err1, err2) {
            console.log(err1)
            console.log(err2)
        })
    }else{
       
    }
    });
}


function stroornissen() {
    //GetVideoComments()
    //console.log('hure');
    $.ajax({
        url: 'json/stoornissen.json',
        type: 'GET',
        dataType: 'json',
    }).done(function (data) {
        //console.log(data);
        for (let result of data.data) {
           //console.log((result))
            let div = $(`<div id= ${result.id} class="d-flex justify-content-center align-items-center stoornisDiv">`);
            let p = $(`<div id= ${result.id} class="d-inline p-2 stoornisText">`);
            let divImgAppend = $(`<div id= ${result.id} class="divImg  d-inline p-2"">`);
            let divImgPrepend = $(`<div id= ${result.id} class="divImg  d-inline p-2"">`);
            let divImgAppendSmall = $(`<div id= ${result.id} class="divImg  d-inline p-2"">`);

            $(`<img id= ${result.id} src= ${result.img} width="200" height="210">`).appendTo(divImgAppend);
            $(`<img id= ${result.id} src= ${result.img} width="200" height="210">`).appendTo(divImgPrepend);
            $(`<img id= ${result.id} src= ${result.img} width="200" height="210">`).appendTo(divImgAppendSmall);
            $(`<h1 id= ${result.id}>`).text(`${result.onderwerp}`).appendTo(p);
            $(`<p id= ${result.id} class="stoornisDiscriptie">`).text(`${result.discriptie}`).appendTo(p);
            $(`<button id= ${result.id} class="btn btn-outline-danger infoButton">`).text(`Meer info`).appendTo(p);
            div.append(p)

            if (result.id % 2 === 0) {
                div.append(divImgAppend);
                $(".stoornisTextEven").css("margin-left", "10%")
            } else{ 
                div.prepend(divImgPrepend);
                $(".stoornisTextOneven").css("margin-right", "10%")
            }

            if ($(window).width() < 960) {
                $(divImgAppend).empty()
                $(divImgPrepend).empty()
                div.prepend(divImgAppendSmall);
             }

            $("#stoornis").append(div);

          
            $(".stoornisDiv:even").addClass("even")
            $(".stoornisDiv:odd").addClass("oneven");

            $(".stoornisText:even").addClass("stoornisTextEven")
            $(".stoornisText:odd").addClass("stoornisTextOneven");



        }

        $('.infoButton').on("click", function () {
            let idStoornis = $(this).attr('id');
            stoornisDetail(idStoornis)
            //video(idStoornis)
        })
    }).fail(function (err1, err2) {
        console.log(err1)
        console.log(err2)
    })
}

function stoornisDetail(id) {
    GetVideoComments(id)
    console.log(id);
    $('#stoornis').hide();
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
            //console.log(result)
            if (cijfer == id) {

                //https://stackoverflow.com/questions/19873002/how-to-replace-all-spaces-in-a-string/19873010
                let breakResult = result.meerInfo
                let res = breakResult.replace(/break/g, "<br>");


                //console.log(result.id + result.onderwerp);
                let div = $(`<div class='d-flex justify-content-around detailVideo' id= ${result.id}>`);
                let textVideoDiv =$(`<div id= ${result.id} class="embed-responsive embed-responsive-16by9 video">`);
                let videoDiv =$(`<div class='detailStoornis' id= ${result.id}>`);
                let divTextarea = $(`<div id= ${result.id} class="divTextarea">`);
                let titel = $(`<div id= ${result.id}>`);
                let video = $(`<video class="embed-responsive-item" controls autoplay id= ${result.id}>`);

                $(`<h1 id= ${result.id} class="text-uppercase stoornisTitel">`).text(`${result.onderwerp}`).appendTo(titel);
                $(`<source src= ${result.video} type="video/mp4" id= ${result.id}>`).appendTo(video);
                $(`<textarea id= ${result.id} class="form-control form-control-sm divTextareaGetInput" placeholder="Doe je verhaal..." required>`).appendTo(divTextarea);
                $(`<button id= ${result.id} class="divTextareaButton btn">`).text(`Comment`).appendTo(divTextarea);
                $(`<p id= ${result.id}>`).html(`${res}`).appendTo(videoDiv);
                $(`<button id= ${result.id} class="terugStroonis btn btn-outline-success">`).text(`Terug`).appendTo(titel);
                textVideoDiv.append(video)
                div.append(textVideoDiv)
                //div.append(video)
                div.append(videoDiv)
                $(".stoornisDetail").append(titel).append(div).append(divTextarea);

                /*let userid = localStorage.getItem("userId")
                //console.log(id)
                let video = {
                    //username: $('#newUsername').val(),
                    userId: userid,
                    comment: $('textarea.divTextarea').val(),
                    frontendVideoId: videoid
                }*/
            }
        }

        $('.terugStroonis').on("click", function () {
            $('.stoornisDetail').hide();
            $('#stoornis').show();
            $('.stoornisDetail').empty()
        })

        $('.divTextareaButton').on("click", function(){
            console.log(id)
            let comment = $(".divTextareaGetInput").val();
            $(".divTextareaGetInput").val('');
            //console.log(comment, id);
            PostVideoComments(comment, id)
            //GetVideoComments(id)
        })

    }).fail(function (err1, err2) {
        console.log(err1)
        console.log(err2)
    })
/*get comments*/

}

function PostVideoComments(comment, videoid){
    let userid = localStorage.getItem("userId")
    $.ajax({
        url: `http://localhost:63342/getUser/${userid}`,
        type: 'GET',
        dataType: 'json'
    }).done(function (data) {
        console.log(data)
        let username = data[0].username;
    let video = {
        username: username,
        userId: userid,
        comment: comment,
        frontendVideoId: videoid
    }
    //console.log(video)
    $.ajax({
        url:`http://localhost:63342/postVideoComments/${videoid}`,
        type: 'POST',
        data: video,
        success: function (data, e) {
            //e.preventDefault()
            //console.log(data)
            //console.log('added!')
            GetVideoComments(videoid)
            }
        }).fail(function (err1, err2) {
            console.log(err1)
            console.log(err2)
        })

        /*$.ajax({
            url: `http://localhost:63342/videoComments/${videoid}`,
            type: 'GET',
            dataType: 'json',
        }).done(function (data) {
            console.log(data[0].comment);
            let dataComment = data[0].comment
            for (let comment of dataComment) {
                //console.log(dag)
                //let dag = result[i]
                //console.log(dag)
                let div = $(`<div class='comment' id= ${comment.commentId}>`);
        
                $(`<p type=text id= ${comment.commentId}>`).text(`username: ${comment.username}`).appendTo(div)
                $(`<p type=text id= ${comment.commentId}>`).text(`comment: ${comment.comment}`).appendTo(div);
        
                $(".divTextarea").append(div);
        
            }
        }).fail(function (err1, err2) {
            console.log(err1)
            console.log(err2)
        })*/
    })
}

function GetVideoComments(videoid){
    console.log(videoid)
    $.ajax({
        url: `http://localhost:63342/videoComments/${videoid}`,
        type: 'GET',
        dataType: 'json',
    }).done(function (data) {
        $(".comment").remove()
        console.log(data[0].comment);
        //console.log(data[0]);
        let dataComment = data[0].comment
        for (let comment of dataComment) {
            //console.log(dag)
            //let dag = result[i]
            //console.log(dag)
            let div = $(`<div class='comment' id= ${comment.commentId}>`);
    
            $(`<p type=text id= ${comment.commentId} class="font-weight-bold usernameComment">`).text(`${comment.username}`).appendTo(div)
            $(`<p type=text class="commentColor" id= ${comment.commentId} class="usercommentComments">`).text(`${comment.comment}`).appendTo(div);
    
            $(".divTextarea").append(div);
    
        }
    }).fail(function (err1, err2) {
        console.log(err1)
        console.log(err2)
    })
}

function zoekHulp() {
    //console.log('hulp');
    $.ajax({
        url: 'json/hulp.json',
        type: 'GET',
        dataType: 'json',
    }).done(function (data) {
        //console.log(data);
        for (let result of data.data) {

            let socialResult = result.discriptie
            let res = socialResult.replace("break", '\n');
            //console.log((result.socialeMedia[0].website))
            let maindiv = $(`<div style="text-align: center;" class='mainDivZoekHulp' id= ${result.id}>`);
            let div = $(`<div class='col zoekHulpDiv container' id= ${result.id}>`);
            let icons = $(`<div id= ${result.id}>`);
            //https://stackoverflow.com/questions/18560755/how-can-i-add-an-href-to-a-fontawesome-icon-and-word-below-it
            let aWebsiteIcon = $(`<a id= ${result.id} class="icon-block fa-lg" href=${result.socialeMedia[0].website} class="icon-block">`);
            let aBellenIcon = $(`<a id= ${result.id} class="icon-block fa-lg" href=${result.socialeMedia[0].bellen} class="icon-block">`);
            let aChattenIcon = $(`<a id= ${result.id} class="icon-block fa-lg" href=${result.socialeMedia[0].chatten} class="icon-block">`);

            $(`<h1 id= ${result.id}>`).text(`${result.centra}`).appendTo(maindiv);
            $(`<p id= ${result.id} class='zoekHulpDiscriptie'>`).text(`${res}`).appendTo(maindiv);
            
            $(`<i id= ${result.id} class="fas fa-mobile">`).appendTo(aBellenIcon);
            $(`<i id= ${result.id} class="fas fa-globe">`).appendTo(aWebsiteIcon);
            $(`<i id= ${result.id} class="fas fa-laptop">`).appendTo(aChattenIcon);

            //$(`<button id= ${result.id} class="zoekHulpbutton btn btn-primary">`).text(`Meer info`).appendTo(maindiv);
            icons.append(aBellenIcon).append(aWebsiteIcon).append(aChattenIcon)
            maindiv.append(icons)
            maindiv.appendTo(div)
            $(".zoekHulpText").append(div);
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
            if (cijfer == id) {
                let div = $(`<div class='detailHelp' id= ${result.id}>`);
                let socials = $(`<div class='socials' id= ${result.id}>`);

                $(`<h1 id= ${result.id}>`).text(`${result.centra}`).appendTo(div);
                $(`<p id= ${result.id}>`).text(`${result.discriptie}`).appendTo(div);
    
                let socialResult = result.socialeMedia
                for(let social of socialResult){
                    $(`<p id= ${result.id}>`).text(`chatten: ${social.chatten}`).appendTo(socials);
                    $(`<p id= ${result.id}>`).text(`locatie: ${social.langsgaan}`).appendTo(div);
                    $(`<p id= ${result.id}>`).text(`bellen: ${social.bellen}`).appendTo(div);
                    $(`<p id= ${result.id}>`).text(`website: ${social.website}`).appendTo(div);
                    $(`<p id= ${result.id}>`).text(`mail: ${social.mail}`).appendTo(div);
                }

                div.append(socials)
                $(`<button id= ${result.id} class="terugHulp btn btn-primary">`).text(`terug`).appendTo(div);
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