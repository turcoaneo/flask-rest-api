export const apiCall = async (id, WEB_URL, methodType, requestBody) => {
    let endpoint = WEB_URL + "recipe";
    if (!!id) {
        endpoint = `http://127.0.0.1:5000/recipe/${id}`;
    }
    let init = {
        method: methodType, headers: new Headers({
            'content-type': 'application/json', 'Access-Control-Allow-Origin': WEB_URL
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