export const apiCall = async (id, webUrl, recipeEndpoint, methodType, requestBody) => {
    let endpoint = webUrl + "" + recipeEndpoint;
    if (!!id) {
        endpoint = endpoint + "/" + `${id}`;
    }
    let init = {
        method: methodType, headers: new Headers({
            'content-type': 'application/json', 'Access-Control-Allow-Origin': webUrl
        }), cache: 'no-cache'
    };
    if (!!requestBody) {
        init["body"] = requestBody;
    }
    return await fetch(endpoint, init).then(async (response) => {
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }
        return await response.json();
    });
}