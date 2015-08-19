var gulp = require('gulp'),
    gutil = require('gulp-util'),
    merge = require('merge-stream'),
    browserSync = require('browser-sync').create();
// ----------------------------------
var targetFolder = "target";
var sourceFolder = "src";

var htmlSources = sourceFolder + "/html/**/*.html";
var cssSources = sourceFolder + "/css/**/*.css";
var assetsSources = sourceFolder + "/assets/**/*";

var componentsTarget = targetFolder + "/webcomponents";
// ----------------------------------
gulp.task("html", function () {
    console.log("Copying HTML-files");
    return gulp.src(htmlSources)
        .pipe(gulp.dest(targetFolder))
        .on("error", gutil.log);
});

gulp.task("assets", function () {
    console.log("Copying asset-files");
    return gulp.src(assetsSources)
        .pipe(gulp.dest(targetFolder + "/resources"))
        .on("error", gutil.log);
});

gulp.task("css", function () {
    console.log("Copying CSS-files");
    return gulp.src(cssSources)
        .pipe(gulp.dest(targetFolder + "/css"))
        .on("error", gutil.log);
});

gulp.task("webdeps", function(){
    console.log("Copying web-dependencies");
    
    var filesToCopy = {
        // Polymer
        "bower_components/polymer/polymer.html": componentsTarget
        ,"bower_components/polymer/polymer-mini.html": componentsTarget
        ,"bower_components/polymer/polymer-micro.html": componentsTarget
        // webcomponents-polyfill
        ,"bower_components/webcomponentsjs/webcomponents-lite.min.js": targetFolder + "/js"
        // MDL
        ,"bower_components/material-design-lite/material.min.js": targetFolder + "/js"
        ,"bower_components/material-design-lite/material.min.css": targetFolder + "/css"
    };
    
    var stream = false;
    Object.keys(filesToCopy).forEach(function(entry){
        // prepare stream
        function copyWebDepFileStream(){
            return gulp.src(entry).pipe(gulp.dest(filesToCopy[entry]));
        }
        if(!stream) stream = copyWebDepFileStream();
        else stream = merge(stream, copyWebDepFileStream());
    });

    return stream;
});

gulp.task("webserver", ["default"], function(cb) {
    console.log("Starting local webserver");
    browserSync.init({
        ui:false,
        ghostMode: false,
        online:false,
        minify:false,
        codeSync:false,
        timestamps: false,
        injectChanges: false,
        
        port: 8080,
        server: {
            baseDir: "./"+targetFolder
        }
    });

    gulp.watch(assetsSources, ["assets"], browserSync.reload);
    gulp.watch(cssSources, ["css"], browserSync.reload);
    gulp.watch(htmlSources, ["html"], browserSync.reload);
});

gulp.task("default", ["html", "assets", "css", "webdeps"], function(cb){ cb(); });