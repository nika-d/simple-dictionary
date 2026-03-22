export class DictionaryValidationError extends Error {
  path: string

  constructor(path: string, expected: string, received: unknown) {
    const receivedType = Array.isArray(received) ? 'array' : typeof received
    super(`Invalid value at "${path}": expected ${expected}, received ${receivedType}`)
    this.name = 'DictionaryValidationError'
    this.path = path
  }
}

function assertRecord(value: unknown, path: string): asserts value is Record<string, unknown> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new DictionaryValidationError(path, 'object', value)
  }
}

function readRequiredString(obj: Record<string, unknown>, key: string, path: string): string {
  const value = obj[key]
  if (typeof value !== 'string') {
    throw new DictionaryValidationError(`${path}.${key}`, 'string', value)
  }
  return value
}

function readOptionalString(
  obj: Record<string, unknown>,
  key: string,
  path: string,
): string | undefined {
  const value = obj[key]
  if (value === undefined) {
    return undefined
  }
  if (typeof value !== 'string') {
    throw new DictionaryValidationError(`${path}.${key}`, 'string | undefined', value)
  }
  return value
}

function readRequiredArray(obj: Record<string, unknown>, key: string, path: string): unknown[] {
  const value = obj[key]
  if (!Array.isArray(value)) {
    throw new DictionaryValidationError(`${path}.${key}`, 'array', value)
  }
  return value
}

function readStringArray(obj: Record<string, unknown>, key: string, path: string): string[] {
  const value = readRequiredArray(obj, key, path)
  return value.map((entry, index) => {
    if (typeof entry !== 'string') {
      throw new DictionaryValidationError(`${path}.${key}[${index}]`, 'string', entry)
    }
    return entry
  })
}

export class Definition {
  definition: string
  example?: string
  synonyms: string[]
  antonyms: string[]

  constructor(data: Definition) {
    this.definition = data.definition
    this.example = data.example
    this.synonyms = data.synonyms
    this.antonyms = data.antonyms
  }

  static fromJSON(json: unknown, path = 'definition'): Definition {
    assertRecord(json, path)

    return new Definition({
      definition: readRequiredString(json, 'definition', path),
      example: readOptionalString(json, 'example', path),
      synonyms: readStringArray(json, 'synonyms', path),
      antonyms: readStringArray(json, 'antonyms', path),
    } as Definition)
  }
}

export class Meaning {
  partOfSpeech: string
  definitions: Definition[]

  constructor(data: Meaning) {
    this.partOfSpeech = data.partOfSpeech
    this.definitions = data.definitions.map((d) => new Definition(d))
  }

  static fromJSON(json: unknown, path = 'meaning'): Meaning {
    assertRecord(json, path)
    const definitions = readRequiredArray(json, 'definitions', path).map((entry, index) =>
      Definition.fromJSON(entry, `${path}.definitions[${index}]`),
    )

    return new Meaning({
      partOfSpeech: readRequiredString(json, 'partOfSpeech', path),
      definitions,
    } as Meaning)
  }
}

export class Phonetic {
  text?: string
  audio?: string

  constructor(data: Phonetic) {
    this.text = data.text
    this.audio = data.audio
  }

  static fromJSON(json: unknown, path = 'phonetic'): Phonetic {
    assertRecord(json, path)

    return new Phonetic({
      text: readOptionalString(json, 'text', path),
      audio: readOptionalString(json, 'audio', path),
    } as Phonetic)
  }
}

export class DictionaryEntry {
  word: string
  phonetic?: string
  phonetics: Phonetic[]
  origin?: string
  meanings: Meaning[]

  constructor(data: DictionaryEntry) {
    this.word = data.word
    this.phonetic = data.phonetic
    this.phonetics = data.phonetics.map((p) => new Phonetic(p))
    this.origin = data.origin
    this.meanings = data.meanings.map((m) => new Meaning(m))
  }

  static fromJSON(json: unknown, path = 'entry'): DictionaryEntry {
    assertRecord(json, path)

    const phonetics = readRequiredArray(json, 'phonetics', path).map((entry, index) =>
      Phonetic.fromJSON(entry, `${path}.phonetics[${index}]`),
    )

    const meanings = readRequiredArray(json, 'meanings', path).map((entry, index) =>
      Meaning.fromJSON(entry, `${path}.meanings[${index}]`),
    )

    return new DictionaryEntry({
      word: readRequiredString(json, 'word', path),
      phonetic: readOptionalString(json, 'phonetic', path),
      phonetics,
      origin: readOptionalString(json, 'origin', path),
      meanings,
    } as DictionaryEntry)
  }

  static fromJSONArray(json: unknown, path = 'root'): DictionaryEntry[] {
    if (!Array.isArray(json)) {
      throw new DictionaryValidationError(path, 'array', json)
    }

    return json.map((entry, index) => DictionaryEntry.fromJSON(entry, `${path}[${index}]`))
  }
}

export type DictionaryAPIResponse = DictionaryEntry[]

export function parseDictionaryAPIResponse(json: unknown): DictionaryAPIResponse {
  return DictionaryEntry.fromJSONArray(json, 'response')
}
