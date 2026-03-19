import type { IDocument } from '@muhaqqiq-editor/react';

/**
 * Sample 5-line Latin scholarly document.
 *
 * Text adapted from Cicero's De Re Publica with edition symbol states
 * applied to demonstrate the same prefix/bracket/suffix formatting in
 * an LTR critical-edition context.
 */
export const LATIN_DOCUMENT: IDocument = {
  id: 'latin-doc-1',
  text: [
    {
      id: 'elem-la-1',
      order: 0,
      position: 'main',
      lines: [
        {
          id: 'line-la-1',
          elementId: 'elem-la-1',
          order: 0,
          tokens: ['Est', 'igitur', 'res', 'publica', 'res', 'populi'],
          states: ['sound', 'sound', 'sound', 'sound', 'sound', 'sound'],
        },
        {
          id: 'line-la-2',
          elementId: 'elem-la-1',
          order: 1,
          tokens: ['populus', 'autem', 'non', 'omnis', 'hominum', 'coetus'],
          states: ['sound', 'corrupt', 'sound', 'sound', 'lacuna', 'sound'],
        },
        {
          id: 'line-la-3',
          elementId: 'elem-la-1',
          order: 2,
          tokens: ['quoquo', 'modo', 'congregatus', 'sed', 'coetus', 'multitudinis'],
          states: ['sound', 'sound', 'emended', 'sound', 'sound', 'supplied'],
        },
        {
          id: 'line-la-4',
          elementId: 'elem-la-1',
          order: 3,
          tokens: ['iuris', 'consensu', 'et', 'utilitatis', 'communione', 'sociatus'],
          states: ['editorial', 'sound', 'sound', 'conjectural', 'sound', 'sound'],
        },
        {
          id: 'line-la-5',
          elementId: 'elem-la-1',
          order: 4,
          tokens: ['eius', 'autem', 'prima', 'causa', 'coeundi', 'est'],
          states: ['sound', 'unclear', 'sound', 'gloss', 'sound', 'sound'],
        },
      ],
    },
  ],
  dividers: [],
};
