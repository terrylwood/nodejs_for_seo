(function () {
    "use strict";
//	this function is strict...
    var jsdom = require('jsdom'),
        YUI = require('yui').YUI,
        dom,
        document,
        window,
        http = require('http'),
        get_html = function (response) {
            var markup = '';
            response.on('error', function (e) {
                console.log('ERROR: ' + e.message);
            });
            response.on('data', function (content) {
                markup += content;
            });
            response.on('end', function () {
                //Create the document and window
                document = jsdom.jsdom(markup);
                window = document.createWindow();
                var modName = "Core",
                    modVer = "2.0",
                    conformTest = window.document.implementation.hasFeature(modName, modVer);
                console.log("DOM " + modName + " " + modVer + " supported?: " + conformTest);
                YUI({
                    doc: document,
                    win: window
                }).use(
                    'node',
                    'get',
                    function (Y) {
                        var failure = function (err) {
                                if (err) {
                                    console.log('Error loading js: ' + err[0].error, 'error');
                                    return;
                                }
                                console.log('js loaded successfully!');
                            },
                            txOne = Y.Get.js(['http://assistedhomes.net/javascript/serverIO.js'], {
                                onSuccess: function () {
                                    /*
                                    // scan the transaction object(ie. this) for target js code
                                    var prop;
                                    console.log('serverIO loaded successfully!');
                                    for (prop in this._yuid) {
                                        if (this._yuid.hasOwnProperty(prop)) {
                                            console.log(prop);
                                        }
                                    }
                                    */
                                    console.log('serverIO.js loaded successfully!');
                                    //console.log('Y.serverIO?', (Y.serverIO) ? true : false);
                                    Y.Get.js(['http://assistedhomes.net/javascript/setForm.js'], {
                                        onSuccess: function () {
                                            console.log('setForm.js loaded successfully!');
                                            Y.Get.js([
                                                'http://assistedhomes.net/javascript/formModule.js',
                                                'http://assistedhomes.net/javascript/navController.js'
                                            ], {
                                                async: false,
                                                onSuccess: function () {
                                                    console.log('formModule.js, navController.js loaded successfully!');
                                                    Y.Get.js([
                                                        'http://assistedhomes.net/javascript/contentController.js',
                                                        'http://assistedhomes.net/javascript/setDirectory_results.js'
                                                    ], {
                                                        async: true,
                                                        onSuccess: function () {
                                                            console.log('contentController.js, setDirectory_results.js loaded successfully!');
                                                            console.log('<!DOCTYPE html>\n' + Y.one('doc').get('outerHTML'));
                                                        },
                                                        onFailure: function () {
                                                            console.log('FAILURE: contentController.js, setDirectory_results.js load error!');
                                                        }
                                                    }, failure);
                                                },
                                                onFailure: function () {
                                                    console.log('FAILURE: formModule.js, navController.js load error!');
                                                }
                                            }, failure);
                                        },
                                        onFailure: function () {
                                            console.log('FAILURE: setForm.js load error!');
                                        }
                                    }, failure);
                                },
                                onFailure: function () {
                                    console.log('FAILURE: serverIO load error!');
                                }
                            }, failure);
                        return;
                    }
                );
            });
        },
        get_url = function (url_path, get_content) {
            var address = {
                host: 'www.assistedhomes.net',
                port: 80,
                path: url_path
            };
            return http.request(address, get_content);
        },
        page_path_object = {
            carlsbad: '/CA/CA-san-diego/carlsbad.php'
        };
    //Turn off all the things we don't want.
    jsdom.defaultDocumentFeatures = {
        //Bring in outside resources
        FetchExternalResources   : false,
        //Don't process them
        ProcessExternalResources : false,
        //Don't expose Mutation events (for performance)
        MutationEvents           : false,
        //Do not use their implementation of QSA
        QuerySelector            : false
    };
    dom = jsdom.defaultLevel;
    //Hack in focus and blur methods so they don't fail when a YUI widget calls them
    dom.Element.prototype.blur = function () {};
    dom.Element.prototype.focus = function () {};
    console.log('YUI version is ' + YUI.version + '.');
    get_url(page_path_object.carlsbad, get_html).end();
}());
