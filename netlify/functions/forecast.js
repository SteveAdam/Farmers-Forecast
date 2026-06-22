export default async (req, context) => {
    const { lat, lon, days, ai } = Object.fromEntries(new URL(req.url).searchParams);
    const apiKey = req.headers.get('x-api-key');

    if (!apiKey) {
        return new Response(JSON.stringify({ error: 'Missing API key' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    try {
        const response = await fetch(
            `https://api.weather-ai.co/v1/forecast?lat=${lat}&lon=${lon}&days=${days}&ai=${ai}`,
            {
                headers: { Authorization: `Bearer ${apiKey}` }
            }
        );

        const data = await response.json();

        if (!response.ok) {
            return new Response(JSON.stringify(data), {
                status: response.status,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        return new Response(JSON.stringify(data), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};
