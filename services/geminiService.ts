
import { GoogleGenAI, Type, Modality } from "@google/genai";

const getAIInstance = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export interface AIResponse {
  text: string;
  groundingLinks: { title: string; uri: string; domain?: string }[];
}

async function withRetry<T>(fn: () => Promise<T>, retries = 3, delay = 1000): Promise<T> {
  try {
    return await fn();
  } catch (error: any) {
    const isOverloaded = error?.message?.includes('503') || error?.message?.includes('overloaded');
    if (isOverloaded && retries > 0) {
      console.warn(`AI model overloaded. Retrying in ${delay}ms... (${retries} attempts left)`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return withRetry(fn, retries - 1, delay * 2);
    }
    throw error;
  }
}

const extractLinks = (response: any) => {
  const links: { title: string; uri: string; domain?: string }[] = [];
  const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
  const groundingChunks = groundingMetadata?.groundingChunks;
  
  groundingChunks?.forEach((chunk: any) => {
    if (chunk.web) {
      try {
        const url = new URL(chunk.web.uri);
        links.push({ 
          title: chunk.web.title || "Official Source", 
          uri: chunk.web.uri,
          domain: url.hostname.replace('www.', '')
        });
      } catch (e) {
        links.push({ title: chunk.web.title || "Official Source", uri: chunk.web.uri });
      }
    }
  });
  return Array.from(new Map(links.map(item => [item.uri, item])).values());
};

export const improveExperienceText = async (role: string, company: string, description: string): Promise<string> => {
  return withRetry(async () => {
    const ai = getAIInstance();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Role: ${role}\nCompany: ${company}\nDraft Description: ${description}\n\nTask: Rewrite this professional experience to be high-impact. Use action verbs.`,
      config: {
        systemInstruction: "You are a career coach. Transform descriptions into high-impact professional highlights.",
      }
    });
    return response.text || description;
  });
};

export const generateMentorResponse = async (mentorName: string, mentorRole: string, userInterests: string[]): Promise<string> => {
  return withRetry(async () => {
    const ai = getAIInstance();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Mentor: ${mentorName}, Role: ${mentorRole}\nStudent Interests: ${userInterests.join(', ')}\n\nTask: Write a welcoming response as this mentor, accepting a request. Mention T-Hub/WE Hub synergy.`,
      config: {
        systemInstruction: "You are an institutional mentor at T-Hub/WE Hub. Your tone is professional and encouraging.",
      }
    });
    return response.text || "I'm excited to support your journey within our innovation network.";
  });
};

export const getStartupRiskAnalysis = async (prompt: string): Promise<string> => {
  return withRetry(async () => {
    const ai = getAIInstance();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Analyze the following startup idea using T-Hub's 6M2P Framework: ${prompt}`,
      config: {
        systemInstruction: "You are a professional venture capitalist at T-Hub. Focus on Money, Market, Motivation, Manpower, Mentor, Method, Planning, and Product.",
      }
    });
    return response.text || "Analysis unavailable.";
  });
};

export const getAILearningResponse = async (prompt: string, context?: string): Promise<AIResponse> => {
  return withRetry(async () => {
    const ai = getAIInstance();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: `You are EduBot at T-Hub. Context: ${context || 'General'}. Use institutional knowledge.`,
        tools: [{ googleSearch: {} }],
      }
    });
    return { 
      text: response.text || "No details found.", 
      groundingLinks: extractLinks(response) 
    };
  });
};

export const searchRealTimeCourses = async (topic: string): Promise<AIResponse> => {
  return withRetry(async () => {
    const ai = getAIInstance();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Find high-quality upcoming professional courses and certifications for: ${topic}. Search through Google for Startups, Coursera (Google/IBM specializations), and top university programs.`,
      config: {
        tools: [{ googleSearch: {} }],
      }
    });
    return {
      text: response.text || "",
      groundingLinks: extractLinks(response)
    };
  });
};

export const findNearbyEducationEvents = async (query: string, lat?: number, lng?: number): Promise<AIResponse> => {
  return withRetry(async () => {
    const ai = getAIInstance();
    const locationContext = lat && lng ? ` near coordinates ${lat}, ${lng}` : " in Hyderabad and nearby hubs";
    const refinedQuery = `
      Find upcoming tech, AI, startup, and hackathon events${locationContext} from Meetup.com, Eventbrite.com, and Luma (lu.ma).
      Focus on: ${query}. 
      For each event, find the Title, Date, Venue/Location, and official URL.
      Do not invent events. Prioritize official APIs and search-grounded sources.
    `;
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: refinedQuery,
      config: {
        tools: [{ googleSearch: {} }],
      }
    });
    return { 
      text: response.text || "Institutional discovery engine returned no active events.", 
      groundingLinks: extractLinks(response) 
    };
  });
};

export const getMentorMatch = async (userInterests: string[], mentors: any[]): Promise<string> => {
  return withRetry(async () => {
    const ai = getAIInstance();
    const mentorsSummary = mentors.map(m => `${m.name} (${m.role} at ${m.company}) - Expertise: ${m.tags.join(', ')}`).join('\n');
    const prompt = `Student Interests: ${userInterests.join(', ')}\n\nAvailable Mentors:\n${mentorsSummary}\n\nTask: Identify the best mentor for this student and explain why in 2 sentences. Focus on T-Hub ecosystem synergy.`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: "You are an institutional matching engine at T-Hub. Match students with mentors based on strategic career alignment.",
      }
    });
    return response.text || "No direct synergy match found at this time.";
  });
};

export const generateStartupVisual = async (prompt: string): Promise<string | null> => {
  return withRetry(async () => {
    const ai = getAIInstance();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: `A professional, minimal, high-tech logo for an innovation venture based on this concept: ${prompt}. Solid background, sharp edges, institutional aesthetic.` }] },
    });
    
    // Correctly iterate through all parts as per Nano Banana series documentation
    const candidate = response.candidates?.[0];
    if (candidate?.content?.parts) {
      for (const part of candidate.content.parts) {
        if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    }
    return null;
  });
};
