import { Plugin } from "vite";
import { OutputBundle } from "rollup";

import { checkCSSOutput } from "./lib/check-css-output";
import { getCssBundle } from "./lib/get-css-bundle";
import { getInjectionChunkTarget } from "./lib/get-injection-chunk-target";
import { PluginError } from "./lib/plugin-error";
import { PluginOptions } from "./types";
import { PLUGIN_NAME } from "./lib/constants";

export function shadowStyle(options: PluginOptions): Plugin {
  return {
    name: PLUGIN_NAME,

    enforce: "post",

    config(userConfig, env) {
      if (env.command === "build") {
        if (!userConfig.build) {
          userConfig.build = {};
        }

        if (userConfig.build.cssCodeSplit) {
          throw new PluginError(
            `'build.cssCodeSplit' option is set to true, it must be false.`
          );
        }
      }
    },

    generateBundle(_, outputBundle) {
      checkCSSOutput(outputBundle as OutputBundle);

      const cssBundle = getCssBundle(outputBundle as OutputBundle);

      const injectionTarget = getInjectionChunkTarget(
        outputBundle as OutputBundle
      );

      const hostUrl = options.assetsPath || process.env.ASSETS_PATH;

      if (typeof hostUrl == "undefined") {
        console.warn(
          'The remote style takes effect only when the "assetsPath" option in the vite.config.ts file.'
        );
        return;
      }

      const stylesheetUrl = hostUrl + cssBundle.fileName;

      // Swap the style placeholder with the style to inject.
      injectionTarget.code = injectionTarget.code.replace(
        "SHADOW_STYLE",
        `'${stylesheetUrl}'`
      );

      return;
    }
  };
}
