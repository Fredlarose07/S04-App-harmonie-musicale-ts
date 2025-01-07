// parametre d'une note
export type NoteName = 'C' | 'D' | 'E' | 'F' | 'G' | 'A' | 'B';
export type Alteration = '♯' | '♭' | '';

// modele d'une note
export type Note = Readonly<{
    name: NoteName;
    alteration: Alteration;
}>;

// -------------------------------------------------------------------
const maNote: Note = {name: 'C', alteration: '♯'};
console.log(maNote)
// -------------------------------------------------------------------

//mode
export type MajorMode = 'Major';
export type MinorMode = 'Minor';
export type ScaleMode = MajorMode | MinorMode;


// les parametres d'un intervalle
export type IntervalSize = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
export type IntervalQuality = 'perfect' | 'major' | 'minor' | 'diminished' | 'augmented';
export type Semitone = 0.5 | 1;

// modele d'un intervalle 
export type ScaleInterval = Readonly<{
    size: IntervalSize;
    quality: IntervalQuality;
    semitones: Semitone;
}>;

// -------------------------------------------------------------------
const x: ScaleInterval = {size: 1, quality: 'perfect', semitones: 0.5};
console.log(x)
// -------------------------------------------------------------------

// modele d'une gamme
export type ScaleTemplate<T extends ScaleMode> = Readonly<{
    mode: T;
    intervals: ReadonlyArray<ScaleInterval>;
    defaultAccidental: 'sharp' | 'flat'; // demander
}>;


// -------------------------------------------------------------------
// const majorScale: ScaleTemplate<'Major'> = {
//     mode: 'Major',
//     intervals: [
//         { size: 1, quality: 'perfect', semitones: 0.5 },
//         { size: 2, quality: 'major', semitones: 1 },
//     ],
//     defaultAccidental: 'sharp'
// };

// console.log(majorScale);
// -------------------------------------------------------------------


export type ValidationError =
    | { kind: 'invalid_note'; note: Note }
    | { kind: 'invalid_interval'; from: Note; to: Note }
    | { kind: 'invalid_size'; expected: number; got: number };

export type ValidationResult<T> = Readonly<{
    success: boolean;
    data: T;
    errors: ReadonlyArray<ValidationError>;
}>;

export type Scale = Readonly<{
    tonic: Note;
    mode: ScaleMode;
    notes: ReadonlyArray<Note>;
}>;

declare const validatedSymbol: unique symbol;
export type ValidScale = Scale & { readonly [validatedSymbol]: true };

export type NoteValidator = (note: Note) => ValidationResult<Note>;
export type NoteComparator = (note1: Note, note2: Note) => boolean;
export type IntervalCalculator = (note1: NoteName, note2: NoteName) => Semitone;


// la gamme majeure
export const MAJOR_SCALE_INTERVALS: ReadonlyArray<ScaleInterval> = [
    { size: 2, quality: 'major', semitones: 1 },
    { size: 3, quality: 'major', semitones: 1 },
    { size: 4, quality: 'perfect', semitones: 0.5 },
    { size: 5, quality: 'perfect', semitones: 1 },
    { size: 6, quality: 'major', semitones: 1 },
    { size: 7, quality: 'major', semitones: 1 },
    { size: 8, quality: 'perfect', semitones: 0.5 }
] as const;


// la gamme mineure
export const MINOR_SCALE_INTERVALS: ReadonlyArray<ScaleInterval> = [
    { size: 2, quality: 'major', semitones: 1 },
    { size: 3, quality: 'minor', semitones: 0.5 },
    { size: 4, quality: 'perfect', semitones: 1 },
    { size: 5, quality: 'perfect', semitones: 1 },
    { size: 6, quality: 'minor', semitones: 0.5 },
    { size: 7, quality: 'minor', semitones: 1 },
    { size: 8, quality: 'perfect', semitones: 1 }
] as const;


// -------------------------------------------------------------------
//enregistrer la gamme majeure
export const MAJOR_TEMPLATE: ScaleTemplate<'Major'> = {
    mode: 'Major',
    intervals: MAJOR_SCALE_INTERVALS,
    defaultAccidental: 'sharp'
} as const;

console.log(MAJOR_TEMPLATE);
// -------------------------------------------------------------------


// -------------------------------------------------------------------
//enregistrer la gamme mineure
export const MINOR_TEMPLATE: ScaleTemplate<'Minor'> = {
    mode: 'Minor',
    intervals: MINOR_SCALE_INTERVALS,
    defaultAccidental: 'flat'
} as const;

console.log(MINOR_TEMPLATE);
// -------------------------------------------------------------------


