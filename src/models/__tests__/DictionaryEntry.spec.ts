import { describe, it, expect } from 'vitest'

import {
  DictionaryEntry,
  DictionaryValidationError,
  parseDictionaryAPIResponse,
} from '../DictionaryEntry'

function makeValidEntry() {
  return {
    word: 'hello',
    phonetic: 'həˈləʊ',
    phonetics: [
      {
        text: 'həˈləʊ',
        audio: '//ssl.gstatic.com/dictionary/static/sounds/20200429/hello--_gb_1.mp3',
      },
      {
        text: 'hɛˈləʊ',
      },
    ],
    origin: 'early 19th century: variant of earlier hollo ; related to holla.',
    meanings: [
      {
        partOfSpeech: 'exclamation',
        definitions: [
          {
            definition: 'used as a greeting or to begin a phone conversation.',
            example: 'hello there, Katie!',
            synonyms: [],
            antonyms: [],
          },
        ],
      },
    ],
  }
}

function expectValidationError(fn: () => void, expectedPath: string) {
  try {
    fn()
    throw new Error('Expected DictionaryValidationError was not thrown')
  } catch (error) {
    expect(error).toBeInstanceOf(DictionaryValidationError)
    expect((error as DictionaryValidationError).path).toBe(expectedPath)
  }
}

describe('DictionaryEntry parser', () => {
  it('parses a valid API response', () => {
    const payload = [makeValidEntry()]

    const parsed = parseDictionaryAPIResponse(payload)

    expect(parsed).toHaveLength(1)
    expect(parsed[0]).toBeInstanceOf(DictionaryEntry)
    expect(parsed[0].word).toBe('hello')
    expect(parsed[0].meanings[0].definitions[0].definition).toContain('greeting')
  })

  it('keeps optional fields undefined when missing', () => {
    const minimal = makeValidEntry()
    delete minimal.phonetic
    delete minimal.origin
    delete minimal.phonetics[0].audio
    delete minimal.meanings[0].definitions[0].example

    const parsed = parseDictionaryAPIResponse([minimal])

    expect(parsed[0].phonetic).toBeUndefined()
    expect(parsed[0].origin).toBeUndefined()
    expect(parsed[0].phonetics[0].audio).toBeUndefined()
    expect(parsed[0].meanings[0].definitions[0].example).toBeUndefined()
  })

  it('throws for non-array API responses', () => {
    expectValidationError(() => parseDictionaryAPIResponse({}), 'response')
  })

  it('throws with nested path for invalid definition type', () => {
    const invalid = [makeValidEntry()]
    invalid[0].meanings[0].definitions[0].definition = 123 as unknown as string

    expectValidationError(
      () => parseDictionaryAPIResponse(invalid),
      'response[0].meanings[0].definitions[0].definition',
    )
  })

  it('throws with nested path for invalid phonetic text', () => {
    const invalidEntry = makeValidEntry()
    invalidEntry.phonetics[0].text = null as unknown as string

    expectValidationError(() => DictionaryEntry.fromJSON(invalidEntry), 'entry.phonetics[0].text')
  })
})
