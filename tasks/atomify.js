'use strict';

var fs = require('fs');
var atomify = require('atomify');

module.exports = function(grunt) {

  grunt.task.registerMultiTask('atomify', 'Atomify all the stuff grunt says to.', function() {

        var options = this.data;
        var done = this.async();

        var cssConfig = options.cssConfig;
        var jsConfig = options.jsConfig;
        var atomifyConfig = {};
        var expectedCallbacks = 0;
        var receivedCallbacks = 0;

        function mkdirIfNeeded(outputFile)  {
            var lastSlash, path,
                directory = '', directories;

            if(outputFile.lastIndexOf('/') > 0)  {
                // mkdir the output if it doesn't exist
                lastSlash = outputFile.lastIndexOf('/');
                path = outputFile.slice(0, lastSlash);

                if(fs.existsSync(path) === false)  {
                    directories = path.split('/').forEach(function(element, index, array)  {
                        directory += element + '/';
                        fs.mkdirSync(directory);
                    });
                }
            }

        }

        if(jsConfig !== undefined)  {
            // if there's a directory in the output, we have to make it
            mkdirIfNeeded(jsConfig.output);
            // add the JS config to the overall config that we're passing to atomify
            atomifyConfig.js = jsConfig;

            if(jsConfig.output !== undefined)  {
                expectedCallbacks +=1;
            }
        }

        if(cssConfig !== undefined)  {
            // if there's a directory in the output, we have to make it
            mkdirIfNeeded(cssConfig.output);
            // add the CSS config to the overall config that we're passing to atomify
            atomifyConfig.css = cssConfig;

            if(cssConfig.output !== undefined)  {
                expectedCallbacks +=1;
            }
        }

        if((cssConfig !== undefined) || (jsConfig !== undefined))  {
            atomify(atomifyConfig, function(error)  {
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
