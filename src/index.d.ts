export type RecorderState = 'idle' | 'requesting' | 'recording' | 'processing' | 'recorded';
export interface RecordStartDetail { demo: boolean }
export interface RecordStopDetail {
  blob: Blob | null;
  url: string | null;
  duration: number;
  mimeType: string | null;
  demo: boolean;
}
export interface RecordErrorDetail { error: Error; message: string }
export declare function formatTime(milliseconds: number): string;
export declare class LiquidGlass extends HTMLElement { refresh(): void }
export declare class LiquidRecorder extends HTMLElement {
  readonly state: RecorderState;
  readonly duration: number;
  readonly blob: Blob | null;
  readonly recordingUrl: string | null;
  start(): Promise<void>;
  stop(): void;
  reset(): void;
  download(): void;
}
export declare function registerLiquidGlass(): void;
declare global {
  interface HTMLElementTagNameMap {
    'liquid-glass': LiquidGlass;
    'liquid-recorder': LiquidRecorder;
  }
  interface HTMLElementEventMap {
    'record-start': CustomEvent<RecordStartDetail>;
    'record-stop': CustomEvent<RecordStopDetail>;
    'record-error': CustomEvent<RecordErrorDetail>;
  }
}
