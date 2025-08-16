/**
 * PubMed API integration to fetch scientific research
 * for evidence-based fitness responses
 */

// Secure approach - API key should be in env var for production
const PUBMED_API_KEY = "4425ce0018d0d56baaf996cdb91dea004f09";

/**
 * Search PubMed for relevant studies based on query
 */
export async function searchPubMed(query: string, maxResults: number = 3): Promise<PubMedResult[]> {
  try {
    // Step 1: Search for relevant article IDs
    const searchUrl = new URL("https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi");
    searchUrl.searchParams.append("db", "pubmed");
    searchUrl.searchParams.append("term", `${query} AND ("last 5 years"[PDat])`);
    searchUrl.searchParams.append("retmode", "json");
    searchUrl.searchParams.append("retmax", maxResults.toString());
    searchUrl.searchParams.append("sort", "relevance");
    searchUrl.searchParams.append("api_key", PUBMED_API_KEY);

    const searchResponse = await fetch(searchUrl.toString());
    if (!searchResponse.ok) {
      throw new Error(`PubMed search failed: ${searchResponse.statusText}`);
    }

    const searchData = await searchResponse.json();
    const ids = searchData.esearchresult?.idlist || [];
    
    if (ids.length === 0) {
      return [];
    }

    // Step 2: Fetch article summaries
    const summaryUrl = new URL("https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi");
    summaryUrl.searchParams.append("db", "pubmed");
    summaryUrl.searchParams.append("id", ids.join(","));
    summaryUrl.searchParams.append("retmode", "json");
    summaryUrl.searchParams.append("api_key", PUBMED_API_KEY);

    const summaryResponse = await fetch(summaryUrl.toString());
    if (!summaryResponse.ok) {
      throw new Error(`PubMed summary fetch failed: ${summaryResponse.statusText}`);
    }

    const summaryData = await summaryResponse.json();
    
    // Process and return formatted results
    return ids.map((id: string) => {
      const article = summaryData.result[id];
      if (!article) return null;
      
      return {
        id,
        title: article.title || "No title available",
        authors: formatAuthors(article.authors) || "No authors listed",
        journal: article.fulljournalname || article.source || "Journal not specified",
        year: article.pubdate?.split(" ")?.[0] || "Year not available",
        abstract: "", // Will be fetched separately if needed
        url: `https://pubmed.ncbi.nlm.nih.gov/${id}/`,
      };
    }).filter(Boolean);
  } catch (error) {
    console.error("PubMed API error:", error);
    return [];
  }
}

/**
 * Fetch abstract for a specific PubMed article by ID
 */
export async function getPubMedAbstract(id: string): Promise<string> {
  try {
    const efetchUrl = new URL("https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi");
    efetchUrl.searchParams.append("db", "pubmed");
    efetchUrl.searchParams.append("id", id);
    efetchUrl.searchParams.append("retmode", "text");
    efetchUrl.searchParams.append("rettype", "abstract");
    efetchUrl.searchParams.append("api_key", PUBMED_API_KEY);

    const response = await fetch(efetchUrl.toString());
    if (!response.ok) {
      throw new Error(`Failed to fetch abstract: ${response.statusText}`);
    }

    const text = await response.text();
    return text || "No abstract available.";
  } catch (error) {
    console.error("Error fetching PubMed abstract:", error);
    return "Failed to retrieve abstract.";
  }
}

/**
 * Format author list from PubMed response
 */
function formatAuthors(authors: any[] = []): string {
  if (!authors || !authors.length) return "";
  
  // For brevity, limit to first 3 authors + et al
  const authorList = authors.slice(0, 3).map(author => {
    if (author.name) return author.name;
    if (author.lastname && author.initials) {
      return `${author.lastname} ${author.initials}`;
    }
    return author.lastname || "";
  }).filter(Boolean);
  
  if (authors.length > 3) {
    authorList.push("et al");
  }
  
  return authorList.join(", ");
}

/**
 * Generate a concise research summary from PubMed results
 */
export function generateResearchSummary(results: PubMedResult[]): string {
  if (!results || results.length === 0) {
    return "No relevant scientific studies found.";
  }

  let summary = "Research findings:\n\n";
  
  results.forEach((result, index) => {
    summary += `[${index + 1}] ${result.title}\n`;
    summary += `${result.authors} (${result.year}). ${result.journal}.\n`;
    summary += `${result.url}\n\n`;
  });
  
  return summary;
}

export interface PubMedResult {
  id: string;
  title: string;
  authors: string;
  journal: string;
  year: string;
  abstract: string;
  url: string;
}
