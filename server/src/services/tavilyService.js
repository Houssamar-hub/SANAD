const env = require('../config/env');

const OFFICIAL_MOROCCAN_DOMAINS = [
  'adala.justice.gov.ma',
  'justice.gov.ma',
  'sgg.gov.ma',
  'cndh.ma',
  'social.gov.ma',
  'maroc.ma'
];

/**
 * Searches Moroccan legal sources via Tavily API
 * @param {string} query - Legal query
 * @returns {Promise<Array<{ title: string, url: string, content: string }>>}
 */
const searchLegalSources = async (query) => {
  if (!env.TAVILY_API_KEY) {
    console.warn('[SANAD-Tavily] TAVILY_API_KEY non fournie. Recherche web désactivée.');
    return [];
  }

  try {
    const enrichedQuery = `${query} loi marocaine droit maroc CNDH justice`;
    const response = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        api_key: env.TAVILY_API_KEY,
        query: enrichedQuery,
        search_depth: 'advanced',
        include_domains: [
          'justice.gov.ma',
          'sgg.gov.ma',
          'cndh.ma',
          'social.gov.ma',
          'adala.justice.gov.ma',
          'cg.gov.ma'
        ],
        max_results: 4
      })
    });

    if (!response.ok) {
      console.warn(`[SANAD-Tavily] Erreur API Tavily: ${response.status} ${response.statusText}`);
      return [];
    }

    const data = await response.json();
    if (!data.results || !Array.isArray(data.results)) {
      return [];
    }

    return data.results.map((r) => ({
      title: r.title,
      url: r.url,
      content: r.content,
      score: r.score
    }));
  } catch (error) {
    console.warn(`[SANAD-Tavily] Échec de la recherche: ${error.message}`);
    return [];
  }
};

module.exports = {
  searchLegalSources,
  OFFICIAL_MOROCCAN_DOMAINS
};
