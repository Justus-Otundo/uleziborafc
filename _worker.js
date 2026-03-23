// Cloudflare Worker - OAuth proxy for Decap CMS
const CLIENT_ID = 'Ov23lizwavVKiXUJnNrg';
const CLIENT_SECRET = '87b34954f230c586daf6f28a4e40489d996290e3';

export default {
    async fetch(request, env) {
        const url = new URL(request.url);
        const path = url.pathname;

        // OAuth: Redirect to GitHub
        if (path === '/api/auth' || path === '/api/auth/') {
            const redirectUri = url.origin + '/api/callback';
            return Response.redirect(
                'https://github.com/login/oauth/authorize?client_id=' + CLIENT_ID +
                '&redirect_uri=' + encodeURIComponent(redirectUri) +
                '&scope=repo,user',
                302
            );
        }

        // OAuth: Handle callback from GitHub
        if (path === '/api/callback' || path === '/api/callback/') {
            const code = url.searchParams.get('code');
            if (!code) {
                return new Response('Missing code', { status: 400 });
            }

            const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    client_id: CLIENT_ID,
                    client_secret: CLIENT_SECRET,
                    code: code
                })
            });

            const data = await tokenRes.json();

            if (data.access_token) {
                return new Response(
                    '<html><body><script>' +
                    'window.opener.postMessage(' +
                    '"authorization:github:success:' + JSON.stringify({token: data.access_token, provider: 'github'}).replace(/"/g, '\\"') + '",' +
                    '"*"' +
                    ');window.close();' +
                    '</script><p>Authorized! This window will close.</p></body></html>',
                    { headers: { 'Content-Type': 'text/html;charset=UTF-8' } }
                );
            }

            return new Response('OAuth error: ' + JSON.stringify(data), { status: 400 });
        }

        // All other requests: serve static assets
        return env.ASSETS.fetch(request);
    }
};
