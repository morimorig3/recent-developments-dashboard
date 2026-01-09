import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import type { ICard } from '../types';

dotenv.config();

export interface DailySummaryItem {
  topic: string;
  description: string;
}

export interface DailySummary {
  items: DailySummaryItem[];
  generatedAt: string;
}

/**
 * プロンプトインジェクション対策のためタイトルをサニタイズ
 */
const sanitizeTitle = (title: string): string => {
  return (
    title
      // 改行・タブを空白に置換
      .replace(/[\r\n\t]/g, ' ')
      // プロンプト構造を壊す可能性のある文字を除去
      .replace(/[[\]{}#]/g, '')
      // 連続する空白を1つに
      .replace(/\s+/g, ' ')
      .trim()
      // 100文字に制限
      .slice(0, 100)
  );
};

/**
 * 不完全なJSON配列の修復を試みる
 * 例: [{"a":1},{"b":2 → [{"a":1}]
 */
const tryRepairJson = (text: string): unknown[] | null => {
  // 配列の開始を確認
  if (!text.startsWith('[')) return null;

  // 完全なオブジェクトを抽出
  const objects: unknown[] = [];
  const regex = /\{[^{}]*"topic"\s*:\s*"[^"]*"\s*,\s*"description"\s*:\s*"[^"]*"\s*\}/g;
  let match;

  while ((match = regex.exec(text)) !== null) {
    try {
      objects.push(JSON.parse(match[0]));
    } catch {
      // パースできないオブジェクトはスキップ
    }
  }

  return objects.length > 0 ? objects : null;
};

/**
 * DailySummaryItem の型ガード
 */
const isDailySummaryItem = (item: unknown): item is DailySummaryItem => {
  return (
    typeof item === 'object' &&
    item !== null &&
    'topic' in item &&
    'description' in item &&
    typeof (item as DailySummaryItem).topic === 'string' &&
    typeof (item as DailySummaryItem).description === 'string'
  );
};

export const getDailySummary = async (articles: ICard[]): Promise<DailySummary> => {
  const generatedAt = new Date().toISOString();

  // APIキー未設定時は早期リターン
  if (!process.env.GEMINI_API_KEY) {
    console.warn('GEMINI_API_KEY is not set, skipping daily summary generation');
    return { items: [], generatedAt };
  }

  if (articles.length === 0) {
    return { items: [], generatedAt };
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    // 記事情報をコンパクトにまとめる（タイトルはサニタイズ）
    const articleList = articles
      .map((a, i) => `${i + 1}. (${a.site}) ${sanitizeTitle(a.title)} - いいね: ${a.likesCount}`)
      .join('\n');

    const prompt = `あなたは技術トレンド分析の専門家です。以下の技術記事一覧から、開発者コミュニティで注目されているトピックを分析してください。

<articles>
${articleList}
</articles>

上記の記事群から共通するテーマや注目トピックを3つ抽出し、以下のJSON形式のみを出力してください。

出力形式:
[{"topic": "トピック名(10文字以内)", "description": "説明(50文字以内)"}, ...]

注意:
- JSON配列のみを出力すること
- 説明文や前置きは不要
- 必ず3つのトピックを出力すること`;

    const result = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        temperature: 0,
        maxOutputTokens: 4096,
      },
    });

    // finishReasonをチェック
    const finishReason = result.candidates?.[0]?.finishReason;
    if (finishReason && finishReason !== 'STOP') {
      console.warn(`getDailySummary: Unexpected finishReason: ${finishReason}`);
    }

    let responseText = result.text || '';

    // コードブロックマーカーを削除
    responseText = responseText
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    // JSONパースと型バリデーション
    let parsed: unknown;
    try {
      parsed = JSON.parse(responseText);
    } catch {
      // 不完全なJSONの修復を試みる
      console.warn('getDailySummary: JSON parse failed, attempting repair...');
      const repaired = tryRepairJson(responseText);
      if (repaired) {
        parsed = repaired;
      } else {
        console.error('getDailySummary: JSON repair failed. Response:', responseText);
        return { items: [], generatedAt };
      }
    }

    if (!Array.isArray(parsed)) {
      console.error('getDailySummary: Expected array, got:', typeof parsed);
      return { items: [], generatedAt };
    }

    // 型ガードでフィルタリング
    const items = parsed.filter(isDailySummaryItem);

    if (items.length !== parsed.length) {
      console.warn(
        `getDailySummary: Some items failed validation (${items.length}/${parsed.length})`,
      );
    }

    return { items, generatedAt };
  } catch (error) {
    console.error('Error in getDailySummary:', error);
    return { items: [], generatedAt };
  }
};
