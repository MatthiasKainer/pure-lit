import { terser } from "rollup-plugin-terser";
import resolve from "rollup-plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import typescript from "rollup-plugin-typescript2";
import filesize from "rollup-plugin-filesize";
import minifyHTML from "rollup-plugin-minify-html-literals";

import pkg from "./package.json";

const input = `./src/index.ts`;
const plugins = [
    typescript(),
    replace({ "Reflect.decorate": "undefined" }),
    minifyHTML(),
    commonjs(),
    resolve(),
    json(),
    terser({
        module: true,
        warnings: true,
        mangle: {
            properties: {
                regex: /^__/,
            },
        },
    }),
    filesize({
        showBrotliSize: true,
    }),
];
const external = ["lit"]

const get = (input, pkg) => {
    const mainBundle = {
        input,
        external,
        output: {
            file: pkg.module,
            format: "esm",
            sourcemap: true,
        },
        plugins,
    };

    const cjsBundle = {
        input,
        external,
        output: {
            file: pkg.main,
            format: "cjs",
            sourcemap: true,
        },
        plugins,
    };

    const systemBundle = {
        input,
        external,
        output: {
            file: pkg.system,
            format: "system",
            sourcemap: true,
        },
        plugins,
    };
    return [mainBundle, cjsBundle, systemBundle]
}

export default [
    ...get(input, pkg)
];
