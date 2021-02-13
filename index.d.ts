import { DotenvConfigOptions } from 'dotenv';
declare type Variables = Record<string, string>;
interface Options {
    fileRegexp: RegExp;
    getEnvFullName(name: string): string;
    variablePrefix: string;
    dotenvConfigOptions?: DotenvConfigOptions;
    debug?: boolean;
}
declare function pluginVueEnv(variables?: Variables, args?: Partial<Options>): {
    name: string;
    transform(code: string, id: any): {
        code: string;
    } | undefined;
};
export { pluginVueEnv };
export default pluginVueEnv;
