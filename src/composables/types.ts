export type CompetitionEvent = "competition-start" | "score-update" | "competition-end";
export type SetEvent = "set-start" | "set-update" | "set-end";

export enum COLOR {
    EMPTY,
    BLACK,
    WHITE,
}

export interface Payload {
    title: string;
    board: COLOR[][];
    emphasized: {
        y: number;
        x: number;
        type: number;
    }[];
    teams: {
        name: string;
        color: string;
        time: {
            total: number;
            set: number;
            remaining: number;
        };
    }[];
    sets: {
        type: SetResultType;
        color?: string;
    }[];
    clients: number;
}

export enum SetResultType {
    none,
    row,
    invalid,
    timeout,
    draw,
}
