'use strict';

var fs = require('fs');
var os = require('os');
var child_process = require('child_process');
var mkdirp = require('mkdirp');
var sinon = require('sinon');
var should = require('should');
var expect = require('chai').expect;
var nodeMinify = require('../lib/node-minify');

var oneFile = __dirname + '/../examples/public/js/base.js';
var filesArray = [
  __dirname + '/../examples/public/js/base.js',
  __dirname + '/../examples/public/js/base2.js'
];
var fileJSOut = __dirname + '/../examples/public/dist/base.js';
var fileCSS = __dirname + '/../examples/public/css/base.css';
var fileCSSArray = [
  __dirname + '/../examples/public/css/base.css',
  __dirname + '/../examples/public/css/base2.css'
];
var fileCSSOut = __dirname + '/../examples/public/dist/base.css';

var tests = {
  concat: [
    {
      it: 'should concat javascript and no compress and an array of file',
      minify: {
        compressor: 'no-compress',
        input: filesArray,
        output: fileJSOut
      }
    },
    {
      it: 'should concat javascript and no compress and a single file',
      minify: {
        compressor: 'no-compress',
        input: oneFile,
        output: fileJSOut
      }
    }
  ],
  commoncss: [
    {
      it: 'should compress css with {compressor} and a single file',
      minify: {
        compressor: '{compressor}',
        input: fileCSS,
        output: fileCSSOut
      }
    },
    {
      it: 'should compress css with {compressor} and an array of file',
      minify: {
        compressor: '{compressor}',
        input: fileCSSArray,
        output: fileCSSOut
      }
    }
  ],
  commonjs: [
    {
      it: 'should compress javascript with {compressor} and a single file',
      minify: {
        compressor: '{compressor}',
        input: oneFile,
        output: fileJSOut
      }
    },
    {
      it: 'should compress javascript with {compressor} and a single file with a custom public folder',
      minify: {
        compressor: '{compressor}',
        input: 'base.js',
        output: fileJSOut,
        publicFolder: __dirname + '/../examples/public/js/'
      }
    },
    {
      it: 'should compress javascript with {compressor} and a single file with a custom buffer size',
      minify: {
        compressor: '{compressor}',
        input: oneFile,
        output: fileJSOut,
        buffer: 2000 * 1024
      }
    },
    {
      it: 'should compress javascript with {compressor} and a single file with some options',
      minify: {
        compressor: '{compressor}',
        input: oneFile,
        output: fileJSOut,
        options: {
          charset: 'utf8'
        }
      }
    },
    {
      it: 'should compress javascript with {compressor} and an array of file',
      minify: {
        compressor: '{compressor}',
        input: filesArray,
        output: fileJSOut
      }
    },
    {
      it: 'should compress javascript with {compressor} and an array of file with a custom public folder',
      minify: {
        compressor: '{compressor}',
        input: [
          'base.js',
          'base2.js'
        ],
        output: fileJSOut,
        publicFolder: __dirname + '/../examples/public/js/'
      }
    },
    {
      it: 'should compress javascript with {compressor} and an array of file with a custom buffer size',
      minify: {
        compressor: '{compressor}',
        input: filesArray,
        output: fileJSOut,
        buffer: 2000 * 1024
      }
    },
    {
      it: 'should compress javascript with {compressor} and wildcards path',
      minify: {
        compressor: '{compressor}',
        input: __dirname + '/../examples/public/js/**/*.js',
        output: fileJSOut
      }
    },
    {
      it: 'should compress javascript with {compressor} and wildcards path with a custom public folder',
      minify: {
        compressor: '{compressor}',
        input: '**/*.js',
        output: fileJSOut,
        publicFolder: __dirname + '/../examples/public/js/'
      }
    },
    {
      it: 'should compress javascript with {compressor} and wildcards path with a custom buffer size',
      minify: {
        compressor: '{compressor}',
        input: __dirname + '/../examples/public/js/**/*.js',
        output: fileJSOut,
        buffer: 2000 * 1024
      }
    }
  ]
};

var runOneTest = function(options, compressor, sync) {
  options = JSON.parse(JSON.stringify(options));

  options.minify.compressor = options.minify.compressor.replace('{compressor}', compressor);
  options.minify.output = options.minify.output.replace('{compressor}', compressor);

  if (sync) {
    options.minify.sync = true;
  }

  it(options.it.replace('{compressor}', compressor), function(done) {
    options.minify.callback = function(err, min) {
      should.not.exist(err);
      should.exist(min);

      done();
    };

    nodeMinify.minify(options.minify);
  });
};

describe('node-minify', function() {
  mkdirp('/tmp/');

  describe('Fake binary', function() {
    it('should throw an error if binary does not exist', function(done) {
      var options = {};
      options.minify = {
        compressor: 'fake',
        input: __dirname + '/../examples/public/js/**/*.js',
        output: fileJSOut
      };

      expect(function() {
        nodeMinify.minify(options.minify);
      }).to.throw();
      done();
    });
  });

  describe('No mandatories', function() {
    it('should throw an error if no compressor', function(done) {
      var options = {};
      options.minify = {
        input: __dirname + '/../examples/public/js/**/*.js',
        output: fileJSOut
      };

      expect(function() {
        nodeMinify.minify(options.minify);
      }).to.throw();
      done();
    });

    it('should throw an error if no input', function(done) {
      var options = {};
      options.minify = {
        compressor: 'no-compress',
        output: fileJSOut
      };

      expect(function() {
        nodeMinify.minify(options.minify);
      }).to.throw();
      done();
    });

    it('should throw an error if no output', function(done) {
      var options = {};
      options.minify = {
        compressor: 'no-compress',
        input: __dirname + '/../examples/public/js/**/*.js'
      };

      expect(function() {
        nodeMinify.minify(options.minify);
      }).to.throw();
      done();
    });
  });

  describe('Create errors', function() {
    it('should callback an error if gcc with bad options', function(done) {
      var options = {};
      options.minify = {
        compressor: 'gcc',
        input: oneFile,
        output: fileJSOut,
        options: {
          fake: true
        },
        callback: function(err, min) {
          should.exist(err);
          should.not.exist(min);

          done();
        }
      };

      nodeMinify.minify(options.minify);
    });

    it('should callback an error if yui with bad options', function(done) {
      var options = {};
      options.minify = {
        compressor: 'yui-js',
        input: oneFile,
        output: fileJSOut,
        sync: true,
        options: {
          fake: true
        },
        callback: function(err, min) {
          should.exist(err);
          should.not.exist(min);

          done();
        }
      };

      nodeMinify.minify(options.minify);
    });
  });

  describe('Create more errors', function() {
    beforeEach(function() {
      this.stub = sinon.stub(child_process, 'spawnSync').throws(new Error('UnsupportedClassVersionError'));
    });
    afterEach(function() {
      this.stub.restore();
    });
    it('should callback an error on spawnSync', function(done) {
      var options = {};
      options.minify = {
        compressor: 'gcc',
        input: oneFile,
        output: fileJSOut,
        sync: true,
        callback: function(err, min) {
          should.exist(err);
          should.not.exist(min);

          done();
        }
      };

      nodeMinify.minify(options.minify);
    });
  });

  describe('Deprecated', function() {
    it('should show a deprecated message', function(done) {
      var options = {};
      options.minify = {
        compressor: 'uglifyjs',
        input: __dirname + '/../examples/public/js/**/*.js',
        output: fileJSOut
      };

      options.minify.callback = function(err, min) {
        should.not.exist(err);
        should.exist(min);

        done();
      };

      new nodeMinify.minify(options.minify);
    });

    it('should show throw on type option', function(done) {
      var options = {};
      options.minify = {
        type: 'uglifyjs',
        input: __dirname + '/../examples/public/js/**/*.js',
        output: fileJSOut
      };

      expect(function() {
        nodeMinify.minify(options.minify);
      }).to.throw();
      done();
    });
    
    it('should show throw on type fileIn', function(done) {
      var options = {};
      options.minify = {
        compressor: 'uglifyjs',
        fileIn: __dirname + '/../examples/public/js/**/*.js',
        output: fileJSOut
      };

      expect(function() {
        nodeMinify.minify(options.minify);
      }).to.throw();
      done();
    });
    
    it('should show throw on type fileOut', function(done) {
      var options = {};
      options.minify = {
        compressor: 'uglifyjs',
        input: __dirname + '/../examples/public/js/**/*.js',
        fileOut: fileJSOut
      };

      expect(function() {
        nodeMinify.minify(options.minify);
      }).to.throw();
      done();
    });
  });

  describe('Concatenation', function() {
    tests.concat.forEach(function(o) {
      runOneTest(o, 'no-compress');
    });
  });

  describe('GCC', function() {
    tests.commonjs.forEach(function(o) {
      runOneTest(o, 'gcc');
    });
    tests.commonjs.forEach(function(o) {
      runOneTest(o, 'gcc', true);
    });
  });

  describe('YUI', function() {
    tests.commonjs.forEach(function(o) {
      runOneTest(o, 'yui-js');
    });
    tests.commonjs.forEach(function(o) {
      runOneTest(o, 'yui-js', true);
    });

    tests.commoncss.forEach(function(o) {
      runOneTest(o, 'yui-css');
    });
    tests.commoncss.forEach(function(o) {
      runOneTest(o, 'yui', true);
    });
  });

  describe('UglifyJS', function() {
    tests.commonjs.forEach(function(o) {
      runOneTest(o, 'uglifyjs');
    });
  });

  describe('Clean-css', function() {
    tests.commoncss.forEach(function(o) {
      runOneTest(o, 'clean-css');
    });
  });

  describe('CSSO', function() {
    tests.commoncss.forEach(function(o) {
      runOneTest(o, 'csso');
    });
  });

  describe('Sqwish', function() {
    tests.commoncss.forEach(function(o) {
      runOneTest(o, 'sqwish');
    });
  });
});
