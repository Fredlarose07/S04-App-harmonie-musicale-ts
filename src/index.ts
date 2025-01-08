// // parametre d'une note
// export type NoteName = 'C' | 'D' | 'E' | 'F' | 'G' | 'A' | 'B';
// export type Alteration = '♯' | '♭' | '';

// // modele d'une note
// export type Note = Readonly<{
//     name: NoteName;
//     alteration: Alteration;
// }>;

// // -------------------------------------------------------------------
// const maNote: Note = {name: 'C', alteration: '♯'};
// console.log(maNote)
// // -------------------------------------------------------------------

// //mode
// export type MajorMode = 'Major';
// export type MinorMode = 'Minor';
// export type ScaleMode = MajorMode | MinorMode;


// // les parametres d'un intervalle
// export type IntervalSize = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
// export type IntervalQuality = 'perfect' | 'major' | 'minor' | 'diminished' | 'augmented';
// export type Semitone = 0.5 | 1;

// // modele d'un intervalle 
// export type ScaleInterval = Readonly<{
//     size: IntervalSize;
//     quality: IntervalQuality;
//     semitones: Semitone;
// }>;

// // -------------------------------------------------------------------
// const x: ScaleInterval = {size: 1, quality: 'perfect', semitones: 0.5};
// console.log(x)
// // -------------------------------------------------------------------

// // modele d'une gamme
// export type ScaleTemplate<T extends ScaleMode> = Readonly<{
//     mode: T;
//     intervals: ReadonlyArray<ScaleInterval>;
//     defaultAccidental: 'sharp' | 'flat'; // demander
// }>;


// // -------------------------------------------------------------------
// // const majorScale: ScaleTemplate<'Major'> = {
// //     mode: 'Major',
// //     intervals: [
// //         { size: 1, quality: 'perfect', semitones: 0.5 },
// //         { size: 2, quality: 'major', semitones: 1 },
// //     ],
// //     defaultAccidental: 'sharp'
// // };

// // console.log(majorScale);
// // -------------------------------------------------------------------


// export type ValidationError =
//     | { kind: 'invalid_note'; note: Note }
//     | { kind: 'invalid_interval'; from: Note; to: Note }
//     | { kind: 'invalid_size'; expected: number; got: number };

// export type ValidationResult<T> = Readonly<{
//     success: boolean;
//     data: T;
//     errors: ReadonlyArray<ValidationError>;
// }>;

// export type Scale = Readonly<{
//     tonic: Note;
//     mode: ScaleMode;
//     notes: ReadonlyArray<Note>;
// }>;

// declare const validatedSymbol: unique symbol;
// export type ValidScale = Scale & { readonly [validatedSymbol]: true };

// export type NoteValidator = (note: Note) => ValidationResult<Note>;
// export type NoteComparator = (note1: Note, note2: Note) => boolean;
// export type IntervalCalculator = (note1: NoteName, note2: NoteName) => Semitone;


// // la gamme majeure
// export const MAJOR_SCALE_INTERVALS: ReadonlyArray<ScaleInterval> = [
//     { size: 2, quality: 'major', semitones: 1 },
//     { size: 3, quality: 'major', semitones: 1 },
//     { size: 4, quality: 'perfect', semitones: 0.5 },
//     { size: 5, quality: 'perfect', semitones: 1 },
//     { size: 6, quality: 'major', semitones: 1 },
//     { size: 7, quality: 'major', semitones: 1 },
//     { size: 8, quality: 'perfect', semitones: 0.5 }
// ] as const;


// // la gamme mineure
// export const MINOR_SCALE_INTERVALS: ReadonlyArray<ScaleInterval> = [
//     { size: 2, quality: 'major', semitones: 1 },
//     { size: 3, quality: 'minor', semitones: 0.5 },
//     { size: 4, quality: 'perfect', semitones: 1 },
//     { size: 5, quality: 'perfect', semitones: 1 },
//     { size: 6, quality: 'minor', semitones: 0.5 },
//     { size: 7, quality: 'minor', semitones: 1 },
//     { size: 8, quality: 'perfect', semitones: 1 }
// ] as const;


// // -------------------------------------------------------------------
// //enregistrer la gamme majeure
// export const MAJOR_TEMPLATE: ScaleTemplate<'Major'> = {
//     mode: 'Major',
//     intervals: MAJOR_SCALE_INTERVALS,
//     defaultAccidental: 'sharp'
// } as const;

// console.log(MAJOR_TEMPLATE);
// // -------------------------------------------------------------------


// // -------------------------------------------------------------------
// //enregistrer la gamme mineure
// export const MINOR_TEMPLATE: ScaleTemplate<'Minor'> = {
//     mode: 'Minor',
//     intervals: MINOR_SCALE_INTERVALS,
//     defaultAccidental: 'flat'
// } as const;

// console.log(MINOR_TEMPLATE);
// // -------------------------------------------------------------------


// CUSTOMER to ORDER = Relation 1:N | ORDER to CUSTOMER = relation 1:1
// Un client peut avoir plusieurs commandes
// 



enum orderStatus {
    pending = "pending",
    confirmed = "Confirmed",
    Shipped = "shipped",
    Delivered = 'Delivered',
    Cancelled = 'cancelled',
}

interface OrderStatusMetaData {
    label: string; 
    color: string;
    icon: string;
    canTransitionTo: orderStatus;
}


import {
    Note,
    NoteName,
    Alteration,
    Scale,
    ScaleMode,
    ScaleInterval,
    ScaleTemplate,
    ValidationResult,
    ValidationError,
    MAJOR_TEMPLATE,
    MINOR_TEMPLATE
} from './scale-types';

const createNote = (name: NoteName, alteration: Alteration = ''): Note => ({
    name,
    alteration
});

const validateNote = (note: Note): ValidationResult<Note> => {
    const validNotes: readonly NoteName[] = ['C', 'D', 'E', 'F', 'G', 'A', 'B'] as const;

    if (!validNotes.includes(note.name)) {
        return {
            success: false,
            data: note,
            errors: [{ kind: 'invalid_note', note }]
        };
    }

    return {
        success: true,
        data: note,
        errors: []
    };
};

const getNextNote = (note: NoteName): NoteName => {
    const notes: readonly NoteName[] = ['C', 'D', 'E', 'F', 'G', 'A', 'B'] as const;
    const currentIndex = notes.indexOf(note);
    return notes[(currentIndex + 1) % 7];
};

const determineAlteration = (
    currentNote: NoteName,
    nextNote: NoteName,
    interval: ScaleInterval,
    template: ScaleTemplate<ScaleMode>
): Alteration => {
    const useSharp = template.defaultAccidental === 'sharp';

    const naturalSemitones: Record<string, number> = {
        'C-D': 2, 'D-E': 2, 'E-F': 1,
        'F-G': 2, 'G-A': 2, 'A-B': 2, 'B-C': 1
    };

    const key = `${currentNote} -${nextNote} `;
    const reverseKey = `${nextNote} -${currentNote} `;
    const naturalInterval = naturalSemitones[key] || naturalSemitones[reverseKey] || 2;

    const desiredSemitones = interval.semitones * 2;

    const difference = desiredSemitones - naturalInterval;

    switch (interval.quality) {
        case 'perfect':
            if (difference === 0) return '';
            if (difference === 1) return useSharp ? '♯' : '';
            if (difference === -1) return useSharp ? '' : '♭';
            break;

        case 'major':
            if (difference === 0) return '';
            if (difference === 1) return useSharp ? '♯' : '';
            if (difference === -1) return useSharp ? '' : '♭';
            break;

        case 'minor':
            if (difference === -1) return '';
            if (difference === 0) return useSharp ? '' : '♭';
            if (difference === -2) return useSharp ? '' : '♭';
            break;

        case 'augmented':
            if (difference === 1) return useSharp ? '♯' : '';
            if (difference === 2) return useSharp ? '♯' : '';
            break;

        case 'diminished':
            if (difference === -2) return useSharp ? '' : '♭';
            if (difference === -3) return useSharp ? '' : '♭';
            break;
    }

    const specialCases: Record<string, Alteration> = {
        'B-F': useSharp ? '' : '♭',
        'E-B': useSharp ? '' : '♭',
        'F-B': useSharp ? '♯' : '',
        'B-E': useSharp ? '♯' : ''
    };

    if (specialCases[key]) return specialCases[key];

    return useSharp ? '♯' : '♭';
};

const createScale = <T extends ScaleMode>(
    tonic: Note,
    template: ScaleTemplate<T>
): ValidationResult<Scale> => {
    const notes: Note[] = [tonic];
    let currentNote = tonic.name;
    const errors: ValidationError[] = [];

    const tonicValidation = validateNote(tonic);
    if (!tonicValidation.success) {
        errors.push(...tonicValidation.errors);
    }

    for (const interval of template.intervals) {
        const nextNote = getNextNote(currentNote);
        const alteration = determineAlteration(
            currentNote,
            nextNote,
            interval,
            template
        );

        const note = createNote(nextNote, alteration);
        const noteValidation = validateNote(note);

        if (!noteValidation.success) {
            errors.push(...noteValidation.errors);
        }

        notes.push(note);
        currentNote = nextNote;
    }

    notes.push(tonic);

    const scale: Scale = {
        tonic,
        mode: template.mode,
        notes: notes
    };

    return {
        success: errors.length === 0,
        data: scale,
        errors
    };
};

const createMajorScale = (tonic: Note): ValidationResult<Scale> =>
    createScale(tonic, MAJOR_TEMPLATE);

const createMinorScale = (tonic: Note): ValidationResult<Scale> =>
    createScale(tonic, MINOR_TEMPLATE);

const displayNote = (note: Note): string =>
    `${note.name}${note.alteration} `;

const displayScale = (scale: Scale): string =>
    scale.notes.map(displayNote).join(' - ');

export {
    createNote,
    createMajorScale,
    createMinorScale,
    createScale,
    validateNote,
    displayScale,
    displayNote
};