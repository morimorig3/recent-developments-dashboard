import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import type { Summary } from '../types';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export const getSummaryFromUrl = async (url: string): Promise<Summary[]> => {
  try {
    // Fetch HTML content from URL
    const fetchResponse = await fetch(url);
    const html = await fetchResponse.text();

    // Initialize Gemini model
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    // Prepare prompt for Gemini
    const prompt = `
以下のHTMLは技術ブログの内容です。この記事から重要なポイントを抽出し、以下の要件で返してください：
1. 日本語で記事の重要なポイントを抽出すること
2. 抽出したポイントをJSON形式で返却すること
3. 各ポイントは簡潔に、タイトルと本文の形式で示すこと
4. 返却形式は以下のJSON配列形式にしてください：
   [
     {
       "title": "ポイントのタイトル",
       "body": "ポイントの詳細説明"
     },
     ...
   ]
5. 各ポイントは簡潔かつ明確に記述してください
6. 少なくとも3つ、最大で5つの重要なポイントを抽出してください

HTML内容:
${html}
`;

    // Generate content using Gemini
    const result = await model.generateContent(prompt);
    let responseText = result.response.text();

    // Remove code block markers if they exist
    responseText = responseText
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    // Parse the JSON response
    const summaries: Summary[] = JSON.parse(responseText);
    return summaries;
  } catch (error) {
    console.error('Error in getSummaryFromUrl:', error);
    // エラーを投げずに空の配列を返す
    return [];
  }
};
