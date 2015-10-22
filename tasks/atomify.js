'use strict';

var fs = require('fs');
var atomify = require('atomify');

module.exports = function(grunt) {

  grunt.task.registerMultiTask('atomify', 'Atomify all the stuff grunt says to.', function() {

        var options = this.data;
        var done = this.async();

        var cssConfig = options.css;
        var jsConfig = options.js;
        var serverConfig = options.server;
        var atomifyConfig = {};
        var expectedCallbacks = 0;
        var receivedCallbacks = 0;

        if(jsConfig !== undefined)  {
            // add the JS config to the overall config that we're passing to atomify
            atomifyConfig.js = jsConfig;

            if(jsConfig.output !== undefined)  {
                expectedCallbacks +=1;
            }
        }

        if(cssConfig !== undefined)  {
            // add the CSS config to the overall config that we're passing to atomify
            atomifyConfig.css = cssConfig;

            if(cssConfig.output !== undefined)  {
                expectedCallbacks +=1;
            }
        }

        if (!!serverConfig) {
            atomifyConfig.server = serverConfig;
        }

        if((cssConfig !== undefined) || (jsConfig !== undefined))  {
            atomify(atomifyConfig, function(error)  {
                if (!!error) {
                  var msg = "Error processing file '" + error.filename + "': " + error.message;
                  grunt.fail.warn(msg);
                  done();
                }

                receivedCallbacks +=1;
                if(receivedCallbacks === expectedCallbacks)  {
                    done();
                }
            });
        }  else   {
            done();  // nothing to do. done.
        }

  });

};
