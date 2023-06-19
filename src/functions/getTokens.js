
// Function to obtain the access token for the API requests.
async function GetTokens(user, passw, url) {
    let tokenData = null;
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Basic cmJwbXJlc3Q6M2RtMURNM24=`);

    const raw = `grant_type=password&username=${user}&password=${passw}`;
    const options = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow',
        credentials: "same-origin"
    };
    const result = await fetch(`/osp/a/idm/auth/oauth2/grant`, options)
        .then(res => res.json())
        .then(result => ({
            access_token: result.access_token,
            expires_in: result.expires_in,
            refresh_token: result.refresh_token
        }))
        .catch(error => error);

    tokenData = result;
    return tokenData;
};



export { GetTokens }