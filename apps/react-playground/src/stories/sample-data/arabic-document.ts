import type { IDocument } from '@muhaqqiq-editor/react';

/**
 * Sample 5-line Arabic scholarly document.
 *
 * Text adapted from Ibn Khaldun's Muqaddimah (المقدّمة) with edition
 * symbol states applied to demonstrate prefix, bracket, and suffix
 * formatting in a realistic critical-edition context.
 */
export const ARABIC_DOCUMENT: IDocument = {
  id: 'arabic-doc-1',
  text: [
    {
      id: 'elem-ar-1',
      order: 0,
      position: 'main',
      lines: [
        {
          id: 'line-ar-1',
          elementId: 'elem-ar-1',
          order: 0,
          tokens: ['اعلم', 'أنّ', 'فنّ', 'التاريخ', 'من', 'الفنون', 'التي', 'تتداولها', 'الأمم'],
          states: ['sound', 'sound', 'sound', 'sound', 'sound', 'sound', 'sound', 'sound', 'sound'],
        },
        {
          id: 'line-ar-2',
          elementId: 'elem-ar-1',
          order: 1,
          tokens: ['والأجيال', 'وتشدّ', 'إليه', 'الركائب', 'والرحال'],
          states: ['sound', 'corrupt', 'sound', 'emended', 'sound'],
        },
        {
          id: 'line-ar-3',
          elementId: 'elem-ar-1',
          order: 2,
          tokens: ['وتسمو', 'إلى', 'معرفته', 'السوقة', 'والأغفال'],
          states: ['sound', 'sound', 'lacuna', 'sound', 'unclear'],
        },
        {
          id: 'line-ar-4',
          elementId: 'elem-ar-1',
          order: 3,
          tokens: ['وتتنافس', 'فيه', 'الملوك', 'والأقيال'],
          states: ['sound', 'sound', 'supplied', 'editorial'],
        },
        {
          id: 'line-ar-5',
          elementId: 'elem-ar-1',
          order: 4,
          tokens: ['ويتساوى', 'في', 'فهمه', 'العلماء', 'والجهّال'],
          states: ['conjectural', 'sound', 'sound', 'sound', 'gloss'],
        },
      ],
    },
  ],
  dividers: [],
};
