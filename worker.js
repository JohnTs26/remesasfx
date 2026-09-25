export default {
  async fetch(request) {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    const url = new URL(request.url);
    const target = url.searchParams.get("target");

    let response;

    if (target === "binance") {
      const body = await request.text();
      response = await fetch(
        "https://p2p.binance.com/bapi/c2c/v2/friendly/c2c/adv/search",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
            "Accept": "*/*",
            "Accept-Language": "es-419,es;q=0.9",
            "Accept-Encoding": "gzip, deflate, br",
            "Referer": "https://p2p.binance.com/es-LA/trade/all-payments/USDT?fiat=BOB",
            "Origin": "https://p2p.binance.com",
            "Cache-Control": "no-cache",
            "Pragma": "no-cache",
            "sec-ch-ua": '"Chromium";v="128", "Not;A=Brand";v="24", "Google Chrome";v="128"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"Windows"',
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
          },
          body,
        }
      );

      if (!response.ok) {
        return new Response(
          JSON.stringify({ error: "Binance bloqueó la solicitud", status: response.status }),
          { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

    } else if (target === "bcb") {
      response = await fetch("https://apibcb.cucu.bo/api/v1/tc/oficial", {
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; RemesasFX/1.0)",
          "Accept": "application/json",
        }
      });
    } else {
      return new Response(
        JSON.stringify({ error: "Target no válido" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.text();
    return new Response(data, {
      status: response.status,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  },
};
