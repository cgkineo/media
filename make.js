var fsg = require("fs-glob");
var fs = require("fs");
var path = require("path");
var uglify = require("uglify-js");

var config = {
    media: {
        static: [
            "util/css.js",
            "util/html.js",
            "util/javascript.js",
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
    },
    mediaui: {
        static: [
            "util/css.js",
            "util/html.js",
            "util/javascript.js",
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
            "mediaui/uilist.js",
            "mediaui/polyfills/fullscreen-polyfill.js",
            "mediaui/ui.js"
        ],
        globs: [
            "*.js",
            "**/*.js"
        ]
    }
};


function buildJS(name) {

    var buildConfig = config[name];

    var globs = buildConfig.globs.slice(0).concat(buildConfig.static.map(function(name) {
        return "!"+name;
    }));

    var files = {};
    buildConfig.static.forEach(function(name) {
        files[name] = fs.readFileSync("./src/js/"+name).toString();
    });

    return fsg.stats({
        globs: globs,
        location: "./src/js"
    }).then((stats)=>{

        return stats.each((stat, next, resolve)=>{

            if (!stat) return resolve(files);

            files[fsg.rel(stat.location, "./src/js")] = fs.readFileSync(stat.location).toString();

            next();

        });

    }).then((files)=>{

        var result = uglify.minify(files, {
            toplevel: true,
            compress: {
                passes: 3
            },
            mangle: {
                properties: {
                    regex: /_.*/,
                    builtins : true
                }
            },
            output: {
                beautify: false
            }
        });
        if (result.error) {
            console.log(files['mediaui.css']);
            console.log(result.error);
            return;
        }

        var values = [];
        for (var k in files) values.push(files[k]);

        var header = fs.readFileSync("header.js").toString();
        var footer = fs.readFileSync("footer.js").toString();

        fsg.mkdir("./dist");
        fs.writeFileSync(`./dist/${name}.js`, header+values.join("\n")+footer);
        fs.writeFileSync(`./dist/${name}.min.js`, header+result.code+footer);

    });

}

buildJS("media")
.then(function() {
    buildJS("mediaui");
});
