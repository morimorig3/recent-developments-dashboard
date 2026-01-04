import satori from 'satori';
import sharp from 'sharp';
import { writeFileSync } from 'fs';

const notoSansUrl = 'https://cdn.jsdelivr.net/fontsource/fonts/noto-sans-jp@latest/japanese-700-normal.ttf';
const jetBrainsUrl = 'https://cdn.jsdelivr.net/fontsource/fonts/jetbrains-mono@latest/latin-500-normal.ttf';

const [notoSansFont, jetBrainsFont] = await Promise.all([
  fetch(notoSansUrl).then(res => res.arrayBuffer()),
  fetch(jetBrainsUrl).then(res => res.arrayBuffer()),
]);

const design = {
  type: 'div',
  props: {
    style: {
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#0f172a',
      padding: '40px',
      fontFamily: 'Noto Sans JP',
    },
    children: [
      {
        type: 'div',
        props: {
          style: {
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#1e293b',
            borderRadius: '16px',
            border: '1px solid #334155',
            width: '100%',
            height: '100%',
            overflow: 'hidden',
          },
          children: [
            {
              type: 'div',
              props: {
                style: {
                  display: 'flex',
                  alignItems: 'center',
                  padding: '18px 24px',
                  backgroundColor: '#334155',
                  gap: '10px',
                },
                children: [
                  { type: 'div', props: { style: { width: '16px', height: '16px', borderRadius: '50%', backgroundColor: '#ef4444' } } },
                  { type: 'div', props: { style: { width: '16px', height: '16px', borderRadius: '50%', backgroundColor: '#eab308' } } },
                  { type: 'div', props: { style: { width: '16px', height: '16px', borderRadius: '50%', backgroundColor: '#22c55e' } } },
                  { type: 'span', props: { style: { marginLeft: '20px', color: '#94a3b8', fontSize: '18px', fontFamily: 'JetBrains Mono' }, children: 'catchup.ts' } },
                ],
              },
            },
            {
              type: 'div',
              props: {
                style: {
                  display: 'flex',
                  flex: 1,
                },
                children: [
                  {
                    type: 'div',
                    props: {
                      style: {
                        display: 'flex',
                        flexDirection: 'column',
                        padding: '50px 24px',
                        backgroundColor: '#1e293b',
                        borderRight: '1px solid #334155',
                        gap: '20px',
                        justifyContent: 'center',
                      },
                      children: [
                        { type: 'span', props: { style: { color: '#475569', fontSize: '42px', fontFamily: 'JetBrains Mono' }, children: '1' } },
                        { type: 'span', props: { style: { color: '#475569', fontSize: '42px', fontFamily: 'JetBrains Mono' }, children: '2' } },
                        { type: 'span', props: { style: { color: '#475569', fontSize: '42px', fontFamily: 'JetBrains Mono' }, children: '3' } },
                      ],
                    },
                  },
                  {
                    type: 'div',
                    props: {
                      style: {
                        display: 'flex',
                        flexDirection: 'column',
                        padding: '50px 40px',
                        gap: '20px',
                        justifyContent: 'center',
                        flex: 1,
                      },
                      children: [
                        {
                          type: 'div',
                          props: {
                            style: { display: 'flex', gap: '16px', fontSize: '42px', alignItems: 'center' },
                            children: [
                              { type: 'span', props: { style: { color: '#7c6f9b' }, children: 'const' } },
                              { type: 'span', props: { style: { color: '#8a7a50' }, children: 'title' } },
                              { type: 'span', props: { style: { color: '#6b7280' }, children: '=' } },
                              { type: 'span', props: { style: { color: '#ffffff', fontWeight: 700, fontSize: '48px', fontFamily: 'Noto Sans JP' }, children: '"がんばらない"' } },
                            ],
                          },
                        },
                        {
                          type: 'div',
                          props: {
                            style: { display: 'flex', gap: '16px', fontSize: '42px', alignItems: 'center' },
                            children: [
                              { type: 'span', props: { style: { color: '#7c6f9b' }, children: 'const' } },
                              { type: 'span', props: { style: { color: '#8a7a50' }, children: 'goal' } },
                              { type: 'span', props: { style: { color: '#6b7280' }, children: '=' } },
                              { type: 'span', props: { style: { color: '#4ade80', fontWeight: 700, fontSize: '48px', fontFamily: 'Noto Sans JP' }, children: '"技術キャッチアップ"' } },
                            ],
                          },
                        },
                        {
                          type: 'div',
                          props: {
                            style: { display: 'flex', alignItems: 'center', gap: '16px', fontSize: '36px' },
                            children: [
                              { type: 'span', props: { style: { color: '#4a6a8a' }, children: 'export' } },
                              { type: 'span', props: { style: { color: '#7c6f9b' }, children: 'default' } },
                              { type: 'span', props: { style: { color: '#6b7280' }, children: '{ title, goal }' } },
                              { type: 'span', props: { style: { width: '14px', height: '40px', backgroundColor: '#61afef', marginLeft: '4px' } } },
                            ],
                          },
                        },
                      ],
                    },
                  },
                ],
              },
            },
          ],
        },
      },
    ],
  },
};

const svg = await satori(design, {
  width: 1200,
  height: 630,
  fonts: [
    { name: 'Noto Sans JP', data: notoSansFont, weight: 700, style: 'normal' },
    { name: 'JetBrains Mono', data: jetBrainsFont, weight: 500, style: 'normal' },
  ],
});

const png = await sharp(Buffer.from(svg)).png().toBuffer();
writeFileSync('./public/og-image.png', png);
console.log('✅ OG image generated: public/og-image.png');
