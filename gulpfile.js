/**
 * Gulp tasks for OppSpace project. Built with Gulp 3.9.1. Consider upgrading to Gulp 4 once released as it offers e.g. gulp.series task.
 * To start using, install Node and using npm install Gulp 'npm install --g gulp' and in the project folder 'npm install --save-dev gulp'
 * Run 'npm install' in project folder and you're ready to go!
 * Note: folder structure kind of presumes you're running tasks on your dev machine
 */

var gulp = require('gulp'),
	cache = require('gulp-cached'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	rename = require('gulp-rename'),
	plumber = require('gulp-plumber'),
	cleancss = require('gulp-clean-css'),
	sourcemaps = require('gulp-sourcemaps'),
	annotate = require('gulp-ng-annotate'),
	tsc = require('gulp-typescript'),
	tsProject = tsc.createProject("tsconfig.json"),
	browserify = require("browserify"),
	stringify = require("stringify"),
	source = require("vinyl-source-stream"),
	buffer = require("vinyl-buffer"),
	tsify = require('tsify');
	spawn = require("child_process").spawn;

/**
 * Define file names
 */

var paths = {
	source : {
		maints: "Scripts/Main.ts"
	},
	built : {
		root: "./built/",
		mainfull: "./built/main.full.js"
	}
};

/**
 * Browserifies and bundles TS compiled files, currently only dataservice.factory.js
 */
gulp.task("browserify", function () {
	var libraryName = "main";
	var outputFolder = paths.built.root;
	var outputFileName = libraryName + ".full.js";

	var bundler = browserify({
		debug: true,
		standalone: libraryName
	}).transform(stringify, {
      appliesTo: { includeExtensions: ['.html'] }
    });

	return bundler.add("./Scripts/Vendor/fetch.js")
		.add(paths.source.maints)
		.plugin(tsify, { noImplicitAny: false })
		.bundle()
		.pipe(source(outputFileName))
		.pipe(buffer())
		//.pipe(sourcemaps.init({ loadMaps: true }))
		//.pipe(uglify())
		//.pipe(sourcemaps.write())
		.pipe(gulp.dest(outputFolder));
});

gulp.task("uglify", ["browserify"], function () {
    return gulp.src([paths.built.mainfull])
		.pipe(plumber())
		.pipe(sourcemaps.init({ loadMaps: true }))
		.pipe(annotate())
//		.pipe(uglify({
//			preserveComments: 'license'
//		}))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(paths.built.root));
});

function runPowershell(script, callback) {
	var child = spawn("powershell.exe",[script]);
	child.stdout.on("data",function(data){
		console.log("Powershell Data: " + data);
	});
	child.stderr.on("data",function(data){
		console.log("Powershell Errors: " + data);
	});
	child.on("exit",function(){
		console.log("Powershell Script finished");
	});
	child.stdin.end(); //end input
	if(callback) {
		callback();
	}
}

gulp.task("package", function (callback) {
    runPowershell(".\\Pack.ps1")
});

gulp.task("build", ["uglify"], function(callback) {
	runPowershell(".\\Pack.ps1")
});

gulp.task("install", ["build"], function() {
	runPowershell(".\\Install.ps1")
});

/**
 * Watch task: when js files change, do a concat and upload the bundled OppSpaceApp.js to SP. Also, update the html files to SP
 */
gulp.task("watch", function () {
	gulp.watch([sourcePaths.js], ["build"]);
});

/**
 * Gulp main task definitions
 * copyFilesToSP: saves files from project structure to SP using spsave
 * build: concatenates, uglifies and moves the JS files into SP, moves CSS and html files also
 * default: default task for the proect, uglify and move files
 * 
 * Note: sub-tasks run in paraller unless the individual task itself has a prequisitie task. Switch to gulp.series once Gulp 4 is generally available 
 */
gulp.task("default", ["build"]);