function handlePreFlightRequest(): Response {
  return new Response("Preflight OK!", {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "content-type",
    },
  });
}

async function handler(req: Request): Promise<Response> {
  if (req.method === "OPTIONS") {
    return handlePreFlightRequest();
  }

  const url = new URL(req.url);
  const word = url.pathname.split('/').pop();

  if (!word) {
    return new Response(
      JSON.stringify({ error: "Missing 'word' query parameter" }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      },
    );
  }

  const similarityRequestBody = JSON.stringify({
    word1: "centrale", 
    word2: word,       
  });

  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: similarityRequestBody,
  };

  try {
    const response = await fetch("https://word2vec.nicolasfley.fr/similarity", requestOptions);

    if (!response.ok) {
      throw new Error(`Similarity API error: ${response.statusText}`);
    }

    const result = await response.json();

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "content-type",
      },
    });

  } catch (error) {
    console.error("Fetch error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }
}

Deno.serve(handler);
