import { describe, it, expect, afterEach } from 'vitest';
import { PACKS, detectLang, setLang, getLang, t, fill, onLangChange } from '../src/i18n/index.js';
import { GAME_OVER_PHRASES, PROTEST_SLOGANS } from '../src/game/texts.js';
import { Missions, missionAt, gradeFor, GRADES } from '../src/game/missions.js';
import { buildTutorial } from '../src/game/tutorial.js';
import { OBSTACLE_TYPES } from '../src/game/obstacles.js';
import { BONUS_KINDS } from '../src/game/items.js';

afterEach(() => setLang('fr'));

/** Toutes les « adresses » de textes d'une langue (ex. jokes.hit.vache). */
function shape(obj, prefix = '') {
  if (typeof obj === 'string') return [prefix];
  if (Array.isArray(obj)) return obj.every((x) => typeof x === 'string') ? [prefix] : obj.flatMap((x, i) => shape(x, `${prefix}[${i}]`));
  return Object.keys(obj).flatMap((k) => shape(obj[k], prefix ? `${prefix}.${k}` : k));
}

describe('langues', () => {
  it('anglais et français ont exactement les mêmes rubriques', () => {
    expect(shape(PACKS.en).sort()).toEqual(shape(PACKS.fr).sort());
  });

  it('aucune liste vide, aucun texte vide', () => {
    for (const p of Object.values(PACKS)) {
      const walk = (o) => {
        if (typeof o === 'string') expect(o.trim().length).toBeGreaterThan(0);
        else if (Array.isArray(o)) {
          expect(o.length).toBeGreaterThan(0);
          o.forEach(walk);
        } else Object.values(o).forEach(walk);
      };
      walk(p);
    }
  });

  it('chaque langue couvre tous les obstacles, bonus, grades et étapes du tutoriel', () => {
    for (const p of Object.values(PACKS)) {
      const hittable = Object.entries(OBSTACLE_TYPES).filter(([, o]) => o.effect === 'hit').map(([k]) => k);
      for (const type of hittable) expect(p.jokes.hit[type], `${p.code} hit.${type}`).toBeTruthy();
      for (const b of BONUS_KINDS) expect(p.jokes.pickup[b.kind], `${p.code} pickup.${b.kind}`).toBeTruthy();
      expect(p.grades).toHaveLength(GRADES.length);
      expect(p.tutorial).toHaveLength(buildTutorial().length);
    }
  });

  it('chaque mission a un texte dans chaque langue', () => {
    for (const code of Object.keys(PACKS)) {
      setLang(code);
      for (let i = 0; i < 60; i++) {
        const m = missionAt(i);
        expect(m.text, `${code} ${m.id}`).toBeTruthy();
        expect(m.text).not.toMatch(/\{|undefined/);
      }
    }
  });

  it('detectLang : choix du joueur, puis langue du navigateur', () => {
    expect(detectLang('en', ['fr-FR'])).toBe('en');
    expect(detectLang(null, ['fr-FR', 'en'])).toBe('fr');
    expect(detectLang(null, ['en-US'])).toBe('en');
    expect(detectLang(null, ['de-DE', 'fr'])).toBe('fr');
    expect(detectLang(null, ['es-ES'])).toBe('en'); // ni français ni anglais : anglais
    expect(detectLang(null, [])).toBe('fr'); // aucune info : français
    expect(detectLang('klingon', [])).toBe('fr');
  });

  it('t() traduit et remplit les repères', () => {
    expect(t('replay')).toBe('Rejouer');
    setLang('en');
    expect(getLang()).toBe('en');
    expect(t('replay')).toBe('Run again');
    expect(t('promoted', { name: 'General' })).toBe('⭐ Gérard is promoted to General!');
    expect(t('cle-inconnue')).toBe('cle-inconnue');
    expect(fill('{a} et {b}', { a: 1 })).toBe('1 et {b}');
  });

  it('changer de langue met à jour les blagues, grades et missions', () => {
    const calls = [];
    const off = onLangChange((p) => calls.push(p.code));
    const m = new Missions([]);
    expect(m.active[0].text).toBe('Cours 250 m');
    setLang('en');
    expect(GAME_OVER_PHRASES).toBe(PACKS.en.jokes.gameOver);
    expect(PROTEST_SLOGANS).toBe(PACKS.en.jokes.slogans);
    expect(gradeFor(0).name).toBe('Trainee Gendarme');
    m.relabel();
    expect(m.active[0].text).toBe('Run 250 m');
    expect(missionAt(25).text).toBe('Run 1,000 m');
    setLang('fr');
    expect(missionAt(25).text).toBe('Cours 1 000 m');
    off();
    expect(calls).toEqual(['en', 'fr']);
  });
});
