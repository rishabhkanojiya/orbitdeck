const express = require("express");
const path = require("path");
const process = require("process");
const webpack = require("webpack");
const config = require("./config/webpack.dev");
const history = require("connect-history-api-fallback");

const app = express();

let { PORT = 3000, ENV: env = "development" } = process.env;

const checkHealth = (_req, res) => {
    return res.json({ ok: "ok" });
};

if (env === "development") {
    console.log(
        "------------------------IN DEVELOPMENT------------------------------",
    );
    const compiler = webpack(config);
    app.use(history());
    app.use(
        require("webpack-dev-middleware")(compiler, {
            publicPath: config.output.publicPath,
        }),
    );
    app.use(
        require("webpack-hot-middleware")(compiler, {
            reload: true,
        }),
    );
}

app.use(express.static(path.join(__dirname, "build")));

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "./build", "index.html"));
});

app.get("/_healthz", checkHealth);
app.get("/_readyz", checkHealth);

app.listen(PORT, (err) => {
    if (err) {
        return console.error(err);
    }
    console.log(`Listening on http://localhost:${PORT}`);
});
