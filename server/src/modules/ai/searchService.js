/**
 * SANAD AI Assistant - Official Moroccan Web Search Service (Tavily)
 * Restricts live searches exclusively to verified official Moroccan governmental and institutional portals:
 * - adala.justice.gov.ma (Portail Juridique Adala)
 * - justice.gov.ma (Ministère de la Justice)
 * - sgg.gov.ma (Secrétariat Général du Gouvernement)
 * - cndh.ma (Conseil National des Droits de l'Homme)
 * - social.gov.ma (Ministère de la Solidarité et de la Femme)
 */

const OFFICIAL_DOMAINS = [
  'adala.justice.gov.ma',
  'justice.gov.ma',
  'sgg.gov.ma',
  'cndh.ma',
  'social.gov.ma'
];

async function searchOfficialSources(query, maxResults = 3) {
  const apiKey = process.env.TAVILY_API_KEY;

  if (!apiKey || apiKey === 'YOUR_TAVILY_API_KEY') {
    return {
      results: [],
      source: 'offline_corpus'
    };
  }

  try {
    const searchPayload = {
      api_key: apiKey,
      query: `${query} Maroc loi droit`,
      search_depth: 'basic',
      include_domains: OFFICIAL_DOMAINS,
      max_results: maxResults,
      include_answer: false
    };

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);

    const response = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(searchPayload),
      signal: controller.signal
    });
    clearTimeout(timeout);

    if (response.ok) {
      const data = await response.json();
      if (data && Array.isArray(data.results)) {
        const verifiedResults = data.results.map(r => ({
          title: r.title,
          url: r.url,
          content: r.content,
          score: r.score,
          isOfficial: OFFICIAL_DOMAINS.some(d => (r.url || '').includes(d))
        }));

        return {
          results: verifiedResults,
          source: 'tavily_official'
        };
      }
    }
  } catch (error) {
    // Fallback to offline verified corpus without crashing
  }

  return {
    results: [],
    source: 'offline_fallback'
  };
}

module.exports = {
  OFFICIAL_DOMAINS,
  searchOfficialSources
};
