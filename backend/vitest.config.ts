import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        globals: true,
        root: './src',
        poolOptions:{
            threads: {
                singleThread: true
            }
        },
        hookTimeout: 10000000,
        testTimeout: 10000000
    },
    plugins: [
        swc.vite({
            sourceMaps: "inline",
            jsc: {
                target: "es2022",
                externalHelpers: true,
                keepClassNames: true,
                parser: {
                    syntax: "typescript",
                    tsx: true,
                    decorators: true,
                    dynamicImport: true,
                },
                transform: {
                    useDefineForClassFields: true,
                    legacyDecorator: true,
                    decoratorMetadata: true,
                }
            },
            module: {
                type: "nodenext",
                strictMode: true,
                lazy: false,
                noInterop: false,
            },
            isModule: true,
        },
        )
    ]
}
)