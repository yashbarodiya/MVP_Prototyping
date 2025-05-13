import { NewsArticle, NewsCategory, NewsResponse } from "@/types/news";

const API_KEY = "0b482b6aaefd47409008c612c94234fa";
const BASE_URL = "https://newsapi.org/v2";

export async function fetchNews(category: NewsCategory = "technology", pageSize = 10): Promise<NewsArticle[]> {
  try {
    const response = await fetch(
      `${BASE_URL}/top-headlines?country=us&category=${category}&pageSize=${pageSize}&apiKey=${API_KEY}`,
      { next: { revalidate: 3600 } } // Revalidate every hour
    );
    
    if (!response.ok) {
      throw new Error(`News API responded with status: ${response.status}`);
    }
    
    const data = await response.json() as NewsResponse;
    
    // Map to our own ArticleType and add ids if they don't exist
    return data.articles.map((article, index) => ({
      ...article,
      id: article.url.split("/").pop()?.replace(/[^a-zA-Z0-9]/g, "-") || `article-${index}`,
    }));
  } catch (error) {
    console.error("Error fetching news:", error);
    return [];
  }
}

export async function fetchArticleById(id: string): Promise<NewsArticle | null> {
  try {
    // In a real app, we would fetch a specific article by ID
    // For the MVP, we'll just fetch all articles and find the one we want
    const allArticles = await fetchNews();
    const article = allArticles.find(article => article.id === id);
    
    if (!article) {
      return null;
    }
    
    return article;
  } catch (error) {
    console.error("Error fetching article:", error);
    return null;
  }
}