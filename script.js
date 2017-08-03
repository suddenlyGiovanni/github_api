/*
    1. make username and password inputs / hiding mechanism
    2. ajax request upon click after entering github username include
        authorization header
    3. Pass repos to template and insert html into DOM
    4. On click on repo, fetch most recent commits include
        authorization header
    5. Pass commits to template and insert html into DOM
*/


$( document ).ready( function () {



    // DOM HOOKS
    // var $gitHubCredentials = $( '#github-credentials' );
    // var $gitHubQueryName = $( '#github-query-name' );
    var $gitHubCredentialsBtn = $( '#github-credentials-save' );
    var $gitHubQueryNameBtn = $( '#github-query-name-submit' );
    var $main = $( 'main' );
    //_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ __


    // GLOBAL VARIABLES
    var username;
    var password;
    //_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ __



    //  //  //  //  //  //
    // EVENT LISTENERS  //
    //  //  //  //  //  //_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ __
    $gitHubCredentialsBtn.on( 'click', function () {
        username = $( '#github-credentials > input[name="username"]' ).val();
        password = $( '#github-credentials > input[name="password"]' ).val();
        // console.log( username, password );
    } );

    $gitHubQueryNameBtn.on( 'click', function () {
        var githubUserName = $( '#github-query-name > input[name="name"]' ).val();
        // console.log( githubUserName );
        createAjaxPar( githubUserName, 'getUser' );
    } );

    $main.on( 'click', '.repo', function ( event ) {

        var repo = $( event.target ).closest( '.repo' );
        var targ = repo.find( '.commits' );
        var fullName = repo.find( 'h3' ).html().trim();

        // if (event.target.classList.contains('repo')) {
        //     event.target.classList.forEach(function(elem) {
        //         if (elem !== 'repo') {
        //             // console.log(elem);
        //             target = elem;
        //         }
        //     });
        // }
        // console.log( fullName );
        makeAjaxReq( `https://api.github.com/repos/${fullName}/commits`, 'getCommit', targ );

    } );
    //_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ __


    // HANDLEBARS_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    Handlebars.templates = Handlebars.templates || {};
    var templates = document.querySelectorAll( 'template' );
    Array.prototype.slice.call( templates ).forEach( function ( tmpl ) {
        Handlebars.templates[ tmpl.id ] = Handlebars.compile( tmpl.innerHTML.replace( /{{&gt;/g, '{{>' ) );
    } );
    Handlebars.partials = Handlebars.templates;
    //_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ __



    //  //  //  //  //  //  //  //
    // FUNCTIONS DECLARATION    //
    //  //  //  //  //  //  //  //


    // CREATE AJAX PARAMETERS _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ __
    function createAjaxPar( query, behavior ) {
        // two behavior:
        // 1. get githubUserName repo
        // 2. get githubUserName on repo get last 20 commits
        if ( behavior == 'getUser' ) {
            makeAjaxReq( `https://api.github.com/users/${query}/repos`, 'getUser', query );
        }
        // else if ( behavior == 'getCommit' ) {
        //     makeAjaxReq( `https://api.github.com/repos/${query}/commits`, 'getCommit', query );
        // }
    }



    // MAKE THE AJAX REQUEST_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ __
    function makeAjaxReq( url, behavior, target ) {
        $.ajax( {
            url: url,
            headers: {
                Authorization: 'Basic ' + btoa( username + ':' + password )
            },
            method: 'GET',
            data: {
                limit: 20
            },
            success: function ( data ) {
                // console.log( data );
                renderData( data, behavior, target );
            }
        } );
    }


    // RENDER DATA _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    function renderData( data, behavior, target ) {

        if ( behavior == 'getUser' ) {
            $main.append( Handlebars.templates.repo( {
                repo: data
            } ) );
        } else if ( behavior == 'getCommit' ) {
            console.log( data );
            // console.log(Handlebars.templates.commits( data ), target.length);
            target.append( Handlebars.templates.commits( {
                commits: data
            } ) );
        }
    }









    //_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ __

} );
