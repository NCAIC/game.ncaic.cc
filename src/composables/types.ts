export type CompetitionEvent = "competition-start" | "score-update" | "competition-end";
export type SetEvent = "set-start" | "set-update" | "set-end";

export enum COLOR {
    EMPTY,
    BLACK,
    WHITE,
}

export interface Payload {
    board?: COLOR[][];
    emphasized?: {
        y: number;
        x: number;
        type: number;
    }[];
    teams?: {
        name: string;
        win: number;
        time: {
            total: number;
            set: number;
            remaining: number;
        };
    }[];
    msg?: {
        channel: number;
        content: string;
    }[];
    clients?: number;
}
