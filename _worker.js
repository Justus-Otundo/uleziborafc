// Cloudflare Worker - OAuth proxy for Decap CMS
// Handles GitHub OAuth token exchange

const CLIENT_ID = 'Ov23lizwavVKiXUJnNrg';
const CLIENT_SECRET = '87b34954f230c586daf6f28a4e40489d996290e3';

export default {
    async fetch(request, env) {
        const url = new URL(request.url);

        // Step 1: Redirect to GitHub OAuth
        if (url.pathname === '/api/auth') {
            const redirectUri = `${url.origin}/api/callback`;
            const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=repo,user`;
            return Response.redirect(githubAuthUrl, 302);
        }

        // Step 2: Handle callback - exchange code for token
        if (url.pathname === '/api/callback') {
            const code = url.searchParams.get('code');

            if (!code) {
                return new Response('Missing code parameter', { status: 400 });
            }

            // Exchange code for access token
            const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
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

            const tokenData = await tokenResponse.json();

            if (tokenData.access_token) {
                // Return HTML that sends the token back to the CMS via postMessage
                const html = `<!DOCTYPE html>
<html>
<head><title>Authorizing...</title></head>
<body>
<script>
(function() {
    function sendMessage(provider, token) {
        var message = "authorization:" + provider + ":success:" + JSON.stringify({ token: token, provider: provider });
        if (window.opener) {
            window.opener.postMessage(message, "*");
            window.close();
        }
    }
    sendMessage("github", "${tokenData.access_token}");
})();
</script>
<p>Authorizing... Please wait.</p>
</body>
</html>`;
                return new Response(html, {
                    headers: { 'Content-Type': 'text/html' }
                });
            } else {
                return new Response('OAuth error: ' + JSON.stringify(tokenData), { status: 400 });
            }
        }

        // For all other requests, serve static assets
        return env.ASSETS.fetch(request);
    }
};
