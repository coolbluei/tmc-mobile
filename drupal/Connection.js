export default class Connection {

    baseUrl = process.env.EXPO_PUBLIC_API_BASE;

    jsonApiBase = "/api/";

    getBaseUrl = () => {
        return this.baseUrl;
    }

    getJsonApiBase = () => {
        return this.jsonApiBase;
    }

}