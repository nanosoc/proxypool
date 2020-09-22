// 修改为你自己的域名
const domain = 'example.com';
const token = '1234567890abc';

// 后面内容无需进行任何修改
const upstream = 'zll.us';
const replace_dict = {
    [upstream]: domain
};

addEventListener('fetch', event => {
    event.respondWith(fetchAndApply(event.request));
});

async function fetchAndApply(request) {
    let response = null;
    let url = new URL(request.url);

    if (url.protocol == 'http:') {
        url.protocol = 'https:';
        response = Response.redirect(url.href);
        return response;
    }

    url.host = upstream;
    let new_request_headers = new Headers();
    new_request_headers.set('Host', upstream);
    new_request_headers.set('Referer', url.href);
    new_request_headers.set('User-Agent', domain + token);

    let original_response = await fetch(url.href, {
        method: request.method,
        headers: new_request_headers
    });

    let response_headers = new Headers(original_response.headers);
    response_headers.set('access-control-allow-origin', '*');
    response_headers.set('access-control-allow-credentials', true);
    response_headers.delete('content-security-policy');
    response_headers.delete('content-security-policy-report-only');
    response_headers.delete('clear-site-data');
    response_headers.delete('set-cookie');
    response_headers.delete('cf-cache-status');
    response_headers.delete('cf-ray');
    response_headers.delete('cf-request-id');
    response_headers.delete('alt-svc');
    response_headers.delete('location');

    let text = await replace_response_text(original_response.clone());
    response = new Response(text, {
        status: original_response.status,
        headers: response_headers
    });
    return response;
}

async function replace_response_text(response) {
    let text = await response.text();
    var i, j;
    for (i in replace_dict) {
        j = replace_dict[i]
        let re = new RegExp(i, 'g');
        text = text.replace(re, j);
    }
    return text;
}
