var fsg = require("fs-glob");
var fs = require("fs");
var path = require("path");

var config = {
    media: {
        js: {
            static: [
                "util/ajax.js",
                "util/css.js",
                "util/functions.js",
                "util/arrays.js",
                "util/numbers.js",
                "util/objects.js",
                "util/strings.js",
                "util/properties.js",
                "util/events.js",
                "util/class.js",
                "util/elements.js",
                "util/rafer.js",

                "media/media.js",
                "media/defaultoptions.js",
                "media/domevents.js",
                "media/device.js"
            ],
            globs: [
                "integration/*.js",
                "media/*.js",
                "util/*.js",
                "integration/**/*.js",
                "media/**/*.js",
                "util/**/*.js",
            ]
        }
    },
    mediaui: {
        js: {
            static: [
                "util/ajax.js",
                "util/css.js",
                "util/functions.js",
                "util/arrays.js",
                "util/numbers.js",
                "util/objects.js",
                "util/strings.js",
                "util/properties.js",
                "util/events.js",
                "util/class.js",
                "util/elements.js",
                "util/rafer.js",

                "media/media.js",
                "media/defaultoptions.js",
                "media/domevents.js",
                "media/device.js",

                "mediaui/component.js",
                "mediaui/controller.js",
                "mediaui/input.js",
                "mediaui/output.js",
                "mediaui/mediauilist.js",
                "mediaui/polyfills/fullscreen-polyfill.js",
                "mediaui/mediaui.js"
            ],
            globs: [
                "*.js",
                "**/*.js"
            ]
        },
        less: {
            globs: [
                "mediaui/*.less",
                "mediaui/**/*.less"
            ]
        },
        assets: {
            globs: [
                "*",
                "**"
            ]
        }
    }
};


function buildJS(name) {

    var buildConfig = config[name].js;

    var globs = buildConfig.globs.slice(0).concat(buildConfig.static.map(function(name) {
        return "!"+name;
    }));

    var files = {};
    buildConfig.static.forEach(function(name) {
        files["./src/js/"+name] = true;
    });

    return fsg.stats({
        globs: globs,
        location: "./src/js"
    }).then((stats)=>{

        return stats.each((stat, next, resolve)=>{

            if (!stat) return resolve(files);

            files["./"+fsg.rel(stat.location, "./")] = true;

            next();

        });

    }).then((files)=>{


        fsg.mkdir(`./dist/${name}/`);

        var values = [];
        for (var k in files) values.push(files[k]);

        var wrapper = fs.readFileSync("wrapper.js").toString().replace("%sourceMapFileName%", `${name}.min.js.map`);

        const ClosureCompiler = require('google-closure-compiler').compiler;
        const closureCompiler = new ClosureCompiler({
            js: Object.keys(files),
            create_source_map: `./dist/${name}/${name}.min.js.map`,
            compilation_level: 'SIMPLE',
            js_output_file: `./dist/${name}/${name}.min.js`,
            language_in: 'ECMASCRIPT5_STRICT',
            output_wrapper: wrapper,
            source_map_location_mapping: ["./src/|./", "./dist/|./"],
            source_map_include_content: true
        });

        const compilerProcess = closureCompiler.run(function(exitCode, stdOut, stdErr) {
            if (stdErr) {
                console.log(stdErr);
                return;
            }
        });

    });

}

function buildLess(name) {
    var less = require("less");
    var buildConfig = config[name].less;

    return fsg.stats({
        globs: buildConfig.globs,
        location: "./src/less"
    }).then((stats)=>{

        var source = "";
        stats.forEach(function(file) {
            source+= "@import '"+fsg.rel(file.location, "./")+"';\n";
        });

        less.render(source, {
            sourceMap: {
                sourceMapFileInline: false,
                outputSourceFiles: true,
                sourceMapURL: `${name}.min.css.map`,
                sourceMapBasepath: "src/"
            }
        }, function(error, output) {
            if (error) {
                console.log(error);
                return;
            }
            fs.writeFileSync(`./dist/${name}/${name}.min.css`, output.css);
            fs.writeFileSync(`./dist/${name}/${name}.min.css.map`, output.map);
        });

    });
}

function copyAssets(name) {
    var buildConfig = config[name].assets;
    return fsg.copy({
        globs: buildConfig.globs,
        location: `./src/assets/${name}/`,
        to: `../../../dist/${name}/`
    });
}

buildJS("media")
.then(function() {
    return buildJS("mediaui");
}).then(function() {
    return buildLess("mediaui");
}).then(function() {
    return copyAssets("mediaui");
});
