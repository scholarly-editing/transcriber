import React from 'react';
export interface EditorProps {
    content?: string;
    onChange?: (content: string) => void;
}
export declare const MuhaqqiqEditor: React.FC<EditorProps>;
